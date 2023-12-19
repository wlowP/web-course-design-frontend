<template>
  <div class="project-doc">
    <v-md-editor v-model="mdText"
                 mode="preview"
                 height="calc(100vh - 95px)"
                 :default-show-toc="true"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import md from '@/assets/README.md?raw'

const mdText = ref(md)
</script>
