import axios from 'axios'
import { api } from '@/api/ApiService'

export interface User {
  id: number;
  name: string;
  email: string;
}

export class AuthService {
  private readonly TOKEN_KEY = 'qr_generator_token';
  private readonly USER_KEY = 'qr_generator_user';

  /**
   * Connexion d'un utilisateur
   */
  async login(email: string, password: string, remember: boolean = false): Promise<boolean> {
    try {
      const response = await api.post('/login', { email, password, remember });
      
      if (response.data.success && response.data.token) {
        this.setToken(response.data.token);
        this.setUser(response.data.user);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  }

  /**
   * Inscription d'un nouvel utilisateur
   */
  async register(name: string, email: string, password: string): Promise<boolean> {
    try {
      const response = await api.post('/register', { name, email, password, password_confirmation: password });
      
      if (response.data.success && response.data.token) {
        this.setToken(response.data.token);
        this.setUser(response.data.user);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  }

  /**
   * Déconnexion de l'utilisateur
   */
  async logout(): Promise<boolean> {
    try {
      // Appel API de déconnexion
      await api.post('/logout');
      return true;
    } catch (error) {
      console.error('Error during logout:', error);
      return false;
    } finally {
      // Toujours supprimer le token et l'utilisateur localement
      this.removeToken();
      this.removeUser();
    }
  }

  /**
   * Récupération des informations de l'utilisateur connecté
   */
  async getCurrentUser(): Promise<User | null> {
    // Si l'utilisateur est déjà en cache, le retourner
    const cachedUser = this.getUser();
    if (cachedUser) {
      return cachedUser;
    }

    // Sinon, récupérer les informations depuis l'API
    if (this.isAuthenticated()) {
      try {
        const response = await api.get('/user');
        const user = response.data.data;
        this.setUser(user);
        return user;
      } catch (error) {
        console.error('Error getting current user:', error);
        this.removeToken();
        this.removeUser();
        return null;
      }
    }

    return null;
  }

  /**
   * Vérification si l'utilisateur est authentifié
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Récupération du token d'authentification
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Définition du token d'authentification
   */
  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    
    // Configurer axios pour envoyer le token dans les requêtes suivantes
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Suppression du token d'authentification
   */
  private removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    delete axios.defaults.headers.common['Authorization'];
  }

  /**
   * Récupération de l'utilisateur du localStorage
   */
  private getUser(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    if (userJson) {
      try {
        return JSON.parse(userJson);
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  /**
   * Enregistrement de l'utilisateur dans le localStorage
   */
  private setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  /**
   * Suppression de l'utilisateur du localStorage
   */
  private removeUser(): void {
    localStorage.removeItem(this.USER_KEY);
  }
}