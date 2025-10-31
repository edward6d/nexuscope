import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getMinorPatches } from '@/common/patches'

export const useSettingsStore = defineStore('settings', () => {
  const defaultMinorPatches = ref(new Set<string>(getMinorPatches().slice(-15)))
  const favoriteHeroes = ref(new Set<string>())
  const customHeroSets = ref(new Array<{name: string, heroes: Set<string>}>())

  return { defaultMinorPatches, favoriteHeroes, customHeroSets }
}, {
  persist: {
    serializer: {
      serialize: (state) =>
        JSON.stringify({
          ...state,
          defaultMinorPatches: Array.from(state.defaultMinorPatches),
          favoriteHeroes: Array.from(state.favoriteHeroes),
          customHeroSets: state.customHeroSets.map((s: {name: string, heroes: Set<string>}) => ({
            name: s.name,
            heroes: Array.from(s.heroes)
          }))
        }),
      deserialize: (str) => {
        const newState = JSON.parse(str)
        newState.defaultMinorPatches = new Set<string>(newState.defaultMinorPatches || [])
        newState.favoriteHeroes = new Set<string>(newState.favoriteHeroes || [])
        newState.customHeroSets = newState.customHeroSets.map((s: {name: string, heroes: Set<string>}) => ({
          name: s.name,
          heroes: new Set<string>(s.heroes || [])
        }))
        return newState
      }
    }
  }
})
