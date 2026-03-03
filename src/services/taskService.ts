import type { Task } from '../stores/taskStore'

export const taskService = {

  async fetchTasks(): Promise<Task[]> {
    await new Promise(resolve => setTimeout(resolve, 300))

    const saved = localStorage.getItem('tasks')
    return saved ? JSON.parse(saved) : []
  },

  async createTask(task: Task) {
    await new Promise(resolve => setTimeout(resolve, 200))

    const saved = localStorage.getItem('tasks')
    const tasks = saved ? JSON.parse(saved) : []

    tasks.push(task)
    localStorage.setItem('tasks', JSON.stringify(tasks))
  },

  async updateTask(updated: Task) {
    await new Promise(resolve => setTimeout(resolve, 200))

    const saved = localStorage.getItem('tasks')
    const tasks = saved ? JSON.parse(saved) : []

    const index = tasks.findIndex((t: Task) => t.id === updated.id)

    if (index !== -1) {
      tasks[index] = updated
      localStorage.setItem('tasks', JSON.stringify(tasks))
    }
  },

  async deleteTask(id: number) {
    await new Promise(resolve => setTimeout(resolve, 200))

    const saved = localStorage.getItem('tasks')
    const tasks = saved ? JSON.parse(saved) : []

    const filtered = tasks.filter((t: Task) => t.id !== id)
    localStorage.setItem('tasks', JSON.stringify(filtered))
  }
}