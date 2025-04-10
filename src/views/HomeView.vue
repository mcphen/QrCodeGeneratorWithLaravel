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
            <QRCodeList :qrCodes="qrCodes" />
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
    const qrCodeService = new QRCodeService()

    onMounted(() => {
      loadQRCodes()
    })

    const loadQRCodes = () => {
      qrCodes.value = qrCodeService.getAllQRCodes()
    }

    const onQRGenerated = (qrCode: QRCode) => {
      loadQRCodes() // Reload the list after a new QR code is generated
    }

    return {
      qrCodes,
      onQRGenerated
    }
  }
})
</script>
