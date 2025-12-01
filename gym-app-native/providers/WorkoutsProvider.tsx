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
  ExperienceLevel,
  Goal,
  NewWorkoutInput,
  PlanRecommendation,
  PlanResult,
  Template,
  Workout,
} from '../types/workouts';

const STORAGE_KEY = '@gymapp/workouts';
const TEMPLATES_KEY = '@gymapp/templates';
const FILE_PATH = `${((FileSystem as any).documentDirectory ?? '')}workouts.json`;
const TEMPLATES_FILE_PATH = `${((FileSystem as any).documentDirectory ?? '')}templates.json`;
const DAY_MS = 24 * 60 * 60 * 1000;

type WorkoutsContextValue = {
  workouts: Workout[];
  templates: Template[];
  loading: boolean;
  addWorkout: (input: NewWorkoutInput) => Promise<Workout | null>;
  addTemplate: (template: Template) => Promise<void>;
  updateTemplate: (id: string, template: Partial<Template>) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  useTemplateWorkout: (templateId: string) => Template | undefined;
  refresh: () => Promise<void>;
  clearStore: () => Promise<void>;
};

const WorkoutsContext = createContext<WorkoutsContextValue>({
  workouts: [],
  templates: [],
  loading: false,
  addWorkout: async () => null,
  addTemplate: async () => {},
  updateTemplate: async () => {},
  deleteTemplate: async () => {},
  useTemplateWorkout: () => undefined,
  refresh: async () => {},
  clearStore: async () => {},
});

/* ----------------------------------------------------
   Provider
----------------------------------------------------- */

export const WorkoutsProvider = React.memo(function WorkoutsProvider({ children }: React.PropsWithChildren) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const stored = await readStore();
      setWorkouts(stored);
      const storedTemplates = await readTemplates();
      setTemplates(storedTemplates);
    } catch (err) {
      console.warn('Failed to load workouts', err);
      setWorkouts([]);
      setTemplates([]);
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

  const persistTemplates = useCallback(async (next: Template[]) => {
    setTemplates(next);
    try {
      await writeTemplates(next);
    } catch (err) {
      console.warn('Persist templates failed', err);
    }
  }, []);

  const addTemplate = useCallback(
    async (template: Template) => {
      const next = [template, ...templates];
      await persistTemplates(next);
    },
    [templates, persistTemplates],
  );

  const updateTemplate = useCallback(
    async (id: string, updates: Partial<Template>) => {
      const next = templates.map((t) =>
        t.id === id ? { ...t, ...updates } : t,
      );
      await persistTemplates(next);
    },
    [templates, persistTemplates],
  );

  const deleteTemplate = useCallback(
    async (id: string) => {
      const next = templates.filter((t) => t.id !== id);
      await persistTemplates(next);
    },
    [templates, persistTemplates],
  );

  const useTemplateWorkout = useCallback(
    (templateId: string) => templates.find((t) => t.id === templateId),
    [templates],
  );

  const clearStore = useCallback(async () => {
    setLoading(true);
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      await AsyncStorage.removeItem(TEMPLATES_KEY);
      if (Platform.OS !== 'web') {
        const info = await FileSystem.getInfoAsync(FILE_PATH);
        if (info.exists) {
          await FileSystem.deleteAsync(FILE_PATH, { idempotent: true });
        }
        const templateInfo = await FileSystem.getInfoAsync(TEMPLATES_FILE_PATH);
        if (templateInfo.exists) {
          await FileSystem.deleteAsync(TEMPLATES_FILE_PATH, { idempotent: true });
        }
      }
    } catch (err) {
      console.warn('Failed to clear data', err);
    } finally {
      setWorkouts([]);
      setTemplates([]);
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
    () => ({
      workouts,
      templates,
      loading,
      addWorkout,
      addTemplate,
      updateTemplate,
      deleteTemplate,
      useTemplateWorkout,
      refresh,
      clearStore,
    }),
    [
      workouts,
      templates,
      loading,
      addWorkout,
      addTemplate,
      updateTemplate,
      deleteTemplate,
      useTemplateWorkout,
      refresh,
      clearStore,
    ],
  );

  return (
    <WorkoutsContext.Provider value={value}>
      {children}
    </WorkoutsContext.Provider>
  );
});

export function useWorkouts() {
  const ctx = useContext(WorkoutsContext);
  if (!ctx) throw new Error('useWorkouts must be used in provider');
  return ctx;
}

/* ----------------------------------------------------
   AI Plan Generation
----------------------------------------------------- */

export function buildPlanFromHistory(
  workouts: Workout[],
  options: {
    goal: Goal;
    duration: string;
    experience: ExperienceLevel;
    muscles: string[];
  }
): PlanResult {
  const { goal, experience, muscles } = options;

  // Parse duration string to minutes
  const durationMin = parseInt(options.duration.split('-')[0]);
  const durationMax = parseInt(options.duration.split('-')[1]);
  const avgDuration = (durationMin + durationMax) / 2;

  // Determine plan parameters based on goal and experience
  const goalConfig = {
    'Strength': { reps: '3-5', rest: '3-5 min', sets: 4, sessionsPerWeek: 4 },
    'Muscle Size': { reps: '8-12', rest: '60-90 sec', sets: 3, sessionsPerWeek: 4 },
    'Endurance': { reps: '15-20', rest: '30-45 sec', sets: 2, sessionsPerWeek: 5 },
    'Power': { reps: '1-3', rest: '3-5 min', sets: 3, sessionsPerWeek: 3 },
  };

  const experienceConfig = {
    'Beginner': { multiplier: 0.8, extra: ' - Focus on form and consistency' },
    'Intermediate': { multiplier: 1, extra: '' },
    'Advanced': { multiplier: 1.2, extra: ' - Include advanced techniques' },
  };

  const config = goalConfig[goal];
  const expConfig = experienceConfig[experience];

  // Generate recommendations for each muscle group
  const recommendations = muscles.map((muscle) => ({
    focus: muscle,
    sets: Math.ceil(config.sets * expConfig.multiplier),
    reps: config.reps,
    rest: config.rest,
    rationale: `Optimal for ${goal.toLowerCase()} development${expConfig.extra.toLowerCase()}`,
  }));

  // Calculate weekly metrics
  const totalSetsPerSession = recommendations.reduce((sum, rec) => sum + rec.sets, 0);
  const sessionsPerWeek = config.sessionsPerWeek;
  const weeklyVolume = Math.round((durationMax + durationMin) / 2 * sessionsPerWeek * 10);

  // Generate adjustments based on history
  const adjustments: string[] = [];
  if (workouts.length > 0) {
    const avgWorkoutVolume = workouts.slice(0, 10).reduce((sum, w) => sum + w.totalVolume, 0) / Math.min(workouts.length, 10);
    if (avgWorkoutVolume > weeklyVolume * 2) {
      adjustments.push('Your recent volume is higher than recommended - consider deloading');
    }
    if (muscles.length > 5) {
      adjustments.push('Focusing on many muscle groups - ensure adequate recovery between sessions');
    }
  }

  if (experience === 'Beginner') {
    adjustments.push('Start with lighter weights to master movement patterns');
  }

  return {
    sessionsPerWeek,
    setsPerExercise: totalSetsPerSession / muscles.length,
    repRange: config.reps,
    restRange: config.rest,
    weeklyVolume,
    weeklyWorkouts: sessionsPerWeek,
    adjustments,
    recommendations,
  };
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
  } catch {
    // If parsing fails, data is corrupted - clear it
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch {}
  }

  if (!raw && Platform.OS !== 'web') {
    try {
      const info = await FileSystem.getInfoAsync(FILE_PATH);
      if (info.exists) {
        const str = await FileSystem.readAsStringAsync(FILE_PATH);
        raw = JSON.parse(str);
      }
    } catch {
      // If file parsing fails, it's corrupted - delete it
      try {
        await FileSystem.deleteAsync(FILE_PATH, { idempotent: true });
      } catch {}
    }
  }

  let validated = validateWorkouts(raw);

  // Seed with defaults if nothing exists to give the app meaningful initial state.
  if (!validated.length) {
    validated = seedWorkouts;
  }

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

async function readTemplates(): Promise<Template[]> {
  let raw: any = null;

  try {
    const str = await AsyncStorage.getItem(TEMPLATES_KEY);
    if (str) raw = JSON.parse(str);
  } catch {
    try {
      await AsyncStorage.removeItem(TEMPLATES_KEY);
    } catch {}
  }

  if (!raw && Platform.OS !== 'web') {
    try {
      const info = await FileSystem.getInfoAsync(TEMPLATES_FILE_PATH);
      if (info.exists) {
        const str = await FileSystem.readAsStringAsync(TEMPLATES_FILE_PATH);
        raw = JSON.parse(str);
      }
    } catch {
      try {
        await FileSystem.deleteAsync(TEMPLATES_FILE_PATH, { idempotent: true });
      } catch {}
    }
  }

  let validated = validateTemplates(raw);
  await writeTemplates(validated);
  return validated;
}

async function writeTemplates(list: Template[]) {
  const json = JSON.stringify(list);
  try {
    await AsyncStorage.setItem(TEMPLATES_KEY, json);
  } catch {}
  if (Platform.OS !== 'web') {
    try {
      await FileSystem.writeAsStringAsync(TEMPLATES_FILE_PATH, json);
    } catch {}
  }
}

function validateTemplates(value: any): Template[] {
  if (!Array.isArray(value)) return [];

  const cleaned: Template[] = [];

  for (const raw of value) {
    const template = sanitizeTemplate(raw);
    if (template) cleaned.push(template);
  }
  return cleaned;
}

function sanitizeTemplate(raw: any): Template | null {
  if (!raw || typeof raw !== 'object') return null;

  const name = typeof raw.name === 'string' && raw.name.trim()
    ? raw.name.trim()
    : 'Untitled Template';

  const exercises = sanitizeExercises(raw.exercises);
  if (!exercises.length) return null;

  const description = typeof raw.description === 'string' ? raw.description : undefined;

  return {
    id: typeof raw.id === 'string' ? raw.id : `t-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name,
    description,
    exercises,
  };
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

/* ----------------------------------------------------
   Seed data (used when storage is empty)
----------------------------------------------------- */

const seedWorkouts: Workout[] = createSeedWorkouts();

function createSeedWorkouts(): Workout[] {
  const seeds = [
    {
      title: 'Push Day',
      performedAt: new Date('2024-11-28').getTime(),
      durationMinutes: 75,
      exercises: [
        {
          name: 'Bench Press',
          sets: [
            { reps: 10, weight: 135 },
            { reps: 8, weight: 145 },
            { reps: 6, weight: 155 },
          ],
        },
        {
          name: 'Shoulder Press',
          sets: [
            { reps: 12, weight: 65 },
            { reps: 10, weight: 70 },
          ],
        },
      ],
    },
    {
      title: 'Pull Day',
      performedAt: new Date('2024-11-26').getTime(),
      durationMinutes: 60,
      exercises: [
        {
          name: 'Deadlift',
          sets: [
            { reps: 5, weight: 225 },
            { reps: 5, weight: 245 },
            { reps: 3, weight: 265 },
          ],
        },
      ],
    },
    {
      title: 'Leg Day',
      performedAt: new Date('2024-11-21').getTime(),
      durationMinutes: 90,
      exercises: [
        {
          name: 'Squat',
          sets: [
            { reps: 8, weight: 185 },
            { reps: 6, weight: 205 },
            { reps: 4, weight: 225 },
          ],
        },
      ],
    },
  ];

  return seeds.map((seed, idx) => {
    const exercises: ExerciseEntry[] = seed.exercises.map((ex, exIdx) => {
      const sets = ex.sets.map((set, setIdx) => ({
        id: `seed-set-${idx}-${exIdx}-${setIdx}`,
        weight: set.weight,
        reps: set.reps,
        completed: true,
      }));
      return {
        id: `seed-ex-${idx}-${exIdx}`,
        name: ex.name,
        sets,
      };
    });
    const totals = calculateTotals(exercises);
    return {
      id: `seed-${idx}-${seed.performedAt}`,
      title: seed.title,
      performedAt: seed.performedAt,
      startedAt: seed.performedAt,
      durationMinutes: seed.durationMinutes,
      totalSets: totals.totalSets,
      totalVolume: totals.totalVolume,
      exercises,
    };
  });
}
