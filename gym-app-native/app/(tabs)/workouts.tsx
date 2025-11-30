import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../../constants/colors';
import { useWorkouts, formatDateLabel, formatDuration } from '../../providers/WorkoutsProvider';

export default function WorkoutsScreen() {
  const router = useRouter();
  const { workouts } = useWorkouts();

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Workouts</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => router.push('/log-workout')}>
            <Ionicons name="add" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Recent Workouts</Text>
        {workouts.map((workout) => (
          <View key={workout.id} style={styles.workoutCard}>
            <View style={styles.rowTop}>
              <Text style={styles.workoutDate}>{formatDateLabel(workout.performedAt)}</Text>
              <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaItem}>
                <Ionicons name="time-outline" size={14} color={colors.muted} /> {formatDuration(workout.durationMinutes)}
              </Text>
              <Text style={styles.metaItem}>
                <Ionicons name="stats-chart" size={14} color={colors.muted} /> {formatNumber(workout.totalVolume)} kg
              </Text>
              <Text style={styles.metaItem}>
                <Ionicons name="barbell-outline" size={14} color={colors.muted} /> {workout.totalSets} sets
              </Text>
            </View>

            {workout.exercises.map((ex) => (
              <View key={ex.id} style={styles.exerciseBlock}>
                <Text style={styles.exerciseName}>{ex.name}</Text>
                <View style={styles.setList}>
                  {ex.sets.map((set, idx) => (
                    <View key={set.id} style={styles.setRow}>
                      <Text style={styles.setLabel}>Set {idx + 1}</Text>
                      <Text style={styles.setValue}>{set.weight} kg x {set.reps} reps</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        ))}

        {!workouts.length && (
          <Text style={styles.emptyText}>No workouts yet. Log your first session.</Text>
        )}

        <TouchableOpacity
          style={styles.dashedButton}
          onPress={() => router.push('/log-workout')}
          activeOpacity={0.85}
        >
          <Text style={styles.dashedText}>+ Add Workout</Text>
        </TouchableOpacity>
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
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#2563ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  workoutCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 12,
  },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  workoutDate: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  metaItem: {
    fontSize: 13,
    color: '#475467',
  },
  exerciseBlock: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#f8fafc',
    marginBottom: 10,
  },
  exerciseName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  setList: {
    gap: 6,
  },
  setRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  setLabel: {
    fontSize: 13,
    color: '#475467',
  },
  setValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  emptyText: {
    color: '#475467',
    marginBottom: 12,
  },
  dashedButton: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#fff',
    marginTop: 4,
  },
  dashedText: {
    fontWeight: '700',
    color: '#0f172a',
  },
});
