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
 * Instance Axios admin — authentification par cookie de session (httpOnly).
 * withCredentials garantit l'envoi du cookie sur toutes les pages admin.
 */
export const adminApi = axios.create({
  baseURL: '/api/admin',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 600000,
  withCredentials: true,
});

adminApi.interceptors.request.use(
  (config) => {
    // FormData : laisser le navigateur poser le boundary multipart
    if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
      if (config.headers) {
        delete (config.headers as Record<string, unknown>)['Content-Type'];
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (!path.startsWith('/admin/login')) {
        const next = encodeURIComponent(path + window.location.search);
        window.location.href = `/admin/login?next=${next}`;
      }
    }
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', error.response?.data || error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
