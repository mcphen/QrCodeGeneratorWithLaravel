<template>
  <div class="home">
    <h1 class="text-center mb-4">QR Code Generator</h1>
    
    <div class="row">
      <div class="col-md-6 mb-4">
        <div class="card">
          <div class="card-header bg-primary text-white">
            <h4 class="mb-0">Create New QR Code</h4>
          </div>
          <div class="card-body">
            <QRCodeGenerator @qr-generated="onQRGenerated" />
          </div>
        </div>
      </div>
      
      <div class="col-md-6">
        <div class="card">
          <div class="card-header bg-primary text-white">
            <h4 class="mb-0">Your QR Codes</h4>
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

    onMounted(async () => {
      await loadQRCodes()
    })

    const loadQRCodes = async () => {
      loading.value = true
      error.value = ''
      
      try {
        qrCodes.value = await qrCodeService.getAllQRCodes()
      } catch (err) {
        console.error('Error loading QR codes:', err)
        error.value = 'Erreur lors du chargement des QR codes.'
      } finally {
        loading.value = false
      }
    }

    const onQRGenerated = async (qrCode: QRCode) => {
      await loadQRCodes() // Reload the list after a new QR code is generated
    }

    return {
      qrCodes,
      loading,
      error,
      onQRGenerated
    }
  }
})
</script>
