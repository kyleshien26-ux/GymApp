import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import {
  ExerciseEntry,
  Goal,
  NewWorkoutInput,
  PlanRecommendation,
  PlanResult,
  Workout,
} from '../types/workouts';

const STORAGE_KEY = '@gymapp/workouts';
const FILE_PATH = `${((FileSystem as any).documentDirectory ?? '')}workouts.json`;
const DAY_MS = 24 * 60 * 60 * 1000;

type WorkoutsContextValue = {
  workouts: Workout[];
  loading: boolean;
  addWorkout: (input: NewWorkoutInput) => Promise<Workout | null>;
  refresh: () => Promise<void>;
  clearStore: () => Promise<void>;
};

const WorkoutsContext = createContext<WorkoutsContextValue>({
  workouts: [],
  loading: false,
  addWorkout: async () => null,
  refresh: async () => {},
  clearStore: async () => {},
});

/* ----------------------------------------------------
   Provider
----------------------------------------------------- */

export function WorkoutsProvider({ children }: React.PropsWithChildren) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const stored = await readStore();
      setWorkouts(stored);
    } catch (err) {
      console.warn('Failed to load workouts', err);
      setWorkouts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const persist = useCallback(async (next: Workout[]) => {
    setWorkouts(next);
    try {
      await writeStore(next);
    } catch (err) {
      console.warn('Persist failed', err);
    }
  }, []);

  const clearStore = useCallback(async () => {
    setLoading(true);
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      if (Platform.OS !== 'web') {
        const info = await FileSystem.getInfoAsync(FILE_PATH);
        if (info.exists) {
          await FileSystem.deleteAsync(FILE_PATH, { idempotent: true });
        }
      }
    } catch (err) {
      console.warn('Failed to clear data', err);
    } finally {
      setWorkouts([]);
      setLoading(false);
    }
  }, []);

  const addWorkout = useCallback(
    async (input: NewWorkoutInput) => {
      const exercises = sanitizeExercises(input.exercises);
      if (!exercises.length) return null;

      const performedAt = input.performedAt ?? Date.now();
      const startedAt = input.startedAt ?? performedAt;

      const { totalSets, totalVolume } = calculateTotals(exercises);
      if (totalSets === 0) return null;

      const durationMinutes =
        input.durationMinutes ??
        Math.max(1, Math.round((performedAt - startedAt) / (60 * 1000)));

      const workout: Workout = {
        id: `w-${performedAt}-${Math.random().toString(36).slice(2, 8)}`,
        title: input.title?.trim() || 'Workout',
        performedAt,
        startedAt,
        durationMinutes,
        totalSets,
        totalVolume,
        exercises,
      };

      const next = [workout, ...workouts].sort(
        (a, b) => b.performedAt - a.performedAt,
      );

      await persist(next);
      return workout;
    },
    [workouts, persist],
  );

  const value = useMemo(
    () => ({ workouts, loading, addWorkout, refresh, clearStore }),
    [workouts, loading, addWorkout, refresh, clearStore],
  );

  return (
    <WorkoutsContext.Provider value={value}>
      {children}
    </WorkoutsContext.Provider>
  );
}

export function useWorkouts() {
  const ctx = useContext(WorkoutsContext);
  if (!ctx) throw new Error('useWorkouts must be used in provider');
  return ctx;
}

/* ----------------------------------------------------
   Calculations
----------------------------------------------------- */

export function calculateTotals(exercises: ExerciseEntry[]) {
  return exercises.reduce(
    (acc, exercise) => {
      exercise.sets.forEach((set) => {
        acc.totalSets += 1;
        acc.totalVolume += set.weight * set.reps;
      });
      return acc;
    },
    { totalSets: 0, totalVolume: 0 },
  );
}

export function getStats(workouts: Workout[]) {
  const now = Date.now();
  const weekAgo = now - 7 * DAY_MS;

  const weekly = workouts.filter((w) => w.performedAt >= weekAgo);
  const weeklyVolume = weekly.reduce((acc, w) => acc + w.totalVolume, 0);

  return {
    weeklyWorkouts: weekly.length,
    weeklyVolume,
    totalWorkouts: workouts.length,
    totalVolume: workouts.reduce((a, w) => a + w.totalVolume, 0),
    streak: calculateStreak(workouts),
  };
}

export function calculateStreak(workouts: Workout[]) {
  if (!workouts.length) return 0;
  const sorted = [...workouts].sort(
    (a, b) => b.performedAt - a.performedAt,
  );

  let streak = 0;
  const todayStart = startOfDay(Date.now());
  let lastOffset: number | null = null;

  for (const workout of sorted) {
    const dayOffset = Math.floor(
      (todayStart - startOfDay(workout.performedAt)) / DAY_MS,
    );

    if (dayOffset < 0) continue;

    if (lastOffset === null) {
      lastOffset = dayOffset;
      streak++;
      continue;
    }

    if (dayOffset === lastOffset) continue;
    if (dayOffset === lastOffset + 1) {
      streak++;
      lastOffset = dayOffset;
      continue;
    }

    break;
  }
  return streak;
}

/* ----------------------------------------------------
   Sanitizers (FULLY REWRITTEN)
----------------------------------------------------- */

function sanitizeExercises(exercises: ExerciseEntry[]) {
  if (!Array.isArray(exercises)) return [];

  return exercises
    .map((ex) => {
      const name = typeof ex.name === 'string' ? ex.name.trim() : 'Exercise';
      const sets = sanitizeSets(ex.sets);
      if (!sets.length) return null;

      return {
        id: typeof ex.id === 'string'
          ? ex.id
          : `ex-${Math.random().toString(36).slice(2, 6)}`,
        name,
        sets,
        notes: typeof ex.notes === 'string' ? ex.notes : undefined,
      };
    })
    .filter(Boolean) as ExerciseEntry[];
}

function sanitizeSets(rawSets: any[]): {
  id: string;
  weight: number;
  reps: number;
  completed?: boolean;
  notes?: string;
}[] {
  if (!Array.isArray(rawSets)) return [];

  return rawSets
    .map((s) => {
      const weight = safeNumber(s.weight);
      const reps = safeNumber(s.reps);

      if (reps <= 0) return null;

      const completed = safeBoolean(s.completed);

      return {
        id:
          typeof s.id === 'string'
            ? s.id
            : `set-${Math.random().toString(36).slice(2, 6)}`,
        weight,
        reps,
        completed,
        notes: typeof s.notes === 'string' ? s.notes : undefined,
      };
    })
    .filter(Boolean) as any[];
}

function safeNumber(v: any, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function safeBoolean(v: any) {
  if (typeof v === 'boolean') return v;
  if (typeof v === 'string') {
    const s = v.toLowerCase().trim();
    if (s === 'true') return true;
    if (s === 'false') return false;
  }
  return false;
}

/* ----------------------------------------------------
   Storage
----------------------------------------------------- */

async function readStore(): Promise<Workout[]> {
  let raw: any = null;

  try {
    const str = await AsyncStorage.getItem(STORAGE_KEY);
    if (str) raw = JSON.parse(str);
  } catch {}

  if (!raw && Platform.OS !== 'web') {
    try {
      const info = await FileSystem.getInfoAsync(FILE_PATH);
      if (info.exists) {
        const str = await FileSystem.readAsStringAsync(FILE_PATH);
        raw = JSON.parse(str);
      }
    } catch {}
  }

  const validated = validateWorkouts(raw);
  await writeStore(validated);
  return validated;
}

async function writeStore(list: Workout[]) {
  const json = JSON.stringify(list);
  try {
    await AsyncStorage.setItem(STORAGE_KEY, json);
  } catch {}
  if (Platform.OS !== 'web') {
    try {
      await FileSystem.writeAsStringAsync(FILE_PATH, json);
    } catch {}
  }
}

function validateWorkouts(value: any): Workout[] {
  if (!Array.isArray(value)) return [];

  const cleaned: Workout[] = [];

  for (const raw of value) {
    const workout = sanitizeWorkout(raw);
    if (workout) cleaned.push(workout);
  }
  return cleaned.sort((a, b) => b.performedAt - a.performedAt);
}

function sanitizeWorkout(raw: any): Workout | null {
  if (!raw || typeof raw !== 'object') return null;

  const exercises = sanitizeExercises(raw.exercises);
  if (!exercises.length) return null;

  const performedAt = safeNumber(raw.performedAt, Date.now());
  const startedAt = safeNumber(raw.startedAt, performedAt);
  const durationMinutes = safeNumber(raw.durationMinutes, 1);

  const { totalSets, totalVolume } = calculateTotals(exercises);

  return {
    id:
      typeof raw.id === 'string'
        ? raw.id
        : `w-${performedAt}-${Math.random().toString(36).slice(2, 6)}`,
    title:
      typeof raw.title === 'string' && raw.title.trim()
        ? raw.title.trim()
        : 'Workout',
    performedAt,
    startedAt,
    durationMinutes,
    totalVolume,
    totalSets,
    exercises,
  };
}

/* ----------------------------------------------------
   Utilities
----------------------------------------------------- */

function startOfDay(ts: number) {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function formatDateLabel(ts: number) {
  const d = new Date(ts);
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDuration(min: number) {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

export function getRecentWorkouts(w: Workout[], limit = 3) {
  return [...w].sort((a, b) => b.performedAt - a.performedAt).slice(0, limit);
}