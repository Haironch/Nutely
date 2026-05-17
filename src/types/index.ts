export type Sex = 'male' | 'female'

export type ActivityLevel =
  | 'sedentary'
  | 'light'
  | 'moderate'
  | 'active'
  | 'very_active'

export type Goal =
  | 'lose_fat'
  | 'gain_muscle'
  | 'recomposition'
  | 'maintenance'

export type BodyFatCategory =
  | 'essential'
  | 'athletic'
  | 'fitness'
  | 'average'
  | 'obese'

export interface UserData {
  age: number
  sex: Sex
  heightCm: number
  weightKg: number
  goalWeightKg: number
  activityLevel: ActivityLevel
  goal: Goal
  neckCm?: number
  waistCm?: number
  hipCm?: number
}

export interface NutritionResults {
  bmr: number
  tdee: number
  targetCalories: number
  deficitOrSurplus: number
  protein: number
  carbs: number
  fat: number
  idealWeightMin: number
  idealWeightMax: number
  bodyFatPercent: number | null
  bodyFatCategory: BodyFatCategory | null
  estimatedWeeks: number
  bmi: number
}
