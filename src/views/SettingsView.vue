<script setup lang="ts">
import { computed, ref } from 'vue'
import { BButton, BField } from 'buefy'

import { useSettingsStore } from '@/stores/settings'

import HeroPickerGrid from '@/components/HeroPickerGrid.vue'
import PatchPickerDropdown from '@/components/PatchPickerDropdown.vue'
import HeroSetSelect from '@/components/HeroSetSelect.vue'
import { FAVORITES_SET_NAME } from '@/components/HeroSetSelect.vue'

const settings = useSettingsStore()

const selectedHeroSetName = ref(FAVORITES_SET_NAME)
const selectedHeroSet = computed({
  get() {
    if (selectedHeroSetName.value === FAVORITES_SET_NAME)
      return settings.favoriteHeroes
    else {
      return settings.customHeroSets.find((csh) => csh.name === selectedHeroSetName.value)?.heroes!
    }
  },
  set(newValue) {
    if (newValue) {
      if (selectedHeroSetName.value === FAVORITES_SET_NAME)
        settings.favoriteHeroes = newValue
      else {
        const customSet = settings.customHeroSets.find((csh) => csh.name === selectedHeroSetName.value)
        if (customSet) {
          customSet.heroes = newValue
        }
      }
    }
  },
})

function addHeroSet() {
  const setName = prompt('Enter name of the new set')
  if (setName === FAVORITES_SET_NAME || settings.customHeroSets.find(o => o.name === setName)) {
    alert(`Set with the name "${setName}" already exists!`)
    return
  } else if (!setName) {
    alert(`Set name cannot be empty!`)
  } else {
    settings.customHeroSets.push({
      name: setName,
      heroes: new Set<string>()
    })
    selectedHeroSetName.value = setName
  }
}
function deleteHeroSet() {
  const i = settings.customHeroSets.findIndex(o => o.name === selectedHeroSetName.value)
  if (i !== -1) {
    selectedHeroSetName.value = FAVORITES_SET_NAME
    settings.customHeroSets.splice(i, 1)
  }
}
function renameHeroSet() {
  const newName = prompt(`Enter new name for set "${selectedHeroSetName.value}"`)
  if (newName === FAVORITES_SET_NAME || settings.customHeroSets.find(o => o.name === newName)) {
    alert(`Set with the name "${newName}" already exists!`)
    return
  } else if (!newName) {
    alert(`Set name cannot be empty!`)
  } else {
    const el = settings.customHeroSets.find(o => o.name === selectedHeroSetName.value)
    if (el) {
      el.name = newName
      selectedHeroSetName.value = newName
    }
  }
}
const canMoveHeroSet = computed(() => {
  const i = settings.customHeroSets.findIndex(o => o.name === selectedHeroSetName.value)
  return {
    up: i > 0,
    down: i < settings.customHeroSets.length-1,
  }
})
function moveHeroSet(moveUp:boolean) {
  const i = settings.customHeroSets.findIndex(o => o.name === selectedHeroSetName.value)
  if (moveUp && canMoveHeroSet.value.up) {
    [settings.customHeroSets[i-1], settings.customHeroSets[i]] = [settings.customHeroSets[i]!, settings.customHeroSets[i-1]!]
  } else if (!moveUp && canMoveHeroSet.value.down) {
    [settings.customHeroSets[i], settings.customHeroSets[i+1]] = [settings.customHeroSets[i+1]!, settings.customHeroSets[i]!]
  }
}
</script>

<template>
  <h1>Settings</h1>
  <BField label="Default patches">
    <PatchPickerDropdown v-model="settings.defaultMinorPatches"/>
  </BField>
  <BField label="Hero sets" grouped group-multiline>
    <HeroSetSelect v-model="selectedHeroSetName"/>
    <div class="buttons">
      <BButton icon-left="plus-thick" type="is-success"
      @click="addHeroSet">
        Add
      </BButton>
      <BButton icon-left="delete" type="is-danger"
      :disabled="selectedHeroSetName===FAVORITES_SET_NAME"
      @click="deleteHeroSet">
        Delete
      </BButton>
      <BButton icon-left="rename" type="is-info"
      :disabled="selectedHeroSetName===FAVORITES_SET_NAME"
      @click="renameHeroSet">
        Rename
      </BButton>
      <BButton icon-left="arrow-up-thick" type="is-info"
      :disabled="selectedHeroSetName===FAVORITES_SET_NAME || !canMoveHeroSet.up"
      @click="moveHeroSet(true)">
        Move up
      </BButton>
      <BButton icon-left="arrow-down-thick" type="is-info"
        :disabled="selectedHeroSetName===FAVORITES_SET_NAME || !canMoveHeroSet.down"
        @click="moveHeroSet(false)">
        Move down
      </BButton>
    </div>
  </BField>
  <BField :label="`Heroes in set ${selectedHeroSetName}`">
    <HeroPickerGrid v-model="selectedHeroSet"/>
  </BField>
  <div class="field">
  </div>
  <div class="field">
  </div>
  <div class="field">
  </div>
</template>
