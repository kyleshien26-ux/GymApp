export interface SetEntry {
  id: string;
  weight: number;
  reps: number;
  completed: boolean;
}

export interface ExerciseEntry {
  id: string;
  name: string;
  sets: SetEntry[];
  notes?: string;
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
}

export interface Template {
  id: string;
  name: string;
  exercises: ExerciseEntry[];
}

export interface NewWorkoutInput {
  title: string;
  startedAt: number;
  durationMinutes: number;
  exercises: ExerciseEntry[];
}