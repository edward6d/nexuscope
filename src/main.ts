import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import Buefy from 'buefy'
import 'buefy/dist/css/buefy.css'

import App from './App.vue'
import router from './router'

import './assets/main.css'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.use(Buefy, {
  defaultIconPack: 'mdi' // via CDN
})

app.mount('#app')
