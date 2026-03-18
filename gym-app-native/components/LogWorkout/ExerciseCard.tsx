import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { useSettings } from '../../providers/SettingsProvider';
import { exerciseDatabase } from '../../constants/exercises';
import { getRestTime } from '../../lib/workout-planner';
import { ExerciseEntry, SetEntry, Workout } from '../../types/workouts';

interface ExerciseCardProps {
  exercise: ExerciseEntry;
  onUpdate: (exercise: ExerciseEntry) => void;
  onRemove: () => void;
  onCompleteSet: (setId: string, isCompleted: boolean) => void;
  currentUnit: string;
  workouts: Workout[];
}

export default function ExerciseCard({ exercise, onUpdate, onRemove, onCompleteSet, currentUnit, workouts }: ExerciseCardProps) {
  const { getSuggestion, settings } = useSettings();
  const staticInfo = exerciseDatabase.find(e => e.name === exercise.name);
  const suggestion = getSuggestion(exercise.name, workouts);
  const showSuggestionBanner = suggestion.confidence > 0;
  
  const scientificRest = getRestTime(exercise.name, settings.userGoal || 'Hypertrophy');

  const updateSet = (setId: string, field: string, value: number) => {
    if (!Array.isArray(exercise.sets)) return;
    const updatedSets = exercise.sets.map((s: SetEntry) =>
      s.id === setId ? { ...s, [field]: value } : s
    );
    onUpdate({ ...exercise, sets: updatedSets });
  };

  const addSet = () => {
    if (!Array.isArray(exercise.sets)) return;
    const lastSet = exercise.sets[exercise.sets.length - 1];
    const newSet: SetEntry = {
      id: `s-${Date.now()}-${Math.random()}`,
      weight: lastSet ? lastSet.weight : 0,
      reps: lastSet ? lastSet.reps : 0,
      completed: false
    };
    onUpdate({ ...exercise, sets: [...exercise.sets, newSet] });
  };

  const applySuggestion = () => {
    if (!Array.isArray(exercise.sets)) return;
    const updatedSets = exercise.sets.map((s: SetEntry) => ({
      ...s,
      weight: suggestion.weight,
      reps: suggestion.reps
    }));
    onUpdate({ ...exercise, sets: updatedSets });
    Alert.alert("Suggestion Applied", `Sets updated to ${suggestion.weight}kg.`);
  };

  const showTips = () => {
    Alert.alert(
      exercise.name,
      `${staticInfo?.tips || 'No specific tips available.'}\n\nBiomechanics: ${staticInfo?.movementPlane || 'Unknown'}`,
      [{ text: 'Got it' }]
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <TouchableOpacity onPress={showTips} style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
            <Text style={styles.name}>{exercise.name}</Text>
            <Ionicons name="information-circle-outline" size={18} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.restText}>⏱️ Rest: {scientificRest}s</Text>
        </View>
        <TouchableOpacity onPress={onRemove}>
          <Ionicons name="trash-outline" size={20} color={colors.danger} />
        </TouchableOpacity>
      </View>

      {showSuggestionBanner && (
        <View style={[styles.aiBanner, { backgroundColor: '#f0f9ff', borderColor: '#0ea5e9' }]}>
          <View style={{flex: 1}}>
            <Text style={{fontSize: 12, color: '#0369a1', fontWeight:'bold'}}>
              Suggestion: {suggestion.weight}kg × {suggestion.reps}
            </Text>
            <Text style={{fontSize: 12, color: '#0369a1'}}>{suggestion.reason}</Text>
          </View>
          <TouchableOpacity style={styles.applyBtn} onPress={applySuggestion}>
            <Text style={{fontSize: 10, fontWeight: 'bold', color: '#0ea5e9'}}>APPLY</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.row}>
        <Text style={[styles.colHead, {width: 30}]}>#</Text>
        <Text style={[styles.colHead, {flex: 1}]}>{currentUnit?.toUpperCase() || 'KG'}</Text>
        <Text style={[styles.colHead, {flex: 1}]}>REPS</Text>
        <Text style={[styles.colHead, {width: 40}]}>✓</Text>
      </View>

      {Array.isArray(exercise.sets) && exercise.sets.map((set: SetEntry, index: number) => (
        <View key={set.id} style={styles.setRow}>
          <Text style={styles.setNum}>{index + 1}</Text>
          <TextInput style={styles.input} keyboardType="numeric" value={set.weight.toString()} onChangeText={(v) => updateSet(set.id, 'weight', Number(v))} />
          <TextInput style={styles.input} keyboardType="numeric" value={set.reps.toString()} onChangeText={(v) => updateSet(set.id, 'reps', Number(v))} />
          <TouchableOpacity onPress={() => onCompleteSet(set.id, !set.completed)}>
            <Ionicons name={set.completed ? "checkmark-circle" : "ellipse-outline"} size={28} color={set.completed ? colors.success : colors.muted} />
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={styles.addSetBtn} onPress={addSet}>
        <Text style={styles.addSetText}>+ Add Set</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, borderRadius: 12, padding: 16, marginBottom: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  name: { fontSize: 16, fontWeight: '700', color: colors.text },
  restText: { fontSize: 12, color: colors.muted, marginTop: 2 },
  aiBanner: { flexDirection: 'row', padding: 10, borderRadius: 8, borderWidth: 1, marginBottom: 12, alignItems: 'center' },
  applyBtn: { backgroundColor: '#fff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginLeft: 8 },
  row: { flexDirection: 'row', marginBottom: 8, alignItems: 'center', gap: 10 },
  colHead: { fontSize: 11, fontWeight: '700', color: colors.muted, textAlign: 'center' },
  setRow: { flexDirection: 'row', marginBottom: 10, alignItems: 'center', gap: 10 },
  setNum: { width: 30, textAlign: 'center', color: colors.muted, fontWeight: '500' },
  input: { flex: 1, backgroundColor: colors.background, borderRadius: 8, padding: 10, textAlign: 'center', fontSize: 16 },
  addSetBtn: { alignItems: 'center', padding: 8, marginTop: 4 },
  addSetText: { color: colors.primary, fontWeight: '600', fontSize: 14 },
});