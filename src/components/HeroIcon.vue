<script setup lang="ts">
import { BIcon, BImage } from 'buefy';
import { getHeroIconUrl } from '@/common/heroes'

interface Props {
  favorite?: boolean,
  hero: string
}

const props = withDefaults(defineProps<Props>(), {
  favorite: false,
  hero: '_unknown',
})
</script>

<template>
  <div class="icon-wrap">
    <BImage :src="getHeroIconUrl(hero)"/>
    <div class="favorite-icon" v-if="favorite">
      <BIcon icon="heart-circle-outline" />
    </div>
  </div>
</template>

<style scoped>
.icon-wrap {
  position: relative;
}
.favorite-icon {
  position: absolute;
  top: 4%;
  left: 4%;
  border-radius: 50%;
  padding: 0;
  margin: 0;
  height: 24px;
  background: linear-gradient(0deg,hsla(295, 90%, 15%, 0.8) 0%, hsla(295, 90%, 30%, 0.8) 100%);
}
.favorite-icon .icon {
  background: linear-gradient(0deg,rgba(220, 24, 224, 1) 0%, rgba(234, 119, 237, 1) 60%, rgba(255, 255, 255, 1) 100%);
  background-clip: text;
  color: transparent;
}
</style>
