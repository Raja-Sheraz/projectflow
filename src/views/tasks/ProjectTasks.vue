<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTaskStore } from '../../stores/taskStore'
import draggable from 'vuedraggable'
import type { Task } from '../../stores/taskStore'

const route = useRoute()
const taskStore = useTaskStore()
const projectId = Number(route.params.projectId)

const title = ref('')
const description = ref('')

onMounted(() => {
  taskStore.fetchTasks()
})

/* ----------------------------------------
   Writable Computed Columns (REAL FIX)
----------------------------------------- */

function createColumn(status: Task['status']) {
  return computed<Task[]>({
    get() {
      return taskStore.tasks.filter(
        t => t.projectId === projectId && t.status === status
      )
    },
    set(newTasks) {
      newTasks.forEach(task => {
        if (task.status !== status) {
          taskStore.updateTask({
            ...task,
            status
          })
        }
      })
    }
  })
}

const todoTasks = createColumn('todo')
const inProgressTasks = createColumn('in-progress')
const doneTasks = createColumn('done')

/* ----------------------------------------
   Add Task
----------------------------------------- */

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

/* ----------------------------------------
   Manual Move
----------------------------------------- */

function moveTask(task: Task, status: Task['status']) {
  if (task.status === status) return

  taskStore.updateTask({
    ...task,
    status
  })
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4">
    <h2 class="text-2xl font-bold mb-6">Project Tasks</h2>

    <!-- Add Task -->
    <div class="bg-white shadow rounded-lg p-4 mb-6 flex gap-4">
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
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Add Task
      </button>
    </div>

    <!-- Columns -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

      <!-- TODO -->
      <div class="bg-gray-100 rounded-lg p-4">
        <h3 class="font-semibold mb-4">Todo</h3>

        <draggable
          v-model="todoTasks"
          :group="{ name: 'tasks', pull: true, put: true }"
          item-key="id"
          animation="200"
          ghost-class="opacity-40"
          chosen-class="scale-105"
          drag-class="rotate-1"
        >
          <template #item="{ element }">
            <div class="bg-white p-4 rounded-lg shadow mb-3">
              <h4 class="font-medium">{{ element.title }}</h4>
              <p class="text-sm text-gray-500 mb-3">
                {{ element.description }}
              </p>

              <div class="flex justify-end gap-3 text-xs">
                <button
                  @click="moveTask(element, 'in-progress')"
                  class="text-yellow-600 hover:underline"
                >
                  In Progress →
                </button>
                <button
                  @click="moveTask(element, 'done')"
                  class="text-green-600 hover:underline"
                >
                  Done →
                </button>
              </div>
            </div>
          </template>
        </draggable>
      </div>

      <!-- IN PROGRESS -->
      <div class="bg-yellow-100 rounded-lg p-4">
        <h3 class="font-semibold mb-4">In Progress</h3>

        <draggable
          v-model="inProgressTasks"
          :group="{ name: 'tasks', pull: true, put: true }"
          item-key="id"
          animation="200"
          ghost-class="opacity-40"
          chosen-class="scale-105"
          drag-class="rotate-1"
        >
          <template #item="{ element }">
            <div class="bg-white p-4 rounded-lg shadow mb-3">
              <h4 class="font-medium">{{ element.title }}</h4>
              <p class="text-sm text-gray-500 mb-3">
                {{ element.description }}
              </p>

              <div class="flex justify-between text-xs">
                <button
                  @click="moveTask(element, 'todo')"
                  class="text-blue-600 hover:underline"
                >
                  ← Todo
                </button>
                <button
                  @click="moveTask(element, 'done')"
                  class="text-green-600 hover:underline"
                >
                  Done →
                </button>
              </div>
            </div>
          </template>
        </draggable>
      </div>

      <!-- DONE -->
      <div class="bg-green-100 rounded-lg p-4">
        <h3 class="font-semibold mb-4">Done</h3>

        <draggable
          v-model="doneTasks"
          :group="{ name: 'tasks', pull: true, put: true }"
          item-key="id"
          animation="200"
          ghost-class="opacity-40"
          chosen-class="scale-105"
          drag-class="rotate-1"
        >
          <template #item="{ element }">
            <div class="bg-white p-4 rounded-lg shadow mb-3">
              <h4 class="font-medium">{{ element.title }}</h4>
              <p class="text-sm text-gray-500 mb-3">
                {{ element.description }}
              </p>

              <div class="flex justify-start gap-3 text-xs">
                <button
                  @click="moveTask(element, 'todo')"
                  class="text-blue-600 hover:underline"
                >
                  ← Todo
                </button>
                <button
                  @click="moveTask(element, 'in-progress')"
                  class="text-yellow-600 hover:underline"
                >
                  ← In Progress
                </button>
              </div>
            </div>
          </template>
        </draggable>
      </div>

    </div>
  </div>
</template>