// In-memory storage system for GymApp
// TODO: Migrate to AsyncStorage for persistence

import { Workout, Exercise, PersonalRecord } from '../types/workout';

// In-memory storage
let workouts: Workout[] = [
  {
    id: '1',
    name: 'Push Day',
    date: new Date('2024-11-28'),
    exercises: [
      {
        id: '1',
        name: 'Bench Press',
        sets: [
          { reps: 10, weight: 135, completed: true },
          { reps: 8, weight: 145, completed: true },
          { reps: 6, weight: 155, completed: true }
        ]
      },
      {
        id: '2', 
        name: 'Shoulder Press',
        sets: [
          { reps: 12, weight: 65, completed: true },
          { reps: 10, weight: 70, completed: true }
        ]
      }
    ],
    totalVolume: 4380, // Calculated: (135*10 + 145*8 + 155*6) + (65*12 + 70*10)
    duration: 75
  },
  {
    id: '2',
    name: 'Pull Day', 
    date: new Date('2024-11-26'),
    exercises: [
      {
        id: '3',
        name: 'Deadlift',
        sets: [
          { reps: 5, weight: 225, completed: true },
          { reps: 5, weight: 245, completed: true },
          { reps: 3, weight: 265, completed: true }
        ]
      }
    ],
    totalVolume: 2265, // 225*5 + 245*5 + 265*3
    duration: 60
  },
  {
    id: '3',
    name: 'Leg Day',
    date: new Date('2024-11-21'),
    exercises: [
      {
        id: '4',
        name: 'Squat',
        sets: [
          { reps: 8, weight: 185, completed: true },
          { reps: 6, weight: 205, completed: true },
          { reps: 4, weight: 225, completed: true }
        ]
      }
    ],
    totalVolume: 4010, // 185*8 + 205*6 + 225*4
    duration: 90
  }
];

let personalRecords: PersonalRecord[] = [
  { exercise: 'Bench Press', weight: 155, reps: 6, date: new Date('2024-11-28') },
  { exercise: 'Deadlift', weight: 265, reps: 3, date: new Date('2024-11-26') },
  { exercise: 'Squat', weight: 225, reps: 4, date: new Date('2024-11-21') }
];

// Storage functions
export const getAllWorkouts = (): Workout[] => {
  return [...workouts].sort((a, b) => b.date.getTime() - a.date.getTime());
};

export const getAllRecords = (): PersonalRecord[] => {
  return [...personalRecords];
};

export const addWorkout = (workout: Omit<Workout, 'id'>): Workout => {
  const newWorkout: Workout = {
    ...workout,
    id: Date.now().toString()
  };
  workouts.push(newWorkout);
  return newWorkout;
};

export const getWorkoutsByDateRange = (startDate: Date, endDate: Date): Workout[] => {
  return workouts.filter(workout => 
    workout.date >= startDate && workout.date <= endDate
  );
};

export const calculateTotalVolume = (workouts: Workout[]): number => {
  return workouts.reduce((total, workout) => total + workout.totalVolume, 0);
};

export const getWorkoutStreak = (): number => {
  // Calculate current workout streak (placeholder logic)
  const sortedWorkouts = getAllWorkouts();
  let streak = 0;
  const today = new Date();
  
  for (const workout of sortedWorkouts) {
    const daysDiff = Math.floor((today.getTime() - workout.date.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff <= streak + 1) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

// Helper function to get date ranges for timeframe calculations
export const getDateRange = (timeframe: 'Weekly' | 'Monthly' | 'Yearly') => {
  const now = new Date();
  const current = new Date(now);
  const previous = new Date(now);
  
  switch (timeframe) {
    case 'Weekly':
      current.setDate(now.getDate() - 7);
      previous.setDate(now.getDate() - 14);
      break;
    case 'Monthly':
      current.setMonth(now.getMonth() - 1);
      previous.setMonth(now.getMonth() - 2);
      break;
    case 'Yearly':
      current.setFullYear(now.getFullYear() - 1);
      previous.setFullYear(now.getFullYear() - 2);
      break;
  }
  
  return {
    currentPeriodStart: current,
    currentPeriodEnd: now,
    previousPeriodStart: previous,
    previousPeriodEnd: current
  };
};
