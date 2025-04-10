import { QRCode } from '@/models/QRCode'

export class QRCodeService {
  private readonly storageKey: string = 'qr_codes'
  private readonly baseUrl: string = window.location.origin

  /**
   * Creates a new QR code for the given URL
   */
  createQRCode(url: string): QRCode {
    const qrCodes = this.getAllQRCodes()
    
    // Generate a unique ID
    const id = this.generateUniqueId()
    
    // Create the QR code object
    const newQRCode: QRCode = {
      id,
      originalUrl: url,
      redirectUrl: `${this.baseUrl}/scan/${id}`,
      createdAt: Date.now(),
      scanCount: 0
    }
    
    // Save to localStorage
    this.saveQRCodes([...qrCodes, newQRCode])
    
    return newQRCode
  }

  /**
   * Gets all QR codes from localStorage
   */
  getAllQRCodes(): QRCode[] {
    const storedQRCodes = localStorage.getItem(this.storageKey)
    return storedQRCodes ? JSON.parse(storedQRCodes) : []
  }

  /**
   * Gets a single QR code by ID
   */
  getQRCodeById(id: string): QRCode | undefined {
    const qrCodes = this.getAllQRCodes()
    return qrCodes.find(qrCode => qrCode.id === id)
  }

  /**
   * Updates a QR code
   */
  updateQRCode(updatedQRCode: QRCode): void {
    const qrCodes = this.getAllQRCodes()
    const index = qrCodes.findIndex(qrCode => qrCode.id === updatedQRCode.id)
    
    if (index !== -1) {
      qrCodes[index] = updatedQRCode
      this.saveQRCodes(qrCodes)
    }
  }

  /**
   * Deletes a QR code by ID
   */
  deleteQRCode(id: string): void {
    const qrCodes = this.getAllQRCodes()
    const filteredQRCodes = qrCodes.filter(qrCode => qrCode.id !== id)
    this.saveQRCodes(filteredQRCodes)
  }

  /**
   * Increments the scan count for a QR code and returns the original URL
   */
  incrementScanCountAndGetUrl(id: string): string {
    const qrCode = this.getQRCodeById(id)
    
    if (qrCode) {
      qrCode.scanCount += 1
      this.updateQRCode(qrCode)
      return qrCode.originalUrl
    }
    
    return ''
  }

  /**
   * Saves the QR codes to localStorage
   */
  private saveQRCodes(qrCodes: QRCode[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(qrCodes))
  }

  /**
   * Generates a unique ID for a QR code
   */
  private generateUniqueId(): string {
    // Generate a random string and append timestamp to ensure uniqueness
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15) + 
           Date.now().toString(36)
  }
}
