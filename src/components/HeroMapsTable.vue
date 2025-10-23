<script setup lang="ts">
import { computed, ref } from 'vue'
import { BTable, BTableColumn } from 'buefy'
import { hmwColumnNumbers, getHeroMapWinrates } from '@/common/hero_map_winrates'
import { ALL_STANDARD_MAPS, getMapData } from '@/common/maps'
import MapIcon from '@/components/MapIcon.vue'

const props = defineProps<{
  hero: string,
  patches: Set<string>
}>()

const tableData = computed(() => {
  const hmw = getHeroMapWinrates(props.hero, props.patches)

  const rows: Array<{ gameMap: string; winrate: number, games: number}> = []
  for (const m of ALL_STANDARD_MAPS) {
    const wins = hmw.data[hmwColumnNumbers[`wins_${m}`]!] ?? 0
    const games = hmw.data[hmwColumnNumbers[`games_${m}`]!] ?? 0
    if (games > 0) {
      rows.push(
        {
          gameMap: m,
          winrate: wins/games,
          games
        })
    }
  }
  return rows
})
</script>

<template>
  <BTable
    :data="tableData"
    :default-sort="['winrate','desc']"
    :hoverable="true"
    :striped="true">
    <BTableColumn
      field="gameMap"
      label="Map"
      sortable>
      <template #default="{ row }">
        <span class="icon-text">
          <MapIcon :gameMap="row.gameMap" class="icon mr-2" />
          {{ getMapData(row.gameMap).name }}
        </span>
      </template>
    </BTableColumn>
    <BTableColumn
      field="winrate"
      label="Winrate"
      numeric
      sortable>
      <template #default="{ row }">
        <span class="is-family-monospace">
          {{ (row.winrate*100).toFixed(2) }}%
        </span>
      </template>
    </BTableColumn>
    <BTableColumn
      field="games"
      label="Games"
      numeric
      sortable>
      <template #default="{ row }">
        <span class="is-family-monospace">
          {{ row.games }}
        </span>
      </template>
    </BTableColumn>
  </BTable>
</template>

<style scoped>
</style>
