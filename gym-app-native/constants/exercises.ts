export type MuscleGroup = 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Biceps' | 'Triceps' | 'Abs' | 'Calves';

export type MovementPlane = 
  | 'Horizontal Push' | 'Vertical Push' | 'Incline Push'
  | 'Horizontal Pull' | 'Vertical Pull'
  | 'Knee Dominant' | 'Hip Hinge' | 'Knee Isolation'
  | 'Elbow Flexion' | 'Elbow Extension'
  | 'Lateral Raise' | 'Rear Delt Fly' | 'Core Flexion'
  | 'Calves';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  movementPlane: MovementPlane;
  tier: 'S' | 'A' | 'B';
  type: 'Compound' | 'Isolation';
  equipment: 'Barbell' | 'Dumbbell' | 'Machine' | 'Cable' | 'Bodyweight';
  fatigueCost: 'High' | 'Medium' | 'Low';
  jointStress: 'High' | 'Medium' | 'Low';
  targetReps: string; 
  tips: string;
}

export const exerciseDatabase: Exercise[] = [
  // --- CHEST ---
  { id: 'flat-bb-bench', name: 'Barbell Flat Bench', muscleGroup: 'Chest', movementPlane: 'Horizontal Push', tier: 'S', type: 'Compound', equipment: 'Barbell', fatigueCost: 'High', jointStress: 'High', targetReps: '5-8', tips: "Retract scapula." },
  { id: 'flat-db-press', name: 'Dumbbell Flat Press', muscleGroup: 'Chest', movementPlane: 'Horizontal Push', tier: 'S', type: 'Compound', equipment: 'Dumbbell', fatigueCost: 'Medium', jointStress: 'Medium', targetReps: '8-12', tips: "Tuck elbows 45 deg." },
  { id: 'pushups', name: 'Pushups', muscleGroup: 'Chest', movementPlane: 'Horizontal Push', tier: 'A', type: 'Compound', equipment: 'Bodyweight', fatigueCost: 'Low', jointStress: 'Low', targetReps: '15-20', tips: "Chest to floor." },

  // --- SHOULDERS ---
  { id: 'ohp-db', name: 'Seated DB Press', muscleGroup: 'Shoulders', movementPlane: 'Vertical Push', tier: 'A', type: 'Compound', equipment: 'Dumbbell', fatigueCost: 'Medium', jointStress: 'Medium', targetReps: '8-12', tips: "Full ROM." },
  { id: 'db-lat-raise', name: 'DB Lateral Raise', muscleGroup: 'Shoulders', movementPlane: 'Lateral Raise', tier: 'A', type: 'Isolation', equipment: 'Dumbbell', fatigueCost: 'Low', jointStress: 'Medium', targetReps: '12-20', tips: "Lead with elbows." },
  { id: 'face-pull', name: 'Face Pull', muscleGroup: 'Shoulders', movementPlane: 'Rear Delt Fly', tier: 'S', type: 'Isolation', equipment: 'Cable', fatigueCost: 'Low', jointStress: 'Low', targetReps: '15-20', tips: "Pull to forehead." },

  // --- BACK ---
  { id: 'pullup', name: 'Pull Up', muscleGroup: 'Back', movementPlane: 'Vertical Pull', tier: 'S', type: 'Compound', equipment: 'Bodyweight', fatigueCost: 'High', jointStress: 'Medium', targetReps: '5-10', tips: "Dead hang." },
  { id: 'db-row', name: 'One Arm DB Row', muscleGroup: 'Back', movementPlane: 'Horizontal Pull', tier: 'S', type: 'Compound', equipment: 'Dumbbell', fatigueCost: 'Medium', jointStress: 'Low', targetReps: '8-12', tips: "Pull to hip." },
  { id: 'db-pullover', name: 'DB Pullover', muscleGroup: 'Back', movementPlane: 'Vertical Pull', tier: 'B', type: 'Isolation', equipment: 'Dumbbell', fatigueCost: 'Low', jointStress: 'Medium', targetReps: '12-15', tips: "Stretch lats." },

  // --- LEGS (The "3-Exercise Bug" Killer) ---
  { id: 'db-goblet-squat', name: 'DB Goblet Squat', muscleGroup: 'Legs', movementPlane: 'Knee Dominant', tier: 'S', type: 'Compound', equipment: 'Dumbbell', fatigueCost: 'Medium', jointStress: 'Medium', targetReps: '10-15', tips: "Hold DB at chest." },
  { id: 'db-rdl', name: 'DB Romanian Deadlift', muscleGroup: 'Legs', movementPlane: 'Hip Hinge', tier: 'S', type: 'Compound', equipment: 'Dumbbell', fatigueCost: 'Medium', jointStress: 'Medium', targetReps: '10-15', tips: "Feel the stretch." },
  { id: 'db-lunge', name: 'DB Walking Lunge', muscleGroup: 'Legs', movementPlane: 'Knee Dominant', tier: 'B', type: 'Compound', equipment: 'Dumbbell', fatigueCost: 'High', jointStress: 'High', targetReps: '10-12', tips: "Large steps." },
  { id: 'db-split-squat', name: 'DB Split Squat', muscleGroup: 'Legs', movementPlane: 'Knee Dominant', tier: 'A', type: 'Compound', equipment: 'Dumbbell', fatigueCost: 'High', jointStress: 'High', targetReps: '8-12', tips: "Elevate back foot." },
  { id: 'db-leg-curl', name: 'DB Floor Leg Curl', muscleGroup: 'Legs', movementPlane: 'Knee Isolation', tier: 'B', type: 'Isolation', equipment: 'Dumbbell', fatigueCost: 'Low', jointStress: 'Low', targetReps: '12-15', tips: "DB between feet." },
  { id: 'db-calf-raise', name: 'DB Calf Raise', muscleGroup: 'Calves', movementPlane: 'Calves', tier: 'A', type: 'Isolation', equipment: 'Dumbbell', fatigueCost: 'Low', jointStress: 'Low', targetReps: '15-20', tips: "Full stretch." }
];