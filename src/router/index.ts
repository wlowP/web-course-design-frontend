import { createRouter, createWebHistory, Router } from 'vue-router'
import { ch } from '@/utils/commons'
import { UserType } from '@/types/Enums'
import useUserStore from '@/stores/user'
import { message } from 'ant-design-vue'

let store

const router: Router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: ch('/登录') },
    { path: ch('/登录'), component: () => import('@/views/login.vue') },
    {
      path: ch('/主页'),
      component: () => import('@/views/main.vue'),
      redirect: ch('/主页/个人信息/系统简介'),
      beforeEnter: (to) => {
        if (!store) store = useUserStore()
        if (!to.meta.roles.includes(store.userInfo.userType)) {
          message.error('无权访问此页面').then(() => {})
          return { path: '/404' }
        }
      },
      children: [
        { path: ch('测试页面'), component: () => import('@/views/test.vue'), meta: { roles: [UserType.ADMIN, UserType.STUDENT, UserType.TEACHER] } },
        { path: ch('个人信息/系统简介'), component: () => import('@/views/userinfo/sys-description.vue'), meta: { roles: [UserType.ADMIN, UserType.STUDENT, UserType.TEACHER] } },
        { path: ch('个人信息/修改密码'), component: () => import('@/views/userinfo/renew-password.vue'), meta: { roles: [UserType.ADMIN, UserType.STUDENT, UserType.TEACHER] } },
        { path: ch('个人信息/项目文档'), component: () => import('@/views/userinfo/project-doc.vue'), meta: { roles: [UserType.ADMIN, UserType.STUDENT, UserType.TEACHER] } },
        { path: ch('个人信息/个人简介'), component: () => import('@/views/userinfo/introduction.vue'), meta: { roles: [UserType.STUDENT] } },
        { path: ch('个人信息/教师简介'), component: () => import('@/views/userinfo/introduction-teacher.vue'), meta: { roles: [UserType.TEACHER] } },
        { path: ch('人员管理/学生管理'), component: () => import('@/views/staff/student-list.vue'), meta: { roles: [UserType.ADMIN] } },
        { path: ch('人员管理/学生信息'), component: () => import('@/views/staff/student-info.vue'), meta: { roles: [UserType.ADMIN] } },
        { path: ch('人员管理/教师管理'), component: () => import('@/views/staff/teacher-list.vue'), meta: { roles: [UserType.ADMIN] } },
        { path: ch('人员管理/教师信息'), component: () => import('@/views/staff/teacher-info.vue'), meta: { roles: [UserType.ADMIN] } },
        { path: ch('教务管理/课程管理'), component: () => import('@/views/education/course-list.vue'), meta: { roles: [UserType.ADMIN] } },
        { path: ch('教务管理/成绩管理'), component: () => import('@/views/education/score-list.vue'), meta: { roles: [UserType.ADMIN] } },
        { path: ch('博客/博客编辑'), component: () => import('@/views/userinfo/blog-edit.vue'), meta: { roles: [UserType.ADMIN, UserType.STUDENT] } },
        { path: ch('博客/学生博客'), component: () => import('@/views/userinfo/blogs.vue'), meta: { roles: [UserType.ADMIN, UserType.STUDENT] } }
      ]
    },
    // 404页面
    { path: '/:unknownPath(.*)*', component: () => import('@/views/404.vue') }
  ]
})

export default router
