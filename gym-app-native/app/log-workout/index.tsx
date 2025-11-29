import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../../constants/colors';
import { calculateTotals, useWorkouts } from '../../providers/WorkoutsProvider';
import { ExerciseEntry, SetEntry } from '../../types/workouts';

export default function LogWorkout() {
  const router = useRouter();
  const { addWorkout } = useWorkouts();
  const startedAt = useRef(Date.now());

  const [workoutTitle, setWorkoutTitle] = useState("Today's Session");
  const [exercises, setExercises] = useState<ExerciseEntry[]>([
    createExercise('Bench Press'),
  ]);
  const [error, setError] = useState<string | null>(null);

  const totals = useMemo(() => calculateTotals(exercises), [exercises]);

  const handleAddExercise = () => {
    setExercises((prev) => [...prev, createExercise(`Exercise ${prev.length + 1}`)]);
  };

  const handleRemoveExercise = (id: string) => {
    setExercises((prev) => prev.filter((ex) => ex.id !== id));
  };

  const updateExerciseName = (id: string, name: string) => {
    setExercises((prev) => prev.map((ex) => (ex.id === id ? { ...ex, name } : ex)));
  };

  const updateSet = (exerciseId: string, setId: string, field: 'weight' | 'reps', value: string) => {
    setExercises((prev) =>
      prev.map((exercise) => {
        if (exercise.id !== exerciseId) return exercise;
        return {
          ...exercise,
          sets: exercise.sets.map((set) =>
            set.id === setId ? { ...set, [field]: Number(value) || 0 } : set,
          ),
        };
      }),
    );
  };

  const addSet = (exerciseId: string) => {
    setExercises((prev) =>
      prev.map((exercise) =>
        exercise.id === exerciseId
          ? { ...exercise, sets: [...exercise.sets, createSet(exercise.sets.length + 1)] }
          : exercise,
      ),
    );
  };

  const handleSave = async () => {
    if (!exercises.length) {
      setError('Add at least one exercise.');
      return;
    }

    const saved = await addWorkout({
      title: workoutTitle,
      startedAt: startedAt.current,
      performedAt: Date.now(),
      exercises,
    });

    if (!saved) {
      setError('Nothing to save yet. Add sets and reps.');
      return;
    }

    setError(null);
    router.push('/history');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Log Workout</Text>
          <Text style={styles.subtitle}>Track your training session</Text>
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.85}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Exercises</Text>
            <Text style={styles.summaryValue}>{exercises.length}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Sets</Text>
            <Text style={styles.summaryValue}>{totals.totalSets}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Volume</Text>
            <Text style={styles.summaryValue}>{formatNumber(totals.totalVolume)} kg</Text>
          </View>
        </View>

        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>Workout name</Text>
          <TextInput
            value={workoutTitle}
            onChangeText={setWorkoutTitle}
            placeholder="Leg Day, Push, Pull..."
            placeholderTextColor={colors.muted}
            style={styles.workoutInput}
          />
        </View>

        <TouchableOpacity
          style={styles.addExerciseBox}
          onPress={handleAddExercise}
          activeOpacity={0.85}
        >
          <Text style={styles.addExerciseText}>+ Add Exercise</Text>
        </TouchableOpacity>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {exercises.map((exercise, idx) => (
          <View key={exercise.id} style={styles.exerciseCard}>
            <View style={styles.exerciseHeader}>
              <View style={styles.exerciseChip}>
                <Text style={styles.exerciseChipText}>{idx + 1}</Text>
              </View>
              <TextInput
                value={exercise.name}
                onChangeText={(text) => updateExerciseName(exercise.id, text)}
                placeholder="Exercise name"
                placeholderTextColor={colors.muted}
                style={styles.exerciseNameInput}
              />
              <TouchableOpacity onPress={() => handleRemoveExercise(exercise.id)}>
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            </View>

            {exercise.sets.map((set, setIdx) => (
              <View key={set.id} style={styles.setBox}>
                <Text style={styles.setLabel}>Set {setIdx + 1}</Text>
                <View style={styles.inputRow}>
                  <View style={styles.inputPill}>
                    <Text style={styles.inputPillLabel}>Weight (kg)</Text>
                    <TextInput
                      style={styles.inputValue}
                      keyboardType="numeric"
                      value={String(set.weight || '')}
                      onChangeText={(text) => updateSet(exercise.id, set.id, 'weight', text)}
                      placeholder="0"
                      placeholderTextColor={colors.muted}
                    />
                  </View>
                  <View style={styles.inputPill}>
                    <Text style={styles.inputPillLabel}>Reps</Text>
                    <TextInput
                      style={styles.inputValue}
                      keyboardType="numeric"
                      value={String(set.reps || '')}
                      onChangeText={(text) => updateSet(exercise.id, set.id, 'reps', text)}
                      placeholder="0"
                      placeholderTextColor={colors.muted}
                    />
                  </View>
                </View>
              </View>
            ))}

            <TouchableOpacity style={styles.addSetButton} onPress={() => addSet(exercise.id)}>
              <Ionicons name='add' size={16} color={colors.primary} />
              <Text style={styles.addSetText}>Add set</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function createSet(order: number): SetEntry {
  return {
    id: `set-${Date.now()}-${order}-${Math.random().toString(36).slice(2, 5)}`,
    weight: 0,
    reps: 0,
  };
}

function createExercise(name: string): ExerciseEntry {
  return {
    id: `ex-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    name,
    sets: [createSet(1)],
  };
}

function formatNumber(num: number) {
  return new Intl.NumberFormat().format(Math.round(num));
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  summaryRow: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  summaryItem: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.muted,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  inputCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12,
    color: colors.muted,
    marginBottom: 6,
  },
  workoutInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 12,
    color: colors.text,
    fontSize: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
  addExerciseBox: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginVertical: 12,
    backgroundColor: colors.card,
  },
  addExerciseText: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 15,
  },
  exerciseCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  exerciseChip: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: '#e0e7ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseChipText: {
    fontWeight: '700',
    color: colors.primary,
  },
  exerciseNameInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 4,
  },
  removeText: {
    fontSize: 13,
    color: colors.muted,
  },
  setBox: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    backgroundColor: colors.card,
    marginBottom: 10,
  },
  setLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  inputPill: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputPillLabel: {
    fontSize: 12,
    color: colors.muted,
  },
  inputValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginTop: 4,
  },
  addSetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
  },
  addSetText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '700',
  },
  errorText: {
    color: colors.danger,
    marginBottom: 10,
  },
});
