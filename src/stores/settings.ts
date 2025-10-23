import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getMinorPatches } from '@/common/patches'

export const useSettingsStore = defineStore('settings', () => {
  const defaultMinorPatches = ref(new Set<string>(getMinorPatches().slice(-15)))
  const favoriteHeroes = ref(new Set<string>())

  return { defaultMinorPatches, favoriteHeroes }
}, {
  persist: {
    serializer: {
      serialize: (state) =>
        JSON.stringify({
          ...state,
          defaultMinorPatches: Array.from(state.defaultMinorPatches),
          favoriteHeroes: Array.from(state.favoriteHeroes),
        }),
      deserialize: (str) => {
        const newState = JSON.parse(str)
        newState.defaultMinorPatches = new Set<string>(newState.defaultMinorPatches || [])
        newState.favoriteHeroes = new Set<string>(newState.favoriteHeroes || [])
        return newState
      }
    }
  }
})
