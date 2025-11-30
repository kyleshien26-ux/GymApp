import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useWorkouts, formatDateLabel, formatDuration } from '../../providers/WorkoutsProvider';
import { colors } from '../../constants/colors';

export default function WorkoutDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { workouts } = useWorkouts();

  const workout = useMemo(() => workouts.find((w) => w.id === id), [workouts, id]);

  if (!workout) {
    return (
      <View style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Workout</Text>
          <View style={{ width: 22 }} />
        </View>
        <Text style={styles.emptyText}>Workout not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>{workout.title}</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.dateText}>
          {formatDateLabel(workout.performedAt)} • {formatDuration(workout.durationMinutes)}
        </Text>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{workout.durationMinutes}</Text>
            <Text style={styles.statLabel}>Minutes</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{workout.exercises.length}</Text>
            <Text style={styles.statLabel}>Exercises</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{workout.totalSets}</Text>
            <Text style={styles.statLabel}>Sets</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {workout.exercises.map((exercise) => (
          <View key={exercise.id} style={styles.exerciseCard}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            {exercise.sets.map((set, idx) => (
              <View key={set.id} style={styles.setRow}>
                <Text style={styles.setLabel}>Set {idx + 1}</Text>
                <Text style={styles.setWeight}>
                  {set.weight} kg x {set.reps}
                </Text>
                <Ionicons
                  name={set.completed ? 'checkmark-circle' : 'ellipse-outline'}
                  size={20}
                  color={set.completed ? '#22c55e' : '#cbd5e1'}
                />
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  dateText: {
    fontSize: 13,
    color: colors.muted,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 4,
  },
  scroll: {
    flex: 1,
  },
  exerciseCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
  },
  setRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  setLabel: {
    fontSize: 13,
    color: colors.muted,
    flex: 1,
  },
  setWeight: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    flex: 1.2,
    textAlign: 'right',
    marginRight: 8,
  },
  emptyText: {
    color: colors.muted,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
});
