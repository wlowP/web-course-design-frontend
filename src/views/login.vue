<template>
  <!-- 登录页面 -->
  <div class="login">
    你好
    <div>这是登录页面</div>
    <a-button type="default" @click="login">登录为管理员</a-button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ch } from '@/utils/commons'
import request, { DataResponse } from '@/utils/request'
import useUserStore from '@/stores/user'
import type { UserInfo } from '@/types/User'
import { message } from 'ant-design-vue'

const router = useRouter()
const store = useUserStore()

const login = async () => {
  const res = await request.post('/auth/login', {
    username: 'admin',
    password: 123
  }) as DataResponse<UserInfo>

  if (res.code === 0) {
    store.userInfo = res.data
    message.success(`欢迎回来, ${res.data.name} ~`)
    await router.push(ch('/主页'))
  } else {
    message.error(res.msg)
  }
}
</script>

<style scoped>

</style>
