import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login'
  },

  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/auth/Login.vue')
  },

  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/auth/Register.vue')
  },

  {
    path: '/dashboard',
    component: () => import('../layouts/DashboardLayout.vue'),
    meta: { requiresAuth: true },   // 🔹 protect dashboard
    children: [
      {
        path: '',
        name: 'DashboardHome',
        component: () => import('../views/Dashboard.vue')
      },
      {
        path: 'projects',
        name: 'Projects',
        component: () => import('../views/projects/Projects.vue')
      },
      {
        path: 'projects/:projectId',
        name: 'ProjectTasks',
        component: () => import('../views/tasks/ProjectTasks.vue'),
        props: true
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

/* 🔒 Navigation Guard (Vue Router v4 style) */
router.beforeEach((to) => {

  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    return '/login'
  }

  if (to.path === '/login' && token) {
    return '/dashboard'
  }

  return true
})

export default router