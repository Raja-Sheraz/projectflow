<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { useRoute } from "vue-router"
import draggable from "vuedraggable"

import { useTaskStore } from "../../stores/taskStore"
import { useUserStore } from "../../stores/userStore"
import { useAuthStore } from "../../stores/authStore"
import type { Task } from "../../stores/taskStore"
import EmptyState from "../../components/EmptyState.vue"

/* ---------------- Stores ---------------- */
const taskStore = useTaskStore()
const userStore = useUserStore()
const authStore = useAuthStore()
const taskError = ref("")

/* ---------------- Route ---------------- */
const route = useRoute()
const projectId = Number(route.params.projectId)

/* ---------------- Role ---------------- */
const isAdmin = computed(() => authStore.user?.role === "admin")

/* ---------------- Form ---------------- */
const title = ref("")
const description = ref("")

/* ---------------- Mounted ---------------- */
onMounted(() => {
  taskStore.fetchTasks()
  userStore.fetchUsers()
})

/* ---------------- Add Task ---------------- */
function addTask() {

  if (title.value.trim().length < 3) {
    taskError.value = "Task title must be at least 3 characters"
    return
  }

  if (description.value.trim().length < 5) {
    taskError.value = "Description must be at least 5 characters"
    return
  }

  taskError.value = ""

  taskStore.addTask({
    projectId,
    title: title.value,
    description: description.value,
    status: "todo",
    assignedTo: null
  })

  title.value = ""
  description.value = ""
}


/* ---------------- Manual Move ---------------- */
function moveTask(task: Task, status: Task["status"]) {
  if (task.status === status) return

    // prevent moving if not assigned
  if (!task.assignedTo) {
    alert("Please assign a user before moving the task.")
    return
  }

  taskStore.updateTask({
    ...task,
    status
  })
}

/* ---------------- Drag Change ---------------- */
function handleChange(evt: any, status: Task["status"]) {
  if (evt?.added) {
    const task = evt.added.element

    taskStore.updateTask({
      ...task,
      status
    })
  }
}

function onTodoChange(e: any) {
  handleChange(e, "todo")
}

function onInProgressChange(e: any) {
  handleChange(e, "in-progress")
}

function onDoneChange(e: any) {
  handleChange(e, "done")
}

/* ---------------- Assign ---------------- */
function handleAssign(task: Task, userId: number | null) {
  taskStore.updateTask({
    ...task,
    assignedTo: userId
  })
}

/* ---------------- Columns ---------------- */
const todoTasks = computed(() =>
  taskStore.tasks.filter(
    t => t.projectId === projectId && t.status === "todo"
  )
)

const inProgressTasks = computed(() =>
  taskStore.tasks.filter(
    t => t.projectId === projectId && t.status === "in-progress"
  )
)

const doneTasks = computed(() =>
  taskStore.tasks.filter(
    t => t.projectId === projectId && t.status === "done"
  )
)
</script>

<template>

<div class="max-w-7xl mx-auto px-4">

<h2 class="text-2xl font-bold mb-6">
Project Tasks
</h2>

<!-- Loading -->
<div
v-if="taskStore.loading"
class="text-center py-10 text-gray-500"
>
Loading tasks...
</div>

<div v-else>

<!-- Add Task -->
<div class="bg-white shadow rounded-lg p-4 mb-6">

<div class="flex flex-col md:flex-row gap-4">

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
class="bg-blue-600 text-white px-4 py-2 rounded"
>
Add Task
</button>

</div>

<!-- Error message -->
<p
v-if="taskError"
class="text-red-500 text-sm mt-2"
>
{{ taskError }}
</p>

</div>


<!-- Empty -->
<EmptyState
v-if="!todoTasks.length && !inProgressTasks.length && !doneTasks.length"
message="No tasks yet for this project"
/>


<!-- Kanban Board -->
<div
v-else
class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
>

<!-- TODO -->
<div class="bg-gray-100 rounded-lg p-4">

<h3 class="font-semibold mb-4">
Todo
</h3>

<draggable
:list="todoTasks"
:group="{ name: 'tasks', pull: true, put: true }"
item-key="id"
@change="onTodoChange"
>

<template #item="{ element }">

<div class="bg-white p-4 rounded shadow mb-3">

<h4 class="font-medium">
{{ element.title }}
</h4>

<p class="text-sm text-gray-500 mb-2">
{{ element.description }}
</p>

<select
v-if="isAdmin"
:value="element.assignedTo ?? ''"
@change="handleAssign(
element,
Number(($event.target as HTMLSelectElement).value) || null
)"
class="border rounded px-2 py-1 text-sm w-full mb-2"
>

<option value="">Unassigned</option>

<option
v-for="user in userStore.users"
:key="user.id"
:value="user.id"
>
{{ user.name }}
</option>

</select>

<p
v-else
class="text-xs text-gray-500 mb-2"
>
Assigned to:
{{ userStore.users.find(u => u.id === element.assignedTo)?.name || "Unassigned" }}
</p>

<div class="flex justify-between text-xs">

<button
@click="moveTask(element,'in-progress')"
class="text-yellow-600"
>
In Progress →
</button>

<button
@click="moveTask(element,'done')"
class="text-green-600"
>
Done →
</button>

</div>

<button
v-if="isAdmin"
@click="taskStore.deleteTask(element.id)"
class="text-red-600 text-xs mt-2"
>
Delete
</button>

</div>

</template>

</draggable>

</div>


<!-- IN PROGRESS -->
<div class="bg-yellow-100 rounded-lg p-4">

<h3 class="font-semibold mb-4">
In Progress
</h3>

<draggable
:list="inProgressTasks"
:group="{ name: 'tasks', pull: true, put: true }"
item-key="id"
@change="onInProgressChange"
>

<template #item="{ element }">

<div class="bg-white p-4 rounded shadow mb-3">

<h4 class="font-medium">
{{ element.title }}
</h4>

<p class="text-sm text-gray-500 mb-2">
{{ element.description }}
</p>

<select
v-if="isAdmin"
:value="element.assignedTo ?? ''"
@change="handleAssign(
element,
Number(($event.target as HTMLSelectElement).value) || null
)"
class="border rounded px-2 py-1 text-sm w-full mb-2"
>

<option value="">Unassigned</option>

<option
v-for="user in userStore.users"
:key="user.id"
:value="user.id"
>
{{ user.name }}
</option>

</select>

<p
v-else
class="text-xs text-gray-500 mb-2"
>
Assigned to:
{{ userStore.users.find(u => u.id === element.assignedTo)?.name || "Unassigned" }}
</p>

<div class="flex justify-between text-xs">

<button
@click="moveTask(element,'todo')"
class="text-blue-600"
>
← Todo
</button>

<button
@click="moveTask(element,'done')"
class="text-green-600"
>
Done →
</button>

</div>

<button
v-if="isAdmin"
@click="taskStore.deleteTask(element.id)"
class="text-red-600 text-xs mt-2"
>
Delete
</button>

</div>

</template>

</draggable>

</div>


<!-- DONE -->
<div class="bg-green-100 rounded-lg p-4">

<h3 class="font-semibold mb-4">
Done
</h3>

<draggable
:list="doneTasks"
:group="{ name: 'tasks', pull: true, put: true }"
item-key="id"
@change="onDoneChange"
>

<template #item="{ element }">

<div class="bg-white p-4 rounded shadow mb-3">

<h4 class="font-medium">
{{ element.title }}
</h4>

<p class="text-sm text-gray-500 mb-2">
{{ element.description }}
</p>

<select
v-if="isAdmin"
:value="element.assignedTo ?? ''"
@change="handleAssign(
element,
Number(($event.target as HTMLSelectElement).value) || null
)"
class="border rounded px-2 py-1 text-sm w-full mb-2"
>

<option value="">Unassigned</option>

<option
v-for="user in userStore.users"
:key="user.id"
:value="user.id"
>
{{ user.name }}
</option>

</select>

<p
v-else
class="text-xs text-gray-500 mb-2"
>
Assigned to:
{{ userStore.users.find(u => u.id === element.assignedTo)?.name || "Unassigned" }}
</p>

<div class="flex justify-between text-xs">

<button
@click="moveTask(element,'todo')"
class="text-blue-600"
>
← Todo
</button>

<button
@click="moveTask(element,'in-progress')"
class="text-yellow-600"
>
← In Progress
</button>

</div>

<button
v-if="isAdmin"
@click="taskStore.deleteTask(element.id)"
class="text-red-600 text-xs mt-2"
>
Delete
</button>

</div>

</template>

</draggable>

</div>

</div>

</div>

</div>

</template>