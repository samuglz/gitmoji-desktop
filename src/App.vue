<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
onMounted(() => {
  const router = useRouter()
  router.push('/')
})
</script>

<template>
  <router-view />
</template>
