import { createRouter, createWebHistory } from 'vue-router'
import { ch } from '@/utils/commons'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: ch('/用户登录') },
    { path: ch('/用户登录'), component: () => import('@/views/login.vue') },
    { path: ch('/主页'), component: () => import('@/views/layout.vue') }
  ]
})

export default router
