import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAllWorkouts, getAllRecords, getDateRange, calculateTotalVolume, getWorkoutsByDateRange } from '@/lib/storage';
import { Workout, ProgressStats } from '@/types/workout';

const PRIMARY = '#2563ff';
const BORDER = '#e5e7eb';
const MUTED = '#6b7280';

type Timeframe = 'Weekly' | 'Monthly' | 'Yearly';

export default function ProgressScreen() {
  const [timeframe, setTimeframe] = useState<Timeframe>('Weekly');
  const [overviewTab, setOverviewTab] = useState<'overview' | 'exercise'>('overview');
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [stats, setStats] = useState<ProgressStats>({
    volumeChange: 0,
    workoutChange: 0,
    currentVolume: 0,
    previousVolume: 0,
    currentWorkouts: 0,
    previousWorkouts: 0
  });
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    try {
      const allWorkouts = getAllWorkouts();
      setWorkouts(allWorkouts);
      
      const timeframeStats = getTimeframeStats(timeframe);
      setStats(timeframeStats);
    } catch (error) {
      console.error('Error loading workout data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeframeStats = (timeframe: Timeframe): ProgressStats => {
    const { currentPeriodStart, currentPeriodEnd, previousPeriodStart, previousPeriodEnd } = getDateRange(timeframe);
    
    const currentWorkouts = getWorkoutsByDateRange(currentPeriodStart, currentPeriodEnd);
    const previousWorkouts = getWorkoutsByDateRange(previousPeriodStart, previousPeriodEnd);
    
    const currentVolume = calculateTotalVolume(currentWorkouts);
    const previousVolume = calculateTotalVolume(previousWorkouts);
    
    // Fix division by zero bug
    const volumeChange = previousVolume === 0 
      ? (currentVolume > 0 ? 100 : 0)
      : Math.round(((currentVolume - previousVolume) / previousVolume) * 100);
    
    const workoutChange = currentWorkouts.length - previousWorkouts.length;
    
    return {
      volumeChange,
      workoutChange,
      currentVolume,
      previousVolume,
      currentWorkouts: currentWorkouts.length,
      previousWorkouts: previousWorkouts.length
    };
  };

  useEffect(() => {
    loadData();
  }, [timeframe]);

  const statCards = [
    { 
      label: 'Volume Change', 
      value: loading ? '...' : `${stats.volumeChange > 0 ? '+' : ''}${stats.volumeChange}%`, 
      sub: `vs previous ${timeframe.toLowerCase().slice(0, -2)}`, 
      color: stats.volumeChange >= 0 ? '#10b981' : '#ef4444' 
    },
    { 
      label: 'Workout Change', 
      value: loading ? '...' : `${stats.workoutChange > 0 ? '+' : ''}${stats.workoutChange}`, 
      sub: `vs previous ${timeframe.toLowerCase().slice(0, -2)}`, 
      color: stats.workoutChange >= 0 ? '#10b981' : '#ef4444' 
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
            <Text style={styles.cardTitle}>Weekly Volume Trend</Text>
            <Ionicons name="bar-chart" size={20} color={PRIMARY} />
          </View>
          <View style={styles.chartPlaceholder}>
            <View style={styles.bar} />
            <View style={[styles.bar, { height: 70 }]} />
            <View style={[styles.bar, { height: 120 }]} />
            <View style={[styles.bar, { height: 40 }]} />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Personal Records</Text>
          <View style={styles.prRow}>
            <View>
              <Text style={styles.prLabel}>Pull-ups</Text>
              <Text style={styles.prSub}>Nov 9, 2025</Text>
            </View>
            <View style={styles.prValueContainer}>
              <Text style={styles.prValue}>72</Text>
              <Text style={styles.prUnit}>kg (1RM)</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.linkRow}>
            <Text style={styles.link}>60 kg x 6 reps</Text>
            <Ionicons name="chevron-forward" size={16} color={PRIMARY} />
          </TouchableOpacity>
        </View>
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
    color: MUTED,
  },
  segmentTextActive: {
    color: PRIMARY,
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
    borderColor: BORDER,
  },
  statLabel: {
    fontSize: 13,
    color: MUTED,
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
    color: MUTED,
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
    borderColor: PRIMARY,
  },
  pillText: {
    fontSize: 14,
    color: MUTED,
    fontWeight: '600',
  },
  pillTextActive: {
    color: PRIMARY,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
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
  chartPlaceholder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 160,
    paddingHorizontal: 10,
  },
  bar: {
    flex: 1,
    marginHorizontal: 6,
    backgroundColor: PRIMARY,
    height: 90,
    borderRadius: 8,
  },
  prRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  prLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  prSub: {
    fontSize: 12,
    color: MUTED,
    marginTop: 2,
  },
  prValueContainer: {
    alignItems: 'flex-end',
  },
  prValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
  },
  prUnit: {
    fontSize: 12,
    color: MUTED,
  },
  linkRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  link: {
    color: PRIMARY,
    fontWeight: '700',
    fontSize: 13,
  },
});
