import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ScanRedirectView from '../views/ScanRedirectView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import { AuthService } from '@/services/AuthService'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true }
  },
  {
    path: '/scan/:id',
    name: 'scan',
    component: ScanRedirectView,
    props: true
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { guest: true }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: { guest: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Garde de navigation pour gérer l'authentification
router.beforeEach((to, _from, next) => {
  const authService = new AuthService()
  const isAuthenticated = authService.isAuthenticated()
  
  // Si la route nécessite une authentification et que l'utilisateur n'est pas connecté
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next({ name: 'login' })
  } 
  // Si la route est réservée aux visiteurs et que l'utilisateur est connecté
  else if (to.matched.some(record => record.meta.guest) && isAuthenticated) {
    next({ name: 'home' })
  } 
  // Sinon, autoriser la navigation
  else {
    next()
  }
})

export default router
