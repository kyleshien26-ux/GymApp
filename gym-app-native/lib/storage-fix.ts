// Helper function to ensure boolean values are actual booleans
export function normalizeWorkout(workout: any) {
  return {
    ...workout,
    exercises: workout.exercises?.map((ex: any) => ({
      ...ex,
      sets: ex.sets?.map((set: any) => ({
        ...set,
        completed: set.completed === true || set.completed === 'true',
        reps: Number(set.reps),
        weight: Number(set.weight)
      }))
    }))
  };
}
