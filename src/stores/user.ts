import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

// 用户信息状态
const useUserStore = defineStore('user', () => {
  const userInfo = ref({
    username: '',
    token: '123',
    id: 0,
    userType: 'ADMIN' // ADMIN, STUDENT, TEACHER
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
    storage: localStorage
  }
})

export default useUserStore
