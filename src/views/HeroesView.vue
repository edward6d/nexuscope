<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { BField } from 'buefy'
import { useSettingsStore } from '@/stores/settings'
import { ALL_HEROES, getHeroData } from '@/common/heroes'
import { ALL_STANDARD_MAPS, getMapData } from '@/common/maps'

import MapHeroesTable from '@/components/MapHeroesTable.vue'
import MapPickerDropdown from '@/components/MapPickerDropdown.vue'
import PatchPickerDropdown from '@/components/PatchPickerDropdown.vue'
import RoleButtons from '@/components/RoleButtons.vue'
import HeroSetSelect, { FAVORITES_SET_NAME } from '@/components/HeroSetSelect.vue'

const route = useRoute()
const router = useRouter()
const settings = useSettingsStore()

const selectedMap = computed<string>({
  get() {
    const m = (route.params.game_map as string) || 'alterac_pass'
    return ALL_STANDARD_MAPS.includes(m) ? m : 'alterac_pass'
  },
  set(m: string) {
    if (m === route.params.game_map) return
    router.replace({
      name: route.name,
      params: { ...route.params, game_map: m},
      query: route.query
    })
  }
})
const selectedMinorPatches = ref(new Set(settings.defaultMinorPatches as Set<string>))
const selectedRoles = ref(new Set<string>())
const selectedHeroSetName = ref('')
const favoritesOnly = ref(false)

const filteredHeroes = computed<Set<string>>(() => {
  let start: string[]
  if (!selectedHeroSetName.value) {
    start = Array.from(ALL_HEROES)
  } else if (selectedHeroSetName.value === FAVORITES_SET_NAME) {
    start = Array.from(settings.favoriteHeroes)
  } else {
    start = Array.from(settings.customHeroSets.find(o => o.name === selectedHeroSetName.value)!.heroes)
  }
  const filtered = start.filter((h) =>
    (selectedRoles.value.size === 0 || selectedRoles.value.has(getHeroData(h).role)))
  const s = new Set<string>(filtered)
  return s
})

</script>

<template>
  <div class='container'>
    <h1 class="title">Hero performance on {{ getMapData(selectedMap).name }}</h1>
    <BField grouped group-multiline>
      <MapPickerDropdown v-model="selectedMap"/>
      <PatchPickerDropdown v-model="selectedMinorPatches"/>
      <RoleButtons v-model="selectedRoles"/>
      <HeroSetSelect v-model="selectedHeroSetName" :allowEmpty="true"/>
    </BField>
    <MapHeroesTable
      :gameMap="selectedMap"
      :heroes="filteredHeroes"
      :patches="selectedMinorPatches"/>
  </div>

</template>

<style scoped>
</style>
