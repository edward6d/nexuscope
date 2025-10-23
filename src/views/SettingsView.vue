<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings'

import HeroPickerGrid from '@/components/HeroPickerGrid.vue'
import PatchPickerDropdown from '@/components/PatchPickerDropdown.vue'

const settings = useSettingsStore()

</script>

<template>
  <h1>Settings</h1>
  <div class="field">
    <label class="label">Default patches</label>
    <PatchPickerDropdown v-model="settings.defaultMinorPatches"/>
  </div>
  <div class="field">
    <label class="label">Favorite heroes ({{ settings.favoriteHeroes.size }})</label>
    <HeroPickerGrid v-model="settings.favoriteHeroes"/>
  </div>
</template>
