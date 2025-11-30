import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../../constants/colors';
import { Card, SectionHeader, StatTile } from '../../components/ui';
import {
  formatDateLabel,
  formatDuration,
  getRecentWorkouts,
  getStats,
  useWorkouts,
} from '../../providers/WorkoutsProvider';

export default function Dashboard() {
  const router = useRouter();
  const { workouts } = useWorkouts();
  const stats = getStats(workouts);
  const recentWorkouts = getRecentWorkouts(workouts);

  const quickActions = [
    {
      label: 'Templates',
      description: 'Quick start workouts',
      icon: 'albums' as const,
      color: '#6366f1',
      route: '/(tabs)/templates',
    },
    {
      label: 'History',
      description: 'View past workouts',
      icon: 'time' as const,
      color: '#c084fc',
      route: '/history',
    },
    {
      label: 'Progress',
      description: 'Track your gains',
      icon: 'stats-chart' as const,
      color: '#22c55e',
      route: '/(tabs)/progress',
    },
    {
      label: 'Exercises',
      description: 'Browse library',
      icon: 'fitness' as const,
      color: '#f97316',
      route: '/exercises',
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>Welcome back to your training</Text>
        </View>

        <View style={styles.statsGrid}>
          <StatTile label="This Week" value={stats.weeklyWorkouts} sub="workouts" />
          <StatTile label="Volume" value={formatNumber(stats.weeklyVolume)} sub="kg this week" />
          <StatTile label="Streak" value={stats.streak} sub="days active" />
          <StatTile label="Total" value={stats.totalWorkouts} sub="workouts logged" />
        </View>

        <View style={styles.section}>
          <SectionHeader title="Quick Actions" />
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.label}
              style={styles.actionCard}
              onPress={() => router.push(action.route as any)}
              activeOpacity={0.85}
            >
              <View style={[styles.actionIcon, { backgroundColor: hexToRgba(action.color, 0.12) }]}>
                <Ionicons name={action.icon} size={22} color={action.color} />
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionLabel}>{action.label}</Text>
                <Text style={styles.actionDescription}>{action.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.muted} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <SectionHeader title="Recent Workouts" actionLabel="History" onActionPress={() => router.push('/history')} />
          {!recentWorkouts.length ? (
            <Card>
              <Text style={styles.emptyTitle}>No workouts yet</Text>
              <Text style={styles.emptySubtitle}>Log your first session to see progress here.</Text>
            </Card>
          ) : (
            recentWorkouts.map((workout) => (
              <TouchableOpacity
                key={workout.id}
                style={styles.workoutRow}
                activeOpacity={0.85}
                onPress={() => router.push(`/history/detail?id=${workout.id}`)}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.workoutTitle}>{formatDateLabel(workout.performedAt)}</Text>
                  <Text style={styles.workoutSubtitle}>
                    {workout.title} • {workout.totalSets} sets • {formatNumber(workout.totalVolume)} kg
                  </Text>
                </View>
                <Text style={styles.workoutDuration}>{formatDuration(workout.durationMinutes)}</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.muted} />
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.9}
        onPress={() => router.push('/log-workout')}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

function formatNumber(num: number) {
  return new Intl.NumberFormat().format(Math.round(num));
}

function hexToRgba(hex: string, alpha: number) {
  if (!hex.startsWith('#') || (hex.length !== 7 && hex.length !== 4)) {
    return hex;
  }
  const normalized =
    hex.length === 4
      ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
      : hex;
  const r = parseInt(normalized.slice(1, 3), 16);
  const g = parseInt(normalized.slice(3, 5), 16);
  const b = parseInt(normalized.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 15,
    color: colors.muted,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  section: {
    marginTop: 10,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },
  actionIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    flex: 1,
    marginLeft: 12,
  },
  actionLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  actionDescription: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 2,
  },
  workoutRow: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  workoutTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  workoutSubtitle: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 2,
  },
  workoutDuration: {
    fontSize: 13,
    color: colors.muted,
    marginRight: 6,
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
  fab: {
    position: 'absolute',
    bottom: 18,
    alignSelf: 'center',
    backgroundColor: colors.primary,
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
});
