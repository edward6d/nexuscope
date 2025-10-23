<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import { BButton, BDropdown, BDropdownItem, BInput } from 'buefy'
import { ALL_HEROES, getHeroData, sanitizeName } from '@/common/heroes'
import HeroIcon from '@/components/HeroIcon.vue'

const selectedHero = defineModel<string>({ required: true })

const filterInput = useTemplateRef('filterInput')
const heroFilter = ref('')

const filteredHeroes = computed(() =>
  ALL_HEROES.filter(h => h.includes(sanitizeName(heroFilter.value)) ||
  sanitizeName(getHeroData(h).role).includes(sanitizeName(heroFilter.value)))
)

function onActiveChange(isActive: boolean) { // used when dropdown is clicked
  if (isActive) {
    heroFilter.value = ''
    requestAnimationFrame(() => filterInput.value?.focus())
  }
}
</script>

<template>
  <BDropdown
    aria-role="list"
    :scrollable="true"
    max-height="60vh"
    @active-change="onActiveChange"
  >
    <template #trigger="{ active }">
      <BButton
        :icon-right="active ? 'menu-up' : 'menu-down'">
      <span class="icon-text is-flex-wrap-nowrap">
        <HeroIcon :hero="selectedHero" class="icon mr-2" />
        {{ getHeroData(selectedHero).name }}
      </span>
      </BButton>
    </template>
    <div>
      <BInput
        placeholder="Filter..."
        type="search"
        icon="filter"
        icon-right="close-circle"
        icon-right-clickable
        @icon-right-click="heroFilter=''"
        ref="filterInput"
        size="is-small"
        v-model="heroFilter"
      />
    </div>
    <BDropdownItem
      v-for="hero of filteredHeroes"
      :key="hero"
      aria-role="listitem"
      :class="{ 'is-active': selectedHero === hero }"
      @click="selectedHero = hero"
    >
      <span class="icon-text is-flex-wrap-nowrap">
        <HeroIcon :hero="hero" class="icon mr-2" />
        {{ getHeroData(hero).name }}
      </span>
    </BDropdownItem>
  </BDropdown>
</template>

<style scoped>
.dropdown-trigger button {
  justify-content: space-between;
  min-width: 13rem;
}
.dropdown-item {
  padding-inline-end: 1rem;
}
</style>
