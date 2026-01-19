import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../../constants/colors';
import { Card } from '../../components/ui';
import { formatDateLabel, formatDuration, useWorkouts } from '../../providers/WorkoutsProvider';

export default function History() {
  const router = useRouter();
  const { workouts } = useWorkouts();

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
          <Text style={styles.title}>History</Text>
          <TouchableOpacity activeOpacity={0.8} onPress={() => router.push('/(tabs)/progress')}>
            <Ionicons name="stats-chart" size={22} color={colors.muted} />
          </TouchableOpacity>
        </View>

        {!workouts.length ? (
          <Card>
            <Text style={styles.emptyTitle}>No sessions yet</Text>
            <Text style={styles.emptySubtitle}>Start logging workouts to build your history.</Text>
          </Card>
        ) : (
          workouts.map((workout) => (
            <TouchableOpacity
              key={workout.id}
              style={styles.card}
              onPress={() => router.push(`/history/detail?id=${workout.id}`)}
              activeOpacity={0.85}
            >
              <View style={styles.row}>
                <View style={styles.rowLeft}>
                  <Ionicons name="calendar-outline" size={18} color={colors.text} />
                  <View>
                    <Text style={styles.cardTitle}>{formatDateLabel(workout.performedAt)}</Text>
                    <Text style={styles.cardSubtitle}>{workout.title}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
              </View>

              <View style={styles.metaRow}>
                <Text style={styles.metaItem}>
                  <Ionicons name="time-outline" size={14} color={colors.muted} />{' '}
                  {formatDuration(workout.durationMinutes)}
                </Text>
                <Text style={styles.metaItem}>
                  <Ionicons name="stats-chart" size={14} color={colors.muted} /> {formatNumber(workout.totalVolume)} kg
                </Text>
                <Text style={styles.metaItem}>
                  <Ionicons name="barbell-outline" size={14} color={colors.muted} /> {workout.totalSets} sets
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

function formatNumber(num: number) {
  return new Intl.NumberFormat().format(Math.round(num));
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 80,
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  backButton: {
    marginRight: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  cardSubtitle: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  metaItem: {
    fontSize: 13,
    color: colors.muted,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 4,
  },
});
