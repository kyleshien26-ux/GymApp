import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettings } from '../../providers/SettingsProvider';
import { colors } from '../../constants/colors';

const BORDER = '#e5e7eb';
const MUTED = '#475467';

export default function Records() {
  const { settings } = useSettings();

  const sortedPRs = useMemo(() => {
    return Object.entries(settings.personalRecords)
      .map(([exerciseName, prData]) => ({
        name: exerciseName.charAt(0).toUpperCase() + exerciseName.slice(1),
        ...prData,
      }))
      .sort((a, b) => b.estimated1RM - a.estimated1RM);
  }, [settings.personalRecords]);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Personal Records</Text>
          <Ionicons name="trophy-outline" size={22} color="#f59e0b" />
        </View>

        {sortedPRs.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons
              name="trophy-outline"
              size={48}
              color={MUTED}
              style={{ marginBottom: 12 }}
            />
            <Text style={styles.emptyTitle}>No Records Yet</Text>
            <Text style={styles.emptyDescription}>
              Start logging workouts to track your personal records
            </Text>
          </View>
        ) : (
          sortedPRs.map((pr) => (
            <View key={pr.name} style={styles.card}>
              <Text style={styles.cardTitle}>{pr.name}</Text>
              <View style={styles.valueRow}>
                <Text style={styles.value}>{pr.estimated1RM}</Text>
                <Text style={styles.unit}>kg (1RM)</Text>
              </View>
              <View style={styles.linkRow}>
                <Text style={styles.link}>
                  {pr.weight} kg × {pr.reps} rep{pr.reps !== 1 ? 's' : ''}
                </Text>
                <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
              </View>
              <Text style={styles.date}>{formatDate(pr.date)}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },
  content: {
    padding: 20,
    paddingBottom: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 8,
  },
  value: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0f172a',
  },
  unit: {
    fontSize: 13,
    color: MUTED,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  link: {
    color: '#2563ff',
    fontWeight: '700',
    fontSize: 13,
  },
  date: {
    fontSize: 12,
    color: MUTED,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: MUTED,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
