import { motion } from 'framer-motion'
import { ArrowRight, Zap, Target, TrendingUp } from 'lucide-react'
import { useNutelyStore } from '@/store/useNutelyStore'

const stats = [
  { icon: Zap, label: 'Calorías exactas', value: 'TDEE + macros' },
  { icon: Target, label: 'Peso ideal', value: 'Tu rango saludable' },
  { icon: TrendingUp, label: 'Meta estimada', value: 'Tiempo realista' },
]

export function HeroSection() {
  const setStep = useNutelyStore((s) => s.setStep)

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-lime-400/5 rounded-full blur-[80px]" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(#10B981 1px, transparent 1px), linear-gradient(90deg, #10B981 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs sm:text-sm font-medium mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Análisis nutricional personalizado — gratis
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight mb-6"
        >
          Conoce tu cuerpo.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-400">
            Transforma tu vida.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed px-2"
        >
          Ingresa tus datos y recibe un análisis completo: calorías exactas, macros ideales,
          porcentaje de grasa y el tiempo real para alcanzar tu meta.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <button
            onClick={() => setStep('form')}
            className="group flex items-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] text-sm sm:text-base w-full sm:w-auto justify-center"
          >
            Calcular mi análisis
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <span className="text-sm text-gray-500">Sin registro · Sin tarjeta · 2 minutos</span>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto"
        >
          {stats.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-white/5 bg-white/2 backdrop-blur-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                <Icon className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="font-semibold text-sm text-white">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
