import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Vehicle } from '../../domain/models/Vehicle';
import { Maintenance } from '../../domain/models/Maintenance';
import { MaintenanceStatus } from '../../domain/models/MaintenanceStatus';
import { calculateStatusInfo, formatMileage, formatCurrency } from '../../domain/services/MaintenanceStatusCalculator';
import { calculateExpenseMetrics } from '../../domain/services/ExpenseAnalyticsCalculator';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { ExpenseSummaryCard } from '../components/ExpenseSummaryCard';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { Ionicons } from '@expo/vector-icons';

interface HomeScreenProps {
  vehicle: Vehicle;
  maintenances: Maintenance[];
  onNavigateVehicle: () => void;
  onNavigateAddMaintenance: () => void;
  onNavigateHistory: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  vehicle,
  maintenances,
  onNavigateVehicle,
  onNavigateAddMaintenance,
  onNavigateHistory,
}) => {
  // Compute statuses for all items
  const evaluated = maintenances.map((m) => ({
    maintenance: m,
    statusInfo: calculateStatusInfo(m, vehicle.currentMileage),
  }));

  const overdueCount = evaluated.filter((e) => e.statusInfo.status === MaintenanceStatus.OVERDUE).length;
  const upcomingCount = evaluated.filter((e) => e.statusInfo.status === MaintenanceStatus.UPCOMING).length;
  const expenseMetrics = calculateExpenseMetrics(maintenances);

  return (
    <View style={styles.screen}>
      <Header
        title="AutoCare"
        subtitle="Controla el mantenimiento de tu vehículo"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* VEHICLE CARD */}
        <Card style={styles.vehicleCard}>
          <View style={styles.vehicleHeader}>
            <View style={styles.carIconBox}>
              <Ionicons name="car-outline" size={24} color={Colors.primary} />
            </View>
            <View style={styles.vehicleDetails}>
              <Text style={styles.vehicleTitle}>
                {vehicle.brand} {vehicle.model}
              </Text>
              <Text style={styles.vehicleSub}>
                {vehicle.year} • {vehicle.plate}
              </Text>
            </View>
          </View>

          <View style={styles.odometerBox}>
            <Text style={styles.odometerLabel}>Kilometraje actual</Text>
            <Text style={styles.odometerValue}>{formatMileage(vehicle.currentMileage)}</Text>
          </View>

          <Button
            title="Gestionar vehículo"
            variant="primary"
            onPress={onNavigateVehicle}
            style={styles.cardButton}
          />
        </Card>

        {/* PRIMARY ACTIONS */}
        <View style={styles.actionGroup}>
          <Button
            title="Registrar mantenimiento"
            variant="primary"
            onPress={onNavigateAddMaintenance}
          />
          <Button
            title="Ver historial"
            variant="outline"
            onPress={onNavigateHistory}
          />
        </View>

        {/* GENERAL STATUS BANNER */}
        <Text style={styles.sectionTitle}>Estado general</Text>
        {overdueCount > 0 ? (
          <Card variant="alert" style={styles.alertCard}>
            <View style={styles.alertHeader}>
              <Ionicons name="alert-circle-outline" size={20} color={Colors.statusOverdue} />
              <Text style={styles.alertTitle}>Atención requerida</Text>
            </View>
            <Text style={styles.alertSubtitle}>
              {overdueCount} mantenimiento{overdueCount > 1 ? 's' : ''} vencido{overdueCount > 1 ? 's' : ''}
            </Text>
          </Card>
        ) : upcomingCount > 0 ? (
          <Card style={[styles.alertCard, { backgroundColor: Colors.statusUpcomingBg, borderColor: Colors.statusUpcoming }]}>
            <View style={styles.alertHeader}>
              <Ionicons name="time-outline" size={20} color={Colors.statusUpcoming} />
              <Text style={[styles.alertTitle, { color: Colors.statusUpcoming }]}>Mantenimientos próximos</Text>
            </View>
            <Text style={[styles.alertSubtitle, { color: Colors.statusUpcoming }]}>
              {upcomingCount} servicio{upcomingCount > 1 ? 's' : ''} próximo{upcomingCount > 1 ? 's' : ''} a vencer
            </Text>
          </Card>
        ) : (
          <Card style={[styles.alertCard, { backgroundColor: Colors.statusOkBg, borderColor: Colors.statusOk }]}>
            <View style={styles.alertHeader}>
              <Ionicons name="checkmark-circle-outline" size={20} color={Colors.statusOk} />
              <Text style={[styles.alertTitle, { color: Colors.statusOk }]}>Vehículo al día</Text>
            </View>
            <Text style={[styles.alertSubtitle, { color: Colors.statusOk }]}>
              Todos los mantenimientos programados están al día
            </Text>
          </Card>
        )}

        {/* FINANCIAL CONTROL & EXPENSE ANALYTICS */}
        <Text style={styles.sectionTitle}>Métricas e inversión</Text>
        <ExpenseSummaryCard metrics={expenseMetrics} />

        {/* UPCOMING & OVERDUE LIST */}
        <Text style={styles.sectionTitle}>Próximos mantenimientos</Text>
        {evaluated.length === 0 ? (
          <Text style={styles.emptyText}>No hay mantenimientos registrados aún.</Text>
        ) : (
          evaluated.map(({ maintenance, statusInfo }) => (
            <Card key={maintenance.id} style={styles.maintenanceCard}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{maintenance.type}</Text>
                <Badge status={statusInfo.status} />
              </View>

              <Text style={[styles.statusMsg, statusInfo.status === MaintenanceStatus.OVERDUE ? styles.msgOverdue : styles.msgUpcoming]}>
                {statusInfo.message}
              </Text>

              <View style={styles.infoGrid}>
                {maintenance.nextDate ? (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Próxima fecha:</Text>
                    <Text style={styles.infoValue}>{maintenance.nextDate}</Text>
                  </View>
                ) : null}
                {maintenance.nextMileage ? (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Próximo kilometraje:</Text>
                    <Text style={styles.infoValue}>{formatMileage(maintenance.nextMileage)}</Text>
                  </View>
                ) : null}
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Último costo:</Text>
                  <Text style={styles.infoValue}>{formatCurrency(maintenance.cost)}</Text>
                </View>
              </View>
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl * 2,
    gap: Spacing.md,
  },
  vehicleCard: {
    padding: Spacing.lg,
  },
  vehicleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  carIconBox: {
    width: 44,
    height: 44,
    borderRadius: Spacing.borderRadiusMd,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleDetails: {
    flex: 1,
  },
  vehicleTitle: {
    ...Typography.h3,
  },
  vehicleSub: {
    ...Typography.caption,
    marginTop: 2,
  },
  odometerBox: {
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderRadius: Spacing.borderRadiusMd,
    marginBottom: Spacing.md,
  },
  odometerLabel: {
    ...Typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  odometerValue: {
    ...Typography.h1,
    color: Colors.primary,
    marginTop: 2,
  },
  cardButton: {
    paddingVertical: Spacing.md,
  },
  actionGroup: {
    gap: Spacing.sm,
  },
  sectionTitle: {
    ...Typography.h3,
    marginTop: Spacing.sm,
  },
  alertCard: {
    padding: Spacing.md,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: 4,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.statusOverdue,
  },
  alertSubtitle: {
    fontSize: 13,
    color: Colors.statusOverdue,
  },
  maintenanceCard: {
    marginBottom: Spacing.sm,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  statusMsg: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: Spacing.sm,
  },
  msgOverdue: {
    color: Colors.statusOverdue,
  },
  msgUpcoming: {
    color: Colors.statusUpcoming,
  },
  infoGrid: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: Spacing.sm,
    gap: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  emptyText: {
    ...Typography.bodyMuted,
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: Spacing.lg,
  },
});
