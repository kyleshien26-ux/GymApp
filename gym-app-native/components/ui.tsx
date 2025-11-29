import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewProps } from 'react-native';
import { colors } from '../constants/colors';

export function Card({ children, style, ...rest }: React.PropsWithChildren<ViewProps>) {
  return (
    <View style={[styles.card, style]} {...rest}>
      {children}
    </View>
  );
}

type SectionHeaderProps = {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function SectionHeader({ title, actionLabel, onActionPress }: SectionHeaderProps) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {actionLabel && onActionPress ? (
        <TouchableOpacity onPress={onActionPress} activeOpacity={0.85}>
          <Text style={styles.sectionAction}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

type StatTileProps = {
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
};

export function StatTile({ label, value, sub, color = colors.text }: StatTileProps) {
  return (
    <View style={styles.statTile}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      {sub ? <Text style={styles.statSub}>{sub}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  sectionAction: {
    color: colors.primary,
    fontWeight: '700',
  },
  statTile: {
    width: '48%',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 13,
    color: colors.muted,
    marginBottom: 6,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
  },
  statSub: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },
});
