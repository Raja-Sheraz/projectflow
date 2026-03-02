<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useProjectStore } from '../../stores/projectStore'
import type { Project } from '../../stores/projectStore'

const projectStore = useProjectStore()

const name = ref('')
const description = ref('')
const editingId = ref<number | null>(null)

onMounted(() => {
  projectStore.fetchProjects()
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
  <div>
    <h2 class="text-2xl font-bold mb-4">
      Projects ({{ projectStore.totalProjects }})
    </h2>

    <!-- Form -->
    <div class="mb-6 flex gap-2">
      <input
        v-model="name"
        placeholder="Project name"
        class="border p-2"
      />
      <input
        v-model="description"
        placeholder="Description"
        class="border p-2"
      />

      <!-- Add / Update Button -->
      <button
        v-if="!editingId"
        @click="handleAddProject"
        class="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add
      </button>

      <button
        v-else
        @click="handleUpdate"
        class="bg-green-500 text-white px-4 py-2 rounded"
      >
        Update
      </button>
    </div>

    <!-- Loading -->
    <p v-if="projectStore.loading">Loading...</p>
    <p v-if="projectStore.error" class="text-red-500">
      {{ projectStore.error }}
    </p>

    <!-- List -->
    <div v-if="projectStore.projects.length">
      <div
        v-for="project in projectStore.projects"
        :key="project.id"
        class="border p-4 mb-2 flex justify-between items-center"
      >
        <div>
          <h3 class="font-semibold">{{ project.name }}</h3>
          <p class="text-sm text-gray-600">
            {{ project.description }}
          </p>
        </div>

        <div class="flex gap-3">
          <button
            @click="startEdit(project)"
            class="text-blue-500"
          >
            Edit
          </button>

          <button
            @click="projectStore.deleteProject(project.id)"
            class="text-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <p v-else>No projects yet.</p>
  </div>
</template>