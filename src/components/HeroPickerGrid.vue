<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { BButton, BField, BInput } from 'buefy'
import { ALL_HEROES, getHeroData, sanitizeName } from '@/common/heroes'
import HeroIcon from '@/components/HeroIcon.vue'
import RoleButtons from '@/components/RoleButtons.vue'

const selectedHeroes = defineModel<Set<string>>({ required: true })
const selectedRoles = ref(new Set<string>())

const heroFilter = ref('')

const filteredHeroes = computed(() =>
  ALL_HEROES.filter(h => (h.includes(sanitizeName(heroFilter.value)) ||
  sanitizeName(getHeroData(h).role).includes(sanitizeName(heroFilter.value))) &&
  (selectedRoles.value.size === 0 || selectedRoles.value.has(getHeroData(h).role)))
)

const isDragging = ref(false)
const isDeselecting = ref(false)
const visitedDuringDrag = ref(new Set<string>())

function startDrag(e: PointerEvent) {
  const cell = (e.target as HTMLElement)?.closest('[data-hero-id]') as HTMLElement | null
  const hero = cell?.dataset.heroId

  isDragging.value = true
  visitedDuringDrag.value.clear()
  if (hero) {
    duringDrag(hero)
  }
}

function duringDrag(hero: string) {
  if (!isDragging.value) return
  if (visitedDuringDrag.value.has(hero)) return
  if (visitedDuringDrag.value.size === 0) {
    if (selectedHeroes.value.has(hero)) {
      isDeselecting.value = true
    } else {
      isDeselecting.value = false
    }
  }
  if (isDeselecting.value) {
    selectedHeroes.value.delete(hero)
  } else {
    selectedHeroes.value.add(hero)
  }
  visitedDuringDrag.value.add(hero)
}

function endDrag(e: PointerEvent) {
  if (!isDragging.value) return
  isDragging.value = false
  visitedDuringDrag.value.clear()
}

onMounted(() => {
  window.addEventListener('pointerup', endDrag)
  window.addEventListener('pointercancel', endDrag)
})
onBeforeUnmount(() => {
  window.removeEventListener('pointerup', endDrag)
  window.removeEventListener('pointercancel', endDrag)
})
</script>


<template>
  <BField grouped group-multiline>
    <BButton @click="filteredHeroes.forEach(h => selectedHeroes.add(h))">Select all</BButton>
    <BButton @click="filteredHeroes.forEach(h => selectedHeroes.delete(h))">Select none</BButton>
    <RoleButtons v-model="selectedRoles"/>
    <BField class="mb-0" :type="heroFilter?'is-info':''">
      <BInput
          placeholder="Filter..."
          type="search"
          icon="filter"
          icon-right="close-circle"
          icon-right-clickable
          @icon-right-click="heroFilter=''"
          ref="filterInput"
          v-model="heroFilter"
        />
    </BField>
  </BField>
  <div
    class="grid is-col-min-3"
    @pointerdown="startDrag"
    @dragstart.prevent.stop>
    <div
      v-for="hero of filteredHeroes"
      class="cell hero-select-icon"
      :class="{'favorite':selectedHeroes.has(hero)}"
      :data-hero-id="hero"
      :title="getHeroData(hero).name"
      @pointerenter="duringDrag(hero)">
      <HeroIcon
        :hero="hero"
        :favorite="selectedHeroes.has(hero)"/>
    </div>
    <div
      v-for="hero of ALL_HEROES.filter(h => !filteredHeroes.includes(h))"
      class="cell hero-select-icon is-disabled"
      :class="{'favorite':selectedHeroes.has(hero)}"
      :data-hero-id="hero"
      :title="getHeroData(hero).name"
      @pointerenter="duringDrag(hero)">
      <HeroIcon
        :hero="hero"
        :favorite="selectedHeroes.has(hero)"/>
    </div>
  </div>
</template>

<style scoped>
.grid {
  user-select: none;
}
.hero-select-icon {
  border-radius: 50%;
  box-shadow: 0 0 0 3px hsla(200, 62%, 22%, 0.5);
  cursor: pointer;
  transition: box-shadow .2s ease;
}

.hero-select-icon.is-disabled {
  filter: grayscale(60%) brightness(0.5);
}

.hero-select-icon.favorite {
  box-shadow: 0 0 0 3px hsla(295, 62%, 22%, 0.5);
}

.hero-select-icon:hover {
  box-shadow:
    0 0 0 3px hsla(200, 94%, 81%, 0.85),    /* ring */
    0 0 12px 6px hsla(200, 94%, 94%, 0.35); /* glow */
}

.hero-select-icon.favorite:hover {
  box-shadow:
    0 0 0 3px hsla(295, 94%, 81%, 0.85),
    0 0 12px 6px hsla(295, 94%, 94%, 0.35);
}
</style>
