import type { UserData, NutritionResults, BodyFatCategory, Sex } from '@/types'

const ACTIVITY_MULTIPLIERS: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
}

// Mifflin-St Jeor
function calcBMR(data: UserData): number {
  const { weightKg, heightCm, age, sex } = data
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age
  return sex === 'male' ? base + 5 : base - 161
}

// US Navy body fat formula
function calcBodyFat(data: UserData): number | null {
  const { heightCm, sex, neckCm, waistCm, hipCm } = data
  if (!neckCm || !waistCm) return null
  if (sex === 'male') {
    return (
      495 /
        (1.0324 -
          0.19077 * Math.log10(waistCm - neckCm) +
          0.15456 * Math.log10(heightCm)) -
      450
    )
  }
  if (!hipCm) return null
  return (
    495 /
      (1.29579 -
        0.35004 * Math.log10(waistCm + hipCm - neckCm) +
        0.221 * Math.log10(heightCm)) -
    450
  )
}

function classifyBodyFat(percent: number, sex: Sex): BodyFatCategory {
  if (sex === 'male') {
    if (percent < 6) return 'essential'
    if (percent < 14) return 'athletic'
    if (percent < 18) return 'fitness'
    if (percent < 25) return 'average'
    return 'obese'
  }
  if (percent < 14) return 'essential'
  if (percent < 21) return 'athletic'
  if (percent < 25) return 'fitness'
  if (percent < 32) return 'average'
  return 'obese'
}

function calcIdealWeight(heightCm: number, sex: Sex): [number, number] {
  // Devine formula base + Hammond range
  const heightIn = heightCm / 2.54
  const base = sex === 'male' ? 50 + 2.3 * (heightIn - 60) : 45.5 + 2.3 * (heightIn - 60)
  return [Math.round((base - 3) * 10) / 10, Math.round((base + 3) * 10) / 10]
}

export function calculate(data: UserData): NutritionResults {
  const bmr = Math.round(calcBMR(data))
  const tdee = Math.round(bmr * ACTIVITY_MULTIPLIERS[data.activityLevel])

  let targetCalories: number
  switch (data.goal) {
    case 'lose_fat':
      targetCalories = Math.round(tdee * 0.8)
      break
    case 'gain_muscle':
      targetCalories = Math.round(tdee * 1.1)
      break
    case 'recomposition':
      targetCalories = tdee
      break
    default:
      targetCalories = tdee
  }

  const deficitOrSurplus = targetCalories - tdee

  // Macros
  const protein = Math.round(data.weightKg * (data.goal === 'gain_muscle' ? 2.2 : 2.0))
  const fat = Math.round((targetCalories * 0.25) / 9)
  const carbs = Math.round((targetCalories - protein * 4 - fat * 9) / 4)

  // Ideal weight
  const [idealWeightMin, idealWeightMax] = calcIdealWeight(data.heightCm, data.sex)

  // BMI
  const heightM = data.heightCm / 100
  const bmi = Math.round((data.weightKg / (heightM * heightM)) * 10) / 10

  // Body fat
  const rawBF = calcBodyFat(data)
  const bodyFatPercent = rawBF !== null ? Math.round(rawBF * 10) / 10 : null
  const bodyFatCategory =
    bodyFatPercent !== null ? classifyBodyFat(bodyFatPercent, data.sex) : null

  // Estimated weeks (0.5kg/week realistic pace)
  const diff = Math.abs(data.weightKg - data.goalWeightKg)
  const estimatedWeeks = Math.ceil(diff / 0.5)

  return {
    bmr,
    tdee,
    targetCalories,
    deficitOrSurplus,
    protein,
    carbs,
    fat,
    idealWeightMin,
    idealWeightMax,
    bodyFatPercent,
    bodyFatCategory,
    estimatedWeeks,
    bmi,
  }
}
