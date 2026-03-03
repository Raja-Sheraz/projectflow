import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { taskService } from '../services/taskService'

export interface Task {
  id: number
  projectId: number
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'done'
  assignedTo: number | null
}

export const useTaskStore = defineStore('tasks', () => {

  const tasks = ref<Task[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  /* ---------------- Getters ---------------- */

  const totalTasks = computed(() => tasks.value.length)

  function getTasksByProject(projectId: number) {
    return tasks.value.filter(t => t.projectId === projectId)
  }

  /* ---------------- Fetch ---------------- */

  async function fetchTasks() {
    loading.value = true
    error.value = null

    try {
      tasks.value = await taskService.fetchTasks()
    } catch (err) {
      error.value = 'Failed to load tasks'
    } finally {
      loading.value = false
    }
  }

  /* ---------------- Add ---------------- */

  async function addTask(taskData: Omit<Task, 'id'>) {
    const newTask: Task = {
      id: Date.now(),
      ...taskData
    }

    await taskService.createTask(newTask)

    tasks.value.push(newTask)
  }

  /* ---------------- Update ---------------- */

  async function updateTask(updated: Task) {
    await taskService.updateTask(updated)

    const index = tasks.value.findIndex(t => t.id === updated.id)

    if (index !== -1) {
      tasks.value[index] = { ...updated }
    }
  }

  /* ---------------- Delete ---------------- */

  async function deleteTask(id: number) {
    await taskService.deleteTask(id)
    tasks.value = tasks.value.filter(t => t.id !== id)
  }

  return {
    tasks,
    loading,
    error,
    totalTasks,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
    getTasksByProject
  }
})