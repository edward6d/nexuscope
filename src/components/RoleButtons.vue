<script setup lang="ts">
import { BButton } from 'buefy'
import { getRoleIconUrl, HERO_ROLES, type HeroRole } from '@/common/heroes'

const selectedRoles = defineModel<Set<string>>({ required: true })

function toggleRole(role: HeroRole) {
  if (selectedRoles.value.has(role)) {
    selectedRoles.value.delete(role)
  } else {
    selectedRoles.value.add(role)
  }
}
</script>

<template>
<div>
  <BButton
    v-for="role of HERO_ROLES"
    @click="toggleRole(role)"
    class="role-btn mx-1"
    :class="{'disabled': !selectedRoles.has(role)}"
    :style="{ '--btn-img': `url(${getRoleIconUrl(role)})` }">
    <span class="icon">
      <i class="mdi mdi-blank"></i>
    </span>
  </BButton>
</div>
</template>

<style scoped>
button {
  background-image: var(--btn-img);
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100% auto; /* tweak (e.g. 80%) to taste */
}

.disabled {
  filter: grayscale(60%) brightness(0.5);
}
</style>
