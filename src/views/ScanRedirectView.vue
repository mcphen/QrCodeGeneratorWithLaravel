<template>
  <div class="text-center">
    <div v-if="loading" class="loading-container">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <h3 class="mt-3">Redirection en cours...</h3>
      <p class="text-muted">Vous allez être redirigé vers le site demandé.</p>
    </div>

    <div v-else-if="error" class="error-container mt-5">
      <div class="alert alert-danger">
        <i class="fas fa-exclamation-triangle me-2"></i> {{ error }}
      </div>
      <p class="mt-3">
        <a href="/" class="btn btn-primary">
          <i class="fas fa-home me-2"></i> Retour à l'accueil
        </a>
      </p>
    </div>

    <div v-else-if="redirectUrl" class="success-container mt-5">
      <p>Si vous n'êtes pas redirigé automatiquement, cliquez sur le lien ci-dessous :</p>
      <a :href="redirectUrl" class="btn btn-primary">
        <i class="fas fa-external-link-alt me-2"></i> Aller sur {{ displayUrl }}
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import { ApiService } from '@/api/ApiService'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'ScanRedirectView',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const loading = ref(true)
    const error = ref('')
    const redirectUrl = ref('')
    const route = useRoute()

    // Formater l'URL pour l'affichage
    const displayUrl = computed(() => {
      if (!redirectUrl.value) return ''
      
      try {
        const url = new URL(redirectUrl.value)
        return url.hostname
      } catch (e) {
        return redirectUrl.value
      }
    })

    onMounted(async () => {
      try {
        loading.value = true
        
        // Récupérer l'ID depuis les props ou les paramètres de route
        const qrId = props.id || route.params.id as string
        
        if (!qrId) {
          error.value = 'QR code invalide ou manquant'
          return
        }
        
        // Obtenir l'URL originale et incrémenter le compteur de scans
        const originalUrl = await ApiService.incrementScanAndGetUrl(qrId)
        
        if (!originalUrl) {
          error.value = 'Ce QR code est introuvable ou a expiré'
          return
        }
        
        // Enregistrer l'URL pour l'affichage sécurisé
        redirectUrl.value = originalUrl
        
        // Rediriger automatiquement après un court délai
        setTimeout(() => {
          window.location.href = originalUrl
        }, 1500)
        
      } catch (err) {
        console.error('Erreur lors de la redirection:', err)
        error.value = 'Une erreur est survenue lors de la redirection'
      } finally {
        loading.value = false
      }
    })

    return {
      loading,
      error,
      redirectUrl,
      displayUrl
    }
  }
})
</script>

<style scoped>
.loading-container, .error-container, .success-container {
  max-width: 500px;
  margin: 100px auto;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  background-color: white;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}
</style>