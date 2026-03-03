import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { projectService } from '../services/projectService'

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
    projects.value = await projectService.fetchProjects()
  } catch (err) {
    error.value = 'Failed to load projects'
  } finally {
    loading.value = false
  }
}

async function addProject(projectData: Omit<Project, 'id' | 'createdAt'>) {
  const newProject: Project = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    ...projectData
  }

  await projectService.createProject(newProject)
  await fetchProjects()
}

async function updateProject(updated: Project) {
  await projectService.updateProject(updated)
  await fetchProjects()
}

async function deleteProject(id: number) {
  await projectService.deleteProject(id)
  await fetchProjects()
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