export type SetEntry = {
  id: string;
  weight: number;
  reps: number;
  completed?: boolean;
  notes?: string;
};

export type ExerciseEntry = {
  id: string;
  name: string;
  sets: SetEntry[];
  notes?: string;
};

export type Workout = {
  id: string;
  title: string;
  performedAt: number;
  startedAt: number;
  durationMinutes: number;
  totalVolume: number;
  totalSets: number;
  exercises: ExerciseEntry[];
};

export type Template = {
  id: string;
  name: string;
  exercises: ExerciseEntry[];
  description?: string;
};

export type NewWorkoutInput = {
  title?: string;
  performedAt?: number;
  startedAt?: number;
  durationMinutes?: number;
  exercises: ExerciseEntry[];
};

export type Goal = 'Strength' | 'Muscle Size' | 'Endurance' | 'Power';

export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type PlanRecommendation = {
  focus: string;
  sets: number;
  reps: string;
  rest: string;
  rationale: string;
};

export type PlanResult = {
  sessionsPerWeek: number;
  setsPerExercise: number;
  repRange: string;
  restRange: string;
  weeklyVolume: number;
  weeklyWorkouts: number;
  adjustments: string[];
  recommendations: PlanRecommendation[];
};
