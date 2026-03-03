import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: number
  name: string
  role: 'admin' | 'member'
}

export const useUserStore = defineStore('users', () => {

  const users = ref<User[]>([])
  const loading = ref(false)

  const totalUsers = computed(() => users.value.length)

  async function fetchUsers() {
    loading.value = true

    await new Promise(resolve => setTimeout(resolve, 200))

    const saved = localStorage.getItem('users')

    if (saved) {
      users.value = JSON.parse(saved)
    } else {
      // Default seed users (only first time)
      users.value = [
        { id: 1, name: 'Raja', role: 'admin' },
        { id: 2, name: 'Ali', role: 'member' },
        { id: 3, name: 'Ahmed', role: 'member' }
      ]

      localStorage.setItem('users', JSON.stringify(users.value))
    }

    loading.value = false
  }

  function getUserName(id: number | null) {
    if (!id) return 'Unassigned'
    const user = users.value.find(u => u.id === id)
    return user ? user.name : 'Unknown'
  }

  return {
    users,
    totalUsers,
    loading,
    fetchUsers,
    getUserName
  }
})