<template>
  <div class="teacher">
    <a-page-header class="header"
                   @back="router.back()"
                   :avatar="{ src: svgTeacherList, shape: 'square' }"
    >
      <template #title><span class="title">教师管理</span></template>
      <span class="tip">展示教师的各项信息</span>
    </a-page-header>
    <a-card bordered>
      11
    </a-card>
  </div>
</template>

<script setup lang="ts">
import svgTeacherList from '@/assets/svg/教师管理.svg'
import { useRouter } from 'vue-router'

const router = useRouter()


</script>

<style scoped>

</style>
