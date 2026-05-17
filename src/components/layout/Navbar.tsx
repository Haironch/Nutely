import { motion } from 'framer-motion'

export function Navbar() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">N</span>
          </div>
          <span className="font-display font-bold text-lg text-emerald-400 tracking-tight">
            nutely
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-400">
          <span className="hover:text-emerald-400 cursor-pointer transition-colors">Inicio</span>
          <span className="hover:text-emerald-400 cursor-pointer transition-colors">Cómo funciona</span>
        </nav>
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
          <div className="w-4 h-0.5 bg-emerald-400 relative before:content-[''] before:absolute before:w-4 before:h-0.5 before:bg-emerald-400 before:-top-1.5 after:content-[''] after:absolute after:w-4 after:h-0.5 after:bg-emerald-400 after:top-1.5" />
        </div>
      </div>
    </motion.header>
  )
}
