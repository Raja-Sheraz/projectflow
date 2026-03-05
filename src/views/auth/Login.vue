<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const errorMessage = ref('')

const isFormValid = computed(() => {
  return email.value.includes('@') && password.value.length >= 6
})

watch(email, (newValue) => {
  if (!newValue.includes('@')) {
    errorMessage.value = 'Invalid email format'
  } else {
    errorMessage.value = ''
  }
})

function handleLogin() {

  if (!isFormValid.value) return

  authStore.login(email.value, password.value)

  router.push('/dashboard')

}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded shadow w-96">
      <h1 class="text-2xl font-bold mb-6">Login</h1>

      <input
        v-model="email"
        type="email"
        placeholder="Email"
        class="w-full mb-3 p-2 border rounded"
      />

      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="w-full mb-3 p-2 border rounded"
      />

      <p v-if="errorMessage" class="text-red-500 text-sm mb-2">
        {{ errorMessage }}
      </p>

      <button
        :disabled="!isFormValid"
        @click="handleLogin"
        class="w-full bg-blue-500 text-white p-2 rounded disabled:opacity-50"
      >
        Login
      </button>

      <p class="text-sm text-gray-500 mt-4 text-center">
  Don't have an account?
  <RouterLink to="/register" class="text-blue-500">
    Register
  </RouterLink>
</p>
    </div>
  </div>
</template>