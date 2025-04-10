<template>
  <div class="qr-code-generator">
    <form @submit.prevent="generateQRCode">
      <div class="mb-3">
        <label for="urlInput" class="form-label">Enter URL</label>
        <div class="input-group">
          <input
            type="url"
            class="form-control"
            id="urlInput"
            v-model="url"
            placeholder="https://example.com"
            required
          />
          <button
            class="btn btn-primary"
            type="submit"
            :disabled="!isValidUrl || isGenerating"
          >
            <i class="fas fa-qrcode me-1"></i>
            {{ isGenerating ? 'Generating...' : 'Generate QR' }}
          </button>
        </div>
        <div class="form-text">Enter a valid URL to generate a QR code.</div>
      </div>
    </form>

    <div v-if="generatedQRCode" class="mt-4 text-center">
      <h5>Your QR Code:</h5>
      <div class="qr-code-container border p-3 rounded bg-light">
        <qrcode-vue
          :value="generatedQRCode.redirectUrl"
          :size="200"
          level="H"
          class="mx-auto d-block"
        ></qrcode-vue>
        <div class="mt-2">
          <small class="text-muted">Scan URL: {{ generatedQRCode.redirectUrl }}</small>
          <div class="d-flex justify-content-center mt-2">
            <button class="btn btn-sm btn-outline-primary me-2" @click="downloadQRCode">
              <i class="fas fa-download me-1"></i> Download
            </button>
            <button class="btn btn-sm btn-outline-secondary" @click="copyRedirectUrl">
              <i class="fas fa-copy me-1"></i> Copy URL
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import QrcodeVue from 'qrcode.vue'
import { QRCodeService } from '@/services/QRCodeService'
import { QRCode } from '@/models/QRCode'

export default defineComponent({
  name: 'QRCodeGenerator',
  components: {
    QrcodeVue
  },
  emits: ['qr-generated'],
  setup(_, { emit }) {
    const url = ref('')
    const isGenerating = ref(false)
    const generatedQRCode = ref<QRCode | null>(null)
    const qrCodeService = new QRCodeService()

    const isValidUrl = computed(() => {
      if (!url.value) return false
      try {
        new URL(url.value)
        return true
      } catch (e) {
        return false
      }
    })

    const generateQRCode = async () => {
      if (!isValidUrl.value) return

      isGenerating.value = true
      try {
        const newQRCode = await qrCodeService.createQRCode(url.value)
        if (newQRCode) {
          generatedQRCode.value = newQRCode
          emit('qr-generated', newQRCode)
          url.value = '' // Reset the input field
        } else {
          throw new Error('Erreur lors de la création du QR code')
        }
      } catch (error) {
        console.error('Error generating QR code:', error)
        alert('Erreur lors de la génération du QR code. Veuillez réessayer.')
      } finally {
        isGenerating.value = false
      }
    }

    const downloadQRCode = () => {
      if (!generatedQRCode.value) return

      const canvas = document.querySelector('.qr-code-container canvas')
      if (canvas) {
        const link = document.createElement('a')
        link.download = `qrcode-${generatedQRCode.value.id}.png`
        link.href = (canvas as HTMLCanvasElement).toDataURL('image/png')
        link.click()
      }
    }

    const copyRedirectUrl = () => {
      if (!generatedQRCode.value) return

      navigator.clipboard.writeText(generatedQRCode.value.redirectUrl)
        .then(() => {
          alert('URL copied to clipboard!')
        })
        .catch(err => {
          console.error('Could not copy text: ', err)
        })
    }

    return {
      url,
      isValidUrl,
      isGenerating,
      generatedQRCode,
      generateQRCode,
      downloadQRCode,
      copyRedirectUrl
    }
  }
})
</script>

<style scoped>
.qr-code-container {
  display: inline-block;
  margin: 0 auto;
}
</style>
