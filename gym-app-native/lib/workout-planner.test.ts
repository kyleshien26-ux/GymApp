import { 
    generateAdvancedPlan, 
    getScientificSuggestion, 
    getRestTime, 
    shouldTriggerDeload 
  } from './workout-planner';
  import { Workout } from '../types/workouts';
  import { MuscleGroup } from '../constants/exercises';
  
  describe('Workout Engine Logic Verification', () => {
    
    // --- 1. DOUBLE PROGRESSION PARADIGM ---
    describe('Double Progression (getScientificSuggestion)', () => {
      const baseWorkout = (reps: number, weight: number): Workout => ({
        id: 'w1', title: 'Test', performedAt: Date.now(), startedAt: Date.now(), durationMinutes: 60, totalSets: 1, totalVolume: weight * reps,
        exercises: [{
          id: 'ex1', name: 'Barbell Flat Bench', muscleGroup: 'Chest', movementPlane: 'Horizontal Push',
          sets: [{ id: 's1', reps, weight, completed: true }]
        }]
      });
  
      it('Condition A: Adds reps if below max range', () => {
        // Range for Bench is 5-8. Hit 6 reps. Should suggest 7.
        const suggestion = getScientificSuggestion('Barbell Flat Bench', [baseWorkout(6, 100)], 'Hypertrophy');
        expect(suggestion.weight).toBe(100);
        expect(suggestion.reps).toBe(7);
      });
  
      it('Condition B: Adds weight and resets reps if hitting max range', () => {
        // Range 5-8. Hit 8 reps. Should suggest +2.5kg and 5 reps.
        const suggestion = getScientificSuggestion('Barbell Flat Bench', [baseWorkout(8, 100)], 'Hypertrophy');
        expect(suggestion.weight).toBe(102.5);
        expect(suggestion.reps).toBe(5);
      });
  
      it('Edge Case: Forces minimum reps if user fell short', () => {
        // Range 5-8. Hit 3 reps (failed). Should suggest staying at weight but aiming for 5.
        const suggestion = getScientificSuggestion('Barbell Flat Bench', [baseWorkout(3, 100)], 'Hypertrophy');
        expect(suggestion.weight).toBe(100);
        expect(suggestion.reps).toBe(5);
      });
    });
  
    // --- 2. AUTO-REGULATED DELOAD TRIGGERS ---
    describe('Auto-Regulated Deloads (shouldTriggerDeload)', () => {
      const createHistory = (weights: number[], reps: number[]): Workout[] => {
        return weights.map((w, i) => ({
          id: `w${i}`, title: 'Test', performedAt: Date.now() - (i * 86400000), startedAt: Date.now(), durationMinutes: 60, totalSets: 1, totalVolume: w * reps[i],
          exercises: [{
            id: 'ex1', name: 'Barbell Squat', muscleGroup: 'Legs', movementPlane: 'Knee Dominant',
            sets: [{ id: 's1', reps: reps[i], weight: w, completed: true }]
          }]
        }));
      };
  
      it('Detects a stall (E1RM flat or decreasing over 3 sessions)', () => {
        // Session 3 (Oldest): 100x5 (E1RM: 116.6)
        // Session 2: 100x5 (E1RM: 116.6)
        // Session 1 (Newest): 100x4 (E1RM: 113.3) -> Regression
        const workouts = createHistory([100, 100, 100], [4, 5, 5]); // Newest first
        expect(shouldTriggerDeload(workouts, 'Legs')).toBe(true);
      });
  
      it('Ignores normal progression', () => {
        // Session 3: 100x5
        // Session 2: 100x6
        // Session 1: 105x5
        const workouts = createHistory([105, 100, 100], [5, 6, 5]); // Newest first
        expect(shouldTriggerDeload(workouts, 'Legs')).toBe(false);
      });
    });
  
    // --- 3. SCIENTIFIC REST TIMER ---
    describe('Calibrated Rest Timer (getRestTime)', () => {
      it('Assigns 4 mins (240s) for heavy lower body compounds (Strength)', () => {
        expect(getRestTime('Barbell Squat', 'Strength')).toBe(240);
        expect(getRestTime('Deadlift', 'Strength')).toBe(240);
      });
  
      it('Assigns shorter rest for upper body isolation (Hypertrophy)', () => {
        expect(getRestTime('Dumbbell Curl', 'Hypertrophy')).toBe(90); // 1.5 mins
      });
  
      it('Assigns moderate rest for upper compounds (Hypertrophy)', () => {
        expect(getRestTime('Barbell Flat Bench', 'Hypertrophy')).toBe(120); // 2 mins
      });
    });
  
    // --- 4. MESOCYCLE & FRACTIONAL VOLUME & INJECTION ---
    describe('Advanced Plan Generation (generateAdvancedPlan)', () => {
      it('Ramps volume from Week 1 to Week 4 (Mesocycle Scaling)', () => {
        const optW1: any = { daysPerWeek: 4, weakPoints: [], goal: 'Hypertrophy', legPreference: 'Normal', experience: 'Intermediate', mesocycleWeek: 1 };
        const optW4: any = { daysPerWeek: 4, weakPoints: [], goal: 'Hypertrophy', legPreference: 'Normal', experience: 'Intermediate', mesocycleWeek: 4 };
        
        const planW1 = generateAdvancedPlan([], optW1);
        const planW4 = generateAdvancedPlan([], optW4);
        
        // Count total sets in the week
        const countSets = (plan: any) => plan.routines.reduce((acc: number, r: any) => acc + r.exercises.reduce((sAcc: number, ex: any) => sAcc + ex.sets, 0), 0);
        
        const setsW1 = countSets(planW1);
        const setsW4 = countSets(planW4);
        
        // Week 4 should have significantly more sets than Week 1
        expect(setsW4).toBeGreaterThan(setsW1);
      });
  
      it('Injects isolation exercises for Weak Points (Dynamic Slot Allocation)', () => {
        // 3 Day full body naturally struggles to hit 16 sets (MAV) for a specific weak point like Biceps
        // The injection logic should step in and add curls to a day.
        const options: any = { daysPerWeek: 3, weakPoints: ['Biceps'], goal: 'Hypertrophy', legPreference: 'Normal', experience: 'Intermediate', mesocycleWeek: 4 };
        const plan = generateAdvancedPlan([], options);
        
        // Check if a bonus isolation exercise was added for Biceps
        let hasBonusBicep = false;
        plan.routines.forEach(r => {
          r.exercises.forEach(ex => {
            if (ex.muscleGroup === 'Biceps' && ex.note === 'Bonus Isolation for Weak Point') {
              hasBonusBicep = true;
            }
          });
        });
        
        expect(hasBonusBicep).toBe(true);
      });
    });
  });