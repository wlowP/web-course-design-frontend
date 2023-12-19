import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/css/base.scss'

import persist from 'pinia-plugin-persistedstate'
import VMdEditor from '@kangc/v-md-editor'
import '@kangc/v-md-editor/lib/style/base-editor.css'
import vuePressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js'
import '@kangc/v-md-editor/lib/theme/style/vuepress.css'
import Prism from 'prismjs'

const app = createApp(App)

VMdEditor.use(vuePressTheme, { Prism })
app.use(VMdEditor)

const pinia = createPinia()

// 配置pinia持久化存储插件
pinia.use(persist)
app.use(pinia)

app.use(router)

app.mount('#app')
