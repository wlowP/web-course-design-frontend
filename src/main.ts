
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/css/base.scss'

import persist from 'pinia-plugin-persistedstate'

const app = createApp(App)

const pinia = createPinia()

// 配置pinia持久化存储插件
pinia.use(persist)
app.use(pinia)

app.use(router)

app.mount('#app')
