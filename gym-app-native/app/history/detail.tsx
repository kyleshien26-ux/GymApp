import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors } from '../../constants/colors';
import { useWorkouts, formatDateLabel, formatDuration } from '../../providers/WorkoutsProvider';
import { useSettings } from '../../providers/SettingsProvider';

export default function HistoryDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { workouts, deleteWorkout } = useWorkouts();
  const { recalculatePersonalRecords } = useSettings();
  
  const workout = workouts.find(w => w.id === id);

  if (!workout) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Workout not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.btn}><Text style={{color: colors.primary}}>Go Back</Text></TouchableOpacity>
      </View>
    );
  }

  const handleDelete = async () => {
    const nextWorkouts = workouts.filter(w => w.id !== workout.id);
    await deleteWorkout(workout.id);
    await recalculatePersonalRecords(nextWorkouts);
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="chevron-back" size={24} color={colors.text} /></TouchableOpacity>
        <Text style={styles.title}>{formatDateLabel(workout.performedAt)}</Text>
        <TouchableOpacity onPress={handleDelete}>
          <Ionicons name="trash-outline" size={22} color={colors.danger} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>{workout.title}</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}><Ionicons name="time-outline" size={16} color={colors.muted} /><Text style={styles.statVal}>{formatDuration(workout.durationMinutes)}</Text></View>
            <View style={styles.statItem}><Ionicons name="barbell-outline" size={16} color={colors.muted} /><Text style={styles.statVal}>{workout.totalVolume.toLocaleString()} kg</Text></View>
            <View style={styles.statItem}><Ionicons name="repeat-outline" size={16} color={colors.muted} /><Text style={styles.statVal}>{workout.totalSets} sets</Text></View>
          </View>
        </View>

        <Text style={styles.sectionHeader}>Exercises</Text>
        {workout.exercises.map((ex, i) => (
          <View key={i} style={styles.exerciseCard}>
            <Text style={styles.exName}>{ex.name}</Text>
            {Array.isArray(ex.sets) && ex.sets.map((set, j) => (
              <View key={j} style={styles.setRow}>
                <Text style={styles.setNum}>{j+1}</Text>
                <Text style={styles.setDetails}>{set.weight}kg × {set.reps} reps</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
  title: { fontSize: 18, fontWeight: 'bold' },
  error: { textAlign: 'center', marginTop: 100, fontSize: 18, color: colors.muted },
  btn: { alignSelf: 'center', marginTop: 20 },
  content: { padding: 20 },
  summaryCard: { backgroundColor: colors.card, padding: 20, borderRadius: 16, marginBottom: 24 },
  summaryTitle: { fontSize: 22, fontWeight: '800', color: colors.text, marginBottom: 16 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statItem: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  statVal: { fontWeight: '600', color: colors.text },
  sectionHeader: { fontSize: 18, fontWeight: '700', marginBottom: 12, color: colors.text },
  exerciseCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  exName: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  setRow: { flexDirection: 'row', marginBottom: 4 },
  setNum: { width: 24, color: colors.muted, fontSize: 13 },
  setDetails: { fontSize: 14, color: colors.text, fontWeight: '500' }
});