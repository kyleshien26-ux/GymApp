// Run this once to fix any corrupted boolean data in AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function migrateStorage() {
  try {
    const STORAGE_KEY = '@gymapp/workouts';
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    
    if (!data) return;
    
    const workouts = JSON.parse(data);
    
    // Fix any string booleans
    const fixed = workouts.map((workout: any) => ({
      ...workout,
      exercises: workout.exercises?.map((ex: any) => ({
        ...ex,
        sets: ex.sets?.map((set: any) => ({
          ...set,
          completed: set.completed === true || set.completed === 'true',
          weight: Number(set.weight),
          reps: Number(set.reps)
        }))
      }))
    }));
    
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(fixed));
    console.log('Storage migrated successfully');
  } catch (err) {
    console.error('Migration failed:', err);
  }
}
