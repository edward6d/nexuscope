import { nextTick } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import { getHeroData } from '@/common/heroes'
import { getMapData } from '@/common/maps'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/', redirect: { name: 'heroes' }
    },
    {
      path: '/heroes/:game_map?',
      name: 'heroes',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/HeroesView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/maps/:hero?',
      name: 'maps',
      component: () => import('../views/MapsView.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
    },
  ],
})

router.afterEach((to, from) => {
  nextTick(() => {
    let title = 'NexuScope'

    if (to.name === 'about') {
      title = `${title} - About`
    } else if (to.name === 'settings') {
      title = `${title} - Settings`
    } else if (to.name === 'maps' && to.params.hero) {
      title = `${title} - ${getHeroData(to.params.hero as string).name}`
    } else if (to.name === 'heroes' && to.params.game_map) {
      title = `${title} - ${getMapData(to.params.game_map as string).name}`
    }
    document.title = title
  })
})

export default router
