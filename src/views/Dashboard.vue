<script setup lang="ts">
import { computed } from "vue"
import { useProjectStore } from "../stores/projectStore"
import { useTaskStore } from "../stores/taskStore"

const projectStore = useProjectStore()
const taskStore = useTaskStore()

const totalProjects = computed(() => projectStore.projects.length)

const totalTasks = computed(() => taskStore.tasks.length)

const completedTasks = computed(() =>
  taskStore.tasks.filter(t => t.status === "done").length
)
</script>

<template>

<div class="max-w-6xl mx-auto px-4">

<h1 class="text-3xl font-bold mb-8">
Dashboard
</h1>

<div class="grid grid-cols-1 md:grid-cols-3 gap-6">

<!-- Total Projects -->
<div class="bg-white shadow rounded-lg p-6">

<h2 class="text-gray-500 text-sm mb-2">
Total Projects
</h2>

<p class="text-3xl font-bold">
{{ totalProjects }}
</p>

</div>

<!-- Total Tasks -->
<div class="bg-white shadow rounded-lg p-6">

<h2 class="text-gray-500 text-sm mb-2">
Total Tasks
</h2>

<p class="text-3xl font-bold">
{{ totalTasks }}
</p>

</div>

<!-- Completed Tasks -->
<div class="bg-white shadow rounded-lg p-6">

<h2 class="text-gray-500 text-sm mb-2">
Completed Tasks
</h2>

<p class="text-3xl font-bold text-green-600">
{{ completedTasks }}
</p>

</div>

</div>

</div>

</template>