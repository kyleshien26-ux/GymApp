import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const BORDER = '#e5e7eb';
const MUTED = '#475467';
const PRIMARY = '#2563ff';

export default function WorkoutsScreen() {
  const router = useRouter();

  const recentWorkouts = [
    { id: 1, name: 'Push Day', date: 'Sunday, Nov 9, 2025', duration: '1 min', volume: '2140 kg', sets: 6 },
    { id: 2, name: 'Pull Day', date: 'Sunday, Nov 9, 2025', duration: '0', volume: '0 kg', sets: 0 },
  ];

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
        {recentWorkouts.map((workout) => (
          <View key={workout.id} style={styles.workoutCard}>
            <View style={styles.rowTop}>
              <Text style={styles.workoutDate}>{workout.date}</Text>
              <Ionicons name="chevron-down" size={18} color="#94a3b8" />
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaItem}>
                <Ionicons name="time-outline" size={14} color={MUTED} /> {workout.duration}
              </Text>
              <Text style={styles.metaItem}>
                <Ionicons name="trending-up-outline" size={14} color={MUTED} /> {workout.volume}
              </Text>
              <Text style={styles.metaItem}>
                <Ionicons name="barbell-outline" size={14} color={MUTED} /> {workout.sets} sets
              </Text>
            </View>

            <View style={styles.exerciseBlock}>
              <Text style={styles.exerciseName}>{workout.name}</Text>
              <View style={styles.setList}>
                <View style={styles.setRow}>
                  <Text style={styles.setLabel}>Set 1</Text>
                  <Text style={styles.setValue}>60 kg x 6 reps</Text>
                </View>
                <View style={styles.setRow}>
                  <Text style={styles.setLabel}>Set 2</Text>
                  <Text style={styles.setValue}>60 kg x 5 reps</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.deleteRow}>
              <Ionicons name="trash-outline" size={18} color="#ef4444" />
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))}

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
    backgroundColor: PRIMARY,
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
    borderColor: BORDER,
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
    color: MUTED,
  },
  exerciseBlock: {
    borderWidth: 1,
    borderColor: BORDER,
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
    color: MUTED,
  },
  setValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  deleteRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  deleteText: {
    color: '#ef4444',
    fontWeight: '700',
    fontSize: 13,
  },
  dashedButton: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: BORDER,
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
