import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: number
  name: string
  role: 'admin' | 'member'
}

export const useUserStore = defineStore('users', () => {

  const users = ref<User[]>([
    { id: 1, name: 'Raja', role: 'admin' },
    { id: 2, name: 'Ali', role: 'member' },
    { id: 3, name: 'Ahmed', role: 'member' }
  ])

  const totalUsers = computed(() => users.value.length)

  function getUserById(id: number | null) {
    if (!id) return null
    return users.value.find(u => u.id === id) || null
  }

  return {
    users,
    totalUsers,
    getUserById
  }
})