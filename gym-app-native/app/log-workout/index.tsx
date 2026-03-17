import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const DRAFT_KEY = '@gymapp/draft_workout';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors } from '../../constants/colors';
import { useWorkouts } from '../../providers/WorkoutsProvider';
import { useSettings } from '../../providers/SettingsProvider';
import { ExerciseEntry, SetEntry } from '../../types/workouts';
import { ExercisePicker } from '../../components/ExercisePicker';
import ExerciseCard from './exercise';
import type { Exercise } from '../../constants/exercises';
import { scheduleRestNotification, cancelAllNotifications } from '../../lib/notifications';
import { getRandomTip } from '../../lib/tips';
import { getRestTime } from '../../lib/workout-planner';

export default function LogWorkout() {
  const router = useRouter();
  const { templateId } = useLocalSearchParams();
  const { addWorkout, templates, workouts } = useWorkouts();
  const { getSuggestion, checkPersonalRecords, settings } = useSettings();
  const startedAt = useRef(Date.now());
  
  const [currentUnit, setCurrentUnit] = useState<'kg' | 'lbs'>(settings?.preferences?.units || 'kg');
  const [workoutTitle, setWorkoutTitle] = useState("Today's Session");
  const [exercises, setExercises] = useState<ExerciseEntry[]>([]);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [expiryTimestamp, setExpiryTimestamp] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [currentTip, setCurrentTip] = useState("");
  const [isDiscarding, setIsDiscarding] = useState(false);

  const clearDraft = async () => {
    await AsyncStorage.removeItem(DRAFT_KEY);
  };

  // Auto-save draft
  useEffect(() => {
    const saveDraft = async () => {
        if (exercises.length > 0 && !isDiscarding) {
            const draft = {
                title: workoutTitle,
                exercises: exercises,
                startedAt: startedAt.current,
                templateId: templateId
            };
            await AsyncStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
        }
    };
    const debounce = setTimeout(saveDraft, 1000); 
    return () => clearTimeout(debounce);
  }, [workoutTitle, exercises, templateId, isDiscarding]);

  // Init: Load Template OR Draft
  useEffect(() => {
    const init = async () => {
        if (templateId && templates.length > 0) {
            const t = templates.find(t => t.id === templateId);
            if (t) {
                setWorkoutTitle(t.name);
                setExercises(JSON.parse(JSON.stringify(t.exercises)));
            }
        } else {
            try {
                const draftJson = await AsyncStorage.getItem(DRAFT_KEY);
                if (draftJson) {
                    const draft = JSON.parse(draftJson);
                    setWorkoutTitle(draft.title);
                    setExercises(draft.exercises);
                    startedAt.current = draft.startedAt;
                }
            } catch (e) { console.warn("Failed to load draft"); }
        }
    };
    init();
  }, [templateId, templates]);

  // --- TIMER LOGIC (Timestamp based for background support) ---
  useEffect(() => {
    let interval: any;
    if (expiryTimestamp) {
      interval = setInterval(() => {
        const now = Date.now();
        const left = Math.max(0, Math.ceil((expiryTimestamp - now) / 1000));
        setSecondsLeft(left);
        if (left <= 0) {
          setExpiryTimestamp(null);
          cancelAllNotifications();
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [expiryTimestamp]);

  const startRestTimer = (duration: number) => {
    const end = Date.now() + (duration * 1000);
    setExpiryTimestamp(end);
    setSecondsLeft(duration);
    setCurrentTip(getRandomTip());
    scheduleRestNotification(duration);
  };

  const cancelTimer = () => {
    setExpiryTimestamp(null);
    setSecondsLeft(0);
    cancelAllNotifications();
  };

  const isSuggestionEnabled = settings?.preferences?.enableAdvancedSuggestions ?? true;

  const displayWeight = (w: number | undefined) => {
    const val = w || 0;
    return currentUnit === 'kg' ? val : Math.round(val * 2.20462);
  };

  const saveWeight = (w: number) => currentUnit === 'kg' ? w : w / 2.20462;
  const toggleUnit = () => setCurrentUnit(prev => prev === 'kg' ? 'lbs' : 'kg');

  const handleSelectExercise = (exercise: Exercise) => {
    const suggestion = (isSuggestionEnabled && getSuggestion) 
      ? getSuggestion(exercise.name, workouts) 
      : { weight: 0, reps: 0, reason: '', confidence: 0 };

    const hasHistory = suggestion.confidence > 0;

    const newExercise: ExerciseEntry = {
      id: `ex-${Date.now()}-${Math.random()}`,
      name: exercise.name,
      muscleGroup: exercise.muscleGroup,
      sets: [{ 
        id: `s-${Date.now()}`, 
        weight: (isSuggestionEnabled && hasHistory) ? suggestion.weight : 0, 
        reps: (isSuggestionEnabled && suggestion.reps) ? suggestion.reps : 0, 
        completed: false 
      }],
      notes: (isSuggestionEnabled && hasHistory) ? `${suggestion.reason} @ ${suggestion.weight}kg` : undefined
    };

    setExercises(prev => [...prev, newExercise]);
  };

  const handleCompleteSet = (exId: string, sId: string, isCompleted: boolean) => {
    setExercises(prev => prev.map(ex => {
        if (ex.id !== exId || !Array.isArray(ex.sets)) return ex;
        return {
            ...ex,
            sets: ex.sets.map(s => s.id === sId ? { ...s, completed: isCompleted } : s)
        };
    }));

    if (isCompleted) {
      const exercise = exercises.find(e => e.id === exId);
      const rest = getRestTime(exercise?.name || '', settings.userGoal || 'Hypertrophy');
      startRestTimer(rest);
    } else {
      cancelTimer();
    }
  };

  const handleDiscard = () => {
    Alert.alert(
      'Discard Workout',
      'Are you sure you want to delete this session? All progress will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Discard', 
          style: 'destructive', 
          onPress: async () => {
            setIsDiscarding(true);
            await clearDraft();
            cancelTimer();
            if (router.canDismiss()) {
              router.dismissAll();
            }
            router.replace('/(tabs)/templates');
          }
        }
      ]
    );
  };

  const handleSave = async () => {
    if (!exercises.length) return;
    
    const cleanedExercises = exercises.map(ex => {
      if (!Array.isArray(ex.sets)) return ex;
      return {
        ...ex,
        sets: ex.sets.filter((s: SetEntry) => s.reps > 0 || s.weight > 0).map((s: SetEntry) => ({ ...s, completed: true }))
      };
    }).filter(ex => Array.isArray(ex.sets) && ex.sets.length > 0);

    if (cleanedExercises.length === 0) return;

    const workout = await addWorkout({
      title: workoutTitle,
      startedAt: startedAt.current,
      performedAt: Date.now(),
      exercises: cleanedExercises,
      durationMinutes: 60
    });

    if (workout) {
      await checkPersonalRecords(workout);
      setIsDiscarding(true); // Prevent auto-save from running while unmounting
      await clearDraft();
      // Seamlessly return to Templates
      if (router.canDismiss()) {
        router.dismissAll();
      }
      router.replace('/(tabs)/templates');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <View style={styles.container}>
      <ExercisePicker visible={pickerVisible} onSelectExercise={handleSelectExercise} onClose={() => setPickerVisible(false)} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="chevron-back" size={24} color={colors.text} /></TouchableOpacity>
        <Text style={styles.title}>Log Workout</Text>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
            <TouchableOpacity onPress={() => router.push('/plate-calculator')}>
                <Ionicons name="calculator-outline" size={22} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDiscard} style={styles.discardButton}>
                <Ionicons name="trash-outline" size={22} color={colors.danger} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveText}>Finish</Text>
            </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={{flexDirection: 'row', gap: 10, marginBottom: 20}}>
          <TextInput style={[styles.titleInput, {flex: 1}]} value={workoutTitle} onChangeText={setWorkoutTitle} />
          <TouchableOpacity style={styles.unitBtn} onPress={toggleUnit}><Text style={styles.unitText}>{currentUnit.toUpperCase()}</Text></TouchableOpacity>
        </View>

        {exercises.map((ex) => (
          <ExerciseCard
            key={ex.id}
            exercise={ex}
            workouts={workouts}
            currentUnit={currentUnit}
            onUpdate={(updated) => setExercises(prev => prev.map(e => e.id === ex.id ? updated : e))}
            onRemove={() => setExercises(prev => prev.filter(e => e.id !== ex.id))}
            onCompleteSet={(sId, isCompleted) => handleCompleteSet(ex.id, sId, isCompleted)}
          />
        ))}

        <TouchableOpacity style={styles.addButton} onPress={() => setPickerVisible(true)}>
          <Text style={styles.addText}>+ Add Exercise</Text>
        </TouchableOpacity>
      </ScrollView>

      {expiryTimestamp !== null && (
        <View style={styles.timerOverlay}>
          <View style={{ flex: 1 }}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12}}>
                <View>
                    <Text style={styles.timerLabel}>Rest Timer</Text>
                    <Text style={styles.timerValue}>{formatTime(secondsLeft)}</Text>
                </View>
                <TouchableOpacity 
                    style={styles.skipButton} 
                    onPress={cancelTimer}
                >
                    <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.tipBox}>
                <Ionicons name="bulb" size={16} color="#fbbf24" />
                <Text style={styles.tipText}>{currentTip}</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', color: colors.text },
  saveButton: { backgroundColor: colors.primary, padding: 8, borderRadius: 8 },
  saveText: { color: '#fff', fontWeight: 'bold' },
  content: { padding: 20 },
  titleInput: { fontSize: 24, fontWeight: 'bold', color: colors.text, borderBottomWidth: 1, borderColor: '#e2e8f0' },
  unitBtn: { justifyContent: 'center', padding: 5 },
  unitText: { color: colors.muted, fontWeight: '600' },
  addButton: { backgroundColor: colors.card, padding: 15, borderRadius: 12, alignItems: 'center', marginBottom: 40 },
  addText: { color: colors.primary, fontWeight: 'bold' },
  timerOverlay: { position: 'absolute', bottom: 30, left: 20, right: 20, backgroundColor: colors.text, borderRadius: 20, padding: 20, elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  timerLabel: { color: '#cbd5e1', fontSize: 12, fontWeight: '600' },
  timerValue: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  skipButton: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  skipText: { color: '#fff', fontWeight: 'bold' },
  tipBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', padding: 12, borderRadius: 12 },
  tipText: { marginLeft: 10, fontSize: 13, color: '#e2e8f0', flex: 1, fontStyle: 'italic' }
});