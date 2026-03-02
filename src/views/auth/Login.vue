<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

// 🔹 form state
const email = ref('')
const password = ref('')
const errorMessage = ref('')

// 🔹 computed validation
const isFormValid = computed(() => {
  return email.value.includes('@') && password.value.length >= 6
})

// 🔹 watch example
watch(email, (newValue) => {
  if (!newValue.includes('@')) {
    errorMessage.value = 'Invalid email format'
  } else {
    errorMessage.value = ''
  }
})

// 🔹 login handler
function handleLogin() {
  if (!isFormValid.value) return

  // Fake login logic
  authStore.login('fake-jwt-token', {
    id: 1,
    name: 'Raja',
    role: email.value === 'admin@gmail.com' ? 'admin' : 'member'
  })

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
    </div>
  </div>
</template>