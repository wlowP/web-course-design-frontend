import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { UserInfo } from '@/types/User'
import { UserType } from '@/types/Enums'

// 用户信息状态
const useUserStore = defineStore('user', () => {
  const userInfo = ref<UserInfo>({
    userId: 0,
    name: '',
    userType: UserType.STUDENT, // 1 -> ADMIN, 2 -> STUDENT, 3 -> TEACHER
    avatar: '',
    token: ''
  })

  // 可以修改的计算属性
  const token = computed({
    get: () => userInfo.value.token,
    set: value => userInfo.value.token = value
  })

  return { userInfo, token }
}, {
  persist: {
    key: id => 'KEY__OF_' + id.toUpperCase(),
    storage: localStorage,
    paths: ['userInfo']
  }
})

export default useUserStore
