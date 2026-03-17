import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

export const Card = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.card}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
