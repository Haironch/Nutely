import { motion } from 'framer-motion'
import { RadialBarChart, RadialBar, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'
import { RefreshCw, Flame, Scale, Percent, Clock, Dumbbell, Zap } from 'lucide-react'
import { useNutelyStore } from '@/store/useNutelyStore'
import { BODY_FAT_LABELS, GOAL_LABELS, SUPPLEMENT_INFO } from '@/constants/labels'
import { cn } from '@/lib/utils'

const MACRO_COLORS = ['#10B981', '#A3E635', '#F59E0B']

function MetricCard({
  icon: Icon,
  label,
  value,
  sub,
  highlight,
  delay = 0,
}: {
  icon: React.ElementType
  label: string
  value: string
  sub?: string
  highlight?: boolean
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={cn(
        'rounded-2xl p-4 sm:p-5 border',
        highlight
          ? 'border-emerald-500/40 bg-emerald-500/8'
          : 'border-white/8 bg-surface'
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className={cn(
            'w-9 h-9 rounded-xl flex items-center justify-center',
            highlight ? 'bg-emerald-500/20' : 'bg-white/5'
          )}
        >
          <Icon className={cn('w-4 h-4', highlight ? 'text-emerald-400' : 'text-gray-400')} />
        </div>
      </div>
      <p className="text-lg sm:text-2xl font-display font-bold text-white mb-0.5 leading-tight">{value}</p>
      <p className="text-xs sm:text-sm text-gray-400">{label}</p>
      {sub && <p className="text-xs text-gray-600 mt-1 leading-tight">{sub}</p>}
    </motion.div>
  )
}

export function ResultsDashboard() {
  const { results, userData, reset } = useNutelyStore()
  if (!results || !userData) return null

  const macroData = [
    { name: 'Proteínas', value: results.protein * 4, grams: results.protein },
    { name: 'Carbohidratos', value: results.carbs * 4, grams: results.carbs },
    { name: 'Grasas', value: results.fat * 9, grams: results.fat },
  ]

  const bfInfo = results.bodyFatCategory ? BODY_FAT_LABELS[results.bodyFatCategory] : null

  const relevantSupplements = SUPPLEMENT_INFO.filter((s) =>
    s.goals.includes(userData.goal)
  )

  const months = results.estimatedWeeks >= 4
    ? `~${Math.round(results.estimatedWeeks / 4.3)} meses`
    : `~${results.estimatedWeeks} semanas`

  return (
    <section className="min-h-screen px-4 sm:px-6 py-20 sm:py-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Análisis listo
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3">Tu plan personalizado</h2>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Basado en fórmulas de referencia clínica (Mifflin-St Jeor, US Navy). No reemplaza consulta médica.
          </p>
        </motion.div>

        {/* Top metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-5 sm:mb-6">
          <MetricCard
            icon={Flame}
            label="Calorías objetivo"
            value={`${results.targetCalories} kcal`}
            sub={results.deficitOrSurplus < 0
              ? `${Math.abs(results.deficitOrSurplus)} kcal déficit`
              : results.deficitOrSurplus > 0
              ? `+${results.deficitOrSurplus} kcal superávit`
              : 'Mantenimiento'
            }
            highlight
            delay={0.1}
          />
          <MetricCard
            icon={Zap}
            label="Gasto total (TDEE)"
            value={`${results.tdee} kcal`}
            sub="Calorías de mantenimiento"
            delay={0.15}
          />
          <MetricCard
            icon={Scale}
            label="Peso ideal"
            value={`${results.idealWeightMin}–${results.idealWeightMax} kg`}
            sub={`IMC actual: ${results.bmi}`}
            delay={0.2}
          />
          <MetricCard
            icon={Clock}
            label="Meta estimada"
            value={months}
            sub="A ritmo de 0.5 kg/semana"
            delay={0.25}
          />
        </div>

        {/* Macros + Body fat row */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {/* Macros */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="rounded-2xl p-4 sm:p-6 border border-white/8 bg-surface"
          >
            <div className="flex items-center gap-2 mb-4 sm:mb-5">
              <Dumbbell className="w-4 h-4 text-emerald-400" />
              <h3 className="font-display font-semibold text-sm">Distribución de macros</h3>
            </div>
            <div className="flex flex-col xs:flex-row items-center gap-4">
              <div className="w-28 h-28 xs:w-32 xs:h-32 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={macroData}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={55}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {macroData.map((_, i) => (
                        <Cell key={i} fill={MACRO_COLORS[i]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: '#111A14', border: '1px solid #1F2D23', borderRadius: '8px', fontSize: 12 }}
                      formatter={(_v, name, props) =>
                        [`${(props.payload as { grams: number }).grams}g`, name]
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-3">
                {macroData.map((m, i) => (
                  <div key={m.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: MACRO_COLORS[i] }} />
                      <span className="text-xs text-gray-400">{m.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-white">{m.grams}g</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-white/5">
                  <p className="text-xs text-gray-600">Total: {results.targetCalories} kcal/día</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Body fat */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="rounded-2xl p-4 sm:p-6 border border-white/8 bg-surface"
          >
            <div className="flex items-center gap-2 mb-4 sm:mb-5">
              <Percent className="w-4 h-4 text-emerald-400" />
              <h3 className="font-display font-semibold text-sm">% Grasa corporal</h3>
            </div>
            {results.bodyFatPercent !== null && bfInfo ? (
              <div className="flex items-center gap-6">
                <div className="relative w-28 h-28 flex-shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={55}
                      startAngle={90}
                      endAngle={90 - (results.bodyFatPercent / 50) * 360}
                      data={[{ value: results.bodyFatPercent, fill: bfInfo.color }]}
                    >
                      <RadialBar
                        dataKey="value"
                        cornerRadius={4}
                      />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-white">{results.bodyFatPercent}%</span>
                  </div>
                </div>
                <div>
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-2"
                    style={{ background: bfInfo.color + '20', color: bfInfo.color }}
                  >
                    {bfInfo.label}
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Estimado con fórmula US Navy. Para mayor precisión usa DEXA scan o bioimpedancia.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-24 text-center">
                <p className="text-gray-500 text-sm">
                  Agrega medidas de cuello y cintura para estimar tu % de grasa.
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Supplements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
          className="rounded-2xl p-4 sm:p-6 border border-white/8 bg-surface mb-5 sm:mb-6"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display font-semibold mb-0.5">
                Suplementación sugerida
              </h3>
              <p className="text-xs text-gray-500">
                Para: {GOAL_LABELS[userData.goal]} · Solo informativo, no es consejo médico.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {relevantSupplements.map((s) => (
              <div
                key={s.name}
                className="p-4 rounded-xl border border-white/6 bg-white/2 hover:border-emerald-500/20 transition-colors"
              >
                <div className="text-2xl mb-2">{s.icon}</div>
                <p className="text-sm font-semibold text-white mb-1">{s.name}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* BMR info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="rounded-2xl p-4 sm:p-5 border border-white/6 bg-white/2 mb-6 sm:mb-8 grid grid-cols-2 sm:flex sm:flex-wrap gap-4 sm:gap-6"
        >
          <div>
            <p className="text-xs text-gray-500 mb-0.5">BMR (metabolismo basal)</p>
            <p className="font-semibold text-white">{results.bmr} kcal/día</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Peso meta</p>
            <p className="font-semibold text-white">{userData.goalWeightKg} kg</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Semanas estimadas</p>
            <p className="font-semibold text-white">{results.estimatedWeeks} sem</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Objetivo</p>
            <p className="font-semibold text-white">{GOAL_LABELS[userData.goal]}</p>
          </div>
        </motion.div>

        {/* Reset */}
        <div className="text-center">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Calcular con otros datos
          </button>
        </div>
      </div>
    </section>
  )
}
