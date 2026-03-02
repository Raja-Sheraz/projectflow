<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useProjectStore } from '../../stores/projectStore'

const projectStore = useProjectStore()

const name = ref('')
const description = ref('')

onMounted(() => {
  projectStore.fetchProjects()
})

function handleAddProject() {
  if (!name.value) return

  projectStore.addProject({
    name: name.value,
    description: description.value,
    status: 'active'
  })

  name.value = ''
  description.value = ''
}
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">
      Projects ({{ projectStore.totalProjects }})
    </h2>

    <!-- Add Form -->
    <div class="mb-6">
      <input
        v-model="name"
        placeholder="Project name"
        class="border p-2 mr-2"
      />
      <input
        v-model="description"
        placeholder="Description"
        class="border p-2 mr-2"
      />
      <button
        @click="handleAddProject"
        class="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add
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
        class="border p-4 mb-2 flex justify-between"
      >
        <div>
          <h3 class="font-semibold">{{ project.name }}</h3>
          <p class="text-sm text-gray-600">
            {{ project.description }}
          </p>
        </div>

        <button
          @click="projectStore.deleteProject(project.id)"
          class="text-red-500"
        >
          Delete
        </button>
      </div>
    </div>

    <p v-else>No projects yet.</p>
  </div>
</template>