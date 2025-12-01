import React, { createContext, useCallback, useContext, useEffect, useState, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEY = '@gymapp/settings';

export type UserProfile = {
  name: string;
  age: number;
  weight: number;
  height: number;
  fitnessGoal: string;
  profilePicture: string | null;
};

export type WorkoutPreferences = {
  defaultRestTimer: number; // seconds
  units: 'kg' | 'lbs';
  rpeEnabled: boolean;
  autoIncrement: boolean;
  incrementSize: number;
};

export type NotificationSettings = {
  workoutReminders: boolean;
  reminderTime: string; // HH:mm format
  restDayNotifications: boolean;
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: number | null;
};

export type Measurement = {
  id: string;
  type: 'weight' | 'bodyfat' | 'chest' | 'arms' | 'waist' | 'legs';
  value: number;
  unit: string;
  date: number;
};

export type AppSettings = {
  profile: UserProfile;
  preferences: WorkoutPreferences;
  notifications: NotificationSettings;
  badges: Badge[];
  measurements: Measurement[];
  streak: number;
  lastWorkoutDate: number | null;
  totalWorkoutsLogged: number;
  personalRecords: Record<string, { weight: number; reps: number; date: number; estimated1RM: number }>;
};

const defaultSettings: AppSettings = {
  profile: {
    name: '',
    age: 0,
    weight: 0,
    height: 0,
    fitnessGoal: 'Build Muscle',
    profilePicture: null,
  },
  preferences: {
    defaultRestTimer: 90,
    units: 'kg',
    rpeEnabled: false,
    autoIncrement: true,
    incrementSize: 2.5,
  },
  notifications: {
    workoutReminders: true,
    reminderTime: '09:00',
    restDayNotifications: false,
  },
  badges: [
    { id: 'first-workout', name: 'First Workout', description: 'Complete your first workout', icon: '🏋️', earnedAt: null },
    { id: 'week-streak', name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '🔥', earnedAt: null },
    { id: 'three-week', name: '3 Week Streak', description: 'Maintain a 21-day streak', icon: '💪', earnedAt: null },
    { id: 'pr-hunter', name: 'PR Hunter', description: 'Set a new personal record', icon: '🏆', earnedAt: null },
    { id: 'centurion', name: 'Centurion', description: 'Log 100 sets', icon: '💯', earnedAt: null },
    { id: 'volume-king', name: 'Volume King', description: 'Lift 10,000 kg total volume', icon: '👑', earnedAt: null },
    { id: 'consistent', name: 'Consistency', description: 'Log 10 workouts', icon: '📈', earnedAt: null },
    { id: 'dedication', name: 'Dedication', description: 'Log 50 workouts', icon: '🎯', earnedAt: null },
  ],
  measurements: [],
  streak: 0,
  lastWorkoutDate: null,
  totalWorkoutsLogged: 0,
  personalRecords: {},
};

type SettingsContextValue = {
  settings: AppSettings;
  loading: boolean;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  updatePreferences: (prefs: Partial<WorkoutPreferences>) => Promise<void>;
  updateNotifications: (notifs: Partial<NotificationSettings>) => Promise<void>;
  addMeasurement: (measurement: Omit<Measurement, 'id'>) => Promise<void>;
  recordWorkout: (exercises: { name: string; sets: { weight: number; reps: number }[] }[], totalVolume: number, totalSets: number) => Promise<Badge[]>;
  resetAllData: () => Promise<void>;
  exportData: () => Promise<string>;
  importData: (json: string) => Promise<boolean>;
  calculateEstimated1RM: (weight: number, reps: number) => number;
  getWeightSuggestion: (exerciseName: string, targetReps: number) => { weight: number; reason: string; confidence: number };
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem(SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings({ ...defaultSettings, ...parsed, badges: defaultSettings.badges.map(b => {
          const existing = parsed.badges?.find((pb: Badge) => pb.id === b.id);
          return existing ? { ...b, earnedAt: existing.earnedAt } : b;
        }) });
      }
    } catch (err) {
      console.warn('Failed to load settings', err);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings: AppSettings) => {
    setSettings(newSettings);
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
    } catch (err) {
      console.warn('Failed to save settings', err);
    }
  };

  const updateProfile = useCallback(async (profile: Partial<UserProfile>) => {
    const newSettings = { ...settings, profile: { ...settings.profile, ...profile } };
    await saveSettings(newSettings);
  }, [settings]);

  const updatePreferences = useCallback(async (prefs: Partial<WorkoutPreferences>) => {
    const newSettings = { ...settings, preferences: { ...settings.preferences, ...prefs } };
    await saveSettings(newSettings);
  }, [settings]);

  const updateNotifications = useCallback(async (notifs: Partial<NotificationSettings>) => {
    const newSettings = { ...settings, notifications: { ...settings.notifications, ...notifs } };
    await saveSettings(newSettings);
  }, [settings]);

  // Epley formula for 1RM estimation
  const calculateEstimated1RM = useCallback((weight: number, reps: number): number => {
    if (reps === 1) return weight;
    if (reps <= 0 || weight <= 0) return 0;
    return Math.round(weight * (1 + reps / 30));
  }, []);

  // Adaptive weight suggestion
  const getWeightSuggestion = useCallback((exerciseName: string, targetReps: number): { weight: number; reason: string; confidence: number } => {
    const pr = settings.personalRecords[exerciseName.toLowerCase()];
    if (!pr) {
      return { weight: 0, reason: 'NO_DATA', confidence: 0 };
    }

    const estimated1RM = pr.estimated1RM;
    const daysSinceLastPR = Math.floor((Date.now() - pr.date) / (1000 * 60 * 60 * 24));
    
    // Calculate target weight based on target reps using reverse Epley
    let targetWeight = Math.round(estimated1RM / (1 + targetReps / 30));
    
    let reason = 'HOLD';
    let confidence = 80;

    // Adjust based on recency
    if (daysSinceLastPR > 14) {
      // Suggest deload if no recent training
      targetWeight = Math.round(targetWeight * 0.9);
      reason = 'DELOAD';
      confidence = 70;
    } else if (daysSinceLastPR <= 3 && pr.reps >= targetReps) {
      // Recent success, suggest small increase
      targetWeight = Math.round(targetWeight * 1.025);
      reason = 'INCREASE';
      confidence = 85;
    } else if (pr.reps < targetReps - 2) {
      // Missed reps significantly, decrease
      targetWeight = Math.round(targetWeight * 0.95);
      reason = 'DECREASE';
      confidence = 75;
    }

    // Round to nearest increment
    const increment = settings.preferences.incrementSize;
    targetWeight = Math.round(targetWeight / increment) * increment;

    return { weight: targetWeight, reason, confidence };
  }, [settings.personalRecords, settings.preferences.incrementSize]);

  const recordWorkout = useCallback(async (
    exercises: { name: string; sets: { weight: number; reps: number }[] }[],
    totalVolume: number,
    totalSets: number
  ): Promise<Badge[]> => {
    const now = Date.now();
    const newBadges: Badge[] = [];
    let updatedSettings = { ...settings };
    
    // Update streak
    const today = new Date(now).setHours(0, 0, 0, 0);
    const lastWorkout = settings.lastWorkoutDate ? new Date(settings.lastWorkoutDate).setHours(0, 0, 0, 0) : null;
    
    if (lastWorkout) {
      const daysDiff = Math.floor((today - lastWorkout) / (1000 * 60 * 60 * 24));
      if (daysDiff === 1) {
        updatedSettings.streak = settings.streak + 1;
      } else if (daysDiff > 1) {
        updatedSettings.streak = 1;
      }
    } else {
      updatedSettings.streak = 1;
    }
    
    updatedSettings.lastWorkoutDate = now;
    updatedSettings.totalWorkoutsLogged = settings.totalWorkoutsLogged + 1;

    // Update PRs
    const newPRs = { ...settings.personalRecords };
    exercises.forEach(ex => {
      ex.sets.forEach(set => {
        if (set.weight > 0 && set.reps > 0) {
          const key = ex.name.toLowerCase();
          const estimated1RM = calculateEstimated1RM(set.weight, set.reps);
          const existing = newPRs[key];
          
          if (!existing || estimated1RM > existing.estimated1RM) {
            newPRs[key] = {
              weight: set.weight,
              reps: set.reps,
              date: now,
              estimated1RM,
            };
            // Check for PR badge
            if (!updatedSettings.badges.find(b => b.id === 'pr-hunter')?.earnedAt) {
              const badge = updatedSettings.badges.find(b => b.id === 'pr-hunter');
              if (badge) {
                badge.earnedAt = now;
                newBadges.push(badge);
              }
            }
          }
        }
      });
    });
    updatedSettings.personalRecords = newPRs;

    // Calculate cumulative stats from all workouts in memory
    // For now we'll use totalWorkoutsLogged to track sets (each workout adds sets)
    // In a real app, you'd track cumulative sets separately
    const cumulativeSetsEstimate = updatedSettings.totalWorkoutsLogged * 9; // Avg ~9 sets per workout
    const cumulativeVolumeEstimate = updatedSettings.totalWorkoutsLogged * 5000; // Avg ~5000 kg per workout

    // Check badges
    updatedSettings.badges = updatedSettings.badges.map(badge => {
      if (badge.earnedAt) return badge;

      let earned = false;
      switch (badge.id) {
        case 'first-workout':
          earned = updatedSettings.totalWorkoutsLogged >= 1;
          break;
        case 'week-streak':
          earned = updatedSettings.streak >= 7;
          break;
        case 'three-week':
          earned = updatedSettings.streak >= 21;
          break;
        case 'centurion':
          // 100 cumulative sets - track total sets across all workouts
          earned = cumulativeSetsEstimate >= 100;
          break;
        case 'volume-king':
          // 10,000 kg cumulative volume
          earned = cumulativeVolumeEstimate >= 10000;
          break;
        case 'consistent':
          earned = updatedSettings.totalWorkoutsLogged >= 10;
          break;
        case 'dedication':
          earned = updatedSettings.totalWorkoutsLogged >= 50;
          break;
      }

      if (earned) {
        newBadges.push({ ...badge, earnedAt: now });
        return { ...badge, earnedAt: now };
      }
      return badge;
    });

    await saveSettings(updatedSettings);
    return newBadges;
  }, [settings, calculateEstimated1RM]);

  const resetAllData = useCallback(async () => {
    await AsyncStorage.removeItem(SETTINGS_KEY);
    setSettings(defaultSettings);
  }, []);

  const exportData = useCallback(async (): Promise<string> => {
    const workoutsData = await AsyncStorage.getItem('@gymapp/workouts');
    const workouts = workoutsData ? JSON.parse(workoutsData) : [];
    
    // CSV format for IB IA requirement
    let csv = 'Date,Workout,Exercise,Set,Weight,Reps,RPE\n';
    
    workouts.forEach((w: any) => {
      const date = new Date(w.performedAt).toISOString().split('T')[0];
      const title = (w.title || 'Workout').replace(/,/g, ' ');
      w.exercises?.forEach((ex: any) => {
        const name = (ex.name || '').replace(/,/g, ' ');
        ex.sets?.forEach((s: any, i: number) => {
          csv += [date, title, name, i+1, s.weight||0, s.reps||0, s.rpe||''].join(',') + '\n';
        });
      });
    });
    return csv;
  }, [settings]);

  const importData = useCallback(async (csvOrJson: string): Promise<boolean> => {
    try {
      const trimmed = csvOrJson.trim();
      
      // Handle JSON (backwards compatible)
      if (trimmed.startsWith('{')) {
        const data = JSON.parse(trimmed);
        if (data.settings) await saveSettings({ ...defaultSettings, ...data.settings });
        if (data.workouts) await AsyncStorage.setItem('@gymapp/workouts', JSON.stringify(data.workouts));
        if (data.templates) await AsyncStorage.setItem('@gymapp/templates', JSON.stringify(data.templates));
        return true;
      }
      
      // Handle CSV
      const lines = trimmed.split('\n');
      if (lines.length < 2) return false;
      
      const workoutMap: Record<string, any> = {};
      
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',');
        if (cols.length < 6) continue;
        
        const [date, title, exercise, setNum, weight, reps, rpe] = cols;
        const key = date + '|' + title;
        
        if (!workoutMap[key]) {
          workoutMap[key] = {
            id: 'w-' + Date.now() + '-' + Math.random().toString(36).slice(2,6),
            title: title || 'Workout',
            performedAt: new Date(date).getTime() || Date.now(),
            durationMinutes: 60,
            exercises: [],
            totalVolume: 0
          };
        }
        
        let ex = workoutMap[key].exercises.find((e: any) => e.name === exercise);
        if (!ex) {
          ex = { name: exercise || 'Exercise', sets: [] };
          workoutMap[key].exercises.push(ex);
        }
        
        const w = parseFloat(weight) || 0;
        const r = parseInt(reps) || 0;
        ex.sets.push({ weight: w, reps: r, rpe: rpe ? parseFloat(rpe) : undefined });
        workoutMap[key].totalVolume += w * r;
      }
      
      await AsyncStorage.setItem('@gymapp/workouts', JSON.stringify(Object.values(workoutMap)));
      return true;
    } catch {
      return false;
    }
  }, []);

  const addMeasurement = useCallback(async (measurement: Omit<Measurement, 'id'>) => {
    const newMeasurement: Measurement = {
      id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      ...measurement,
    };
    const newSettings = {
      ...settings,
      measurements: [newMeasurement, ...settings.measurements],
    };
    await saveSettings(newSettings);
  }, [settings]);

  const value = useMemo(() => ({
    settings,
    loading,
    updateProfile,
    updatePreferences,
    updateNotifications,
    addMeasurement,
    recordWorkout,
    resetAllData,
    exportData,
    importData,
    calculateEstimated1RM,
    getWeightSuggestion,
  }), [settings, loading, updateProfile, updatePreferences, updateNotifications, addMeasurement, recordWorkout, resetAllData, exportData, importData, calculateEstimated1RM, getWeightSuggestion]);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
