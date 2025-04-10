<template>
  <div class="row justify-content-center">
    <div class="col-md-6">
      <div class="card shadow">
        <div class="card-header bg-primary text-white">
          <h4 class="mb-0"><i class="fas fa-sign-in-alt me-2"></i>Connexion</h4>
        </div>
        <div class="card-body">
          <div v-if="errorMessage" class="alert alert-danger" role="alert">
            {{ errorMessage }}
          </div>
          <form @submit.prevent="handleLogin">
            <div class="mb-3">
              <label for="email" class="form-label">Adresse email</label>
              <input 
                type="email" 
                class="form-control" 
                id="email" 
                v-model="email" 
                required
                placeholder="Votre adresse email"
              >
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Mot de passe</label>
              <input 
                type="password" 
                class="form-control" 
                id="password" 
                v-model="password" 
                required
                placeholder="Votre mot de passe"
              >
            </div>
            <div class="mb-3 form-check">
              <input 
                type="checkbox" 
                class="form-check-input" 
                id="remember" 
                v-model="remember"
              >
              <label class="form-check-label" for="remember">Se souvenir de moi</label>
            </div>
            <div class="d-grid gap-2">
              <button 
                type="submit" 
                class="btn btn-primary"
                :disabled="isLoading"
              >
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Se connecter
              </button>
            </div>
          </form>
          <div class="mt-3 text-center">
            <p>Vous n'avez pas de compte ? <router-link to="/register">Inscrivez-vous</router-link></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { AuthService } from '@/services/AuthService'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'LoginView',
  setup() {
    const authService = new AuthService()
    const router = useRouter()
    
    const email = ref('')
    const password = ref('')
    const remember = ref(false)
    const isLoading = ref(false)
    const errorMessage = ref('')
    
    const handleLogin = async () => {
      try {
        isLoading.value = true
        errorMessage.value = ''
        
        const success = await authService.login(email.value, password.value, remember.value)
        
        if (success) {
          router.push('/')
        } else {
          errorMessage.value = 'Identifiants incorrects. Veuillez réessayer.'
        }
      } catch (error) {
        console.error('Erreur de connexion:', error)
        errorMessage.value = 'Une erreur est survenue lors de la connexion. Veuillez réessayer.'
      } finally {
        isLoading.value = false
      }
    }
    
    return {
      email,
      password,
      remember,
      isLoading,
      errorMessage,
      handleLogin
    }
  }
})
</script>

<style scoped>
.card {
  border-radius: 10px;
  overflow: hidden;
}

.card-header {
  border-bottom: 0;
}
</style>