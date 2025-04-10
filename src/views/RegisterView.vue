<template>
  <div class="row justify-content-center">
    <div class="col-md-6">
      <div class="card shadow">
        <div class="card-header bg-primary text-white">
          <h4 class="mb-0"><i class="fas fa-user-plus me-2"></i>Inscription</h4>
        </div>
        <div class="card-body">
          <div v-if="errorMessage" class="alert alert-danger" role="alert">
            {{ errorMessage }}
          </div>
          <form @submit.prevent="handleRegister">
            <div class="mb-3">
              <label for="name" class="form-label">Nom complet</label>
              <input 
                type="text" 
                class="form-control" 
                id="name" 
                v-model="name" 
                required
                placeholder="Votre nom complet"
              >
            </div>
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
                placeholder="Choisissez un mot de passe"
                minlength="8"
              >
              <div class="form-text">Le mot de passe doit contenir au moins 8 caractères.</div>
            </div>
            <div class="mb-3">
              <label for="password_confirmation" class="form-label">Confirmation du mot de passe</label>
              <input 
                type="password" 
                class="form-control" 
                id="password_confirmation" 
                v-model="password_confirmation" 
                required
                placeholder="Confirmez votre mot de passe"
                minlength="8"
              >
            </div>
            <div class="d-grid gap-2">
              <button 
                type="submit" 
                class="btn btn-primary"
                :disabled="isLoading || !isFormValid"
              >
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                S'inscrire
              </button>
            </div>
          </form>
          <div class="mt-3 text-center">
            <p>Vous avez déjà un compte ? <router-link to="/login">Connectez-vous</router-link></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { AuthService } from '@/services/AuthService'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'RegisterView',
  setup() {
    const authService = new AuthService()
    const router = useRouter()
    
    const name = ref('')
    const email = ref('')
    const password = ref('')
    const password_confirmation = ref('')
    const isLoading = ref(false)
    const errorMessage = ref('')
    
    const isFormValid = computed(() => {
      return (
        name.value.length > 0 &&
        email.value.length > 0 &&
        password.value.length >= 8 &&
        password.value === password_confirmation.value
      )
    })
    
    const handleRegister = async () => {
      try {
        if (!isFormValid.value) {
          if (password.value !== password_confirmation.value) {
            errorMessage.value = 'Les mots de passe ne correspondent pas.'
          } else if (password.value.length < 8) {
            errorMessage.value = 'Le mot de passe doit contenir au moins 8 caractères.'
          }
          return
        }
        
        isLoading.value = true
        errorMessage.value = ''
        
        const success = await authService.register(name.value, email.value, password.value)
        
        if (success) {
          router.push('/')
        } 
      } catch (error: any) {
        console.error('Erreur d\'inscription:', error)
        
        // Gestion des erreurs de validation du backend
        if (error.response && error.response.data && error.response.data.errors) {
          const errors = error.response.data.errors
          if (errors.email) {
            errorMessage.value = errors.email[0]
          } else if (errors.password) {
            errorMessage.value = errors.password[0]
          } else if (errors.name) {
            errorMessage.value = errors.name[0]
          } else {
            errorMessage.value = 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.'
          }
        } else {
          errorMessage.value = 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.'
        }
      } finally {
        isLoading.value = false
      }
    }
    
    return {
      name,
      email,
      password,
      password_confirmation,
      isLoading,
      errorMessage,
      isFormValid,
      handleRegister
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