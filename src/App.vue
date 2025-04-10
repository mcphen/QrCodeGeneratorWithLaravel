<template>
  <div class="app-container">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
      <div class="container">
        <router-link class="navbar-brand" to="/">
          <i class="fas fa-qrcode me-2"></i>QR Code Generator
        </router-link>
        
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <template v-if="isAuthenticated">
              <li class="nav-item">
                <span class="nav-link text-white">
                  <i class="fas fa-user me-1"></i>{{ currentUser ? currentUser.name : 'Utilisateur' }}
                </span>
              </li>
              <li class="nav-item">
                <a href="#" class="nav-link" @click.prevent="logout">
                  <i class="fas fa-sign-out-alt me-1"></i>Déconnexion
                </a>
              </li>
            </template>
            <template v-else>
              <li class="nav-item">
                <router-link class="nav-link" to="/login">
                  <i class="fas fa-sign-in-alt me-1"></i>Connexion
                </router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/register">
                  <i class="fas fa-user-plus me-1"></i>Inscription
                </router-link>
              </li>
            </template>
          </ul>
        </div>
      </div>
    </nav>

    <div class="container">
      <router-view></router-view>
    </div>

    <footer class="footer mt-5 py-3 bg-light">
      <div class="container text-center">
        <span class="text-muted">© 2023 QR Code Generator</span>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { AuthService, User } from '@/services/AuthService'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'App',
  setup() {
    const authService = new AuthService()
    const router = useRouter()
    const isAuthenticated = ref(authService.isAuthenticated())
    const currentUser = ref<User | null>(null)
    
    onMounted(async () => {
      if (isAuthenticated.value) {
        currentUser.value = await authService.getCurrentUser()
      }
    })
    
    const logout = async () => {
      await authService.logout()
      isAuthenticated.value = false
      currentUser.value = null
      router.push('/login')
    }
    
    return {
      isAuthenticated,
      currentUser,
      logout
    }
  }
})
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.footer {
  margin-top: auto;
}
</style>
