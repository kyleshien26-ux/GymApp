import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Workout } from '../types/workouts';
import { getScientificSuggestion } from '../lib/workout-planner';

const SETTINGS_KEY = '@gymapp/settings';

export type MeasurementType = 'Weight' | 'Body Fat' | 'Muscle Mass';

export type Measurement = {
  id: string;
  type: MeasurementType;
  value: number;
  date: number;
  unit: string;
};

export type Gender = 'Male' | 'Female';
export type ActivityLevel = 'Sedentary' | 'Light' | 'Moderate' | 'Active' | 'Very Active';
export type NutritionGoal = 'Cut' | 'Bulk' | 'Recomp';

export type UserProfile = {
  gender: Gender;
  age: number;
  height: number; // cm
  currentWeight: number; // kg
  activityLevel: ActivityLevel;
  nutritionGoal: NutritionGoal;
  avatar?: string;
};

export type AppSettings = {
  personalRecords: Record<string, { weight: number; reps: number; date: number; estimated1RM: number }>;
  preferences: {
    incrementSize: number;
    units: 'kg' | 'lbs';
    enableAdvancedSuggestions: boolean;
    defaultRestTimer: number;
    rpeEnabled: boolean;
    autoIncrement: boolean;
  };
  notifications: {
    workoutReminders: boolean;
    reminderTime: string;
    restDayNotifications: boolean
  };
  userGoal: 'Strength' | 'Hypertrophy' | 'Endurance';
  username: string;
  measurements: Measurement[];
  userProfile: UserProfile;
};

const defaultSettings: AppSettings = {
  personalRecords: {},
  preferences: {
    incrementSize: 2.5,
    units: 'kg',
    enableAdvancedSuggestions: true,
    defaultRestTimer: 60,
    rpeEnabled: true,
    autoIncrement: true
  },
  notifications: { workoutReminders: false, reminderTime: '08:00', restDayNotifications: false },
  userGoal: 'Hypertrophy',
  username: 'Mr. Bailey',
  measurements: [],
  userProfile: {
    gender: 'Male',
    age: 0,
    height: 0,
    currentWeight: 0,
    activityLevel: 'Moderate',
    nutritionGoal: 'Recomp',
    avatar: '💪'
  }
};

const ensureBool = (val: any, defaultVal: boolean): boolean => {
  if (val === true || val === 'true') return true;
  if (val === false || val === 'false') return false;
  return defaultVal;
};

type SettingsContextValue = {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => Promise<void>;
  updatePreferences: (newPrefs: Partial<AppSettings['preferences']>) => Promise<void>;
  updateNotifications: (newNotifs: Partial<AppSettings['notifications']>) => Promise<void>;
  updateUserProfile: (newProfile: Partial<UserProfile>) => Promise<void>;
  checkPersonalRecords: (workout: Workout) => Promise<void>;
  recalculatePersonalRecords: (workouts: Workout[]) => Promise<void>;
  getSuggestion: (exerciseName: string, workouts: Workout[]) => { weight: number; reps: number; reason: string; confidence: number };
  addMeasurement: (measurement: Omit<Measurement, 'id'>) => Promise<void>;
  exportData: () => Promise<string>;
  importData: (data: string) => Promise<boolean>;
  clearStore: () => Promise<void>;
  isLoaded: boolean;
};

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(SETTINGS_KEY).then(json => {
      if (json) {
        try {
          const saved = JSON.parse(json);
          setSettings({
            ...defaultSettings,
            ...saved,
            preferences: {
              ...defaultSettings.preferences,
              ...saved.preferences,
              rpeEnabled: ensureBool(saved.preferences?.rpeEnabled, defaultSettings.preferences.rpeEnabled),
              autoIncrement: ensureBool(saved.preferences?.autoIncrement, defaultSettings.preferences.autoIncrement),
              enableAdvancedSuggestions: ensureBool(saved.preferences?.enableAdvancedSuggestions, defaultSettings.preferences.enableAdvancedSuggestions),
            },
            notifications: {
              ...defaultSettings.notifications,
              ...saved.notifications,
              workoutReminders: ensureBool(saved.notifications?.workoutReminders, defaultSettings.notifications.workoutReminders),
              restDayNotifications: ensureBool(saved.notifications?.restDayNotifications, defaultSettings.notifications.restDayNotifications),
            },
            userProfile: {
              ...defaultSettings.userProfile,
              ...saved.userProfile
            }
          });
        } catch (e) {
          console.error("Error parsing settings:", e);
        }
      }
      setIsLoaded(true);
    }).catch(e => {
      console.error(e);
      setIsLoaded(true);
    });
  }, []);

  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    const next = { ...settings, ...newSettings };
    setSettings(next);
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
  };

  const updatePreferences = async (newPrefs: Partial<AppSettings['preferences']>) => {
    const next = { ...settings, preferences: { ...settings.preferences, ...newPrefs } };
    setSettings(next);
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
  };

  const updateNotifications = async (newNotifs: Partial<AppSettings['notifications']>) => {
    const next = { ...settings, notifications: { ...settings.notifications, ...newNotifs } };
    setSettings(next);
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
  };

  const updateUserProfile = async (newProfile: Partial<UserProfile>) => {
    const next = { ...settings, userProfile: { ...settings.userProfile, ...newProfile } };
    setSettings(next);
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
  };

  const addMeasurement = async (m: Omit<Measurement, 'id'>) => {
    const newM: Measurement = { ...m, id: `m-${Date.now()}` };
    const next = { 
        ...settings, 
        measurements: [newM, ...(settings.measurements || [])],
        // Auto-update current weight if measurement is weight
        userProfile: m.type === 'Weight' ? { ...settings.userProfile, currentWeight: m.value } : settings.userProfile
    };
    setSettings(next);
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
  }

  const exportData = async () => {
    return JSON.stringify(settings);
  };

  const importData = async (data: string) => {
    try {
      const parsed = JSON.parse(data);
      if (parsed && typeof parsed === 'object') {
        const next = { ...defaultSettings, ...parsed };
        setSettings(next);
        await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const clearStore = async () => {
    await AsyncStorage.removeItem(SETTINGS_KEY);
    setSettings(defaultSettings);
  };

  const checkPersonalRecords = async (workout: Workout) => {
    const nextRecords = { ...settings.personalRecords };
    let hasNewPR = false;
    workout.exercises.forEach(ex => {
      if (Array.isArray(ex.sets)) {
        ex.sets.forEach(set => {
          if (!set.completed || !set.weight || !set.reps) return;
          const est1RM = set.weight * (1 + set.reps / 30);
          const current = nextRecords[ex.name];
          if (!current || est1RM > current.estimated1RM) {
            nextRecords[ex.name] = { weight: set.weight, reps: set.reps, date: workout.performedAt, estimated1RM: est1RM };
            hasNewPR = true;
          }
        });
      }
    });
    if (hasNewPR) await updateSettings({ personalRecords: nextRecords });
  };

  const recalculatePersonalRecords = async (workouts: Workout[]) => {
    const nextRecords: Record<string, any> = {};
    workouts.forEach(workout => {
      workout.exercises.forEach(ex => {
        if (Array.isArray(ex.sets)) {
          ex.sets.forEach(set => {
            if (!set.completed || !set.weight || !set.reps) return;
            const est1RM = set.weight * (1 + set.reps / 30);
            const current = nextRecords[ex.name];
            if (!current || est1RM > current.estimated1RM) {
              nextRecords[ex.name] = { weight: set.weight, reps: set.reps, date: workout.performedAt, estimated1RM: est1RM };
            }
          });
        }
      });
    });
    await updateSettings({ personalRecords: nextRecords });
  };

  const getSuggestion = (exerciseName: string, workouts: Workout[]) => {
    return getScientificSuggestion(exerciseName, workouts, settings.userGoal);
  };
  return (
    <SettingsContext.Provider value={{ 
      settings, 
      updateSettings, 
      updatePreferences, 
      updateNotifications,
      updateUserProfile, 
      checkPersonalRecords, 
      recalculatePersonalRecords,
      getSuggestion, 
      addMeasurement,
      exportData,
      importData,
      clearStore,
      isLoaded
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider');
  return ctx;
};
