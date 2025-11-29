// TypeScript interfaces for GymApp workout system

export interface Set {
  reps: number;
  weight: number;
  completed: boolean;
  restTime?: number; // seconds
}

export interface Exercise {
  id: string;
  name: string;
  sets: Set[];
  notes?: string;
  muscleGroups?: string[];
}

export interface Workout {
  id: string;
  name: string;
  date: Date;
  exercises: Exercise[];
  totalVolume: number; // Total weight * reps
  duration: number; // minutes
  notes?: string;
}

export interface PersonalRecord {
  exercise: string;
  weight: number;
  reps: number;
  date: Date;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  exercises: Omit<Exercise, 'sets'>[];
  category?: string;
  estimatedDuration?: number;
}

// Progress tracking types
export interface ProgressStats {
  volumeChange: number; // percentage
  workoutChange: number; // number difference
  currentVolume: number;
  previousVolume: number;
  currentWorkouts: number;
  previousWorkouts: number;
}

export interface TimeframeData {
  timeframe: 'Weekly' | 'Monthly' | 'Yearly';
  stats: ProgressStats;
}
