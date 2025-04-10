import { QRCode } from '@/models/QRCode'
import { ApiService } from '@/api/ApiService'

export class QRCodeService {

  /**
   * Creates a new QR code for the given URL
   */
  async createQRCode(url: string): Promise<QRCode | null> {
    try {
      const newQRCode = await ApiService.createQRCode(url);
      return newQRCode;
    } catch (error) {
      console.error('Error creating QR code:', error);
      return null;
    }
  }

  /**
   * Gets all QR codes from the API
   */
  async getAllQRCodes(): Promise<QRCode[]> {
    try {
      return await ApiService.getAllQRCodes();
    } catch (error) {
      console.error('Error getting all QR codes:', error);
      return [];
    }
  }

  /**
   * Gets a single QR code by ID
   */
  async getQRCodeById(id: string): Promise<QRCode | null> {
    try {
      return await ApiService.getQRCodeById(id);
    } catch (error) {
      console.error(`Error getting QR code ${id}:`, error);
      return null;
    }
  }

  /**
   * Updates a QR code
   */
  async updateQRCode(updatedQRCode: QRCode): Promise<QRCode | null> {
    try {
      return await ApiService.updateQRCode(updatedQRCode);
    } catch (error) {
      console.error(`Error updating QR code ${updatedQRCode.id}:`, error);
      return null;
    }
  }

  /**
   * Deletes a QR code by ID
   */
  async deleteQRCode(id: string): Promise<boolean> {
    try {
      return await ApiService.deleteQRCode(id);
    } catch (error) {
      console.error(`Error deleting QR code ${id}:`, error);
      return false;
    }
  }

  /**
   * Increments the scan count for a QR code and returns the original URL
   */
  async incrementScanCountAndGetUrl(id: string): Promise<string> {
    try {
      const url = await ApiService.incrementScanAndGetUrl(id);
      return url || '';
    } catch (error) {
      console.error(`Error incrementing scan count for QR code ${id}:`, error);
      return '';
    }
  }
}
