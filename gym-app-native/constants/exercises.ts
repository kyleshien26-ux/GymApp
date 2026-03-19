export type MuscleGroup = 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Biceps' | 'Triceps' | 'Abs' | 'Calves';

export type MovementPlane = 
  | 'Horizontal Push' | 'Vertical Push' | 'Incline Push'
  | 'Horizontal Pull' | 'Vertical Pull'
  | 'Knee Dominant' | 'Hip Hinge' | 'Knee Isolation'
  | 'Elbow Flexion' | 'Elbow Extension'
  | 'Lateral Raise' | 'Rear Delt Fly' | 'Core Flexion'
  | 'Calves';

export type JointStress = 'High' | 'Medium' | 'Low';
export type FatigueCost = 'High' | 'Medium' | 'Low';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  movementPlane: MovementPlane;
  target: string;
  tier: 'S' | 'A' | 'B';
  type: 'Compound' | 'Isolation';
  equipment: 'Barbell' | 'Dumbbell' | 'Machine' | 'Cable' | 'Bodyweight';
  fatigueCost: FatigueCost;
  jointStress: JointStress;
  targetReps: string; 
  tips: string;
  minReps?: number; 
  maxReps?: number; 
  optimalRest?: number; 
}

export const exerciseDatabase: Exercise[] = [
  // CHEST
  { id: 'flat-bb-bench', name: 'Barbell Flat Bench', muscleGroup: 'Chest', target: 'Mid Chest', movementPlane: 'Horizontal Push', tier: 'S', type: 'Compound', equipment: 'Barbell', fatigueCost: 'High', jointStress: 'High', targetReps: '5-8', tips: "Retract scapula. Arch back slightly. Drive feet." },
  { id: 'flat-db-press', name: 'Dumbbell Flat Press', muscleGroup: 'Chest', target: 'Mid Chest', movementPlane: 'Horizontal Push', tier: 'S', type: 'Compound', equipment: 'Dumbbell', fatigueCost: 'Medium', jointStress: 'Medium', targetReps: '8-12', tips: "Deep stretch. Tuck elbows 45 degrees." },
  { id: 'machine-chest-press', name: 'Machine Chest Press', muscleGroup: 'Chest', target: 'Mid Chest', movementPlane: 'Horizontal Push', tier: 'A', type: 'Compound', equipment: 'Machine', fatigueCost: 'Low', jointStress: 'Low', targetReps: '8-12', tips: "Control the negative. Squeeze at top." },
  { id: 'incline-bb-bench', name: 'Incline Barbell Bench', muscleGroup: 'Chest', target: 'Upper Chest', movementPlane: 'Incline Push', tier: 'S', type: 'Compound', equipment: 'Barbell', fatigueCost: 'High', jointStress: 'High', targetReps: '6-10', tips: "Bench at 30 degrees. Touch upper chest." },
  { id: 'incline-db-press', name: 'Incline DB Press', muscleGroup: 'Chest', target: 'Upper Chest', movementPlane: 'Incline Push', tier: 'S', type: 'Compound', equipment: 'Dumbbell', fatigueCost: 'Medium', jointStress: 'Medium', targetReps: '8-12', tips: "Great range of motion. Keep wrists stacked." },
  { id: 'pec-deck', name: 'Pec Deck Fly', muscleGroup: 'Chest', target: 'Inner Chest', movementPlane: 'Horizontal Push', tier: 'B', type: 'Isolation', equipment: 'Machine', fatigueCost: 'Low', jointStress: 'Low', targetReps: '12-15', tips: "Elbows slightly bent. Squeeze center." },
  { id: 'cable-fly-high', name: 'High-to-Low Cable Fly', muscleGroup: 'Chest', target: 'Lower Chest', movementPlane: 'Horizontal Push', tier: 'A', type: 'Isolation', equipment: 'Cable', fatigueCost: 'Low', jointStress: 'Low', targetReps: '12-15', tips: "Step forward. Drive hands down and together." },

  // SHOULDERS
  { id: 'ohp-bb', name: 'Overhead Barbell Press', muscleGroup: 'Shoulders', target: 'Front Delt', movementPlane: 'Vertical Push', tier: 'S', type: 'Compound', equipment: 'Barbell', fatigueCost: 'High', jointStress: 'High', targetReps: '5-8', tips: "Head through at top. Brace core/glutes." },
  { id: 'ohp-db', name: 'Seated DB Shoulder Press', muscleGroup: 'Shoulders', target: 'Front Delt', movementPlane: 'Vertical Push', tier: 'A', type: 'Compound', equipment: 'Dumbbell', fatigueCost: 'Medium', jointStress: 'Medium', targetReps: '8-12', tips: "Back support on bench. Full ROM." },
  { id: 'machine-shoulder-press', name: 'Machine Shoulder Press', muscleGroup: 'Shoulders', target: 'Front Delt', movementPlane: 'Vertical Push', tier: 'A', type: 'Compound', equipment: 'Machine', fatigueCost: 'Low', jointStress: 'Low', targetReps: '10-15', tips: "Good for dropsets. Keep elbows slightly forward." },
  { id: 'db-lat-raise', name: 'DB Lateral Raise', muscleGroup: 'Shoulders', target: 'Side Delt', movementPlane: 'Lateral Raise', tier: 'A', type: 'Isolation', equipment: 'Dumbbell', fatigueCost: 'Low', jointStress: 'Medium', targetReps: '12-20', tips: "Lead with elbows. Pinky slightly up." },
  { id: 'cable-lat-raise', name: 'Cable Lateral Raise', muscleGroup: 'Shoulders', target: 'Side Delt', movementPlane: 'Lateral Raise', tier: 'S', type: 'Isolation', equipment: 'Cable', fatigueCost: 'Low', jointStress: 'Low', targetReps: '12-20', tips: "Constant tension. Cross body setup." },
  { id: 'face-pull', name: 'Face Pull', muscleGroup: 'Shoulders', target: 'Rear Delt', movementPlane: 'Rear Delt Fly', tier: 'S', type: 'Isolation', equipment: 'Cable', fatigueCost: 'Low', jointStress: 'Low', targetReps: '15-20', tips: "Pull to forehead. External rotation at end." },
  { id: 'reverse-pec-deck', name: 'Reverse Pec Deck', muscleGroup: 'Shoulders', target: 'Rear Delt', movementPlane: 'Rear Delt Fly', tier: 'A', type: 'Isolation', equipment: 'Machine', fatigueCost: 'Low', jointStress: 'Low', targetReps: '15-20', tips: "Push back with outer hand. Don't shrug." },

  // BACK
  { id: 'pullup', name: 'Pull Up', muscleGroup: 'Back', target: 'Lats', movementPlane: 'Vertical Pull', tier: 'S', type: 'Compound', equipment: 'Bodyweight', fatigueCost: 'High', jointStress: 'Medium', targetReps: '5-10', tips: "Chest to bar. Full dead hang." },
  { id: 'lat-pulldown', name: 'Lat Pulldown', muscleGroup: 'Back', target: 'Lats', movementPlane: 'Vertical Pull', tier: 'A', type: 'Compound', equipment: 'Cable', fatigueCost: 'Medium', jointStress: 'Low', targetReps: '8-12', tips: "Drive elbows to pockets. Thumbless grip." },
  { id: 'bb-row', name: 'Barbell Row', muscleGroup: 'Back', target: 'Upper Back', movementPlane: 'Horizontal Pull', tier: 'S', type: 'Compound', equipment: 'Barbell', fatigueCost: 'High', jointStress: 'High', targetReps: '6-10', tips: "Torso 45 degrees. Pull to hip crease." },
  { id: 'cable-row', name: 'Seated Cable Row', muscleGroup: 'Back', target: 'Mid Back', movementPlane: 'Horizontal Pull', tier: 'A', type: 'Compound', equipment: 'Cable', fatigueCost: 'Medium', jointStress: 'Low', targetReps: '10-15', tips: "Stretch forward. Squeeze scapula back." },
  { id: 'chest-supported-row', name: 'Chest Supported Row', muscleGroup: 'Back', target: 'Upper Back', movementPlane: 'Horizontal Pull', tier: 'S', type: 'Compound', equipment: 'Machine', fatigueCost: 'Medium', jointStress: 'Low', targetReps: '8-12', tips: "Isolates lats/rhomboids. No lower back limiting." },

  // TRICEPS
  { id: 'skull-crusher', name: 'Skull Crusher', muscleGroup: 'Triceps', target: 'Long Head', movementPlane: 'Elbow Extension', tier: 'A', type: 'Isolation', equipment: 'Barbell', fatigueCost: 'Medium', jointStress: 'High', targetReps: '8-12', tips: "Keep elbows tucked. Bar to hairline." },
  { id: 'tricep-pushdown', name: 'Cable Pushdown', muscleGroup: 'Triceps', target: 'Lateral Head', movementPlane: 'Elbow Extension', tier: 'S', type: 'Isolation', equipment: 'Cable', fatigueCost: 'Low', jointStress: 'Low', targetReps: '12-15', tips: "Elbows pinned to side. Flare rope at bottom." },
  { id: 'overhead-tricep', name: 'Overhead Cable Extension', muscleGroup: 'Triceps', target: 'Long Head', movementPlane: 'Elbow Extension', tier: 'S', type: 'Isolation', equipment: 'Cable', fatigueCost: 'Low', jointStress: 'Medium', targetReps: '10-15', tips: "Deep stretch for long head. Keep core tight." },
  { id: 'dips', name: 'Dips', muscleGroup: 'Triceps', target: 'All Heads', movementPlane: 'Vertical Push', tier: 'S', type: 'Compound', equipment: 'Bodyweight', fatigueCost: 'Medium', jointStress: 'High', targetReps: '8-12', tips: "Stay upright for triceps. 90 degree elbow bend." },

  // BICEPS
  { id: 'bb-curl', name: 'Barbell Curl', muscleGroup: 'Biceps', target: 'Biceps', movementPlane: 'Elbow Flexion', tier: 'A', type: 'Isolation', equipment: 'Barbell', fatigueCost: 'Medium', jointStress: 'Medium', targetReps: '8-12', tips: "Strict form. No swinging." },
  { id: 'db-curl', name: 'Dumbbell Curl', muscleGroup: 'Biceps', target: 'Biceps', movementPlane: 'Elbow Flexion', tier: 'A', type: 'Isolation', equipment: 'Dumbbell', fatigueCost: 'Low', jointStress: 'Low', targetReps: '10-15', tips: "Supinate wrist (palms up) at top." },
  { id: 'hammer-curl', name: 'Hammer Curl', muscleGroup: 'Biceps', target: 'Brachialis', movementPlane: 'Elbow Flexion', tier: 'B', type: 'Isolation', equipment: 'Dumbbell', fatigueCost: 'Low', jointStress: 'Low', targetReps: '10-15', tips: "Neutral grip. Hits brachialis." },
  { id: 'preacher-curl', name: 'Preacher Curl', muscleGroup: 'Biceps', target: 'Short Head', movementPlane: 'Elbow Flexion', tier: 'S', type: 'Isolation', equipment: 'Machine', fatigueCost: 'Low', jointStress: 'Medium', targetReps: '10-15', tips: "Armpit on pad. Full stretch." },
  { id: 'incline-curl', name: 'Incline DB Curl', muscleGroup: 'Biceps', target: 'Long Head', movementPlane: 'Elbow Flexion', tier: 'S', type: 'Isolation', equipment: 'Dumbbell', fatigueCost: 'Low', jointStress: 'Medium', targetReps: '10-15', tips: "Bench at 45-60. Arms hang behind body. Stretch focus." },

  // LEGS
  { id: 'squat', name: 'Barbell Squat', muscleGroup: 'Legs', target: 'Quads', movementPlane: 'Knee Dominant', tier: 'S', type: 'Compound', equipment: 'Barbell', fatigueCost: 'High', jointStress: 'High', targetReps: '5-8', tips: "Knees out. Chest up. Break parallel." },
  { id: 'leg-press', name: 'Leg Press', muscleGroup: 'Legs', target: 'Quads', movementPlane: 'Knee Dominant', tier: 'A', type: 'Compound', equipment: 'Machine', fatigueCost: 'Medium', jointStress: 'Medium', targetReps: '10-15', tips: "Feet mid-plate. Don't lock knees." },
  { id: 'hack-squat', name: 'Hack Squat', muscleGroup: 'Legs', target: 'Quads', movementPlane: 'Knee Dominant', tier: 'S', type: 'Compound', equipment: 'Machine', fatigueCost: 'Medium', jointStress: 'Medium', targetReps: '8-12', tips: "Deep range of motion. Constant tension." },
  { id: 'lunge', name: 'Walking Lunge', muscleGroup: 'Legs', target: 'Glutes/Quads', movementPlane: 'Knee Dominant', tier: 'B', type: 'Compound', equipment: 'Dumbbell', fatigueCost: 'High', jointStress: 'Medium', targetReps: '10-12', tips: "Knee gently touches floor. Vertical torso." },
  { id: 'leg-ext', name: 'Leg Extension', muscleGroup: 'Legs', target: 'Quads', movementPlane: 'Knee Isolation', tier: 'B', type: 'Isolation', equipment: 'Machine', fatigueCost: 'Low', jointStress: 'High', targetReps: '15-20', tips: "Squeeze quads at top. Controlled lower." },

  // LEGS: Hip Hinge
  { id: 'deadlift', name: 'Deadlift', muscleGroup: 'Back', target: 'Posterior Chain', movementPlane: 'Hip Hinge', tier: 'S', type: 'Compound', equipment: 'Barbell', fatigueCost: 'High', jointStress: 'High', targetReps: '3-5', tips: "Brace core. Slack out of bar. Push floor away." },
  { id: 'rdl', name: 'Romanian Deadlift', muscleGroup: 'Legs', target: 'Hamstrings', movementPlane: 'Hip Hinge', tier: 'S', type: 'Compound', equipment: 'Barbell', fatigueCost: 'Medium', jointStress: 'Medium', targetReps: '8-12', tips: "Hips back. Slight knee bend. Feel hamstring stretch." },
  { id: 'leg-curl', name: 'Seated Leg Curl', muscleGroup: 'Legs', target: 'Hamstrings', movementPlane: 'Knee Isolation', tier: 'A', type: 'Isolation', equipment: 'Machine', fatigueCost: 'Low', jointStress: 'Low', targetReps: '10-15', tips: "Lock thigh pad tight. Control return." },

  // ABS & CALVES
  { id: 'calf-raise', name: 'Standing Calf Raise', muscleGroup: 'Calves', target: 'Calves', movementPlane: 'Knee Isolation', tier: 'A', type: 'Isolation', equipment: 'Machine', fatigueCost: 'Low', jointStress: 'Low', targetReps: '15-20', tips: "Full stretch at bottom. Pause." },
  { id: 'cable-crunch', name: 'Cable Crunch', muscleGroup: 'Abs', target: 'Abs', movementPlane: 'Core Flexion', tier: 'S', type: 'Isolation', equipment: 'Cable', fatigueCost: 'Low', jointStress: 'Low', targetReps: '15-20', tips: "Round the back. Crunch down towards knees." },
  { id: 'leg-raise', name: 'Hanging Leg Raise', muscleGroup: 'Abs', target: 'Abs', movementPlane: 'Core Flexion', tier: 'A', type: 'Isolation', equipment: 'Bodyweight', fatigueCost: 'Medium', jointStress: 'Low', targetReps: '10-15', tips: "Tilt pelvis up. Don't swing." }
];

export const getAllMuscleGroups = () => Array.from(new Set(exerciseDatabase.map(e => e.muscleGroup)));
export const searchExercises = (q: string) => exerciseDatabase.filter(e => e.name.toLowerCase().includes(q.toLowerCase()));
export const getExercisesByMuscleGroup = (group: string) => {
  if (group === 'All') return exerciseDatabase;
  return exerciseDatabase.filter(e => e.muscleGroup === group);
};