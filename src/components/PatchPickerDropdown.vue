<script setup lang="ts">
import { computed, ref } from 'vue'
import { BCheckbox, BDropdown, BDropdownItem, BField } from 'buefy'
import { compareVersionStrings, getPatchsets } from '@/common/patches'

import type { Patches } from '@/common/patches'

const props = defineProps<{
  patchSizes?: Record<string, number>
}>()

const selectedMinorPatches = defineModel<Set<string>>({ required: true })

const allPatchsets = getPatchsets()
const sortedMajors: string[] = Object.keys(allPatchsets).sort(compareVersionStrings).reverse()
const sortedMinors: Patches = Object.fromEntries(
  Object.entries(allPatchsets).map(([majorPatch, minorPatches]) => [
    majorPatch,
    [...minorPatches].sort(compareVersionStrings).reverse(),
  ]),
)

function toggleMinorPatch(minorPatch: string) {
  if (selectedMinorPatches.value.has(minorPatch)) {
    selectedMinorPatches.value.delete(minorPatch)
  } else {
    selectedMinorPatches.value.add(minorPatch)
  }
}
function isMajorPartiallySelected(majorPatch: string): boolean {
  return (
    (sortedMinors[majorPatch]?.some((v) => selectedMinorPatches.value.has(v)) &&
      !allPatchsets[majorPatch]?.isSubsetOf(selectedMinorPatches.value)) ?? false
  )
}
function toggleMajorPatch(majorPatch: string) {
  if (
    allPatchsets[majorPatch]?.isSubsetOf(selectedMinorPatches.value) ||
    isMajorPartiallySelected(majorPatch)
  ) {
    for (const minorPatch of allPatchsets[majorPatch] ?? []) {
      selectedMinorPatches.value.delete(minorPatch)
    }
  } else {
    for (const minorPatch of allPatchsets[majorPatch] ?? []) {
      selectedMinorPatches.value.add(minorPatch)
    }
  }
}
</script>

<template>
  <BDropdown aria-role="list" :close-on-click="false" max-height="50vh" :scrollable="true">
    <template #trigger="{ active }">
      <b-button
        :label="`${selectedMinorPatches.size} patches`"

        :icon-right="active ? 'menu-up' : 'menu-down'"
      />
    </template>
    <div v-for="majorPatch of sortedMajors" :key="majorPatch">
      <BDropdownItem
        class="has-text-weight-bold is-size-5"
        :class="{'is-active': allPatchsets[majorPatch]?.isSubsetOf(selectedMinorPatches)}"
        @click="toggleMajorPatch(majorPatch)">
        <BCheckbox
          @click.prevent
          :indeterminate="isMajorPartiallySelected(majorPatch)"
          :model-value="allPatchsets[majorPatch]?.isSubsetOf(selectedMinorPatches)"
        >
          {{ majorPatch }}
          <span class="pl-2 has-text-weight-normal has-text-grey-light" v-if="patchSizes">
            ({{ Object.keys(patchSizes).reduce(
              (sum,val) => allPatchsets[majorPatch]?.has(val) ? sum+patchSizes![val]! : sum,0) }})
          </span>
        </BCheckbox>
      </BDropdownItem>
      <BDropdownItem
        v-for="minorPatch of sortedMinors[majorPatch]"
        :class="{'is-active': selectedMinorPatches.has(minorPatch)}"
        @click="toggleMinorPatch(minorPatch)"
      >
        <BCheckbox @click.prevent :model-value="selectedMinorPatches.has(minorPatch)">
          {{ minorPatch }}
          <span class="pl-2 has-text-grey-light" v-if="patchSizes">
            ({{ patchSizes[minorPatch] }})
          </span>
        </BCheckbox>
      </BDropdownItem>
    </div>
  </BDropdown>
</template>

<style scoped>
.dropdown-trigger button {
  justify-content: space-between;
  min-width: 9rem;
}
</style>
