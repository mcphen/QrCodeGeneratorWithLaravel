<template>
  <div class="home">
    <h1 class="text-center mb-4">QR Code Generator</h1>
    
    <div class="row">
      <div class="col-md-6 mb-4">
        <div class="card shadow">
          <div class="card-header bg-primary text-white">
            <h4 class="mb-0"><i class="fas fa-qrcode me-2"></i>Créer un QR Code</h4>
          </div>
          <div class="card-body">
            <QRCodeGenerator @qr-generated="onQRGenerated" />
          </div>
        </div>
      </div>
      
      <div class="col-md-6">
        <div class="card shadow">
          <div class="card-header bg-primary text-white">
            <h4 class="mb-0"><i class="fas fa-list me-2"></i>Vos QR Codes</h4>
          </div>
          <div class="card-body">
            <div v-if="loading" class="text-center p-4">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="mt-2">Chargement des QR codes...</p>
            </div>
            <div v-else-if="error" class="alert alert-danger">
              {{ error }}
            </div>
            <QRCodeList v-else :qrCodes="qrCodes" @deleted="loadQRCodes" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import QRCodeGenerator from '@/components/QRCodeGenerator.vue'
import QRCodeList from '@/components/QRCodeList.vue'
import { QRCode } from '@/models/QRCode'
import { QRCodeService } from '@/services/QRCodeService'
import { AuthService } from '@/services/AuthService'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'HomeView',
  components: {
    QRCodeGenerator,
    QRCodeList
  },
  setup() {
    const qrCodes = ref<QRCode[]>([])
    const loading = ref<boolean>(false)
    const error = ref<string>('')
    const qrCodeService = new QRCodeService()
    const authService = new AuthService()
    const router = useRouter()

    onMounted(async () => {
      // Vérifier si l'utilisateur est authentifié
      if (!authService.isAuthenticated()) {
        router.push('/login')
        return
      }
      
      await loadQRCodes()
    })

    const loadQRCodes = async () => {
      loading.value = true
      error.value = ''
      
      try {
        qrCodes.value = await qrCodeService.getAllQRCodes()
      } catch (err: any) {
        console.error('Erreur lors du chargement des QR codes:', err)
        
        // Si l'erreur est liée à l'authentification, rediriger vers la page de connexion
        if (err.response && err.response.status === 401) {
          router.push('/login')
        } else {
          error.value = 'Erreur lors du chargement des QR codes.'
        }
      } finally {
        loading.value = false
      }
    }

    const onQRGenerated = async () => {
      await loadQRCodes() // Recharger la liste après la génération d'un nouveau QR code
    }

    return {
      qrCodes,
      loading,
      error,
      onQRGenerated,
      loadQRCodes
    }
  }
})
</script>
