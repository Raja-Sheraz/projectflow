<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { useProjectStore } from '../../stores/projectStore'
import type { Project } from '../../stores/projectStore'

const projectStore = useProjectStore()

const name = ref('')
const description = ref('')
const editingId = ref<number | null>(null)

const searchQuery = ref('')
const debouncedSearch = ref('')
const selectedStatus = ref<'all' | 'active' | 'completed'>('all')

onMounted(() => {
  projectStore.fetchProjects()
})

/* 🔹 Debounce Search */
let timeout: any
watch(searchQuery, (value) => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    debouncedSearch.value = value
  }, 400)
})

/* 🔹 Filtered + Searched Projects */
const filteredProjects = computed(() => {
  return projectStore.projects.filter(project => {
    const matchesSearch =
      project.name.toLowerCase().includes(debouncedSearch.value.toLowerCase()) ||
      project.description.toLowerCase().includes(debouncedSearch.value.toLowerCase())

    const matchesStatus =
      selectedStatus.value === 'all' ||
      project.status === selectedStatus.value

    return matchesSearch && matchesStatus
  })
})

function handleAddProject() {
  if (!name.value.trim()) return

  projectStore.addProject({
    name: name.value,
    description: description.value,
    status: 'active'
  })

  resetForm()
}

function startEdit(project: Project) {
  editingId.value = project.id
  name.value = project.name
  description.value = project.description
}

function handleUpdate() {
  if (!editingId.value) return

  const existing = projectStore.projects.find(p => p.id === editingId.value)
  if (!existing) return

  projectStore.updateProject({
    ...existing,
    name: name.value,
    description: description.value
  })

  resetForm()
}

function toggleStatus(project: Project) {
  projectStore.updateProject({
    ...project,
    status: project.status === 'active' ? 'completed' : 'active'
  })
}

function resetForm() {
  editingId.value = null
  name.value = ''
  description.value = ''
}
</script>

<template>
  <div class="max-w-5xl mx-auto">

    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-3xl font-bold text-gray-800">
        Projects
      </h2>

      <span class="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
        {{ filteredProjects.length }} Total
      </span>
    </div>

    <!-- Add / Edit Form -->
    <div class="bg-white shadow-md rounded-lg p-6 mb-8">
      <div class="flex flex-col md:flex-row gap-4">
        <input
          v-model="name"
          placeholder="Project name"
          class="border rounded px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          v-model="description"
          placeholder="Description"
          class="border rounded px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          v-if="!editingId"
          @click="handleAddProject"
          class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Add
        </button>

        <button
          v-else
          @click="handleUpdate"
          class="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
        >
          Update
        </button>
      </div>
    </div>

    <!-- Search + Filter -->
    <div class="flex flex-col md:flex-row gap-4 mb-8">
      <input
        v-model="searchQuery"
        placeholder="Search by name or description..."
        class="border rounded px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <select
        v-model="selectedStatus"
        class="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="all">All Status</option>
        <option value="active">Active</option>
        <option value="completed">Completed</option>
      </select>
    </div>

    <!-- Loading -->
    <div v-if="projectStore.loading" class="text-center py-10 text-gray-500">
      Loading projects...
    </div>

    <!-- Projects List -->
    <div v-if="filteredProjects.length" class="space-y-6">
      <div
        v-for="project in filteredProjects"
        :key="project.id"
        class="bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row justify-between gap-4"
      >
        <div>
          <div class="flex items-center gap-3 mb-2">
            <h3 class="text-lg font-semibold text-gray-800">
              {{ project.name }}
            </h3>

            <!-- Status Badge -->
            <span
              :class="[
                'text-xs px-3 py-1 rounded-full',
                project.status === 'active'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-200 text-gray-700'
              ]"
            >
              {{ project.status }}
            </span>
          </div>

          <p class="text-gray-600 text-sm">
            {{ project.description }}
          </p>
        </div>

        <div class="flex flex-wrap gap-3 items-center">
          <button
            @click="startEdit(project)"
            class="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Edit
          </button>

          <button
            @click="projectStore.deleteProject(project.id)"
            class="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Delete
          </button>

          <button
            @click="toggleStatus(project)"
            class="text-purple-600 hover:text-purple-800 text-sm font-medium"
          >
            {{ project.status === 'active' ? 'Mark Completed' : 'Mark Active' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="text-center text-gray-400 py-16 text-lg"
    >
      🚀 No projects found. Start by adding a new project.
    </div>

  </div>
</template>