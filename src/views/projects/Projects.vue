<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { useProjectStore } from '../../stores/projectStore'
import type { Project } from '../../stores/projectStore'

const projectStore = useProjectStore()

const name = ref('')
const description = ref('')
const editingId = ref<number | null>(null)

const searchQuery = ref('')
const selectedStatus = ref<'all' | 'active' | 'completed'>('all')

onMounted(() => {
  projectStore.fetchProjects()
})

/* 🔹 Debounce Search */
let timeout: any
watch(searchQuery, () => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    // just trigger reactivity
  }, 400)
})

/* 🔹 Filtered + Searched Projects */
const filteredProjects = computed(() => {
  return projectStore.projects.filter(project => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.value.toLowerCase())

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

function resetForm() {
  editingId.value = null
  name.value = ''
  description.value = ''
}
</script>


<template>
  <div class="max-w-4xl mx-auto">

    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-bold">
        Projects ({{ filteredProjects.length }})
      </h2>
    </div>

    <!-- Add / Edit Form -->
    <div class="bg-white shadow rounded p-4 mb-6 flex gap-3">
      <input
        v-model="name"
        placeholder="Project name"
        class="border rounded px-3 py-2 flex-1"
      />
      <input
        v-model="description"
        placeholder="Description"
        class="border rounded px-3 py-2 flex-1"
      />

      <button
        v-if="!editingId"
        @click="handleAddProject"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add
      </button>

      <button
        v-else
        @click="handleUpdate"
        class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Update
      </button>
    </div>

    <!-- Search + Filter -->
    <div class="flex gap-4 mb-6">
      <input
        v-model="searchQuery"
        placeholder="Search projects..."
        class="border rounded px-3 py-2 flex-1"
      />

      <select
        v-model="selectedStatus"
        class="border rounded px-3 py-2"
      >
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="completed">Completed</option>
      </select>
    </div>

    <!-- Loading -->
    <div v-if="projectStore.loading" class="text-center py-6">
      Loading projects...
    </div>

    <!-- Projects List -->
    <div v-if="filteredProjects.length" class="space-y-4">
      <div
        v-for="project in filteredProjects"
        :key="project.id"
        class="bg-white shadow rounded p-4 flex justify-between items-center"
      >
        <div>
          <h3 class="font-semibold text-lg">{{ project.name }}</h3>
          <p class="text-gray-500 text-sm">
            {{ project.description }}
          </p>
        </div>

        <div class="flex gap-3">
          <button
            @click="startEdit(project)"
            class="text-blue-600 hover:underline"
          >
            Edit
          </button>

          <button
            @click="projectStore.deleteProject(project.id)"
            class="text-red-600 hover:underline"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-gray-500 py-10">
      No projects found.
    </div>

  </div>
</template>