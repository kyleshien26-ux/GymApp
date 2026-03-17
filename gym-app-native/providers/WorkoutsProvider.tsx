import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NewWorkoutInput, Template, Workout, SetEntry } from '../types/workouts';
import { exerciseDatabase } from '../constants/exercises'; 

const STORAGE_KEY = '@gymapp/workouts';
const TEMPLATES_KEY = '@gymapp/templates';

type WorkoutsContextValue = {
  workouts: Workout[];
  templates: Template[];
  addWorkout: (input: NewWorkoutInput) => Promise<Workout | null>;
  deleteWorkout: (id: string) => Promise<void>;
  addTemplate: (template: Template) => Promise<void>;
  updateTemplate: (id: string, template: Template) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  deleteFolder: (folderName: string) => Promise<void>;
  togglePinTemplate: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
  clearStore: () => Promise<void>;
  isLoaded: boolean;
};

const WorkoutsContext = createContext<WorkoutsContextValue | undefined>(undefined);

// Helper to ensure deep type safety for boolean fields
export const castWorkoutBooleans = (workouts: any[]): Workout[] => {
  return workouts.map(w => ({
    ...w,
    exercises: (w.exercises || []).map((ex: any) => ({
      ...ex,
      sets: Array.isArray(ex.sets) 
        ? ex.sets.map((s: any) => ({ ...s, completed: s.completed === true || s.completed === 'true' }))
        : ex.sets
    }))
  }));
};

export const castTemplateBooleans = (templates: any[]): Template[] => {
  return templates.map(t => ({
    ...t,
    isPinned: t.isPinned === true || t.isPinned === 'true',
    exercises: (t.exercises || []).map((ex: any) => ({
      ...ex,
      sets: Array.isArray(ex.sets) 
        ? ex.sets.map((s: any) => ({ ...s, completed: s.completed === true || s.completed === 'true' }))
        : ex.sets
    }))
  }));
};

export const WorkoutsProvider = React.memo(function WorkoutsProvider({ children }: { children: React.ReactNode }) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const [w, t] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY),
        AsyncStorage.getItem(TEMPLATES_KEY)
      ]);
      if (w) {
        const parsed = JSON.parse(w);
        setWorkouts(castWorkoutBooleans(Array.isArray(parsed) ? parsed : []));
      }
      if (t) {
        const parsed = JSON.parse(t);
        setTemplates(castTemplateBooleans(Array.isArray(parsed) ? parsed : []));
      }
    } catch (err) { console.warn(err); } 
    finally { setIsLoaded(true); }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const persist = async (key: string, data: any) => {
    try { await AsyncStorage.setItem(key, JSON.stringify(data)); }
    catch (e) { console.error(e); }
  };

  const addWorkout = useCallback(async (input: NewWorkoutInput) => {
    const totalSets = input.exercises.reduce((acc: number, ex: any) => 
        acc + (Array.isArray(ex.sets) ? ex.sets.length : 0), 0
    );
    const totalVolume = input.exercises.reduce((acc: number, ex: any) => 
      acc + (Array.isArray(ex.sets) ? ex.sets.reduce((sAcc: number, s: any) => sAcc + (Number(s.weight || 0) * Number(s.reps || 0)), 0) : 0), 0
    );

    const workout: Workout = {
      id: `w-${Date.now()}`,
      title: input.title || 'Workout',
      performedAt: input.performedAt || Date.now(),
      startedAt: input.startedAt || Date.now(),
      durationMinutes: input.durationMinutes || 45,
      totalSets,
      totalVolume,
      exercises: input.exercises,
    };
    const next = [workout, ...workouts];
    setWorkouts(prev => {
      const updated = [workout, ...prev];
      persist(STORAGE_KEY, updated);
      return updated;
    });
    return workout;
  }, []); // removed dependency on workouts to avoid stale closures

  const addTemplate = async (t: Template) => {
    setTemplates(prev => {
      const next = [t, ...prev];
      persist(TEMPLATES_KEY, next);
      return next;
    });
  };

  const updateTemplate = async (id: string, t: Template) => {
    setTemplates(prev => {
      const next = prev.map(temp => temp.id === id ? t : temp);
      persist(TEMPLATES_KEY, next);
      return next;
    });
  };

  const deleteWorkout = async (id: string) => {
    setWorkouts(prev => {
      const next = prev.filter(w => w.id !== id);
      persist(STORAGE_KEY, next);
      return next;
    });
  };

  const togglePinTemplate = async (id: string) => {
    setTemplates(prev => {
      const next = prev.map(t => t.id === id ? { ...t, isPinned: !t.isPinned } : t);
      persist(TEMPLATES_KEY, next);
      return next;
    });
  };

  const deleteTemplate = async (id: string) => {
    setTemplates(prev => {
      const next = prev.filter(t => t.id !== id);
      persist(TEMPLATES_KEY, next);
      return next;
    });
  };

  const deleteFolder = async (folderName: string) => {
    setTemplates(prev => {
      const next = prev.filter(t => t.folder !== folderName);
      persist(TEMPLATES_KEY, next);
      return next;
    });
  };

  const clearStore = async () => {
    await AsyncStorage.multiRemove([STORAGE_KEY, TEMPLATES_KEY]);
    setWorkouts([]);
    setTemplates([]);
  }

  const value = useMemo(() => ({
    workouts, templates, addWorkout, deleteWorkout, addTemplate, updateTemplate, deleteTemplate, deleteFolder, togglePinTemplate, refresh, clearStore, isLoaded
  }), [workouts, templates, isLoaded]);

  return <WorkoutsContext.Provider value={value}>{children}</WorkoutsContext.Provider>;
});

export const useWorkouts = () => {
  const ctx = useContext(WorkoutsContext);
  if (!ctx) throw new Error('useWorkouts must be used in provider');
  return ctx;
};

// === HELPER FUNCTIONS ===
export function calculateStreak(workouts: Workout[]) {
  if (!workouts.length) return 0;
  const sorted = [...workouts].sort((a, b) => b.performedAt - a.performedAt);
  let streak = 0;
  const todayStart = new Date().setHours(0, 0, 0, 0);
  const firstDate = new Date(sorted[0].performedAt).setHours(0,0,0,0);
  if (firstDate === todayStart) streak = 1;
  return streak > 0 ? streak : (workouts.length > 0 ? 1 : 0);
}

export function getStats(workouts: Workout[]) {
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const weekly = workouts.filter((w) => w.performedAt >= weekAgo);
  return {
    weeklyWorkouts: weekly.length,
    weeklyVolume: weekly.reduce((acc, w) => acc + w.totalVolume, 0),
    totalWorkouts: workouts.length,
    totalVolume: workouts.reduce((a, w) => a + w.totalVolume, 0),
    streak: calculateStreak(workouts),
  };
}

export function getRecentWorkouts(workouts: Workout[], limit = 3) {
  return [...workouts].sort((a, b) => b.performedAt - a.performedAt).slice(0, limit);
}

export function formatDateLabel(ts: number) {
  return new Date(ts).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

export function formatDuration(min: number) {
  return `${Math.floor(min/60)}h ${min%60}m`;
}
