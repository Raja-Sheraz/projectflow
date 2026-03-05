<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useAuthStore } from './stores/authStore'
import { useProjectStore } from './stores/projectStore'
import { useTaskStore } from './stores/taskStore'
import AppLoader from './components/AppLoader.vue'

const authStore = useAuthStore()
const projectStore = useProjectStore()
const taskStore = useTaskStore()

onMounted(() => {
  authStore.loadUser()
})

const loading = computed(() =>
  projectStore.loading || taskStore.loading
)
</script>

<template>

<AppLoader :loading="loading" />

<router-view />

</template>