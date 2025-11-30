export interface WorkoutSet {
  weight: number;
  reps: number;
  completed?: boolean;
  formIssue?: boolean;
  failed?: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  sets: WorkoutSet[];
  notes?: string;
}

export interface Workout {
  id: string;
  date: string;
  duration?: number;  // in minutes
  exercises: Exercise[];
  notes?: string;
  templateId?: string;
  templateName?: string;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  description?: string;
  exercises: {
    name: string;
    sets: number;
    reps?: number;
    weight?: number;
  }[];
  isFavorite?: boolean;
}
