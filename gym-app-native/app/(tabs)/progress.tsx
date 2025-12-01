import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWorkouts, formatDateLabel } from '../../providers/WorkoutsProvider';
import { colors } from '../../constants/colors';
import { Workout } from '../../types/workouts';

type Timeframe = 'Weekly' | 'Monthly' | 'Yearly';

export default function ProgressScreen() {
  const { workouts } = useWorkouts();
  const [timeframe, setTimeframe] = useState<Timeframe>('Weekly');
  const [overviewTab, setOverviewTab] = useState<'overview' | 'exercise'>('overview');

  const progress = useMemo(() => buildProgress(workouts, timeframe), [workouts, timeframe]);

  const statCards = [
    {
      label: 'Volume Change',
      value: formatDelta(progress.volumeDeltaPercent, '%'),
      sub: `vs previous ${timeframe.toLowerCase()}`,
      color: progress.volumeDeltaPercent >= 0 ? colors.primary : colors.danger,
    },
    {
      label: 'Workout Change',
      value: formatDelta(progress.workoutDelta, ''),
      sub: `vs previous ${timeframe.toLowerCase()}`,
      color: progress.workoutDelta >= 0 ? colors.primary : colors.danger,
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Progress</Text>
          <Text style={styles.subtitle}>Track your gains over time</Text>
        </View>

        <View style={styles.segment}>
          {(['Weekly', 'Monthly', 'Yearly'] as Timeframe[]).map((label) => {
            const active = timeframe === label;
            return (
              <TouchableOpacity
                key={label}
                style={[styles.segmentButton, active && styles.segmentButtonActive]}
                onPress={() => setTimeframe(label)}
              >
                <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.statsRow}>
          {statCards.map((card) => (
            <View key={card.label} style={styles.statCard}>
              <Text style={styles.statLabel}>{card.label}</Text>
              <Text style={[styles.statValue, { color: card.color }]}>{card.value}</Text>
              <Text style={styles.statSub}>{card.sub}</Text>
            </View>
          ))}
        </View>

        <View style={styles.tabPills}>
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'exercise', label: 'By Exercise' },
          ].map((pill) => {
            const active = overviewTab === pill.key;
            return (
              <TouchableOpacity
                key={pill.key}
                onPress={() => setOverviewTab(pill.key as typeof overviewTab)}
                style={[styles.pill, active && styles.pillActive]}
              >
                <Text style={[styles.pillText, active && styles.pillTextActive]}>
                  {pill.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{timeframe} Volume</Text>
            <Ionicons name="bar-chart" size={20} color={colors.primary} />
          </View>
          <Text style={styles.chartLabel}>
            {progress.current.count} workouts • {formatNumber(progress.current.volume)} kg total
          </Text>
          <Text style={styles.chartLabel}>
            Prev: {progress.previous.count} • {formatNumber(progress.previous.volume)} kg
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent Workouts</Text>
          {progress.recent.map((w) => (
            <View key={w.id} style={styles.workoutRow}>
              <View>
                <Text style={styles.workoutTitle}>{w.title}</Text>
                <Text style={styles.workoutSubtitle}>
                  {formatDateLabel(w.performedAt)} • {w.totalSets} sets • {formatNumber(w.totalVolume)} kg
                </Text>
              </View>
              <Text style={styles.workoutDuration}>{w.durationMinutes} min</Text>
            </View>
          ))}
          {!progress.recent.length && (
            <Text style={styles.emptyText}>No workouts yet. Log a session to see progress.</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function getRange(timeframe: Timeframe) {
  const now = Date.now();
  let currentStart = now;
  let prevStart = now;
  switch (timeframe) {
    case 'Weekly':
      currentStart = now - 7 * 24 * 60 * 60 * 1000;
      prevStart = now - 14 * 24 * 60 * 60 * 1000;
      break;
    case 'Monthly': {
      const d = new Date(now);
      const c = new Date(d);
      c.setMonth(d.getMonth() - 1);
      currentStart = c.getTime();
      const p = new Date(d);
      p.setMonth(d.getMonth() - 2);
      prevStart = p.getTime();
      break;
    }
    case 'Yearly': {
      const d = new Date(now);
      const c = new Date(d);
      c.setFullYear(d.getFullYear() - 1);
      currentStart = c.getTime();
      const p = new Date(d);
      p.setFullYear(d.getFullYear() - 2);
      prevStart = p.getTime();
      break;
    }
  }
  return { now, currentStart, prevStart };
}

function buildProgress(workouts: Workout[], timeframe: Timeframe) {
  const { now, currentStart, prevStart } = getRange(timeframe);
  const current = workouts.filter((w) => w.performedAt >= currentStart && w.performedAt <= now);
  const previous = workouts.filter((w) => w.performedAt >= prevStart && w.performedAt < currentStart);

  const currentVolume = current.reduce((acc, w) => acc + w.totalVolume, 0);
  const previousVolume = previous.reduce((acc, w) => acc + w.totalVolume, 0);

  const volumeDelta = currentVolume - previousVolume;
  const volumeDeltaPercent = previousVolume === 0 ? (currentVolume > 0 ? 100 : 0) : Math.round((volumeDelta / previousVolume) * 100);
  const workoutDelta = current.length - previous.length;

  return {
    current: { count: current.length, volume: currentVolume },
    previous: { count: previous.length, volume: previousVolume },
    volumeDelta,
    volumeDeltaPercent,
    workoutDelta,
    recent: workouts.slice(0, 5),
  };
}

function formatDelta(value: number, suffix: string) {
  if (!Number.isFinite(value)) return `0${suffix}`;
  const sign = value > 0 ? '+' : '';
  return `${sign}${value}${suffix}`;
}

function formatNumber(num: number) {
  return new Intl.NumberFormat().format(Math.round(num));
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },
  content: {
    padding: 20,
    paddingBottom: 80,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 15,
    color: '#475467',
    marginTop: 4,
  },
  segment: {
    flexDirection: 'row',
    backgroundColor: '#e5e7eb',
    borderRadius: 12,
    padding: 4,
    marginBottom: 14,
  },
  segmentButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
  },
  segmentButtonActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  segmentText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6b7280',
  },
  segmentTextActive: {
    color: '#2563ff',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  statLabel: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 8,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 4,
  },
  statSub: {
    fontSize: 12,
    color: '#6b7280',
  },
  tabPills: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  pill: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
  },
  pillActive: {
    backgroundColor: '#e5edff',
    borderColor: '#2563ff',
  },
  pillText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
  },
  pillTextActive: {
    color: '#2563ff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  chartLabel: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
  },
  workoutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  workoutTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  workoutSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  workoutDuration: {
    fontSize: 13,
    color: '#6b7280',
    marginLeft: 10,
  },
  emptyText: {
    marginTop: 8,
    color: '#6b7280',
  },
});
