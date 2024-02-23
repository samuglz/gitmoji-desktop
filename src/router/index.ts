import { createWebHistory, createRouter } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'SearchView',
    component: () => import('../Views/SearchView.vue')
  },
  {
    path: '/preferences',
    name: 'PreferencesView',
    component: () => import('../Views/PreferencesView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
