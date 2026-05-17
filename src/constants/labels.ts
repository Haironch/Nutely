export const ACTIVITY_LABELS: Record<string, string> = {
  sedentary: 'Sedentario (sin ejercicio)',
  light: 'Ligero (1–3 días/semana)',
  moderate: 'Moderado (3–5 días/semana)',
  active: 'Activo (6–7 días/semana)',
  very_active: 'Muy activo (2x día o trabajo físico)',
}

export const GOAL_LABELS: Record<string, string> = {
  lose_fat: 'Perder grasa',
  gain_muscle: 'Ganar músculo',
  recomposition: 'Recomposición corporal',
  maintenance: 'Mantener peso',
}

export const BODY_FAT_LABELS: Record<string, { label: string; color: string }> = {
  essential: { label: 'Esencial', color: '#F59E0B' },
  athletic: { label: 'Atlético', color: '#10B981' },
  fitness: { label: 'Fitness', color: '#34D399' },
  average: { label: 'Promedio', color: '#F97316' },
  obese: { label: 'Alto % graso', color: '#EF4444' },
}

export const SUPPLEMENT_INFO = [
  {
    name: 'Proteína Whey',
    icon: '🥛',
    goals: ['lose_fat', 'gain_muscle', 'recomposition'],
    description: 'Ayuda a cubrir requerimientos proteicos diarios. Ideal post-entrenamiento.',
  },
  {
    name: 'Creatina',
    icon: '⚡',
    goals: ['gain_muscle', 'recomposition'],
    description: 'Mejora rendimiento en ejercicios de alta intensidad y favorece la ganancia muscular.',
  },
  {
    name: 'Omega 3',
    icon: '🐟',
    goals: ['lose_fat', 'gain_muscle', 'recomposition', 'maintenance'],
    description: 'Antiinflamatorio, apoya la salud cardiovascular y optimiza el entorno hormonal.',
  },
  {
    name: 'Magnesio',
    icon: '🌿',
    goals: ['lose_fat', 'gain_muscle', 'recomposition', 'maintenance'],
    description: 'Mejora calidad del sueño, función muscular y recuperación.',
  },
  {
    name: 'Electrolitos',
    icon: '💧',
    goals: ['lose_fat', 'recomposition'],
    description: 'Especialmente útil en déficit calórico para mantener rendimiento e hidratación.',
  },
  {
    name: 'Vitamina D3',
    icon: '☀️',
    goals: ['lose_fat', 'gain_muscle', 'recomposition', 'maintenance'],
    description: 'Apoya salud ósea, inmunológica y función hormonal. Muy común su deficiencia.',
  },
]
