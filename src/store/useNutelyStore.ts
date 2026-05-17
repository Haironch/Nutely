import { create } from 'zustand'
import type { UserData, NutritionResults } from '@/types'

type Step = 'hero' | 'form' | 'results'

interface NutelyStore {
  step: Step
  userData: UserData | null
  results: NutritionResults | null
  setStep: (step: Step) => void
  setUserData: (data: UserData) => void
  setResults: (results: NutritionResults) => void
  reset: () => void
}

export const useNutelyStore = create<NutelyStore>((set) => ({
  step: 'hero',
  userData: null,
  results: null,
  setStep: (step) => set({ step }),
  setUserData: (userData) => set({ userData }),
  setResults: (results) => set({ results }),
  reset: () => set({ step: 'hero', userData: null, results: null }),
}))
