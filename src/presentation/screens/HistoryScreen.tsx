import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, ScrollView, Pressable } from 'react-native';
import { Maintenance } from '../../domain/models/Maintenance';
import { MaintenanceStatus } from '../../domain/models/MaintenanceStatus';
import { calculateStatusInfo, formatMileage, formatCurrency } from '../../domain/services/MaintenanceStatusCalculator';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { FilterChip } from '../components/FilterChip';
import { ConfirmModal } from '../components/ConfirmModal';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { Ionicons } from '@expo/vector-icons';

interface HistoryScreenProps {
  maintenances: Maintenance[];
  currentMileage: number;
  onEdit: (item: Maintenance) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}

type FilterType = 'ALL' | MaintenanceStatus;

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  maintenances,
  currentMileage,
  onEdit,
  onDelete,
  onBack,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('ALL');
  const [itemToDelete, setItemToDelete] = useState<Maintenance | null>(null);

  // Filter and search computation
  const filteredList = useMemo(() => {
    return maintenances
      .map((item) => ({
        item,
        statusInfo: calculateStatusInfo(item, currentMileage),
      }))
      .filter(({ item, statusInfo }) => {
        // Filter by status chip
        if (selectedFilter !== 'ALL' && statusInfo.status !== selectedFilter) {
          return false;
        }
        // Filter by search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchType = item.type.toLowerCase().includes(q);
          const matchNotes = item.notes.toLowerCase().includes(q);
          return matchType || matchNotes;
        }
        return true;
      });
  }, [maintenances, currentMileage, selectedFilter, searchQuery]);

  const totalFilteredCost = useMemo(() => {
    return filteredList.reduce((acc, curr) => acc + (Number(curr.item.cost) || 0), 0);
  }, [filteredList]);

  const confirmDelete = () => {
    if (itemToDelete) {
      onDelete(itemToDelete.id);
      setItemToDelete(null);
    }
  };

  return (
    <View style={styles.screen}>
      <Header
        title="Historial"
        subtitle="Mantenimientos realizados a tu vehículo"
        onBack={onBack}
      />

      {/* SEARCH BAR */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={Colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por tipo u observaciones..."
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
            </Pressable>
          ) : null}
        </View>

        {/* HORIZONTAL FILTER CHIPS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContainer}
        >
          <FilterChip
            label="Todos"
            selected={selectedFilter === 'ALL'}
            onPress={() => setSelectedFilter('ALL')}
          />
          <FilterChip
            label="Vencidos"
            selected={selectedFilter === MaintenanceStatus.OVERDUE}
            onPress={() => setSelectedFilter(MaintenanceStatus.OVERDUE)}
          />
          <FilterChip
            label="Próximos"
            selected={selectedFilter === MaintenanceStatus.UPCOMING}
            onPress={() => setSelectedFilter(MaintenanceStatus.UPCOMING)}
          />
          <FilterChip
            label="Al día"
            selected={selectedFilter === MaintenanceStatus.OK}
            onPress={() => setSelectedFilter(MaintenanceStatus.OK)}
          />
        </ScrollView>
      </View>

      {/* RESULTS COUNT & FINANCIAL BADGE */}
      <View style={styles.countRow}>
        <Text style={styles.countText}>
          {filteredList.length} mantenimiento{filteredList.length !== 1 ? 's' : ''} encontrado{filteredList.length !== 1 ? 's' : ''}
        </Text>
        <View style={styles.costBadge}>
          <Text style={styles.costBadgeText}>Total: {formatCurrency(totalFilteredCost)}</Text>
        </View>
      </View>

      {/* FLATLIST */}
      <FlatList
        data={filteredList}
        keyExtractor={({ item }) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item: { item, statusInfo } }) => (
          <Card style={styles.itemCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.itemTitle}>{item.type}</Text>
              <Badge status={statusInfo.status} />
            </View>

            <Text
              style={[
                styles.statusMsg,
                statusInfo.status === MaintenanceStatus.OVERDUE
                  ? styles.msgOverdue
                  : statusInfo.status === MaintenanceStatus.UPCOMING
                  ? styles.msgUpcoming
                  : styles.msgOk,
              ]}
            >
              {statusInfo.message}
            </Text>

            <View style={styles.detailsGrid}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Fecha:</Text>
                <Text style={styles.detailValue}>{item.serviceDate}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Kilometraje:</Text>
                <Text style={styles.detailValue}>{formatMileage(item.serviceMileage)}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Costo:</Text>
                <Text style={styles.detailValue}>{formatCurrency(item.cost)}</Text>
              </View>

              {item.nextMileage ? (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Próximo kilometraje:</Text>
                  <Text style={styles.detailValue}>{formatMileage(item.nextMileage)}</Text>
                </View>
              ) : null}

              {item.nextDate ? (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Próxima fecha:</Text>
                  <Text style={styles.detailValue}>{item.nextDate}</Text>
                </View>
              ) : null}

              {item.notes ? (
                <View style={styles.notesBox}>
                  <Text style={styles.notesLabel}>Notas:</Text>
                  <Text style={styles.notesText}>{item.notes}</Text>
                </View>
              ) : null}
            </View>

            {/* ACTION BUTTONS (EDIT & DELETE) */}
            <View style={styles.actionRow}>
              <Pressable style={styles.actionBtn} onPress={() => onEdit(item)}>
                <Ionicons name="create-outline" size={16} color={Colors.primary} />
                <Text style={styles.editBtnText}>Editar</Text>
              </Pressable>

              <Pressable style={styles.actionBtn} onPress={() => setItemToDelete(item)}>
                <Ionicons name="trash-outline" size={16} color={Colors.statusOverdue} />
                <Text style={styles.deleteBtnText}>Eliminar</Text>
              </Pressable>
            </View>
          </Card>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>Sin resultados</Text>
            <Text style={styles.emptyDesc}>No se encontraron mantenimientos con los filtros seleccionados.</Text>
          </View>
        }
      />

      {/* CONFIRMATION MODAL */}
      <ConfirmModal
        visible={Boolean(itemToDelete)}
        title="¿Eliminar mantenimiento?"
        message={`Se eliminará "${itemToDelete?.type}" del historial. Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={confirmDelete}
        onCancel={() => setItemToDelete(null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchSection: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    gap: Spacing.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: Spacing.borderRadiusMd,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: {
    marginRight: Spacing.xs,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    paddingVertical: Spacing.xs,
  },
  chipsContainer: {
    paddingVertical: 2,
  },
  countRow: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs + 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  countText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  costBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  costBadgeText: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.primary,
    fontSize: 11,
  },
  listContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl * 2,
    gap: Spacing.md,
  },
  itemCard: {
    padding: Spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  statusMsg: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  msgOverdue: {
    color: Colors.statusOverdue,
  },
  msgUpcoming: {
    color: Colors.statusUpcoming,
  },
  msgOk: {
    color: Colors.statusOk,
  },
  detailsGrid: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: Spacing.sm,
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  notesBox: {
    backgroundColor: Colors.background,
    padding: Spacing.sm,
    borderRadius: Spacing.borderRadiusSm,
    marginTop: Spacing.xs,
  },
  notesLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  notesText: {
    fontSize: 12,
    color: Colors.textPrimary,
    lineHeight: 16,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.lg,
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  editBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  deleteBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.statusOverdue,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl,
    gap: Spacing.sm,
  },
  emptyTitle: {
    ...Typography.h3,
    color: Colors.textSecondary,
  },
  emptyDesc: {
    ...Typography.caption,
    textAlign: 'center',
    maxWidth: 240,
  },
});
