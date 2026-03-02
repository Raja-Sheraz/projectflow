<script setup lang="ts">
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

function logout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen flex bg-gray-100">

    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-md p-5">
      <h2 class="text-xl font-bold mb-6">ProjectFlow</h2>

      <nav class="space-y-3">
        <RouterLink to="/dashboard" class="block hover:text-blue-500">
          Dashboard
        </RouterLink>

        <!-- Role based UI -->
        <RouterLink
          v-if="authStore.user?.role === 'admin'"
          to="/projects"
          class="block hover:text-blue-500"
        >
          Projects
        </RouterLink>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">

      <!-- Topbar -->
      <header class="bg-white shadow p-4 flex justify-between">
        <h1 class="font-semibold">
          {{ $route.name }}
        </h1>

        <div class="flex items-center gap-4">
          <span>
            {{ authStore.user?.name }}
          </span>

          <button
            @click="logout"
            class="bg-red-500 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      </header>

      <!-- Page Content Slot -->
      <main class="p-6">
        <router-view />
      </main>

    </div>
  </div>
</template>