import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ScanRedirectView from '../views/ScanRedirectView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/scan/:id',
    name: 'scan',
    component: ScanRedirectView,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
