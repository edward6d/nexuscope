<script setup lang="ts">
import { BButton, BDropdown, BDropdownItem } from 'buefy'
import { ALL_STANDARD_MAPS, getMapData } from '@/common/maps'

import MapIcon from './MapIcon.vue'

const selectedMap = defineModel<string>({ required: true })
</script>

<template>
  <BDropdown
    aria-role="list"
    :scrollable="true"
    max-height="60vh">
    <template #trigger="{ active }">
      <BButton
        :icon-right="active ? 'menu-up' : 'menu-down'">
        <span class="icon-text is-flex-wrap-nowrap">
          <MapIcon :gameMap="selectedMap" class="icon mr-2" />
          {{ getMapData(selectedMap).name }}
        </span>
      </BButton>
    </template>
    <BDropdownItem
      v-for="gameMap of ALL_STANDARD_MAPS"
      :key="gameMap"
      aria-role="listitem"
      @click="selectedMap = gameMap">
        <span class="icon-text is-flex-wrap-nowrap">
          <MapIcon :gameMap="gameMap" class="icon mr-2" />
          {{ getMapData(gameMap).name }}
        </span>
    </BDropdownItem>
  </BDropdown>
</template>

<style scoped>
.dropdown-trigger button {
  justify-content: space-between;
  min-width: 18rem;
}
.dropdown-item {
  padding-inline-end: 1rem;
}
</style>
