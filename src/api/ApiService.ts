import axios from 'axios';
import { QRCode } from '@/models/QRCode';

// URL de base de l'API Laravel depuis les variables d'environnement
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Afficher l'URL de l'API pour le débogage (à supprimer en production)
console.log('API URL:', API_BASE_URL);

// Créer une instance d'Axios préconfigurée pour l'API Laravel
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Ajouter le token d'authentification s'il existe
const token = localStorage.getItem('qr_generator_token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Token expiré ou invalide, rediriger vers la page de connexion
      localStorage.removeItem('qr_generator_token');
      localStorage.removeItem('qr_generator_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

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