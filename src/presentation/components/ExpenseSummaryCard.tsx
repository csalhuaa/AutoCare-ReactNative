import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './Card';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { ExpenseMetrics } from '../../domain/services/ExpenseAnalyticsCalculator';
import { formatCurrency } from '../../domain/services/MaintenanceStatusCalculator';
import { Ionicons } from '@expo/vector-icons';

interface ExpenseSummaryCardProps {
  metrics: ExpenseMetrics;
}

export const ExpenseSummaryCard: React.FC<ExpenseSummaryCardProps> = ({ metrics }) => {
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconBox}>
          <Ionicons name="wallet-outline" size={20} color={Colors.primary} />
        </View>
        <Text style={styles.title}>Control Financiero del Vehículo</Text>
      </View>

      <View style={styles.totalBox}>
        <Text style={styles.totalLabel}>Inversión Total Acumulada</Text>
        <Text style={styles.totalValue}>{formatCurrency(metrics.totalSpent)}</Text>
      </View>

      <View style={styles.metricsRow}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Gasto Promedio</Text>
          <Text style={styles.metricValue}>{formatCurrency(metrics.averageCost)}</Text>
        </View>

        <View style={styles.metricDivider} />

        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Servicios</Text>
          <Text style={styles.metricValue}>{metrics.serviceCount} reg.</Text>
        </View>

        <View style={styles.metricDivider} />

        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Mayor Costo</Text>
          <Text style={styles.metricValue}>
            {metrics.highestCostService ? formatCurrency(metrics.highestCostService.cost) : 'S/ 0.00'}
          </Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: Spacing.md,
    borderRadius: 16,
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: 8,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#E6FFFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...Typography.subtitle,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  totalBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  totalLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  totalValue: {
    ...Typography.title,
    fontSize: 22,
    fontWeight: '800',
    color: Colors.primary,
    marginTop: 2,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.xs,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#E2E8F0',
  },
  metricLabel: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  metricValue: {
    ...Typography.body,
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
});
