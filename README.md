
---

# 🚀 ProjectFlow – Task & Team Management System

ProjectFlow is a high-performance **Single Page Application (SPA)** built with **Vue 3**. It serves as a comprehensive demonstration of modern frontend architecture, featuring centralized state management, dynamic routing, and a polished user interface.

I built a project management system called ProjectFlow using Vue 3 with Composition API.
The application allows users to manage projects and tasks using a Kanban board.

It includes:

* Authentication system (login/register)
* Protected routes using Vue Router guards
* State management using Pinia
* API abstraction using Axios
* LocalStorage persistence
* Project CRUD with search, filter, and pagination
* Task management with drag-and-drop Kanban board
* Reusable components like modal, loader, and empty state
* A custom composable for debounced search

---

## 🛠️ Tech Stack

* **Framework:** Vue 3 (Composition API)
* **State Management:** Pinia
* **Routing:** Vue Router
* **Styling:** TailwindCSS
* **Data Handling:** Axios & LocalStorage (Mock API)
* **Interactivity:** `vuedraggable` (Kanban functionality)

---

## ✨ Features

### 🔐 Authentication & Security

* **Role-Based Access Control (RBAC):** Distinct interfaces for Admins and Members.
* **Protected Routes:** Robust route guards to prevent unauthorized access.
* **Session Persistence:** Token management via LocalStorage.

### 📊 Dashboard & Layout

* **Responsive UI:** Fully adaptive sidebar and navigation systems.
* **Dynamic UX:** Context-aware page titles and breadcrumbs.

### 📁 Project Management

* **Full CRUD:** Create, edit, and delete projects seamlessly.
* **Advanced Tools:** Integrated search, status filtering, and pagination.
* **UI Components:** Reusable modals utilizing Vue’s **Teleport** feature.

### 📝 Task Management (Kanban)

* **Visual Workflow:** Drag-and-drop tasks between "Todo," "In Progress," and "Done."
* **Task Assignment:** Assign specific tasks to team members.

---

## 🧠 Vue Concepts Demonstrated

| Feature | Implementation |
| --- | --- |
| **Logic Reuse** | Custom Composables & Composition API |
| **State** | Pinia Stores with reactive state persistence |
| **Performance** | Lazy-loaded routes & Debounced search inputs |
| **Communication** | Advanced Props, Emits, and Slots patterns |
| **DOM Control** | Teleport for global modals & Nested routing |

---

## 📂 Project Structure

```text
src
├── components    # Reusable UI components
├── layouts       # Dashboard & Auth wrappers
├── views         # Page-level components
├── router        # Route guards & definitions
├── stores        # Pinia state management
├── composables   # Reusable logic functions
├── services      # API & LocalStorage handlers
└── utils         # Helper functions & constants

```

---

## ▶️ Getting Started

1. **Clone the repo**
2. **Install dependencies:**
```bash
npm install

```


3. **Run in development mode:**
```bash
npm run dev

```


4. **Build for production:**
```bash
npm run build

```



---

## 👤 Author

**Raja Sheraz**

* **GitHub:** [Raja-Sheraz](https://github.com/Raja-Sheraz)

---
