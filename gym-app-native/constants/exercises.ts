export type MuscleGroup =
  | 'Chest'
  | 'Back'
  | 'Shoulders'
  | 'Biceps'
  | 'Triceps'
  | 'Forearms'
  | 'Legs'
  | 'Glutes'
  | 'Core';

export type Exercise = {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  category: 'compound' | 'isolation';
};

export const exerciseDatabase: Exercise[] = [
  // Chest
  { id: 'ex-bp', name: 'Bench Press', muscleGroup: 'Chest', category: 'compound' },
  { id: 'ex-ip', name: 'Incline Press', muscleGroup: 'Chest', category: 'compound' },
  { id: 'ex-dp', name: 'Dumbbell Press', muscleGroup: 'Chest', category: 'compound' },
  { id: 'ex-fl', name: 'Flyes', muscleGroup: 'Chest', category: 'isolation' },
  { id: 'ex-pb', name: 'Push-ups', muscleGroup: 'Chest', category: 'compound' },
  { id: 'ex-mc', name: 'Machine Chest Press', muscleGroup: 'Chest', category: 'compound' },

  // Back
  { id: 'ex-dl', name: 'Deadlift', muscleGroup: 'Back', category: 'compound' },
  { id: 'ex-br', name: 'Barbell Row', muscleGroup: 'Back', category: 'compound' },
  { id: 'ex-dr', name: 'Dumbbell Row', muscleGroup: 'Back', category: 'compound' },
  { id: 'ex-pud', name: 'Pull-ups', muscleGroup: 'Back', category: 'compound' },
  { id: 'ex-lp', name: 'Lat Pulldown', muscleGroup: 'Back', category: 'isolation' },
  { id: 'ex-rs', name: 'Seated Row', muscleGroup: 'Back', category: 'isolation' },
  { id: 'ex-cr', name: 'Cable Row', muscleGroup: 'Back', category: 'isolation' },
  { id: 'ex-fr', name: 'Face Pulls', muscleGroup: 'Back', category: 'isolation' },

  // Shoulders
  { id: 'ex-op', name: 'Overhead Press', muscleGroup: 'Shoulders', category: 'compound' },
  { id: 'ex-mp', name: 'Military Press', muscleGroup: 'Shoulders', category: 'compound' },
  { id: 'ex-sp', name: 'Shoulder Press (Machine)', muscleGroup: 'Shoulders', category: 'compound' },
  { id: 'ex-lr', name: 'Lateral Raise', muscleGroup: 'Shoulders', category: 'isolation' },
  { id: 'ex-fr', name: 'Front Raise', muscleGroup: 'Shoulders', category: 'isolation' },
  { id: 'ex-rr', name: 'Reverse Flyes', muscleGroup: 'Shoulders', category: 'isolation' },
  { id: 'ex-sh', name: 'Shrugs', muscleGroup: 'Shoulders', category: 'isolation' },

  // Biceps
  { id: 'ex-bb', name: 'Barbell Curl', muscleGroup: 'Biceps', category: 'isolation' },
  { id: 'ex-db', name: 'Dumbbell Curl', muscleGroup: 'Biceps', category: 'isolation' },
  { id: 'ex-cc', name: 'Cable Curl', muscleGroup: 'Biceps', category: 'isolation' },
  { id: 'ex-hc', name: 'Hammer Curl', muscleGroup: 'Biceps', category: 'isolation' },
  { id: 'ex-pc', name: 'Preacher Curl', muscleGroup: 'Biceps', category: 'isolation' },

  // Triceps
  { id: 'ex-cd', name: 'Close Grip Bench', muscleGroup: 'Triceps', category: 'compound' },
  { id: 'ex-dip', name: 'Dips', muscleGroup: 'Triceps', category: 'compound' },
  { id: 'ex-te', name: 'Tricep Extension', muscleGroup: 'Triceps', category: 'isolation' },
  { id: 'ex-po', name: 'Pushdown', muscleGroup: 'Triceps', category: 'isolation' },
  { id: 'ex-oh', name: 'Overhead Extension', muscleGroup: 'Triceps', category: 'isolation' },

  // Forearms
  { id: 'ex-wc', name: 'Wrist Curl', muscleGroup: 'Forearms', category: 'isolation' },
  { id: 'ex-wr', name: 'Wrist Roller', muscleGroup: 'Forearms', category: 'isolation' },
  { id: 'ex-rc', name: 'Reverse Curl', muscleGroup: 'Forearms', category: 'isolation' },

  // Legs
  { id: 'ex-sq', name: 'Squat', muscleGroup: 'Legs', category: 'compound' },
  { id: 'ex-bs', name: 'Back Squat', muscleGroup: 'Legs', category: 'compound' },
  { id: 'ex-fs', name: 'Front Squat', muscleGroup: 'Legs', category: 'compound' },
  { id: 'ex-lp', name: 'Leg Press', muscleGroup: 'Legs', category: 'compound' },
  { id: 'ex-ld', name: 'Leg Extension', muscleGroup: 'Legs', category: 'isolation' },
  { id: 'ex-lc', name: 'Leg Curl', muscleGroup: 'Legs', category: 'isolation' },
  { id: 'ex-lunge', name: 'Lunge', muscleGroup: 'Legs', category: 'compound' },
  { id: 'ex-sl', name: 'Step-ups', muscleGroup: 'Legs', category: 'compound' },

  // Glutes
  { id: 'ex-hip', name: 'Hip Thrust', muscleGroup: 'Glutes', category: 'compound' },
  { id: 'ex-rdl', name: 'Romanian Deadlift', muscleGroup: 'Glutes', category: 'compound' },
  { id: 'ex-cable', name: 'Cable Kickback', muscleGroup: 'Glutes', category: 'isolation' },
  { id: 'ex-ghd', name: 'Glute Machine', muscleGroup: 'Glutes', category: 'isolation' },

  // Core
  { id: 'ex-plank', name: 'Plank', muscleGroup: 'Core', category: 'isolation' },
  { id: 'ex-ab', name: 'Ab Crunch', muscleGroup: 'Core', category: 'isolation' },
  { id: 'ex-dead', name: 'Deadbug', muscleGroup: 'Core', category: 'isolation' },
  { id: 'ex-cable-w', name: 'Cable Woodchop', muscleGroup: 'Core', category: 'isolation' },
  { id: 'ex-hg', name: 'Hanging Leg Raise', muscleGroup: 'Core', category: 'isolation' },
];

export function getExercisesByMuscleGroup(muscleGroup: MuscleGroup): Exercise[] {
  return exerciseDatabase.filter(ex => ex.muscleGroup === muscleGroup);
}

export function getAllMuscleGroups(): MuscleGroup[] {
  const groups = new Set<MuscleGroup>();
  exerciseDatabase.forEach(ex => groups.add(ex.muscleGroup));
  return Array.from(groups).sort();
}

export function searchExercises(query: string): Exercise[] {
  const lowerQuery = query.toLowerCase();
  return exerciseDatabase.filter(ex =>
    ex.name.toLowerCase().includes(lowerQuery) ||
    ex.muscleGroup.toLowerCase().includes(lowerQuery)
  );
}
