<script setup lang="ts">
import { ref, computed } from "vue"

const name = ref("")
const email = ref("")
const password = ref("")

const isValid = computed(() => {
  return (
    name.value.length >= 3 &&
    email.value.includes("@") &&
    password.value.length >= 6
  )
})

function register() {
  if (!isValid.value) return
  alert("User registered (demo)")
}
</script>

<template>

<div class="min-h-screen flex items-center justify-center bg-gray-100">

<div class="bg-white p-8 rounded shadow w-96">

<h1 class="text-2xl font-bold mb-6">
Register
</h1>

<input
v-model="name"
placeholder="Name"
class="w-full mb-3 p-2 border rounded"
/>

<input
v-model="email"
placeholder="Email"
class="w-full mb-3 p-2 border rounded"
/>

<input
v-model="password"
type="password"
placeholder="Password"
class="w-full mb-3 p-2 border rounded"
/>

<button
@click="register"
:disabled="!isValid"
class="w-full bg-blue-500 text-white p-2 rounded disabled:opacity-50"
>
Register
</button>

</div>

</div>

</template>