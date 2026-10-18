import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaintenanceStatus } from '../../domain/models/MaintenanceStatus';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';

interface BadgeProps {
  status: MaintenanceStatus;
}

export const Badge: React.FC<BadgeProps> = ({ status }) => {
  let label = 'Al día';
  let bg = Colors.statusOkBg;
  let textCol = Colors.statusOk;

  if (status === MaintenanceStatus.OVERDUE) {
    label = 'Vencido';
    bg = Colors.statusOverdueBg;
    textCol = Colors.statusOverdue;
  } else if (status === MaintenanceStatus.UPCOMING) {
    label = 'Próximo';
    bg = Colors.statusUpcomingBg;
    textCol = Colors.statusUpcoming;
  }

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.text, { color: textCol }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs,
    borderRadius: Spacing.borderRadiusPill,
    alignSelf: 'flex-start',
  },
  text: {
    ...Typography.badge,
  },
});
