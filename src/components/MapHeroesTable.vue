<script setup lang="ts">
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue'
import { BCheckbox, BField, BSelect, BTable, BTableColumn } from 'buefy'
import { getHeroMapWinrates, hmwColumnNumbers, } from '@/common/hero_map_winrates'
import { ALL_HEROES, getHeroData } from '@/common/heroes'
import { ALL_STANDARD_MAPS, getMapData } from '@/common/maps'
import HeroIcon from '@/components/HeroIcon.vue'
import MapStripPlot from '@/components/MapStripPlot.vue'
import RoleIcon from '@/components/RoleIcon.vue'

const props = defineProps<{
  gameMap: string
  heroes: Set<string>
  patches: Set<string>
}>()

enum PerformanceMode {
  Absolute = 'Absolute',
  Relative = 'Relative',
  RelativeLength = 'RelativeLength',
  RelativeWidth = 'RelativeWidth',
}
enum PerformanceBarColoring {
  Simple = 'Simple',
  Gradient = 'Gradient',
}

const tableSettings = ref({
  columnVisibility: {
    role: true,
    performance: true,
    nthBest: false,
    winrate: false,
    games: false,
  },
  performanceBarColors: PerformanceBarColoring.Gradient,
  performanceMode: PerformanceMode.RelativeLength,
})

const tableComponent = useTemplateRef('tableComponent')
const tableSortDefault = computed(()=>{
  if (tableSettings.value.performanceMode === PerformanceMode.Absolute)
    return ['winrate', 'desc']
  else
    return ['performance', 'desc']
})
// setting default sorting mode on graph mode change
watch(() => tableSortDefault.value,
  (perfMode) => {
    console.log(`perfMode changed: ${perfMode} ts: ${tableSortDefault.value}`)
    nextTick(() => tableComponent.value?.initSort())
  }
)

const performanceGradient = computed(() => {
  if (tableSettings.value.performanceBarColors === PerformanceBarColoring.Gradient) {
    return [
      { t: 0,   h: 358, s: 53, l: 40, a: 1 },
      { t: 0.5, h: 48,  s: 53, l: 40, a: 1 },
      { t: 1.0, h: 133, s: 53, l: 40, a: 1 },]
  }
  else
    return [{t: 0, h:170, s:93, l:30, a:1}] // simple coloring
})

type MapStats = {
  games: number
  winrate: number
}
export type HmwDataPoint = {
  bestMaps: string[]
  mapData: Record<string, MapStats>
  maxWinrate: number
  minWinrate: number
}
const hmwData = computed(() => {
  const hmwDataPoints: Record<string, HmwDataPoint> = {}
  for (const h of ALL_HEROES) {
    const hmw = getHeroMapWinrates(h, props.patches)
    const mapData: Record<string, MapStats> = {}
    for (const m of ALL_STANDARD_MAPS) {
      const wins = hmw?.data[hmwColumnNumbers[`wins_${m}`]!] ?? 0
      const games = hmw?.data[hmwColumnNumbers[`games_${m}`]!] ?? 0
      mapData[m] = {
        games,
        winrate: wins / games,
      }
    }
    const bestMaps: string[] = Object.entries(mapData)
      .filter((o) => o[1].games > 0)
      .sort((a, b) => b[1].winrate - a[1].winrate)
      .map(([gameMap, { games, winrate }]) => gameMap)
    const maxWinrate: number = mapData[bestMaps[0]!]!.winrate
    const minWinrate: number = mapData[bestMaps[bestMaps.length - 1]!]!.winrate
    hmwDataPoints[h] = {
      bestMaps,
      maxWinrate,
      minWinrate,
      mapData,
    }
  }
  return hmwDataPoints
})
const availableMaps = computed(() =>
  ALL_STANDARD_MAPS.filter((m) =>
    Object.values(hmwData.value).some((o) => (o.mapData[m]?.games ?? 0) > 0),
  ),
)
const globalStats = computed<{maxRange: number, minWinrate:number, maxWinrate: number}>(() => {
  let globalMinWinrate = 1
  let globalMaxWinrate = 0
  let globalMaxRange = 0
  for (const h of props.heroes) {
    const hMin = hmwData.value[h]!.minWinrate
    const hMax = hmwData.value[h]!.maxWinrate
    globalMinWinrate = (hMin < globalMinWinrate) ? hMin : globalMinWinrate
    globalMaxWinrate = (hMax > globalMaxWinrate) ? hMax : globalMaxWinrate
    globalMaxRange = (hMax-hMin > globalMaxRange) ? hMax-hMin : globalMaxRange
  }
  return {maxRange: globalMaxRange, minWinrate:globalMinWinrate, maxWinrate: globalMaxWinrate}
})

const chartData = computed(() => {
  const cd: Record<string,{ value: number, label: string }[]> = {}
  for (const h of ALL_HEROES) {
    cd[h] = []
    for (const m of availableMaps.value) {
      const value = hmwData.value[h]?.mapData[m]?.winrate ?? -1
      const label = `${getMapData(m).name}: ${(value * 100).toFixed(2)}%`
      cd[h].push({value, label})
    }
  }
  return cd
})
const chartHiglightedGamemap = computed(() => availableMaps.value.indexOf(props.gameMap))
const chartParams = computed(() => {
  const ranges: Record <string,{min:number, max:number, axisSpan:number, binsMax:number}> = {}
  for (const h of props.heroes) {
    const hMin = hmwData.value[h]!.minWinrate
    const hMax = hmwData.value[h]!.maxWinrate
    ranges[h] = {
      min: tableSettings.value.performanceMode === PerformanceMode.Absolute ?
        globalStats.value.minWinrate : hMin,
      max: tableSettings.value.performanceMode === PerformanceMode.Absolute ?
        globalStats.value.maxWinrate : hMax,
      axisSpan: tableSettings.value.performanceMode === PerformanceMode.RelativeLength ?
        (hMax-hMin)/globalStats.value.maxRange : 1,
      binsMax: tableSettings.value.performanceMode === PerformanceMode.RelativeWidth ?
        100*(hMax-hMin)/globalStats.value.maxRange : 100,
    }
  }
  return ranges
})

type TableRow = {
  hero: string
  games: number
  performance: number
  nthBest: number
  role: string
  winrate: number
}
const tableData = computed(() => {
  const rows: Array<TableRow> = []
  for (const h of props.heroes) {
    if (hmwData.value[h] && (hmwData.value[h].mapData[props.gameMap]?.games ?? 0) > 0) {
      const winrate =
        hmwData.value[h].mapData[props.gameMap]?.winrate ?? hmwData.value[h].minWinrate
      const minWinrate = hmwData.value[h].minWinrate
      const maxWinrate = hmwData.value[h].maxWinrate
      const performance = (((winrate - minWinrate) / (maxWinrate - minWinrate)) - 0.5) *
        (tableSettings.value.performanceMode === PerformanceMode.RelativeLength ? (maxWinrate-minWinrate) : 1)
      rows.push({
        hero: h,
        games: hmwData.value[h].mapData[props.gameMap]?.games ?? 0,
        performance,
        nthBest: hmwData.value[h].bestMaps.indexOf(props.gameMap) + 1,
        role: getHeroData(h).role,
        winrate,
      })
    }
  }
  return rows
})
</script>

<template>
  <BField grouped group-multiline>
    <label class="label mb-0">Columns:</label>
    <BCheckbox v-model="tableSettings.columnVisibility.role">Role</BCheckbox>
    <BCheckbox v-model="tableSettings.columnVisibility.performance">Performance</BCheckbox>
    <BSelect
      :disabled="!tableSettings.columnVisibility.performance"
      icon="poll"
      size="is-small"
      v-model="tableSettings.performanceMode">
      <option :value="PerformanceMode.Absolute">Absolute</option>
      <option :value="PerformanceMode.Relative">Relative</option>
      <option :value="PerformanceMode.RelativeLength">Rel. axes</option>
      <option :value="PerformanceMode.RelativeWidth">Rel. bars</option>
    </BSelect>
    <BSelect
      :disabled="!tableSettings.columnVisibility.performance"
      icon="palette"
      size="is-small"
      v-model="tableSettings.performanceBarColors">
      <option :value="PerformanceBarColoring.Simple">Simple</option>
      <option :value="PerformanceBarColoring.Gradient">Gradient</option>
    </BSelect>
    <BCheckbox v-model="tableSettings.columnVisibility.nthBest">Rank</BCheckbox>
    <BCheckbox v-model="tableSettings.columnVisibility.winrate">Winrate</BCheckbox>
    <BCheckbox v-model="tableSettings.columnVisibility.games">Games</BCheckbox>
  </BField>
  <BTable
    :data="tableData"
    :default-sort="tableSortDefault"
    default-sort-direction="desc"
    :hoverable="true"
    ref="tableComponent"
    :striped="true">
    <BTableColumn field="hero" label="Hero" sortable width="12rem">
      <template #default="{ row }">
        <span class="icon-text">
          <HeroIcon :hero="row.hero" class="icon mr-2" />
          {{ getHeroData(row.hero).name }}
        </span>
      </template>
    </BTableColumn>
    <BTableColumn
      centered
      field="role"
      label="Role"
      sortable
      :visible="tableSettings.columnVisibility.role"
      width="4.5rem">
      <template #default="{ row }">
        <span class="icon-text" :title="row.role">
          <RoleIcon :role="row.role" :colored="true"/>
        </span>
      </template>
    </BTableColumn>
    <BTableColumn
      cell-class="chartcell"
      centered
      field="performance"
      label="Performance"
      sortable
      :visible="tableSettings.columnVisibility.performance"
      width="auto">
      <template #default="{ row }">
        <MapStripPlot
          :data="chartData[row.hero]!"
          :gradientStops="performanceGradient"
          :highlightIndex="chartHiglightedGamemap"
          :params="chartParams[row.hero]!"/>
      </template>
    </BTableColumn>
    <BTableColumn
      field="nthBest"
      label="Rank"
      numeric
      sortable
      :visible="tableSettings.columnVisibility.nthBest"
      width="3.5rem">
      <template #default="{ row }">
        <span class="is-family-monospace" :title="`${row.nthBest} out of ${availableMaps.length}`">
          {{ row.nthBest }}
        </span>
      </template>
    </BTableColumn>
    <BTableColumn
      field="winrate"
      label="Winrate"
      numeric
      sortable
      :visible="tableSettings.columnVisibility.winrate"
      width="5rem">
      <template #default="{ row }">
        <span class="is-family-monospace"> {{ (row.winrate * 100).toFixed(2) }}% </span>
      </template>
    </BTableColumn>
    <BTableColumn
      field="games"
      label="Games"
      numeric
      sortable
      :visible="tableSettings.columnVisibility.games"
      width="4.5rem">
      <template #default="{ row }">
        <span class="is-family-monospace">
          {{ row.games }}
        </span>
      </template>
    </BTableColumn>
  </BTable>
</template>

<style scoped>
:deep(td.chartcell) {
  position: relative;
}
:deep(td.chartcell)>* {
  position: absolute;
  inset: 0;
  overflow: hidden;
}
</style>
