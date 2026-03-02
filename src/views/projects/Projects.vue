<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { useProjectStore } from '../../stores/projectStore'
import type { Project } from '../../stores/projectStore'
import BaseModal from '../../components/BaseModal.vue'

const projectStore = useProjectStore()

/* -------------------- Form State -------------------- */
const name = ref('')
const description = ref('')
const editingId = ref<number | null>(null)
const showModal = ref(false)

/* -------------------- Search + Filter -------------------- */
const searchQuery = ref('')
const debouncedSearch = ref('')
const selectedStatus = ref<'all' | 'active' | 'completed'>('all')

/* -------------------- Pagination -------------------- */
const currentPage = ref(1)
const itemsPerPage = 5

onMounted(() => {
  projectStore.fetchProjects()
})

/* 🔹 Debounce */
let timeout: any
watch(searchQuery, (value) => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    debouncedSearch.value = value
    currentPage.value = 1
  }, 400)
})

/* 🔹 Filter */
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

/* 🔹 Pagination */
const totalPages = computed(() =>
  Math.ceil(filteredProjects.value.length / itemsPerPage)
)

/* 🔹 Fix Pagination Edge Case */
watch(totalPages, (newTotal) => {
  if (currentPage.value > newTotal) {
    currentPage.value = newTotal || 1
  }
})

const paginatedProjects = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredProjects.value.slice(start, start + itemsPerPage)
})

function goToPage(page: number) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}

/* -------------------- CRUD -------------------- */
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
  showModal.value = true
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
  showModal.value = false
}
</script>

<template>
  <div class="max-w-6xl mx-auto">

    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-3xl font-bold text-gray-800">
        Projects
      </h2>

      <button
        @click="showModal = true"
        class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Add Project
      </button>
    </div>

    <!-- Search + Filter -->
    <div class="flex flex-col md:flex-row gap-4 mb-8">
      <input
        v-model="searchQuery"
        placeholder="Search projects..."
        class="border rounded px-4 py-2 flex-1 focus:ring-2 focus:ring-blue-400 outline-none"
      />

      <select
        v-model="selectedStatus"
        class="border rounded px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
      >
        <option value="all">All Status</option>
        <option value="active">Active</option>
        <option value="completed">Completed</option>
      </select>
    </div>

    <!-- Project Cards -->
    <div v-if="paginatedProjects.length" class="space-y-6">
      <div
        v-for="project in paginatedProjects"
        :key="project.id"
        class="bg-white shadow-md rounded-lg p-6 flex justify-between items-center"
      >
        <div>
          <div class="flex items-center gap-3 mb-2">
            <h3 class="text-lg font-semibold text-gray-800">
              {{ project.name }}
            </h3>

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

        <div class="flex gap-4">
          <button
            @click="startEdit(project)"
            class="text-blue-600 hover:text-blue-800 text-sm"
          >
            Edit
          </button>

          <button
            @click="projectStore.deleteProject(project.id)"
            class="text-red-600 hover:text-red-800 text-sm"
          >
            Delete
          </button>

          <button
            @click="toggleStatus(project)"
            class="text-purple-600 hover:text-purple-800 text-sm"
          >
            {{ project.status === 'active' ? 'Mark Completed' : 'Mark Active' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div
      v-if="totalPages > 1"
      class="flex justify-center gap-2 mt-10"
    >
      <button
        @click="goToPage(currentPage - 1)"
        class="px-3 py-1 border rounded"
      >
        Prev
      </button>

      <button
        v-for="page in totalPages"
        :key="page"
        @click="goToPage(page)"
        :class="[
          'px-3 py-1 border rounded',
          page === currentPage
            ? 'bg-blue-600 text-white'
            : 'bg-white'
        ]"
      >
        {{ page }}
      </button>

      <button
        @click="goToPage(currentPage + 1)"
        class="px-3 py-1 border rounded"
      >
        Next
      </button>
    </div>

    <!-- Empty -->
    <div
      v-if="!projectStore.loading && !filteredProjects.length"
      class="text-center text-gray-400 py-16 text-lg"
    >
      🚀 No projects found.
    </div>

    <!-- Modal -->
    <BaseModal v-model="showModal">
      <h2 class="text-xl font-semibold mb-4">
        {{ editingId ? 'Edit Project' : 'Add Project' }}
      </h2>

      <div class="space-y-4">
        <input
          v-model="name"
          placeholder="Project name"
          class="border rounded px-4 py-2 w-full focus:ring-2 focus:ring-blue-400 outline-none"
        />

        <input
          v-model="description"
          placeholder="Description"
          class="border rounded px-4 py-2 w-full focus:ring-2 focus:ring-blue-400 outline-none"
        />

        <div class="flex justify-end gap-3">
          <button
            @click="showModal = false"
            class="px-4 py-2 border rounded"
          >
            Cancel
          </button>

          <button
            v-if="!editingId"
            @click="handleAddProject"
            class="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add
          </button>

          <button
            v-else
            @click="handleUpdate"
            class="bg-green-600 text-white px-4 py-2 rounded"
          >
            Update
          </button>
        </div>
      </div>
    </BaseModal>

  </div>
</template>