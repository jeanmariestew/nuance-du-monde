import axios from 'axios';

/**
 * Instance Axios publique (non sécurisée)
 * Pour les requêtes vers les APIs publiques (offres, destinations, etc.)
 */
export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 6000000,
});

/**
 * Instance Axios admin (sécurisée)
 * Pour les requêtes vers les APIs d'administration
 * Inclut automatiquement le token d'authentification
 */
export const adminApi = axios.create({
  baseURL: '/api/admin',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 600000,
});

// Intercepteur pour ajouter le token d'authentification aux requêtes admin
adminApi.interceptors.request.use(
  (config) => {
    // Récupérer le token depuis localStorage (côté client uniquement)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('admin_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs d'authentification admin
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide - rediriger vers login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_token');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs générales sur l'API publique
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log des erreurs en développement
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', error.response?.data || error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
