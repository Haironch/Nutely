import { AnimatePresence, motion } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { HeroSection } from '@/components/sections/HeroSection'
import { NutelyForm } from '@/components/forms/NutelyForm'
import { ResultsDashboard } from '@/components/results/ResultsDashboard'
import { useNutelyStore } from '@/store/useNutelyStore'

export default function App() {
  const step = useNutelyStore((s) => s.step)

  return (
    <div className="min-h-screen bg-[#0A0F0D] text-[#F0FDF4]">
      <Navbar />
      <AnimatePresence mode="wait">
        {step === 'hero' && (
          <motion.div
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <HeroSection />
          </motion.div>
        )}
        {step === 'form' && (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <NutelyForm />
          </motion.div>
        )}
        {step === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ResultsDashboard />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
