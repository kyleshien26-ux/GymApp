export interface SetEntry {
  id: string;
  weight: number;
  reps: number;
  completed: boolean;
}

export interface ExerciseEntry {
  id: string;
  name: string;
  sets: SetEntry[] | number; 
  notes?: string;
  reps?: string | number;
  suggestedWeight?: number;
  note?: string;
  muscleGroup?: string; // For analytics/test support
  movementPlane?: string; // For analytics
  tier?: string; // For test support
}

export interface Workout {
  id: string;
  title: string;
  performedAt: number;
  startedAt: number;
  durationMinutes: number;
  totalSets: number;
  totalVolume: number;
  exercises: ExerciseEntry[];
  progression?: { exerciseId: string; weight: number; reps: number; }[];
}

export interface Template {
  id: string;
  name: string;
  exercises: ExerciseEntry[];
  isPinned?: boolean;
  folder?: string;
  description?: string;
}

export interface NewWorkoutInput {
  title: string;
  startedAt: number;
  durationMinutes: number;
  exercises: ExerciseEntry[];
  performedAt?: number;
}