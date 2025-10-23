<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { BField } from 'buefy'
import { ALL_HEROES, getHeroData } from '@/common/heroes'
import { getHeroMapWinrates, hmwColumnNumbers } from '@/common/hero_map_winrates'
import { getMinorPatches } from '@/common/patches'
import { useSettingsStore } from '@/stores/settings'

import HeroMapsTable from '@/components/HeroMapsTable.vue'
import HeroPickerDropdown from '@/components/HeroPickerDropdown.vue'
import PatchPickerDropdown from '@/components/PatchPickerDropdown.vue'

const route = useRoute()
const router = useRouter()
const settings = useSettingsStore()

const selectedHero = computed<string>({
  get() {
    const h = (route.params.hero as string) || 'abathur'
    return ALL_HEROES.includes(h) ? h : 'abathur'
  },
  set(h: string) {
    if (h === route.params.hero) return
    router.replace({
      name: route.name,
      params: { ...route.params, hero: h},
      query: route.query
    })
  }
})
const selectedMinorPatches = ref(new Set(settings.defaultMinorPatches as Set<string>))

const heroPatchsizes = computed(() => {
  const hp: Record<string,number> = {}
  for (const minorPatch of getMinorPatches()) {
    hp[minorPatch] = getHeroMapWinrates(selectedHero.value, new Set([minorPatch])).data[hmwColumnNumbers['games_total']!] as number
  }
  return hp
})
</script>

<template>
  <div class='container'>
    <h1 class="title">Map winrates for {{ getHeroData(selectedHero).name }}</h1>
    <BField grouped group-multiline>
      <HeroPickerDropdown v-model="selectedHero"/>
      <PatchPickerDropdown v-model="selectedMinorPatches" :patchSizes="heroPatchsizes"/>
    </BField>
    <HeroMapsTable :hero="selectedHero" :patches="selectedMinorPatches"/>
  </div>
</template>

<style scoped>
</style>
