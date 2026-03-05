<script setup lang="ts">
import { onMounted, ref, computed, watch } from "vue";
import { useProjectStore } from "../../stores/projectStore";
import { useAuthStore } from "../../stores/authStore";
import type { Project } from "../../stores/projectStore";
import BaseModal from "../../components/BaseModal.vue";
import { useDebounce } from "../../composables/useDebounce";

/* ---------------- Stores ---------------- */
const projectStore = useProjectStore();
const authStore = useAuthStore();

/* ---------------- Role ---------------- */
const isAdmin = computed(() => authStore.user?.role === "admin");

/* ---------------- Form State ---------------- */
const name = ref("");
const description = ref("");
const editingId = ref<number | null>(null);
const showModal = ref(false);

/* ---------------- Search & Filter ---------------- */
const searchQuery = ref("");
const selectedStatus = ref<"all" | "active" | "completed">("all");

const debouncedSearch = useDebounce(() => searchQuery.value, 400);

/* ---------------- Pagination ---------------- */
const currentPage = ref(1);
const itemsPerPage = 5;

onMounted(() => {
  projectStore.fetchProjects();
});

watch(selectedStatus, () => {
  currentPage.value = 1;
});

/* ---------------- Filtering ---------------- */
const filteredProjects = computed(() => {
  return projectStore.projects.filter((project) => {
    const matchesSearch =
      project.name
        .toLowerCase()
        .includes(debouncedSearch.value.toLowerCase()) ||
      project.description
        .toLowerCase()
        .includes(debouncedSearch.value.toLowerCase());

    const matchesStatus =
      selectedStatus.value === "all" || project.status === selectedStatus.value;

    return matchesSearch && matchesStatus;
  });
});

/* ---------------- Count ---------------- */
const totalCount = computed(() => filteredProjects.value.length);

/* ---------------- Pagination ---------------- */
const totalPages = computed(() =>
  Math.ceil(filteredProjects.value.length / itemsPerPage),
);

watch(totalPages, (newTotal) => {
  if (currentPage.value > newTotal) {
    currentPage.value = newTotal || 1;
  }
});

const paginatedProjects = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredProjects.value.slice(start, start + itemsPerPage);
});

function goToPage(page: number) {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
}

/* ---------------- Validation ---------------- */
const errors = ref({
  name: "",
  description: "",
});

const isFormValid = computed(() => {
  return name.value.trim().length >= 3 && description.value.trim().length >= 5;
});

watch(name, (val) => {
  if (!val.trim()) {
    errors.value.name = "Project name is required";
  } else if (val.trim().length < 3) {
    errors.value.name = "Minimum 3 characters required";
  } else {
    errors.value.name = "";
  }
});

watch(description, (val) => {
  if (!val.trim()) {
    errors.value.description = "Description is required";
  } else if (val.trim().length < 5) {
    errors.value.description = "Minimum 5 characters required";
  } else {
    errors.value.description = "";
  }
});

/* ---------------- CRUD ---------------- */
async function handleAddProject() {
  if (!isAdmin.value) return;
  if (!isFormValid.value) return;

  await projectStore.addProject({
    name: name.value,
    description: description.value,
    status: "active",
  });

  resetForm();
}

function startEdit(project: Project) {
  if (!isAdmin.value) return;

  editingId.value = project.id;
  name.value = project.name;
  description.value = project.description;
  showModal.value = true;
}

async function handleUpdate() {
  if (!isAdmin.value) return;
  if (!editingId.value) return;

  const existing = projectStore.projects.find((p) => p.id === editingId.value);

  if (!existing) return;

  await projectStore.updateProject({
    ...existing,
    name: name.value,
    description: description.value,
  });

  resetForm();
}

async function toggleStatus(project: Project) {
  if (!isAdmin.value) return;

  await projectStore.updateProject({
    ...project,
    status: project.status === "active" ? "completed" : "active",
  });
}

async function deleteProject(id: number) {
  if (!isAdmin.value) return;

  await projectStore.deleteProject(id);
}

function resetForm() {
  editingId.value = null;
  name.value = "";
  description.value = "";
  showModal.value = false;
}
</script>

<template>
  <div class="max-w-6xl mx-auto px-4">
    <!-- Header -->
    <div
      class="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6"
    >
      <div>
        <h2 class="text-3xl font-bold text-gray-800">Projects</h2>
        <p class="text-sm text-gray-500 mt-1">Total: {{ totalCount }}</p>
      </div>

      <!-- ADMIN ONLY -->
      <button
        v-if="isAdmin"
        @click="showModal = true"
        class="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        + Add Project
      </button>
    </div>

    <!-- Search & Filter -->
    <div class="flex flex-col md:flex-row gap-4 mb-8">
      <input
        v-model="searchQuery"
        placeholder="Search projects..."
        class="border rounded px-4 py-2 flex-1"
      />

      <select v-model="selectedStatus" class="border rounded px-4 py-2">
        <option value="all">All Status</option>
        <option value="active">Active</option>
        <option value="completed">Completed</option>
      </select>
    </div>

    <!-- Cards -->
    <div v-if="paginatedProjects.length" class="space-y-6">
      <div
        v-for="project in paginatedProjects"
        :key="project.id"
        class="bg-white shadow-md rounded-xl p-6 flex justify-between items-center"
      >
        <div>
          <h3 class="text-lg font-semibold">
            {{ project.name }}
          </h3>

          <p class="text-gray-600 text-sm">
            {{ project.description }}
          </p>
        </div>

        <div class="flex gap-4">
          <!-- ADMIN ONLY -->
          <button
            v-if="isAdmin"
            @click="startEdit(project)"
            class="text-blue-600"
          >
            Edit
          </button>

          <button
            v-if="isAdmin"
            @click="deleteProject(project.id)"
            class="text-red-600"
          >
            Delete
          </button>

          <button
            v-if="isAdmin"
            @click="toggleStatus(project)"
            class="text-purple-600"
          >
            {{ project.status === "active" ? "Mark Completed" : "Mark Active" }}
          </button>

          <RouterLink
            :to="`/dashboard/projects/${project.id}`"
            class="text-indigo-600"
          >
            View Tasks
          </RouterLink>
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
    <!-- Modal -->
    <BaseModal v-model="showModal">
      <h2 class="text-xl font-semibold mb-4">
        {{ editingId ? "Edit Project" : "Add Project" }}
      </h2>

      <input
        v-model="name"
        placeholder="Project name"
        class="border rounded px-4 py-2 w-full mb-3"
      />

      <input
        v-model="description"
        placeholder="Description"
        class="border rounded px-4 py-2 w-full mb-3"
      />

      <div class="flex justify-end gap-3">
        <button @click="resetForm" class="px-4 py-2 border rounded">
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
    </BaseModal>
  </div>
</template>
