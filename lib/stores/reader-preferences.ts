'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { safeStorage, storageKeys } from '@/lib/storage'

export type HighlightColor = 'marker' | 'amber' | 'orange'

interface ReaderPreferences {
  fontScale: number
  highlightColor: HighlightColor
  setFontScale: (scale: number) => void
  setHighlightColor: (color: HighlightColor) => void
}

/** Shared between the reader toolbar and canvas; persisted locally only. */
export const useReaderPreferences = create<ReaderPreferences>()(
  persist(
    (set) => ({
      fontScale: 1,
      highlightColor: 'marker',
      setFontScale: (scale) => set({ fontScale: Math.min(1.4, Math.max(0.85, scale)) }),
      setHighlightColor: (highlightColor) => set({ highlightColor }),
    }),
    {
      name: storageKeys.preferences,
      storage: createJSONStorage(() => safeStorage),
      // Rehydrate after mount (see ReaderPreferencesHydrator) to avoid SSR mismatches.
      skipHydration: true,
    },
  ),
)

export function rehydrateReaderPreferences() {
  void useReaderPreferences.persist.rehydrate()
}
