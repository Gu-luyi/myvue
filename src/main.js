import { createApp } from 'vue'
import 'vant/lib/index.css'
import App from './App.vue'
import vant from 'vant'
import router from './router/index'

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createPinia } from 'pinia'
const pinia=createPinia()


pinia.use(piniaPluginPersistedstate)

const vm=createApp(App)
vm.use(vant)
vm.use(pinia)
vm.use(router)
vm.mount('#app')

