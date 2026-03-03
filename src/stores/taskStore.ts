import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Task {
  id: number
  projectId: number
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'done'
}

export const useTaskStore = defineStore('tasks', () => {

  const tasks = ref<Task[]>([])

  function loadTasks() {
    const saved = localStorage.getItem('tasks')
    tasks.value = saved ? JSON.parse(saved) : []
  }

  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks.value))
  }

  function addTask(task: Omit<Task, 'id'>) {
    tasks.value.push({
      id: Date.now(),
      ...task
    })
    saveTasks()
  }

  function updateTask(updatedTask: Task) {
    const index = tasks.value.findIndex(t => t.id === updatedTask.id)
    if (index !== -1) {
      tasks.value[index] = updatedTask
      saveTasks()
    }
  }

  function deleteTask(id: number) {
    tasks.value = tasks.value.filter(t => t.id !== id)
    saveTasks()
  }

  function getTasksByProject(projectId: number) {
    return tasks.value.filter(t => t.projectId === projectId)
  }

  return {
    tasks,
    loadTasks,
    addTask,
    updateTask,
    deleteTask,
    getTasksByProject
  }
})