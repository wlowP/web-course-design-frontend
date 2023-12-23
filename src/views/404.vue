<template>
  <div class="not-found">
    <a-result status="404" title="404" sub-title="抱歉, 您要找的页面不存在">
      <template #extra>
        <a-button type="primary" @click="$router.back()">返 回</a-button>
      </template>
    </a-result>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>
