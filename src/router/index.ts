import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login'
  },

  {
    path: '/login',
    component: () => import('../views/auth/Login.vue')
  },
  {
    path: '/register',
    component: () => import('../views/auth/Register.vue')
  },

  {
    path: '/dashboard',
    component: () => import('../layouts/DashboardLayout.vue'),
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

router.beforeEach((to) => {
  const authStore = useAuthStore()

  const publicPages = ['/login', '/register']
  const authRequired = !publicPages.includes(to.path)

  if (authRequired && !authStore.isAuthenticated) {
    return '/login'
  }
})

export default router