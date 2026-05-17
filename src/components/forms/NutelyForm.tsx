import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ChevronRight, ChevronLeft, User, Activity, Target, Ruler } from 'lucide-react'
import { useNutelyStore } from '@/store/useNutelyStore'
import { calculate } from '@/utils/calculations'
import type { UserData } from '@/types'
import { ACTIVITY_LABELS, GOAL_LABELS } from '@/constants/labels'
import { cn } from '@/lib/utils'

const schema = z.object({
  age: z.number({ message: 'Requerido' }).min(13).max(100),
  sex: z.enum(['male', 'female']),
  heightCm: z.number({ message: 'Requerido' }).min(100).max(250),
  weightKg: z.number({ message: 'Requerido' }).min(30).max(300),
  goalWeightKg: z.number({ message: 'Requerido' }).min(30).max(300),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'very_active']),
  goal: z.enum(['lose_fat', 'gain_muscle', 'recomposition', 'maintenance']),
  neckCm: z.number().min(20).max(80).optional(),
  waistCm: z.number().min(40).max(200).optional(),
  hipCm: z.number().min(50).max(200).optional(),
})

type FormData = z.infer<typeof schema>

const STEPS = [
  { id: 0, title: 'Datos personales', icon: User, description: 'Básicos sobre ti' },
  { id: 1, title: 'Actividad y meta', icon: Activity, description: 'Tu estilo de vida' },
  { id: 2, title: 'Tu objetivo', icon: Target, description: 'Adónde quieres llegar' },
  { id: 3, title: 'Medidas (opcional)', icon: Ruler, description: 'Para más precisión' },
]

export function NutelyForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const { setUserData, setResults, setStep } = useNutelyStore()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      sex: 'male',
      activityLevel: 'moderate',
      goal: 'lose_fat',
    },
  })

  const watchSex = watch('sex')
  const watchActivity = watch('activityLevel')
  const watchGoal = watch('goal')

  const nextStep = async () => {
    const fieldsPerStep: (keyof FormData)[][] = [
      ['age', 'sex', 'heightCm', 'weightKg'],
      ['activityLevel'],
      ['goal', 'goalWeightKg'],
      [],
    ]
    const valid = await trigger(fieldsPerStep[currentStep])
    if (valid) setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1))
  }

  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 0))

  const onSubmit = (data: FormData) => {
    const userData: UserData = {
      ...data,
      neckCm: data.neckCm || undefined,
      waistCm: data.waistCm || undefined,
      hipCm: data.hipCm || undefined,
    }
    const results = calculate(userData)
    setUserData(userData)
    setResults(results)
    setStep('results')
  }

  return (
    <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-20 sm:py-24">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h2 className="font-display text-3xl font-bold mb-2">Tu análisis personalizado</h2>
          <p className="text-gray-500 text-sm">
            Paso {currentStep + 1} de {STEPS.length}
          </p>
        </motion.div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {STEPS.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={step.id} className="flex items-center gap-2">
                <div
                  className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300',
                    i === currentStep
                      ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                      : i < currentStep
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-white/5 text-gray-600'
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={cn(
                      'h-0.5 w-8 transition-all duration-300',
                      i < currentStep ? 'bg-emerald-500/50' : 'bg-white/10'
                    )}
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* Card */}
        <div className="rounded-2xl sm:rounded-3xl border border-white/8 bg-surface p-5 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <h3 className="font-display text-xl font-semibold mb-1">
                {STEPS[currentStep].title}
              </h3>
              <p className="text-gray-500 text-sm mb-8">{STEPS[currentStep].description}</p>

              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Step 0 — Personal data */}
                {currentStep === 0 && (
                  <div className="space-y-5">
                    {/* Sex */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Sexo biológico</label>
                      <div className="grid grid-cols-2 gap-3">
                        {(['male', 'female'] as const).map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setValue('sex', s)}
                            className={cn(
                              'py-3 rounded-xl border text-sm font-medium transition-all',
                              watchSex === s
                                ? 'border-emerald-500 bg-emerald-500/15 text-emerald-400'
                                : 'border-white/10 bg-white/3 text-gray-400 hover:border-white/20'
                            )}
                          >
                            {s === 'male' ? '♂ Masculino' : '♀ Femenino'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Age */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Edad</label>
                      <input
                        {...register('age', { valueAsNumber: true })}
                        type="number"
                        placeholder="25"
                        className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
                      />
                      {errors.age && <p className="text-red-400 text-xs mt-1">{errors.age.message}</p>}
                    </div>

                    {/* Height & Weight */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Altura (cm)</label>
                        <input
                          {...register('heightCm', { valueAsNumber: true })}
                          type="number"
                          placeholder="175"
                          className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
                        />
                        {errors.heightCm && (
                          <p className="text-red-400 text-xs mt-1">{errors.heightCm.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Peso actual (kg)</label>
                        <input
                          {...register('weightKg', { valueAsNumber: true })}
                          type="number"
                          placeholder="80"
                          className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
                        />
                        {errors.weightKg && (
                          <p className="text-red-400 text-xs mt-1">{errors.weightKg.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 1 — Activity */}
                {currentStep === 1 && (
                  <div className="space-y-3">
                    {Object.entries(ACTIVITY_LABELS).map(([key, label]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setValue('activityLevel', key as UserData['activityLevel'])}
                        className={cn(
                          'w-full px-4 py-4 rounded-xl border text-left text-sm transition-all',
                          watchActivity === key
                            ? 'border-emerald-500 bg-emerald-500/15 text-white'
                            : 'border-white/10 bg-white/3 text-gray-400 hover:border-white/20'
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Step 2 — Goal */}
                {currentStep === 2 && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(GOAL_LABELS).map(([key, label]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setValue('goal', key as UserData['goal'])}
                          className={cn(
                            'py-4 px-3 rounded-xl border text-sm font-medium transition-all text-center',
                            watchGoal === key
                              ? 'border-emerald-500 bg-emerald-500/15 text-emerald-400'
                              : 'border-white/10 bg-white/3 text-gray-400 hover:border-white/20'
                          )}
                        >
                          {label}
                        </button>
                      ))}
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Peso meta (kg)</label>
                      <input
                        {...register('goalWeightKg', { valueAsNumber: true })}
                        type="number"
                        placeholder="72"
                        className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
                      />
                      {errors.goalWeightKg && (
                        <p className="text-red-400 text-xs mt-1">{errors.goalWeightKg.message}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 3 — Measurements */}
                {currentStep === 3 && (
                  <div className="space-y-5">
                    <div className="p-4 rounded-xl bg-emerald-500/8 border border-emerald-500/20 text-sm text-emerald-300">
                      Estas medidas permiten estimar tu % de grasa con mayor precisión. Son opcionales.
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                      {[
                        { key: 'neckCm', label: 'Cuello (cm)', placeholder: '38' },
                        { key: 'waistCm', label: 'Cintura (cm)', placeholder: '85' },
                        { key: 'hipCm', label: 'Cadera (cm)', placeholder: '95', femaleOnly: true },
                      ].map(({ key, label, placeholder, femaleOnly }) => {
                        if (femaleOnly && watchSex !== 'female') return null
                        return (
                          <div key={key}>
                            <label className="block text-xs text-gray-400 mb-2">{label}</label>
                            <input
                              {...register(key as keyof FormData, { valueAsNumber: true })}
                              type="number"
                              placeholder={placeholder}
                              className="w-full px-3 py-3 rounded-xl border border-white/10 bg-white/3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 transition-colors text-sm"
                            />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between mt-6 sm:mt-8 gap-3">
                  <button
                    type="button"
                    onClick={currentStep === 0 ? () => setStep('hero') : prevStep}
                    className="flex items-center gap-1.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all text-sm"
                  >
                    <ChevronLeft className="w-4 h-4 flex-shrink-0" />
                    <span className="hidden xs:inline">{currentStep === 0 ? 'Volver' : 'Anterior'}</span>
                  </button>

                  {currentStep < STEPS.length - 1 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] text-sm flex-1 sm:flex-none justify-center"
                    >
                      Continuar
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-lime-400 text-white font-semibold transition-all hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] text-sm hover:scale-105 flex-1 sm:flex-none justify-center"
                    >
                      Ver mi análisis
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
