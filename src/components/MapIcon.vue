<script setup lang="ts">
import { BImage } from 'buefy';
import { getMapIconUrl } from '@/common/maps'

interface Props {
  gameMap: string
}

const props = withDefaults(defineProps<Props>(), { gameMap: '_unknown', })

</script>

<template>
  <div class="icon-wrap">
    <BImage
      :src="getMapIconUrl(gameMap)"
    />
  </div>
</template>

<style scoped>
.icon-wrap {
  position: relative;
}
</style>
