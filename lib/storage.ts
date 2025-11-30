// Temporary in-memory storage until AsyncStorage is installed
// TODO: Replace with AsyncStorage for persistent data

import { Workout } from '../types/workout';

// In-memory storage (data will reset on app restart)
let workouts: Workout[] = [];
let records: Record<string, number> = {};

// Workout Storage
export async function getAllWorkouts(): Promise<Workout[]> {
  return Promise.resolve([...workouts]);
}

export async function saveWorkout(workout: Workout): Promise<void> {
  workouts.push(workout);
  
  // Update records for each exercise
  workout.exercises?.forEach(exercise => {
    exercise.sets?.forEach(set => {
      const oneRM = calculateOneRepMax(set.weight || 0, set.reps || 0);
      updatePersonalRecord(exercise.name, oneRM);
    });
  });
  
  return Promise.resolve();
}

export async function deleteWorkout(workoutId: string): Promise<void> {
  workouts = workouts.filter(w => w.id !== workoutId);
  return Promise.resolve();
}

export async function updateWorkout(workoutId: string, updatedWorkout: Workout): Promise<void> {
  workouts = workouts.map(w => 
    w.id === workoutId ? updatedWorkout : w
  );
  return Promise.resolve();
}

// Calculate 1RM using Epley formula
export function calculateOneRepMax(weight: number, reps: number): number {
  if (reps === 1) return weight;
  if (reps === 0) return 0;
  return Math.round(weight * (1 + reps / 30));
}

// Get personal records for an exercise
export async function getPersonalRecord(exerciseName: string): Promise<number> {
  return Promise.resolve(records[exerciseName] || 0);
}

// Update personal record if new max is higher
export async function updatePersonalRecord(exerciseName: string, newMax: number): Promise<void> {
  const currentMax = records[exerciseName] || 0;
  if (newMax > currentMax) {
    records[exerciseName] = newMax;
  }
  return Promise.resolve();
}

// Get all personal records
export async function getAllRecords(): Promise<Record<string, number>> {
  return Promise.resolve({ ...records });
}
