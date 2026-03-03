import type { Task } from '../stores/taskStore'

export const taskService = {

async fetchTasks(): Promise<Task[]> {
  await new Promise(resolve => setTimeout(resolve, 300))

  const saved = localStorage.getItem('tasks')
  const tasks = saved ? JSON.parse(saved) : []

  const normalized: Task[] = tasks.map((task: any) => ({
    id: task.id,
    projectId: task.projectId,
    title: task.title,
    description: task.description,
    status: task.status,
    assignedTo: task.assignedTo ?? null
  }))

  // 🔥 persist normalized structure back
  localStorage.setItem('tasks', JSON.stringify(normalized))

  return normalized
},

  async createTask(task: Task) {
    await new Promise(resolve => setTimeout(resolve, 200))

    const saved = localStorage.getItem('tasks')
    const tasks: Task[] = saved ? JSON.parse(saved) : []

    tasks.push(task)

    localStorage.setItem('tasks', JSON.stringify(tasks))
  },

  async updateTask(updated: Task) {
    await new Promise(resolve => setTimeout(resolve, 200))

    const saved = localStorage.getItem('tasks')
    const tasks: Task[] = saved ? JSON.parse(saved) : []

    const index = tasks.findIndex((t: Task) => t.id === updated.id)

    if (index !== -1) {
      tasks[index] = { ...updated }
      localStorage.setItem('tasks', JSON.stringify(tasks))
    }
  },

  async deleteTask(id: number) {
    await new Promise(resolve => setTimeout(resolve, 200))

    const saved = localStorage.getItem('tasks')
    const tasks: Task[] = saved ? JSON.parse(saved) : []

    const filtered = tasks.filter((t: Task) => t.id !== id)

    localStorage.setItem('tasks', JSON.stringify(filtered))
  }
}