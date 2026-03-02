import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Project {
  id: number
  name: string
  description: string
  status: 'active' | 'completed'
  createdAt: string
}

export const useProjectStore = defineStore('projects', () => {

  // 🔹 State
  const projects = ref<Project[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 🔹 Getter
  const totalProjects = computed(() => projects.value.length)

  // 🔹 Actions

  // Simulate API fetch
  async function fetchProjects() {
    loading.value = true
    error.value = null

    try {
      await new Promise(resolve => setTimeout(resolve, 800))

      const saved = localStorage.getItem('projects')
      projects.value = saved ? JSON.parse(saved) : []
    } catch (err) {
      error.value = 'Failed to load projects'
    } finally {
      loading.value = false
    }
  }

  function addProject(project: Omit<Project, 'id' | 'createdAt'>) {
    const newProject: Project = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      ...project
    }

    projects.value.push(newProject)
    localStorage.setItem('projects', JSON.stringify(projects.value))
  }

  function deleteProject(id: number) {
    projects.value = projects.value.filter(p => p.id !== id)
    localStorage.setItem('projects', JSON.stringify(projects.value))
  }

  function updateProject(updatedProject: Project) {
  const index = projects.value.findIndex(p => p.id === updatedProject.id)

  if (index !== -1) {
    projects.value[index] = updatedProject
    localStorage.setItem('projects', JSON.stringify(projects.value))
  }
}

return {
  projects,
  loading,
  error,
  totalProjects,
  fetchProjects,
  addProject,
  deleteProject,
  updateProject
}


})