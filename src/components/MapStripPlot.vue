<script lang="ts">
const BAR_HEIGHT = 30
const BAR_WIDTH = 3
const BAR_SPACING = 1
const AXIS_THICKNESS = 4
const AXIS_COLOR = 'hsla(221, 14%, 22%, 1)'
const BAR_HIGHLIGHT_COLOR = 'hsla(270, 53%, 40%, 1)'
const BAR_HOVER_COLOR = 'hsla(221, 14%, 93%, 1)'
// const GRADIENT_STOPS = [
//   { t: 0, h: 358, s: 53, l: 40, a: 1 },
//   { t: 0.5, h: 48, s: 53, l: 40, a: 1 },
//   { t: 1.0, h: 133, s: 53, l: 40, a: 1 },
// ]
const GRADIENT_STOPS = [
  { t: 0, h:170, s:93, l:30, a:1},
]
</script>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { getGradientColor } from '@/common/util'

interface Props {
  data: { value: number; label: string }[]
  highlightIndex: number
  params: {
    min: number // X value at left side of a maxlength axis
    max: number // X value at right side of a maxlength axis
    axisSpan: number // fraction between [0, 1] - share of full length axis that will be used. 1.0 means full length
    binsMax: number
  }
  // style props
  axisColor?: string
  axisThickness?: number
  barHighlightColor?: string
  barHoverColor?: string
  barHeight?: number
  barWidth?: number
  barSpacing?: number
  gradientStops?: {t:number, h:number, s:number, l:number, a:number}[]
}

const props = withDefaults(defineProps<Props>(), {
  axisColor: 'hsla(221, 14%, 22%, 1)',
  axisThickness: 4,
  barHighlightColor: 'hsla(270, 53%, 40%, 1)',
  barHoverColor: 'hsla(221, 14%, 93%, 1)',
  barHeight: 30,
  barWidth: 3,
  barSpacing: 1,
  gradientStops: () => [{ t: 0, h:170, s:93, l:30, a:1}],
})

const bins = computed<{ actualNo:number, maxNo:number }>(() => {
  const maxNo = Math.max(props.data.length, Math.ceil(props.params.binsMax))
  const actualNo = Math.max(props.data.length,
    Math.ceil(maxNo * Math.min(props.params.axisSpan,1)))
  return {actualNo, maxNo}
})
// const binsNo = computed(() => {
//   const b = Math.ceil(props.params.binsMax * Math.min(props.params.axisSpan,1))
//   return Math.max(props.data.length, b) // should never return less bins than elements of props.data
// })
const axis = computed<{ length:number, maxLength:number, shift:number }>(() => {
  const length = (bins.value.actualNo - 1) * (props.barWidth + props.barSpacing) + props.barWidth
  const maxLength = (bins.value.maxNo - 1) * (props.barWidth + props.barSpacing) + props.barWidth
  const shift = Math.max((maxLength-length)/2,0)
  return { length, maxLength, shift }
})
const viewBox = computed<{ marginX: number; marginY: number; sizeX: number; sizeY: number }>(() => {
  const marginX = (axis.value.maxLength+props.barWidth) / 40
  const marginY = props.barHeight / 6
  const sizeX = axis.value.maxLength + 2*marginX
  const sizeY = props.barHeight + 2 * marginY
  return { marginX, marginY, sizeX, sizeY }
})

// value centers
const binCenters = computed(() => {
  const binStep = (props.params.max - props.params.min) / (bins.value.actualNo - 1)
  return Array.from({ length: bins.value.actualNo }, (_, i) => props.params.min + i * binStep)
})
// dynamic programming algorithm to place values into their best bins
// binAssignment[i] - returns which bin props.data[i] should go into
const binAssignment = computed(() => {
  const itemsToPlace: number = props.data.length
  const availableBins: number = bins.value.actualNo

  const sortedIndices = Array.from({ length: itemsToPlace }, (_, i) => i).sort(
    (a, b) => props.data[a]!.value - props.data[b]!.value,
  )

  // dp[i][j] - minimum cost to place first i bars into first j bins (some bins may be empty)
  const dp: number[][] = Array.from({ length: itemsToPlace + 1 }, () =>
    Array(availableBins + 1).fill(Number.POSITIVE_INFINITY),
  )

  const choose: boolean[][] = Array.from({ length: itemsToPlace + 1 }, () =>
    Array(availableBins + 1).fill(false),
  )

  for (let j = 0; j < availableBins + 1; j++) dp[0]![j] = 0 // minimum cost to place no items into all available bins is zero
  for (let i = 1; i < itemsToPlace + 1; i++) {
    for (let j = 1; j < availableBins + 1; j++) {
      // we can skip bin i
      let best = dp[i]![j - 1] as number
      let took = false

      // or we can place bar i in bin j
      if (j >= i) {
        // we calculate cost as squared error
        const cost = (dp[i - 1]![j - 1]! +
          Math.pow(
            props.data[sortedIndices[i - 1]!]!.value - binCenters.value[j - 1]!,
            2,
          )) as number
        if (cost < best) {
          best = cost
          took = true
        }
      }
      dp[i]![j]! = best
      choose[i]![j] = took
    }
  }
  const assignments: number[] = Array(itemsToPlace).fill(-1)
  let i = itemsToPlace,
    j = availableBins
  while (i > 0 && j > 0) {
    if (choose[i]![j]) {
      assignments[sortedIndices[i - 1]!]! = j - 1
      i = i - 1
    }
    j = j - 1
  }
  return assignments
})
</script>

<template>
  <div class="chartwrap">
    <svg
      class="chart"
      width="100%"
      :viewBox="`-${viewBox.marginX} 0 ${viewBox.sizeX} ${viewBox.sizeY}`"
      preserveAspectRatio="none"
    >
      <g class="elements">
        <rect
          class="axis"
          :x="`${axis.shift + props.axisThickness / 2}`"
          :y="`${(viewBox.sizeY - props.axisThickness) / 2}`"
          :rx="`${props.axisThickness / 2}`"
          :ry="`${props.axisThickness / 2}`"
          :width="`${axis.length - props.axisThickness}`"
          :height="`${props.axisThickness}`"
          :fill="props.axisColor"
          :stroke="props.axisColor"
          :stroke-width="`${props.axisThickness}`"
        />
        <rect
          v-for="[i, d] of data.entries()"
          class="bar"
          :x="axis.shift + binAssignment[i]! * (props.barWidth + props.barSpacing)"
          :y="`${viewBox.marginY}`"
          rx="1"
          ry="1"
          :width="`${props.barWidth}`"
          :height="`${props.barHeight}`"
          :fill="
            i === highlightIndex
              ? props.barHighlightColor
              : getGradientColor(props.gradientStops, binAssignment[i]! / (bins.actualNo - 1))
          "
          :stroke="props.barHoverColor"
        >
          <title>{{ d.label }}</title>
        </rect>
        <!--
        <rect x="1" y="5"
          rx="1" ry="1"
          width="6" height="30"
          fill="hsla(348deg, 100%, 70%, 1)"
          stroke="hsla(348deg, 40%, 30%, 1)" stroke-width="2"/>
        <rect x="197" y="5"
          rx="1" ry="1"
          width="6" height="30"
          fill="hsla(42deg, 70%, 53%, 1)"
          stroke="hsla(42deg, 40%, 30%, 1)" stroke-width="2"/>
        <rect x="393" y="5"
          rx="1" ry="1"
          width="6" height="30"
          fill="hsla(153deg, 53%, 53%, 1)"
          stroke="hsla(153deg, 40%, 30%, 1)" stroke-width="2"/> -->
      </g>
    </svg>
  </div>
</template>

<style scoped>
svg.chart {
  display: block;
  width: 100%;
  height: 100%;
}

.axis {
  vector-effect: non-scaling-stroke;
}

.bar {
  stroke-width: 0;
}

.bar:hover {
  fill: v-bind('props.barHoverColor');
  stroke-width: v-bind('props.barSpacing/1.5');
}
</style>
