import { Workout, ExerciseEntry } from '../types/workouts';
import { exerciseDatabase, Exercise, MovementPlane, MuscleGroup, FatigueCost, JointStress } from '../constants/exercises';

export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type MaintenancePreference = 'Growth' | 'Maintenance';
export type EquipmentProfile = 'Full Gym' | 'Dumbbell Only' | 'Home Gym';

interface PlanningOptions {
  daysPerWeek: number;
  weakPoints: MuscleGroup[];
  goal: 'Strength' | 'Hypertrophy';
  legPreference: 'Normal' | 'Minimum' | 'None';
  experience: ExperienceLevel;
  maintenancePreference?: MaintenancePreference;
  equipmentProfile?: EquipmentProfile;
  mesocycleWeek?: number; // 1-5
}

// --- CONSTANTS ---
const MAV = 16; 
const MEV = 10; 
const MV = 6;   
const ZERO = 0; 

export function shouldTriggerDeload(workouts: Workout[], muscle: MuscleGroup): boolean {
  // Sort workouts newest first without mutating original array
  const sortedWorkouts = [...workouts].sort((a, b) => b.performedAt - a.performedAt);
  const history: number[] = [];

  // Find last 3 compound sessions for this muscle
  for (const w of sortedWorkouts) {
    const compoundEx = w.exercises.find(ex => {
      const dbEx = exerciseDatabase.find(db => db.name === ex.name);
      return dbEx && dbEx.muscleGroup === muscle && dbEx.type === 'Compound';
    });

    if (compoundEx && Array.isArray(compoundEx.sets) && compoundEx.sets.length > 0) {
      // Calculate Peak E1RM for this session
      const peakE1RM = Math.max(...compoundEx.sets.map(s => s.weight * (1 + s.reps / 30)));
      history.push(peakE1RM);
    }

    if (history.length >= 3) break;
  }

  // Need at least 3 sessions to detect a 2-session stall trend
  if (history.length < 3) return false;

  // Check for stall: Newest (0) <= Middle (1) AND Middle (1) <= Oldest (2)
  const isStalled = history[0] <= history[1] && history[1] <= history[2];
  
  return isStalled;
}

function getTargetSets(muscle: MuscleGroup, options: PlanningOptions, workouts: Workout[]): number {
  const { weakPoints, legPreference, maintenancePreference, mesocycleWeek = 1 } = options;
  
  // 1. Hard Constraints
  if ((muscle === 'Legs' || muscle === 'Calves') && legPreference === 'None') return ZERO;
  if ((muscle === 'Legs' || muscle === 'Calves') && legPreference === 'Minimum') return MV;
  
  // 2. Deload Week (Week 5)
  if (mesocycleWeek === 5) return MV;

  // 3. Auto-Regulated Deload (Performance Stall)
  if (shouldTriggerDeload(workouts, muscle)) return MV; 

  // 4. Maintenance Mode
  if (maintenancePreference === 'Maintenance' && !weakPoints.includes(muscle)) return MV;

  // 5. Periodization Scaling (Weeks 1-4)
  const ramp = Math.floor(MEV + ((MAV - MEV) / 3) * (mesocycleWeek - 1));
  
  if (weakPoints.includes(muscle)) {
      return Math.min(MAV, ramp + 2); 
  }
  
  return ramp;
}

// Helper for Fractional Volume
function getSecondaryVolume(plane: MovementPlane, muscle: MuscleGroup): number {
    if (muscle === 'Triceps' && (plane === 'Horizontal Push' || plane === 'Vertical Push' || plane === 'Incline Push')) return 0.5;
    if (muscle === 'Shoulders' && (plane === 'Horizontal Push' || plane === 'Incline Push')) return 0.5; // Front Delt
    if (muscle === 'Biceps' && (plane === 'Vertical Pull' || plane === 'Horizontal Pull')) return 0.5;
    if (muscle === 'Back' && plane === 'Hip Hinge') return 0.5; // Lower back in deadlifts
    return 0;
}

export function generateAdvancedPlan(workouts: Workout[], options: PlanningOptions) {
  const { daysPerWeek, legPreference, goal, weakPoints, equipmentProfile = 'Full Gym', mesocycleWeek = 1 } = options;
  
  let splitStructure: { name: string; planes: MovementPlane[] }[] = [];
  let splitBaseName = '';

  const pushPlanes: MovementPlane[] = ['Horizontal Push', 'Vertical Push', 'Incline Push', 'Lateral Raise', 'Elbow Extension'];
  const pullPlanes: MovementPlane[] = ['Vertical Pull', 'Horizontal Pull', 'Rear Delt Fly', 'Elbow Flexion', 'Core Flexion'];
  const legPlanes: MovementPlane[] = ['Knee Dominant', 'Hip Hinge', 'Knee Isolation', 'Calves']; 

  // --- SPLIT LOGIC ---
  if (daysPerWeek === 3) {
    if (legPreference === 'None') {
      splitBaseName = 'Push / Pull / Upper';
      splitStructure = [
        { name: 'Push Focus', planes: ['Horizontal Push', 'Vertical Push', 'Elbow Extension', 'Lateral Raise'] },
        { name: 'Pull Focus', planes: ['Vertical Pull', 'Horizontal Pull', 'Elbow Flexion', 'Rear Delt Fly'] },
        { name: 'Upper Hybrid', planes: ['Incline Push', 'Horizontal Pull', 'Lateral Raise', 'Elbow Extension', 'Elbow Flexion'] }
      ];
    } else {
      splitBaseName = 'Full Body';
      const fbPlanes: MovementPlane[] = ['Knee Dominant', 'Horizontal Push', 'Vertical Pull', 'Hip Hinge', 'Lateral Raise'];
      splitStructure = [
        { name: 'Full Body A', planes: fbPlanes },
        { name: 'Full Body B', planes: ['Hip Hinge', 'Vertical Push', 'Horizontal Pull', 'Knee Dominant', 'Elbow Flexion'] },
        { name: 'Full Body C', planes: fbPlanes }
      ];
    }
  } else if (daysPerWeek === 4) {
    if (legPreference === 'None') {
      splitBaseName = 'Push / Pull x2';
      splitStructure = [
        { name: 'Push A', planes: pushPlanes },
        { name: 'Pull A', planes: pullPlanes },
        { name: 'Push B', planes: ['Incline Push', 'Horizontal Push', 'Lateral Raise', 'Elbow Extension', 'Elbow Extension'] }, 
        { name: 'Pull B', planes: ['Horizontal Pull', 'Vertical Pull', 'Rear Delt Fly', 'Elbow Flexion', 'Elbow Flexion'] }
      ];
    }
    else {
      splitBaseName = 'Upper / Lower';
      splitStructure = [
        { name: 'Upper A', planes: [...pushPlanes, ...pullPlanes].slice(0, 6) },
        { name: 'Lower A', planes: legPlanes },
        { name: 'Upper B', planes: [...pushPlanes, ...pullPlanes].slice(0, 6).reverse() }, 
        { name: 'Lower B', planes: legPlanes }
      ];
    }
  } else if (daysPerWeek === 5) {
    if (legPreference === 'None') {
      splitBaseName = 'Bro Split (Upper Focus)';
      splitStructure = [
        { name: 'Chest & Tris', planes: ['Horizontal Push', 'Incline Push', 'Elbow Extension', 'Elbow Extension'] },
        { name: 'Back & Biceps', planes: ['Vertical Pull', 'Horizontal Pull', 'Elbow Flexion', 'Elbow Flexion'] },
        { name: 'Shoulders', planes: ['Vertical Push', 'Lateral Raise', 'Rear Delt Fly', 'Lateral Raise'] },
        { name: 'Arms', planes: ['Elbow Flexion', 'Elbow Extension', 'Elbow Flexion', 'Elbow Extension'] },
        { name: 'Upper Pump', planes: ['Horizontal Push', 'Vertical Pull', 'Lateral Raise', 'Elbow Flexion'] }
      ];
    } else {
      splitBaseName = 'Upper/Lower + PPL';
      splitStructure = [
        { name: 'Upper', planes: [...pushPlanes, ...pullPlanes].slice(0, 6) },
        { name: 'Lower', planes: legPlanes },
        { name: 'Push', planes: pushPlanes },
        { name: 'Pull', planes: pullPlanes },
        { name: 'Legs', planes: legPlanes }
      ];
    }
  } else {
    splitBaseName = 'PPL x2';
    const ppl = [
        { name: 'Push', planes: pushPlanes },
        { name: 'Pull', planes: pullPlanes },
        { name: 'Legs', planes: legPlanes }
    ];
    if (legPreference === 'None') {
        splitStructure = [
            { name: 'Push A', planes: pushPlanes }, { name: 'Pull A', planes: pullPlanes },
            { name: 'Push B', planes: pushPlanes }, { name: 'Pull B', planes: pullPlanes },
            { name: 'Push C', planes: pushPlanes }, { name: 'Pull C', planes: pullPlanes }
        ];
    } else {
        splitStructure = [...ppl, ...ppl];
    }
  }

  const globalHistory = new Set<string>(); 
  const weeklyMuscleSets = new Map<MuscleGroup, number>();
  
  // Track all muscles to detect deficits later
  const allMuscles: MuscleGroup[] = ['Chest', 'Back', 'Legs', 'Shoulders', 'Biceps', 'Triceps', 'Abs', 'Calves'];
  allMuscles.forEach(m => weeklyMuscleSets.set(m, 0));

  const routines = splitStructure.map((day, dayIndex) => {
    const dayExercises: ExerciseEntry[] = [];
    let dailyFatigue = 0;
    const dailyJointStress = new Map<MuscleGroup, boolean>();

    for (const plane of day.planes) {
      let candidates = exerciseDatabase.filter(e => {
        if (e.movementPlane !== plane) return false;
        if (equipmentProfile === 'Dumbbell Only' && (e.equipment === 'Barbell' || e.equipment === 'Machine' || e.equipment === 'Cable')) return false;
        if (equipmentProfile === 'Home Gym' && e.equipment === 'Machine') return false;
        if (e.fatigueCost === 'High' && dailyFatigue >= 3) return false;
        if (e.jointStress === 'High' && dailyJointStress.get(e.muscleGroup)) return false;
        return true;
      });

      if (candidates.length === 0) {
          // Fallback: Relax constraints
          candidates = exerciseDatabase.filter(e => {
              if (e.movementPlane !== plane) return false;
              if (equipmentProfile === 'Dumbbell Only' && e.equipment === 'Machine') return false;
              if (equipmentProfile === 'Home Gym' && e.equipment === 'Machine') return false;
              return true;
          });
      }

      candidates.sort((a, b) => {
        const aWeak = weakPoints.includes(a.muscleGroup);
        const bWeak = weakPoints.includes(b.muscleGroup);
        if (aWeak && !bWeak) return -1;
        if (!aWeak && bWeak) return 1;

        const aUsed = globalHistory.has(a.id);
        const bUsed = globalHistory.has(b.id);
        if (!aUsed && bUsed) return -1;
        if (aUsed && !bUsed) return 1;

        return 0;
      });

      const selected = candidates[0];
      if (!selected) continue;

      globalHistory.add(selected.id);
      if (selected.fatigueCost === 'High') dailyFatigue++;
      if (selected.jointStress === 'High') dailyJointStress.set(selected.muscleGroup, true);

      const targetWeekly = getTargetSets(selected.muscleGroup, options, workouts);
      const currentWeekly = weeklyMuscleSets.get(selected.muscleGroup) || 0;
      
      let sets = 2; // Default to 2 sets (maintenance/back-off level) if they are at or over target cap
      
      if (mesocycleWeek === 5) {
          sets = 2; // Deload strictly caps at 2
      } else if (currentWeekly < targetWeekly) {
          if (goal === 'Strength' && selected.type === 'Compound') {
              sets = 4;
              if (currentWeekly < targetWeekly + 2) sets = 5; // Heavy volume push for strength
          } else {
              // Hypertrophy & Isolation
              sets = selected.type === 'Compound' ? 3 : 2; 
              if (weakPoints.includes(selected.muscleGroup)) sets += 1; // Cap at 3-4 for hypertrophy
          }
      }

      // Fractional Volume Tracking
      weeklyMuscleSets.set(selected.muscleGroup, (weeklyMuscleSets.get(selected.muscleGroup) || 0) + sets);
      
      // Credit secondary muscles
      allMuscles.forEach(m => {
          if (m !== selected.muscleGroup) {
              const credit = getSecondaryVolume(selected.movementPlane, m);
              if (credit > 0) {
                  weeklyMuscleSets.set(m, (weeklyMuscleSets.get(m) || 0) + (sets * credit));
              }
          }
      });

      let reps = selected.targetReps;
      if (goal === 'Strength' && selected.type === 'Compound') reps = '3-5';
      if (mesocycleWeek === 5) reps = 'Deload'; // Generic deload marker, user should go easy

      dayExercises.push({
        id: selected.id,
        name: selected.name,
        muscleGroup: selected.muscleGroup,
        movementPlane: selected.movementPlane,
        sets: sets,
        reps: reps,
        note: `Target: ${selected.target}`,
        suggestedWeight: 0
      });
    }

    return { name: `Day ${dayIndex + 1}: ${day.name}`, exercises: dayExercises, dailyFatigue };
  }).filter(r => r.exercises.length > 0);

  // --- 3. Dynamic Slot Injection (Volume Deficit Fix) ---
  if (mesocycleWeek < 5) { 
      weakPoints.forEach(muscle => {
          const current = weeklyMuscleSets.get(muscle) || 0;
          const target = getTargetSets(muscle, options, workouts);
          const deficit = target - current;

          if (deficit >= 3) {
              const targetDay = routines.reduce((min, curr) => 
                  curr.dailyFatigue < min.dailyFatigue ? curr : min
              , routines[0]);
              
              if (targetDay) {
                  const isoCandidates = exerciseDatabase.filter(e => 
                      e.muscleGroup === muscle && 
                      e.type === 'Isolation' &&
                      !targetDay.exercises.find(ex => ex.name === e.name) 
                  );
                  
                  if (isoCandidates.length > 0) {
                      const selected = isoCandidates[0];
                      targetDay.exercises.push({
                          id: selected.id,
                          name: selected.name,
                          muscleGroup: selected.muscleGroup,
                          movementPlane: selected.movementPlane,
                          sets: 3,
                          reps: '12-15',
                          note: 'Bonus Isolation for Weak Point',
                          suggestedWeight: 0
                      });
                      targetDay.dailyFatigue += 1; 
                  }
              }
          }
      });
  }

  const focusLabel = weakPoints.length > 0 ? ` (${weakPoints[0]} Focus)` : '';
  const finalSplitName = `${daysPerWeek} Day ${splitBaseName}${focusLabel} - Week ${mesocycleWeek}`;

  let scheduleAdvice = `Mesocycle Week ${mesocycleWeek}: `;
  if (mesocycleWeek === 1) scheduleAdvice += "Introduction. Focus on form, stop 3 reps shy of failure (3 RIR).";
  else if (mesocycleWeek === 4) scheduleAdvice += "Overreaching. Push hard! 0-1 RIR.";
  else if (mesocycleWeek === 5) scheduleAdvice += "Deload. Reduce weight by 50% or skip sets.";
  else scheduleAdvice += "Accumulation. Add weight or reps. 2 RIR.";

  return { 
    splitName: finalSplitName, 
    routines: routines.map(r => ({ name: r.name, exercises: r.exercises })), // Strip fatigue helper
    scheduleAdvice
  };
}

export function getScientificSuggestion(exerciseName: string, workouts: Workout[], goal: 'Strength' | 'Hypertrophy' | 'Endurance') {
    const exercise = exerciseDatabase.find(e => e.name === exerciseName);
    if (!exercise) return { weight: 0, reps: 10, reason: 'New', confidence: 0 };

    const sortedWorkouts = [...workouts].sort((a, b) => b.performedAt - a.performedAt);

    let lastPerf = null;
    for (const w of sortedWorkouts) {
        const found = w.exercises.find(ex => ex.name === exerciseName);
        if (found && Array.isArray(found.sets) && found.sets.length > 0) {
            // Find Peak set by E1RM
            const peakSet = [...found.sets].sort((a, b) => {
                const e1rmA = a.weight * (1 + a.reps / 30);
                const e1rmB = b.weight * (1 + b.reps / 30);
                return e1rmB - e1rmA;
            })[0];
            
            lastPerf = { weight: peakSet.weight, reps: peakSet.reps, date: w.performedAt };
            break; 
        }
    }

    if (!lastPerf) return { weight: 0, reps: 10, reason: 'Log a workout to unlock suggestions.', confidence: 0 };

    let minReps = 8;
    let maxReps = 12;
    
    if (exercise.targetReps.includes('-')) {
        const parts = exercise.targetReps.split('-');
        minReps = parseInt(parts[0]);
        maxReps = parseInt(parts[1]);
    } else if (goal === 'Strength') {
        minReps = 3; maxReps = 5;
    }

    // Condition B: Add Weight
    if (lastPerf.reps >= maxReps) {
        const increment = goal === 'Strength' ? 1.25 : 2.5; // Micro-loading for strength
        return { 
            weight: lastPerf.weight + increment, 
            reps: minReps, 
            reason: `Hit top of rep range (${maxReps}). Increasing weight!`,
            confidence: 90
        };
    } 
    // Condition A: Add Reps
    else {
        const targetReps = lastPerf.reps < minReps ? minReps : lastPerf.reps + 1;
        return {
            weight: lastPerf.weight,
            reps: targetReps,
            reason: lastPerf.reps < minReps 
                ? `Fell short last time. Try to hit the minimum of ${minReps} reps.`
                : `Stay at ${lastPerf.weight}kg. Aim for ${targetReps} reps.`,
            confidence: 85
        };
    }
}

export function getRestTime(exerciseName: string, goal: 'Strength' | 'Hypertrophy' | 'Endurance'): number {
  const exercise = exerciseDatabase.find(e => e.name === exerciseName);
  if (!exercise) return 90; 

  const isCompound = exercise.type === 'Compound';
  const isLowerBody = ['Knee Dominant', 'Hip Hinge', 'Calves', 'Knee Isolation'].includes(exercise.movementPlane);

  if (goal === 'Strength') {
    if (isCompound && isLowerBody) return 240; 
    if (isCompound) return 180; 
    return 120;
  } else if (goal === 'Hypertrophy') {
    if (isCompound && isLowerBody) return 180; 
    if (isCompound) return 120; 
    return 90; 
  } else {
    return 60;
  }
}

export function calculateStreak(workouts: Workout[]) {
  if (!workouts.length) return 0;
  const uniqueDates = Array.from(new Set(workouts.map(w => new Date(w.performedAt).setHours(0,0,0,0))));
  uniqueDates.sort((a, b) => b - a);

  const today = new Date().setHours(0,0,0,0);
  const yesterday = today - 86400000;
  
  if (uniqueDates[0] < yesterday) return 0; 

  let streak = 1;
  for (let i = 0; i < uniqueDates.length - 1; i++) {
      const curr = uniqueDates[i];
      const prev = uniqueDates[i+1];
      if (curr - prev === 86400000) streak++;
      else break;
  }
  return streak;
}

export function getStats(workouts: Workout[]) {
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const weekly = workouts.filter((w) => w.performedAt >= weekAgo);
  return {
    weeklyWorkouts: weekly.length,
    weeklyVolume: weekly.reduce((acc, w) => acc + w.totalVolume, 0),
    totalWorkouts: workouts.length,
    totalVolume: workouts.reduce((a, w) => a + w.totalVolume, 0),
    streak: calculateStreak(workouts),
  };
}

export function getRecentWorkouts(workouts: Workout[], limit = 3) {
  return [...workouts].sort((a, b) => b.performedAt - a.performedAt).slice(0, limit);
}

export function formatDateLabel(ts: number) {
  return new Date(ts).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

export function formatDuration(min: number) {
  return `${Math.floor(min/60)}h ${min%60}m`;
}