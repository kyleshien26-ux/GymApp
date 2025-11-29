import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const PRIMARY = '#2563ff';
const BORDER = '#e5e7eb';
const MUTED = '#6b7280';

export default function Dashboard() {
  const router = useRouter();

  // FIXED: Changed to neutral values instead of fake data
  // TODO: Connect to real workout data when storage is implemented
  const stats = [
    { label: 'This Week', value: '0', sub: 'workouts' },
    { label: 'Volume', value: '0', sub: 'kg total' },
    { label: 'Streak', value: '0', sub: 'days' },
    { label: 'Total', value: '0', sub: 'workouts' },
  ];

  const quickActions = [
    {
      label: 'Templates',
      description: 'Quick start workouts',
      icon: 'albums-outline' as const,
      color: '#6366f1',
      route: '/(tabs)/templates',
    },
    {
      label: 'History',
      description: 'View past workouts',
      icon: 'time-outline' as const,
      color: '#c084fc',
      route: '/history',
    },
    {
      label: 'Progress',
      description: 'Track your gains',
      icon: 'trending-up-outline' as const,
      color: '#22c55e',
      route: '/(tabs)/progress',
    },
    {
      label: 'Exercises',
      description: 'Browse library',
      icon: 'barbell-outline' as const,
      color: '#f97316',
      route: '/exercises',
    },
  ];

  const recentWorkouts = [
    { id: 1, title: 'No workouts yet', duration: 'Start logging!' },
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
          {stats.map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statSub}>{stat.sub}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.label}
              style={styles.actionCard}
              onPress={() => router.push(action.route as any)}
              activeOpacity={0.85}
            >
              <View style={[styles.actionIcon, { backgroundColor: `${action.color}15` }]}>
                <Ionicons name={action.icon} size={22} color={action.color} />
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionLabel}>{action.label}</Text>
                <Text style={styles.actionDescription}>{action.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={MUTED} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Workouts</Text>
          <View style={styles.emptyState}>
            <Ionicons name="barbell-outline" size={48} color={MUTED} />
            <Text style={styles.emptyText}>No workouts yet</Text>
            <Text style={styles.emptySubtext}>Tap the + button to log your first workout</Text>
          </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
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
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 15,
    color: MUTED,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER,
  },
  statLabel: {
    fontSize: 13,
    color: MUTED,
    marginBottom: 6,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
  },
  statSub: {
    fontSize: 12,
    color: MUTED,
    marginTop: 2,
  },
  section: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 10,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: BORDER,
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
    color: '#0f172a',
  },
  actionDescription: {
    fontSize: 13,
    color: MUTED,
    marginTop: 2,
  },
  emptyState: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 32,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: MUTED,
    marginTop: 4,
    textAlign: 'center',
  },
  workoutRow: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 10,
  },
  workoutTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  workoutDuration: {
    fontSize: 13,
    color: MUTED,
    marginTop: 2,
  },
  fab: {
    position: 'absolute',
    bottom: 18,
    alignSelf: 'center',
    backgroundColor: PRIMARY,
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
