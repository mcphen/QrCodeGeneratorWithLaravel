import axios from 'axios';
import { QRCode } from '@/models/QRCode';

// URL de base de l'API Laravel (à configurer dans .env)
const API_BASE_URL = 'http://localhost:8000/api';

// Créer une instance d'Axios préconfigurée pour l'API Laravel
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export class ApiService {
  /**
   * Récupère tous les QR codes depuis l'API
   */
  static async getAllQRCodes(): Promise<QRCode[]> {
    try {
      const response = await api.get('/qrcodes');
      return response.data.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des QR codes:', error);
      return [];
    }
  }

  /**
   * Récupère un QR code par son ID
   */
  static async getQRCodeById(id: string): Promise<QRCode | null> {
    try {
      const response = await api.get(`/qrcodes/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du QR code ${id}:`, error);
      return null;
    }
  }

  /**
   * Crée un nouveau QR code
   */
  static async createQRCode(url: string): Promise<QRCode | null> {
    try {
      const response = await api.post('/qrcodes', { originalUrl: url });
      return response.data.data;
    } catch (error) {
      console.error('Erreur lors de la création du QR code:', error);
      return null;
    }
  }

  /**
   * Met à jour un QR code existant
   */
  static async updateQRCode(qrCode: QRCode): Promise<QRCode | null> {
    try {
      const response = await api.put(`/qrcodes/${qrCode.id}`, qrCode);
      return response.data.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du QR code ${qrCode.id}:`, error);
      return null;
    }
  }

  /**
   * Supprime un QR code
   */
  static async deleteQRCode(id: string): Promise<boolean> {
    try {
      await api.delete(`/qrcodes/${id}`);
      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression du QR code ${id}:`, error);
      return false;
    }
  }

  /**
   * Incrémente le compteur de scan et récupère l'URL originale
   */
  static async incrementScanAndGetUrl(id: string): Promise<string | null> {
    try {
      const response = await api.post(`/qrcodes/${id}/scan`);
      return response.data.data.originalUrl;
    } catch (error) {
      console.error(`Erreur lors de l'incrémentation du compteur pour ${id}:`, error);
      return null;
    }
  }
}