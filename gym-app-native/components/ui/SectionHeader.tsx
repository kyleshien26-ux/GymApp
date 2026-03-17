import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../constants/colors';

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
}

export const SectionHeader = ({ title, actionLabel, onActionPress }: SectionHeaderProps) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
    {actionLabel && onActionPress && (
      <TouchableOpacity onPress={onActionPress}>
        <Text style={styles.actionText}>{actionLabel}</Text>
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  actionText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  }
});