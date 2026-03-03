import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { taskService } from '../services/taskService'

export interface Task {
  id: number
  projectId: number
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'done'
}

export const useTaskStore = defineStore('tasks', () => {

  const tasks = ref<Task[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  /* Getter */
  const totalTasks = computed(() => tasks.value.length)

  /* Fetch */
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

  /* Add */
  async function addTask(taskData: Omit<Task, 'id'>) {
    const newTask: Task = {
      id: Date.now(),
      ...taskData
    }

    await taskService.createTask(newTask)
    await fetchTasks()
  }

  /* Update */
  async function updateTask(updated: Task) {
    await taskService.updateTask(updated)
    await fetchTasks()
  }

  /* Delete */
  async function deleteTask(id: number) {
    await taskService.deleteTask(id)
    await fetchTasks()
  }

  /* Filter by Project */
  function getTasksByProject(projectId: number) {
    return tasks.value.filter(t => t.projectId === projectId)
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