<template>
  <!-- 登录页面 -->
  <div class="login">
    你好
    <div>这是登录页面</div>
    <AButton type="default" @click="router.push(ch('/主页'))">登录</AButton>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ch } from '@/utils/commons'

const router = useRouter()
</script>

<style scoped>

</style>
