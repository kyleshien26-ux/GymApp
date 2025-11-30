import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const BORDER = '#e5e7eb';
const MUTED = '#475467';

export default function WorkoutDetail() {
  const router = useRouter();

  const exercises = [
    {
      name: 'Bench Press',
      sets: [
        { weight: 135, reps: 10, completed: true },
        { weight: 145, reps: 8, completed: true },
        { weight: 155, reps: 6, completed: true },
      ],
    },
    {
      name: 'Incline Dumbbell Press',
      sets: [
        { weight: 60, reps: 10, completed: true },
        { weight: 65, reps: 8, completed: true },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Push Day</Text>
        <TouchableOpacity>
          <Ionicons name="share-outline" size={22} color="#2563ff" />
        </TouchableOpacity>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.dateText}>Today • 2:30 PM - 3:15 PM</Text>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>45</Text>
            <Text style={styles.statLabel}>Minutes</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>6</Text>
            <Text style={styles.statLabel}>Exercises</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>18</Text>
            <Text style={styles.statLabel}>Sets</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {exercises.map((exercise) => (
          <View key={exercise.name} style={styles.exerciseCard}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            {exercise.sets.map((set, idx) => (
              <View key={idx} style={styles.setRow}>
                <Text style={styles.setLabel}>Set {idx + 1}</Text>
                <Text style={styles.setWeight}>
                  {set.weight} lbs x {set.reps}
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
    backgroundColor: '#f5f7fb',
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
    color: '#0f172a',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 16,
  },
  dateText: {
    fontSize: 13,
    color: MUTED,
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
    color: '#0f172a',
  },
  statLabel: {
    fontSize: 12,
    color: MUTED,
    marginTop: 4,
  },
  scroll: {
    flex: 1,
  },
  exerciseCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 12,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 10,
  },
  setRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  setLabel: {
    fontSize: 13,
    color: MUTED,
    flex: 1,
  },
  setWeight: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    flex: 1.2,
    textAlign: 'right',
    marginRight: 8,
  },
});
