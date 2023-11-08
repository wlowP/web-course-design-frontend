<template>
  <div class="course">
    这是课程管理页面
    <a-button @click="test">测试</a-button>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const test = () => {
  const routes = route.path.substring(1).split('/')
  console.log(decodeURI(routes[1]))
}
</script>

<style scoped>

</style>
