<template>
  <div class="project-doc">
    <v-md-preview :text="md" height="calc(100vh - 95px)"/>
  </div>
</template>

<script setup lang="ts">
import md from '@/assets/README.md?raw'
</script>
