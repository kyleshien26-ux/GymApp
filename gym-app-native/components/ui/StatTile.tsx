import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

export const StatTile = ({ label, value, sub }: { label: string, value: string | number, sub: string }) => (
  <View style={styles.tile}>
    <Text style={styles.label}>{label}</Text>
    <View style={{flexDirection:'row', alignItems:'flex-end', gap: 4}}>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.sub}>{sub}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    padding: 12,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: '45%',
  },
  label: {
    color: colors.muted,
    fontSize: 12,
    marginBottom: 4,
  },
  value: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
  },
  sub: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.muted,
      paddingBottom: 2,
  }
});
