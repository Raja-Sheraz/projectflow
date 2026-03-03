<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTaskStore } from '../../stores/taskStore'
import { useProjectStore } from '../../stores/projectStore'
import type { Task } from '../../stores/taskStore'

const route = useRoute()
const taskStore = useTaskStore()
const projectStore = useProjectStore()

const projectId = Number(route.params.projectId)

const title = ref('')
const description = ref('')

onMounted(() => {
  taskStore.fetchTasks()
})

/* Get current project */
const currentProject = computed(() =>
  projectStore.projects.find(p => p.id === projectId)
)

/* All tasks of this project */
const projectTasks = computed(() =>
  taskStore.getTasksByProject(projectId)
)

/* Columns */
const todoTasks = computed(() =>
  projectTasks.value.filter(t => t.status === 'todo')
)

const inProgressTasks = computed(() =>
  projectTasks.value.filter(t => t.status === 'in-progress')
)

const doneTasks = computed(() =>
  projectTasks.value.filter(t => t.status === 'done')
)

function addTask() {
  if (!title.value.trim()) return

  taskStore.addTask({
    projectId,
    title: title.value,
    description: description.value,
    status: 'todo'
  })

  title.value = ''
  description.value = ''
}

function moveTask(task: Task, newStatus: Task['status']) {
  taskStore.updateTask({
    ...task,
    status: newStatus
  })
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4">

    <!-- Header -->
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-gray-800">
        {{ currentProject?.name || 'Project' }} Tasks
      </h2>
      <p class="text-sm text-gray-500 mt-1">
        Manage tasks efficiently using Kanban workflow
      </p>
    </div>

    <!-- Add Task -->
    <div class="bg-white shadow rounded-xl p-4 mb-8 flex flex-col md:flex-row gap-4">
      <input
        v-model="title"
        placeholder="Task title"
        class="border rounded px-3 py-2 flex-1"
      />
      <input
        v-model="description"
        placeholder="Description"
        class="border rounded px-3 py-2 flex-1"
      />
      <button
        @click="addTask"
        class="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Add Task
      </button>
    </div>

    <!-- Kanban -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

      <!-- TODO -->
      <div class="bg-gray-100 rounded-xl p-4">
        <h3 class="font-semibold mb-4">Todo</h3>

        <div v-if="todoTasks.length">
          <div
            v-for="task in todoTasks"
            :key="task.id"
            class="bg-white p-4 rounded-lg shadow mb-3"
          >
            <h4 class="font-medium">{{ task.title }}</h4>
            <p class="text-sm text-gray-500">{{ task.description }}</p>

            <button
              @click="moveTask(task, 'in-progress')"
              class="text-xs text-blue-600 mt-2"
            >
              Move → In Progress
            </button>
          </div>
        </div>

        <p v-else class="text-sm text-gray-400">
          No tasks here
        </p>
      </div>

      <!-- IN PROGRESS -->
      <div class="bg-yellow-100 rounded-xl p-4">
        <h3 class="font-semibold mb-4">In Progress</h3>

        <div v-if="inProgressTasks.length">
          <div
            v-for="task in inProgressTasks"
            :key="task.id"
            class="bg-white p-4 rounded-lg shadow mb-3"
          >
            <h4 class="font-medium">{{ task.title }}</h4>
            <p class="text-sm text-gray-500">{{ task.description }}</p>

            <button
              @click="moveTask(task, 'done')"
              class="text-xs text-green-600 mt-2"
            >
              Move → Done
            </button>
          </div>
        </div>

        <p v-else class="text-sm text-gray-400">
          No tasks here
        </p>
      </div>

      <!-- DONE -->
      <div class="bg-green-100 rounded-xl p-4">
        <h3 class="font-semibold mb-4">Done</h3>

        <div v-if="doneTasks.length">
          <div
            v-for="task in doneTasks"
            :key="task.id"
            class="bg-white p-4 rounded-lg shadow mb-3"
          >
            <h4 class="font-medium">{{ task.title }}</h4>
            <p class="text-sm text-gray-500">{{ task.description }}</p>

            <button
              @click="moveTask(task, 'todo')"
              class="text-xs text-red-600 mt-2"
            >
              Move → Todo
            </button>
          </div>
        </div>

        <p v-else class="text-sm text-gray-400">
          No tasks here
        </p>
      </div>

    </div>

  </div>
</template> 