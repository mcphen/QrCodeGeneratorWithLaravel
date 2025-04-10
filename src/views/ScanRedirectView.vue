<template>
  <div class="scan-redirect">
    <div class="d-flex justify-content-center align-items-center flex-column vh-100">
      <div class="spinner-border text-primary mb-3" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <h2>Redirecting...</h2>
      <p v-if="error" class="text-danger mt-3">{{ error }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { QRCodeService } from '@/services/QRCodeService'

export default defineComponent({
  name: 'ScanRedirectView',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const error = ref<string>('')
    const qrCodeService = new QRCodeService()

    onMounted(async () => {
      try {
        const url = await qrCodeService.incrementScanCountAndGetUrl(props.id)
        if (url) {
          // Redirect to the original URL after a short delay to display the loading indicator
          setTimeout(() => {
            window.location.href = url
          }, 1000)
        } else {
          error.value = 'QR code non trouvé ou URL invalide.'
        }
      } catch (err) {
        error.value = 'Une erreur est survenue pendant la redirection.'
        console.error(err)
      }
    })

    return {
      error
    }
  }
})
</script>
