import { UserProfile } from '../providers/SettingsProvider';

export interface NutritionPlan {
  tdee: number;
  targetCalories: number;
  macros: {
    protein: number;
    fats: number;
    carbs: number;
  };
}

export function calculateNutrition(profile: UserProfile): NutritionPlan {
  const { gender, age, height, currentWeight, activityLevel, nutritionGoal } = profile;

  // 1. Calculate BMR (Mifflin-St Jeor)
  let bmr = (10 * currentWeight) + (6.25 * height) - (5 * age);
  if (gender === 'Male') {
    bmr += 5;
  } else {
    bmr -= 161;
  }

  // 2. Calculate TDEE with Activity Multiplier
  let multiplier = 1.2;
  switch (activityLevel) {
    case 'Sedentary': multiplier = 1.2; break;
    case 'Light': multiplier = 1.375; break;
    case 'Moderate': multiplier = 1.55; break;
    case 'Active': multiplier = 1.725; break;
    case 'Very Active': multiplier = 1.9; break;
  }

  const tdee = Math.round(bmr * multiplier);

  // 3. Adjust for Goal
  let targetCalories = tdee;
  if (nutritionGoal === 'Cut') {
    targetCalories -= 500;
  } else if (nutritionGoal === 'Bulk') {
    targetCalories += 300;
  }
  // Recomp uses maintenance (tdee)

  // 4. Calculate Macros
  // Protein: 2.0g per kg
  const protein = Math.round(currentWeight * 2.0);
  
  // Fats: 0.8g per kg
  const fats = Math.round(currentWeight * 0.8);

  // Carbs: Remaining calories
  // Protein = 4 cal/g, Fat = 9 cal/g
  const caloriesUsed = (protein * 4) + (fats * 9);
  const remainingCalories = targetCalories - caloriesUsed;
  const carbs = Math.max(0, Math.round(remainingCalories / 4));

  return {
    tdee,
    targetCalories,
    macros: {
      protein,
      fats,
      carbs
    }
  };
}
