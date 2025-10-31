<script lang="ts">
  export const FAVORITES_SET_NAME = 'Favorites'
</script>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { BSelect } from 'buefy'

import { useSettingsStore } from '@/stores/settings'
import { ALL_HEROES } from '@/common/heroes'

interface Props {
  allowEmpty?: boolean
}

const props = withDefaults(defineProps<Props>(), { allowEmpty: false })
const selectedHeroSet = defineModel<string>({ required: true })

const settings = useSettingsStore()
</script>

<template>
  <BSelect placeholder="Select hero set" icon="account-group" v-model="selectedHeroSet">
    <option :value="''" v-if="allowEmpty">All heroes ({{ ALL_HEROES.length }})</option>
    <option :value="FAVORITES_SET_NAME">{{ FAVORITES_SET_NAME }} ({{ settings.favoriteHeroes.size }})</option>
    <option v-for="csh of settings.customHeroSets" :value="csh.name">{{ csh.name }} ({{ csh.heroes.size }})</option>
  </BSelect>
</template>

<style scoped>
</style>
