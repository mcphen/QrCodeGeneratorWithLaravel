<template>
  <div class="qr-code-list">
    <div v-if="qrCodes.length === 0" class="text-center p-4">
      <i class="fas fa-qrcode fa-3x text-muted mb-3"></i>
      <p class="lead">No QR codes generated yet.</p>
      <p>Use the form to create your first QR code!</p>
    </div>

    <div v-else class="table-responsive">
      <table class="table table-hover">
        <thead>
          <tr>
            <th>QR Code</th>
            <th>Original URL</th>
            <th>Created</th>
            <th>Scans</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="qrCode in sortedQRCodes" :key="qrCode.id">
            <td class="text-center align-middle">
              <qrcode-vue
                :value="qrCode.redirectUrl"
                :size="80"
                level="M"
                class="qr-thumbnail"
              ></qrcode-vue>
            </td>
            <td class="align-middle">
              <div class="text-truncate" style="max-width: 200px;" :title="qrCode.originalUrl">
                {{ qrCode.originalUrl }}
              </div>
            </td>
            <td class="align-middle">{{ formatDate(qrCode.createdAt) }}</td>
            <td class="align-middle">
              <span class="badge bg-primary">{{ qrCode.scanCount }}</span>
            </td>
            <td class="align-middle">
              <div class="btn-group">
                <button 
                  class="btn btn-sm btn-outline-primary" 
                  @click="copyUrl(qrCode.redirectUrl)"
                  title="Copy QR Code URL"
                >
                  <i class="fas fa-copy"></i>
                </button>
                <a 
                  :href="qrCode.originalUrl" 
                  target="_blank" 
                  class="btn btn-sm btn-outline-secondary"
                  title="Open original URL"
                >
                  <i class="fas fa-external-link-alt"></i>
                </a>
                <button 
                  class="btn btn-sm btn-outline-danger" 
                  @click="deleteQRCode(qrCode.id)"
                  title="Delete QR Code"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import QrcodeVue from 'qrcode.vue'
import { QRCode } from '@/models/QRCode'
import { QRCodeService } from '@/services/QRCodeService'

export default defineComponent({
  name: 'QRCodeList',
  components: {
    QrcodeVue
  },
  props: {
    qrCodes: {
      type: Array as () => QRCode[],
      required: true
    }
  },
  setup(props) {
    const qrCodeService = new QRCodeService()

    const sortedQRCodes = computed(() => {
      return [...props.qrCodes].sort((a, b) => b.createdAt - a.createdAt)
    })

    const formatDate = (timestamp: number): string => {
      return new Date(timestamp).toLocaleString()
    }

    const copyUrl = (url: string): void => {
      navigator.clipboard.writeText(url)
        .then(() => {
          alert('URL copied to clipboard!')
        })
        .catch(err => {
          console.error('Could not copy text: ', err)
        })
    }

    const deleteQRCode = (id: string): void => {
      if (confirm('Are you sure you want to delete this QR code?')) {
        qrCodeService.deleteQRCode(id)
        // Force a page reload to update the list
        window.location.reload()
      }
    }

    return {
      sortedQRCodes,
      formatDate,
      copyUrl,
      deleteQRCode
    }
  }
})
</script>

<style scoped>
.qr-thumbnail {
  display: inline-block;
}

.table th, .table td {
  vertical-align: middle;
}
</style>
