import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../../constants/colors';
import { calculateTotals, useWorkouts } from '../../providers/WorkoutsProvider';
import { useSettings } from '../../providers/SettingsProvider';
import { ExerciseEntry, SetEntry, Template } from '../../types/workouts';
import { ExercisePicker } from '../../components/ExercisePicker';
import { RestTimer } from '../../components/RestTimer';
import type { Exercise } from '../../constants/exercises';

export default function LogWorkout() {
  const router = useRouter();
  const { addWorkout, addTemplate } = useWorkouts();
  const { settings, getWeightSuggestion, recordWorkout } = useSettings();
  const startedAt = useRef(Date.now());

  const [workoutTitle, setWorkoutTitle] = useState("Today's Session");
  const [exercises, setExercises] = useState<ExerciseEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateDesc, setTemplateDesc] = useState('');
  const [timerVisible, setTimerVisible] = useState(false);

  const totals = useMemo(() => calculateTotals(exercises), [exercises]);

  const handleSelectExercise = (exercise: Exercise) => {
    setExercises((prev) => [...prev, createExercise(exercise.name)]);
  };

  const handleAddExercise = () => {
    setPickerVisible(true);
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

  const applySuggestion = (exerciseId: string, setId: string, suggestedWeight: number) => {
    setExercises((prev) =>
      prev.map((exercise) => {
        if (exercise.id !== exerciseId) return exercise;
        return {
          ...exercise,
          sets: exercise.sets.map((set) =>
            set.id === setId ? { ...set, weight: suggestedWeight } : set,
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

    const exercisesForRecord = exercises.map(ex => ({
      name: ex.name,
      sets: ex.sets.map(s => ({ weight: s.weight, reps: s.reps }))
    }));
    await recordWorkout(exercisesForRecord, totals.totalVolume, totals.totalSets);

    setError(null);
    setTemplateName(workoutTitle);
    setShowSaveTemplate(true);
  };

  const handleSaveTemplate = async () => {
    if (!templateName.trim()) {
      Alert.alert('Template name required', 'Please enter a name for this template');
      return;
    }

    const template: Template = {
      id: `t-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: templateName,
      description: templateDesc,
      exercises,
    };

    await addTemplate(template);
    setShowSaveTemplate(false);
    setTemplateName('');
    setTemplateDesc('');
    router.push('/history');
  };

  const getSuggestionDisplay = (reason: string, confidence: number) => {
    switch (reason) {
      case 'INCREASE':
        return { label: '↑ Increase', color: '#22c55e', icon: 'trending-up' };
      case 'DECREASE':
        return { label: '↓ Decrease', color: '#f59e0b', icon: 'trending-down' };
      case 'DELOAD':
        return { label: '⟳ Deload', color: '#ef4444', icon: 'refresh' };
      case 'HOLD':
        return { label: '→ Maintain', color: '#3b82f6', icon: 'remove' };
      default:
        return { label: 'New Exercise', color: colors.muted, icon: 'add' };
    }
  };

  return (
    <View style={styles.container}>
      <ExercisePicker
        visible={pickerVisible}
        onSelectExercise={handleSelectExercise}
        onClose={() => setPickerVisible(false)}
      />

      <RestTimer
        visible={timerVisible}
        initialSeconds={settings.preferences.defaultRestTimer}
        onDismiss={() => setTimerVisible(false)}
      />

      <Modal
        visible={showSaveTemplate}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setShowSaveTemplate(false);
          router.push('/history');
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Save as Template?</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowSaveTemplate(false);
                  router.push('/history');
                }}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Save this workout as a template for quick future logging
            </Text>

            <View style={styles.inputSection}>
              <Text style={styles.modalInputLabel}>Template Name</Text>
              <TextInput
                style={styles.templateInput}
                value={templateName}
                onChangeText={setTemplateName}
                placeholder="e.g., Push Day"
                placeholderTextColor={colors.muted}
              />
            </View>

            <View style={styles.inputSection}>
              <Text style={styles.modalInputLabel}>Description (Optional)</Text>
              <TextInput
                style={[styles.templateInput, styles.descriptionInput]}
                value={templateDesc}
                onChangeText={setTemplateDesc}
                placeholder="Add notes about this template..."
                placeholderTextColor={colors.muted}
                multiline
              />
            </View>

            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={styles.modalSecondaryButton}
                onPress={() => {
                  setShowSaveTemplate(false);
                  router.push('/history');
                }}
              >
                <Text style={styles.modalSecondaryButtonText}>Skip</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalPrimaryButton}
                onPress={handleSaveTemplate}
              >
                <Text style={styles.modalPrimaryButtonText}>Save Template</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{padding: 8, marginRight: 8}}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Log Workout</Text>
          <Text style={styles.subtitle}>Track your training session</Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.timerButton}
            onPress={() => setTimerVisible(true)}
            activeOpacity={0.85}
          >
            <Ionicons name="timer-outline" size={20} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.85}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
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

        {exercises.map((exercise, idx) => {
          const suggestion = getWeightSuggestion(exercise.name, 8);
          const suggestionDisplay = getSuggestionDisplay(suggestion.reason, suggestion.confidence);
          const hasSuggestion = suggestion.weight > 0;

          return (
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

              {hasSuggestion && (
                <View style={[styles.suggestionBanner, { borderLeftColor: suggestionDisplay.color }]}>
                  <View style={styles.suggestionContent}>
                    <View style={styles.suggestionHeader}>
                      <Ionicons name={suggestionDisplay.icon as any} size={16} color={suggestionDisplay.color} />
                      <Text style={[styles.suggestionLabel, { color: suggestionDisplay.color }]}>
                        {suggestionDisplay.label}
                      </Text>
                      <Text style={styles.suggestionConfidence}>
                        {suggestion.confidence}% confidence
                      </Text>
                    </View>
                    <Text style={styles.suggestionWeight}>
                      Suggested: <Text style={styles.suggestionWeightBold}>{suggestion.weight} kg</Text> for 8 reps
                    </Text>
                  </View>
                </View>
              )}

              {exercise.sets.map((set, setIdx) => (
                <View key={set.id} style={styles.setBox}>
                  <View style={styles.setHeader}>
                    <Text style={styles.setLabel}>Set {setIdx + 1}</Text>
                    {hasSuggestion && set.weight === 0 && (
                      <TouchableOpacity
                        style={styles.applySuggestionBtn}
                        onPress={() => applySuggestion(exercise.id, set.id, suggestion.weight)}
                      >
                        <Ionicons name="flash" size={12} color="#fff" />
                        <Text style={styles.applySuggestionText}>Use {suggestion.weight}kg</Text>
                      </TouchableOpacity>
                    )}
                  </View>
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
          );
        })}
      </ScrollView>
    </View>
  );
}

function createSet(order: number): SetEntry {
  return {
    id: `set-${Date.now()}-${order}-${Math.random().toString(36).slice(2, 5)}`,
    weight: 0,
    reps: 0,
    completed: false,
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
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 54, paddingBottom: 16 },
  title: { fontSize: 24, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 13, color: colors.muted, marginTop: 4 },
  saveButton: { backgroundColor: colors.primary, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  saveButtonText: { color: '#fff', fontWeight: '700' },
  headerButtons: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  timerButton: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  content: { paddingHorizontal: 20, paddingBottom: 60 },
  summaryRow: { flexDirection: 'row', backgroundColor: colors.card, borderRadius: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 16 },
  summaryItem: { flex: 1, padding: 12, alignItems: 'center', borderRightWidth: 1, borderRightColor: colors.border },
  summaryLabel: { fontSize: 12, color: colors.muted, marginBottom: 4 },
  summaryValue: { fontSize: 18, fontWeight: '800', color: colors.text },
  inputCard: { backgroundColor: colors.card, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 12, marginBottom: 12 },
  inputLabel: { fontSize: 12, color: colors.muted, marginBottom: 6 },
  workoutInput: { backgroundColor: '#f8fafc', borderRadius: 10, padding: 12, color: colors.text, fontSize: 15, borderWidth: 1, borderColor: colors.border },
  addExerciseBox: { borderWidth: 1, borderStyle: 'dashed', borderColor: colors.border, borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginVertical: 12, backgroundColor: colors.card },
  addExerciseText: { color: colors.text, fontWeight: '700', fontSize: 15 },
  exerciseCard: { backgroundColor: colors.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 12 },
  exerciseHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  exerciseChip: { width: 26, height: 26, borderRadius: 8, backgroundColor: '#e0e7ff', alignItems: 'center', justifyContent: 'center' },
  exerciseChipText: { fontWeight: '700', color: colors.primary },
  exerciseNameInput: { flex: 1, marginLeft: 10, fontSize: 16, fontWeight: '700', color: colors.text, borderBottomWidth: 1, borderBottomColor: colors.border, paddingVertical: 4 },
  removeText: { fontSize: 13, color: colors.muted },
  suggestionBanner: { backgroundColor: '#f0fdf4', borderRadius: 10, padding: 12, marginBottom: 12, borderLeftWidth: 4 },
  suggestionContent: { flex: 1 },
  suggestionHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  suggestionLabel: { fontSize: 13, fontWeight: '700' },
  suggestionConfidence: { fontSize: 11, color: colors.muted, marginLeft: 'auto' },
  suggestionWeight: { fontSize: 14, color: colors.text },
  suggestionWeightBold: { fontWeight: '800', color: colors.primary },
  setBox: { borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 12, backgroundColor: colors.card, marginBottom: 10 },
  setHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  setLabel: { fontSize: 14, fontWeight: '700', color: colors.text },
  applySuggestionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.primary, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  applySuggestionText: { fontSize: 11, fontWeight: '700', color: '#fff' },
  inputRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  inputPill: { flex: 1, backgroundColor: '#f8fafc', borderRadius: 10, padding: 10, borderWidth: 1, borderColor: colors.border },
  inputPillLabel: { fontSize: 12, color: colors.muted },
  inputValue: { fontSize: 16, fontWeight: '700', color: colors.text, marginTop: 4 },
  addSetButton: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 10 },
  addSetText: { fontSize: 14, color: colors.primary, fontWeight: '700' },
  errorText: { color: colors.danger, marginBottom: 10 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: colors.card, borderRadius: 20, padding: 24, width: '100%', maxWidth: 400 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: colors.text },
  modalSubtitle: { fontSize: 14, color: colors.muted, marginBottom: 20 },
  inputSection: { marginBottom: 16 },
  modalInputLabel: { fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: 8 },
  templateInput: { backgroundColor: colors.background, borderRadius: 12, padding: 12, color: colors.text, fontSize: 15, borderWidth: 1, borderColor: colors.border },
  descriptionInput: { minHeight: 60, textAlignVertical: 'top' },
  modalButtonRow: { flexDirection: 'row', gap: 12, marginTop: 20 },
  modalSecondaryButton: { flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  modalSecondaryButtonText: { fontSize: 15, fontWeight: '700', color: colors.text },
  modalPrimaryButton: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center' },
  modalPrimaryButtonText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
