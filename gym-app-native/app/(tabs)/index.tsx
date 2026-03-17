import React, { useCallback, useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { colors } from '../../constants/colors';
import { Card, SectionHeader, StatTile } from '../../components/ui';
import { Workout } from '../../types/workouts';
import { useWorkouts } from '../../providers/WorkoutsProvider';
import {
  formatDateLabel,
  formatDuration,
  getRecentWorkouts,
  getStats,
} from '../../lib/workout-planner';

const DRAFT_KEY = '@gymapp/draft_workout';

export default function Dashboard() {
  const router = useRouter();
  const { workouts, refresh } = useWorkouts();
  const [stats, setStats] = useState(getStats([]));
  const [recentWorkouts, setRecentWorkouts] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setStats(getStats(workouts));
      setRecentWorkouts(getRecentWorkouts(workouts));
      AsyncStorage.getItem(DRAFT_KEY).then(d => setHasDraft(!!d));
    }, [workouts])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const isRestDay = useMemo(() => {
      if (!recentWorkouts.length) return false;
      const today = new Date().setHours(0,0,0,0);
      const last = new Date(recentWorkouts[0].performedAt).setHours(0,0,0,0);
      return today === last;
  }, [recentWorkouts]);

  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toLocaleString();
  };

  const quickActions = [
    { label: 'Templates', description: 'Quick start', icon: 'albums' as const, color: '#6366f1', route: '/(tabs)/templates' },
    { label: 'History', description: 'Past workouts', icon: 'time' as const, color: '#c084fc', route: '/history' },
    { label: 'Progress', description: 'Track gains', icon: 'stats-chart' as const, color: '#22c55e', route: '/(tabs)/progress' },
    { label: 'Exercises', description: 'Browse library', icon: 'fitness' as const, color: '#f97316', route: '/exercises' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>Welcome back to your training</Text>
          {isRestDay && (
              <View style={{marginTop: 10, backgroundColor: '#dcfce7', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6}}>
                  <Ionicons name="checkmark-circle" size={14} color="#166534" />
                  <Text style={{color: '#166534', fontWeight: '700', fontSize: 12}}>Daily Goal Complete</Text>
              </View>
          )}
        </View>

        {hasDraft && (
            <TouchableOpacity 
                style={[styles.section, {backgroundColor: colors.primary, borderRadius: 16, padding: 16, flexDirection:'row', justifyContent:'space-between', alignItems:'center'}]}
                onPress={() => router.push('/log-workout')}
            >
                <View>
                    <Text style={{color:'#fff', fontWeight:'bold', fontSize: 16}}>Resume Workout</Text>
                    <Text style={{color:'rgba(255,255,255,0.8)', fontSize: 12}}>You have an unsaved session</Text>
                </View>
                <Ionicons name="arrow-forward-circle" size={32} color="#fff" />
            </TouchableOpacity>
        )}

        <View style={styles.statsGrid}>
          <StatTile label="This Week" value={stats.weeklyWorkouts} sub="workouts" />
          <StatTile label="Volume" value={formatNumber(stats.weeklyVolume)} sub="kg" />
          <StatTile label="Streak" value={stats.streak} sub="days" />
          <StatTile label="Total" value={stats.totalWorkouts} sub="logs" />
        </View>

        <View style={styles.section}>
          <SectionHeader title="Quick Actions" />
          <View style={styles.actionGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.label}
                style={styles.actionCard}
                onPress={() => router.push(action.route as any)}
                activeOpacity={0.85}
              >
                <View style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}>
                  <Ionicons name={action.icon} size={22} color={action.color} />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
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
                onPress={() => router.push({ pathname: '/history/detail', params: { id: workout.id } })}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.workoutTitle}>{formatDateLabel(workout.performedAt)}</Text>
                  <Text style={styles.workoutSubtitle}>{workout.title} • {workout.totalSets} sets</Text>
                </View>
                <Text style={styles.workoutDuration}>{formatDuration(workout.durationMinutes)}</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.muted} />
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.fab} activeOpacity={0.9} onPress={() => router.push('/(tabs)/templates')}><Ionicons name="add" size={28} color="#fff" /></TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 100 },
  header: { marginBottom: 20, marginTop: 10 },
  title: { fontSize: 28, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 14, color: colors.muted, marginTop: 4 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  section: { marginBottom: 24 },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  actionCard: { width: '48%', flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  actionIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  actionLabel: { fontWeight: '600', color: colors.text, fontSize: 13 },
  workoutRow: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: colors.card, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: colors.border },
  workoutTitle: { fontWeight: '700', color: colors.text },
  workoutSubtitle: { color: colors.muted, fontSize: 12 },
  workoutDuration: { color: colors.muted, fontSize: 12, marginRight: 8 },
  fab: { position: 'absolute', bottom: 20, right: 20, backgroundColor: colors.primary, width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', elevation: 5 },
  emptyTitle: { fontWeight: '700', textAlign: 'center' },
  emptySubtitle: { textAlign: 'center', color: colors.muted, marginTop: 4 },
});