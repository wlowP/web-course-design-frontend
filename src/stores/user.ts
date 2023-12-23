import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { UserInfo } from '@/types/User'
import { UserType } from '@/types/Enums'
import type { Student } from '@/types/Student'
import type { Teacher } from '@/types/Teacher'

// 用户信息状态
const useUserStore = defineStore('user', () => {
  const userInfo = ref<UserInfo>({
    userId: 0,
    name: '',
    userType: UserType.NULL, // 0 -> NULL, 1 -> ADMIN, 2 -> STUDENT, 3 -> TEACHER
    avatar: '',
    token: ''
  })

  const currentUser = ref<Student | Teacher>({})

  // 可以修改的计算属性
  const token = computed({
    get: () => userInfo.value.token,
    set: value => userInfo.value.token = value
  })

  // 登录页面记录下的表单数据
  const loginForm = ref({
    username: '',
    password: '',
    remember: false
  })

  return { userInfo, token, currentUser, loginForm }
}, {
  persist: {
    key: id => 'KEY__OF_' + id.toUpperCase(),
    storage: localStorage,
    paths: ['userInfo', 'loginForm', 'currentUser']
  }
})

export default useUserStore
