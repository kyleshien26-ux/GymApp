// Training Intelligence Module
// Detects plateaus, fatigue, muscle imbalances, and classifies training age

import { Workout, ExerciseEntry } from '../types/workouts';

export interface TrainingInsight {
  type: 'plateau' | 'fatigue' | 'imbalance' | 'pr' | 'improvement';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'success';
  exercise?: string;
  muscleGroup?: string;
}

export interface MuscleBalance {
  muscleGroup: string;
  weeklyVolume: number;
  targetVolume: number;
  status: 'undertrained' | 'optimal' | 'overtrained';
  percentage: number;
}

// Detect if an exercise has plateaued (no progress in 2+ weeks)
export function detectPlateaus(workouts: Workout[]): TrainingInsight[] {
  const insights: TrainingInsight[] = [];
  const exerciseHistory: Record<string, { date: number; maxWeight: number }[]> = {};
  
  // Build exercise history
  workouts.forEach(workout => {
    workout.exercises.forEach(exercise => {
      const maxWeight = Math.max(...exercise.sets.map(s => s.weight));
      if (!exerciseHistory[exercise.name]) {
        exerciseHistory[exercise.name] = [];
      }
      exerciseHistory[exercise.name].push({
        date: workout.performedAt,
        maxWeight
      });
    });
  });
  
  // Check for plateaus
  Object.entries(exerciseHistory).forEach(([exerciseName, history]) => {
    if (history.length < 4) return; // Need at least 4 sessions
    
    const sorted = history.sort((a, b) => b.date - a.date);
    const recent = sorted.slice(0, 4);
    const weights = recent.map(h => h.maxWeight);
    
    // Check if weight has been the same for last 4 sessions
    const allSame = weights.every(w => Math.abs(w - weights[0]) < 2.5);
    const daysSinceFirst = (recent[0].date - recent[recent.length - 1].date) / (1000 * 60 * 60 * 24);
    
    if (allSame && daysSinceFirst >= 14) {
      insights.push({
        type: 'plateau',
        title: 'Plateau Detected',
        message: `${exerciseName} weight has stalled at ${weights[0]}kg for ${Math.round(daysSinceFirst)} days`,
        severity: 'warning',
        exercise: exerciseName
      });
    }
  });
  
  return insights;
}

// Detect fatigue risk based on volume and frequency
export function detectFatigue(workouts: Workout[]): TrainingInsight[] {
  const insights: TrainingInsight[] = [];
  const now = Date.now();
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  
  // Get workouts from last 7 days
  const recentWorkouts = workouts.filter(w => now - w.performedAt < oneWeek);
  
  // Check for overtraining
  if (recentWorkouts.length >= 6) {
    insights.push({
      type: 'fatigue',
      title: 'High Training Frequency',
      message: `${recentWorkouts.length} workouts in the last week. Consider a rest day for recovery.`,
      severity: 'warning'
    });
  }
  
  // Check for high volume
  const weeklyVolume = recentWorkouts.reduce((sum, w) => sum + w.totalVolume, 0);
  const avgVolume = workouts.length > 4 
    ? workouts.slice(0, 20).reduce((sum, w) => sum + w.totalVolume, 0) / Math.min(workouts.length, 20)
    : weeklyVolume / Math.max(recentWorkouts.length, 1);
  
  if (weeklyVolume > avgVolume * 1.5 && recentWorkouts.length >= 3) {
    insights.push({
      type: 'fatigue',
      title: 'Volume Spike',
      message: 'Weekly volume is 50% higher than your average. Watch for signs of fatigue.',
      severity: 'warning'
    });
  }
  
  return insights;
}

// Calculate muscle balance scores
export function calculateMuscleBalance(workouts: Workout[]): MuscleBalance[] {
  const now = Date.now();
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  const recentWorkouts = workouts.filter(w => now - w.performedAt < oneWeek);
  
  // Volume targets per muscle group (weekly sets)
  const targets: Record<string, number> = {
    'Chest': 12,
    'Back': 14,
    'Shoulders': 10,
    'Biceps': 8,
    'Triceps': 8,
    'Legs': 16,
    'Quads': 10,
    'Hamstrings': 8,
    'Glutes': 8,
    'Core': 6,
    'Abs': 6
  };
  
  // Map exercises to muscle groups
  const muscleMapping: Record<string, string> = {
    'Bench Press': 'Chest',
    'Incline Press': 'Chest',
    'Dumbbell Press': 'Chest',
    'Flyes': 'Chest',
    'Push-ups': 'Chest',
    'Deadlift': 'Back',
    'Barbell Row': 'Back',
    'Dumbbell Row': 'Back',
    'Pull-ups': 'Back',
    'Lat Pulldown': 'Back',
    'Seated Row': 'Back',
    'Overhead Press': 'Shoulders',
    'Military Press': 'Shoulders',
    'Lateral Raise': 'Shoulders',
    'Barbell Curl': 'Biceps',
    'Dumbbell Curl': 'Biceps',
    'Hammer Curl': 'Biceps',
    'Tricep Pushdown': 'Triceps',
    'Skull Crushers': 'Triceps',
    'Squat': 'Legs',
    'Leg Press': 'Legs',
    'Lunges': 'Legs',
    'Leg Curl': 'Hamstrings',
    'Romanian Deadlift': 'Hamstrings',
    'Hip Thrust': 'Glutes',
    'Plank': 'Core',
    'Crunches': 'Abs'
  };
  
  // Calculate weekly sets per muscle
  const weeklySets: Record<string, number> = {};
  
  recentWorkouts.forEach(workout => {
    workout.exercises.forEach(exercise => {
      const muscle = muscleMapping[exercise.name] || 'Other';
      if (!weeklySets[muscle]) weeklySets[muscle] = 0;
      weeklySets[muscle] += exercise.sets.length;
    });
  });
  
  // Generate balance scores
  return Object.entries(targets).map(([muscle, target]) => {
    const actual = weeklySets[muscle] || 0;
    const percentage = Math.round((actual / target) * 100);
    
    let status: 'undertrained' | 'optimal' | 'overtrained';
    if (percentage < 70) status = 'undertrained';
    else if (percentage > 130) status = 'overtrained';
    else status = 'optimal';
    
    return {
      muscleGroup: muscle,
      weeklyVolume: actual,
      targetVolume: target,
      status,
      percentage
    };
  });
}

// Classify training age based on workout history
export function classifyTrainingAge(workouts: Workout[]): { level: string; weeks: number; description: string } {
  if (workouts.length === 0) {
    return { level: 'Beginner', weeks: 0, description: 'Just getting started' };
  }
  
  const oldestWorkout = Math.min(...workouts.map(w => w.performedAt));
  const weeks = Math.floor((Date.now() - oldestWorkout) / (7 * 24 * 60 * 60 * 1000));
  
  if (weeks < 8 || workouts.length < 15) {
    return { level: 'Beginner', weeks, description: 'Building foundations' };
  } else if (weeks < 52 || workouts.length < 100) {
    return { level: 'Intermediate', weeks, description: 'Consistent progress' };
  } else {
    return { level: 'Advanced', weeks, description: 'Experienced lifter' };
  }
}

// Get all training insights
export function getAllInsights(workouts: Workout[]): TrainingInsight[] {
  const plateaus = detectPlateaus(workouts);
  const fatigue = detectFatigue(workouts);
  return [...plateaus, ...fatigue];
}
