import { Workout } from '../types/workouts';

export const initialWorkouts: Workout[] = [
  {
    id: 'w-1',
    title: 'Push Day',
    performedAt: Date.now() - 86400000 * 2,
    startedAt: Date.now() - 86400000 * 2,
    durationMinutes: 65,
    totalSets: 12,
    totalVolume: 12500,
    exercises: [
      { id: 'ex-1', name: 'Bench Press', sets: [{ id: 's-1', weight: 185, reps: 8, completed: true }] },
      { id: 'ex-2', name: 'Overhead Press', sets: [{ id: 's-2', weight: 95, reps: 10, completed: true }] }
    ]
  },
  {
    id: 'w-2',
    title: 'Pull Day',
    performedAt: Date.now() - 86400000 * 5,
    startedAt: Date.now() - 86400000 * 5,
    durationMinutes: 55,
    totalSets: 15,
    totalVolume: 14200,
    exercises: [
      { id: 'ex-3', name: 'Deadlift', sets: [{ id: 's-3', weight: 315, reps: 5, completed: true }] }
    ]
  }
];