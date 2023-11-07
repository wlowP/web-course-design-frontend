<template>
  <!-- 登录页面 -->
  <div class="login">
    你好
    <div>这是登录页面</div>
    <a-button type="default" @click="router.push(ch('/主页'))">登录</a-button>
    <a-button @click="test">测试</a-button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ch } from '@/utils/commons'
import request from '@/utils/request'

const router = useRouter()

const test = async () => {
  const res = await request.post('http://localhost:9090/auth/helloWorld')
  console.log('res = ', res)
}
</script>

<style scoped>

</style>
