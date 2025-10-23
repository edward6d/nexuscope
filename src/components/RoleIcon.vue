<script setup lang="ts">
import { computed, ref } from 'vue'
import { getRoleIconUrl, sanitizeName } from '@/common/heroes'
interface Props {
  colored?: boolean,
  role: string,
}

const props = withDefaults(defineProps<Props>(), {
  colored: false,
})

// can add :class="`role-${sanitizeName(role)}`" to play around with effects later
</script>

<template>
  <div class="icon" :class="{'huemagic':props.colored}">
    <img :src="getRoleIconUrl(role)" />
    <img
      :src="getRoleIconUrl(role)"
      class="duplicate"
      :class="`role-${sanitizeName(role)}`"
      v-if="props.colored"
      />
  </div>
</template>

<style scoped>
.huemagic {
  position: relative;
  overflow: hidden;
}
.huemagic img:first-child {
  mix-blend-mode: screen;
}
.duplicate {
  position: absolute;
  inset: 0;
  transform: translateX(-10000px);
}
.role-bruiser {
  filter: drop-shadow(10000px 0 0 hsl(15deg, 100%, 60%));
}
.role-healer {
  filter: drop-shadow(10000px 0 0 hsl(113deg, 75%, 50%));
}
.role-meleeassassin {
  filter: drop-shadow(10000px 0 0 hsl(0deg, 100%, 60%));
}
.role-rangedassassin {
  filter: drop-shadow(10000px 0 0 hsl(267deg, 100%, 60%));
}
.role-support {
  filter: drop-shadow(10000px 0 0 hsl(212deg, 100%, 60%));
}
.role-tank {
  filter: drop-shadow(10000px 0 0 hsl(45deg, 100%, 50%));
}
</style>
