<template>
  <p>.</p>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

authStore.signOut()
router.push({ name: 'login' })
</script>
