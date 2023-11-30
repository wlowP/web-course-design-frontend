import { createRouter, createWebHistory, Router } from 'vue-router'
import { ch } from '@/utils/commons'

const router: Router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: ch('/登录') },
    { path: ch('/登录'), component: () => import('@/views/login.vue') },
    {
      path: ch('/主页'),
      component: () => import('@/views/main.vue'),
      redirect: ch('/主页/个人信息/系统简介'),
      beforeEnter: (to, from) => {
        // todo: 在这里进行登录判断, 如果没有登录, 则跳转回到登录页面
      },
      children: [
        { path: ch('测试页面'), component: () => import('@/views/test.vue') },
        { path: ch('个人信息/系统简介'), component: () => import('@/views/userinfo/sys-description.vue') },
        { path: ch('个人信息/修改密码'), component: () => import('@/views/userinfo/renew-password.vue') },
        { path: ch('个人信息/项目文档'), component: () => import('@/views/userinfo/project-doc.vue') },
        { path: ch('个人信息/项目视频'), component: () => import('@/views/userinfo/project-video.vue') },
        { path: ch('个人信息/个人简介'), component: () => import('@/views/userinfo/introduction.vue') },
        { path: ch('系统管理/菜单管理'), component: () => import('@/views/system/menu.vue') },
        { path: ch('系统管理/字典管理'), component: () => import('@/views/system/dictionary.vue') },
        { path: ch('人员管理/学生管理'), component: () => import('@/views/staff/student.vue') },
        { path: ch('人员管理/学生信息'), component: () => import('@/views/staff/student-info.vue') },
        { path: ch('人员管理/教师管理'), component: () => import('@/views/staff/teacher.vue') },
        { path: ch('教务管理/课程管理'), component: () => import('@/views/education/course.vue') },
        { path: ch('教务管理/成绩管理'), component: () => import('@/views/education/score.vue') }
      ]
    },
    // todo: 404页面
  ]
})

export default router
