// ============================================================
// API CLIENT - Configuracion de Axios
// ============================================================
// Este archivo configura el cliente HTTP (Axios) con:
// - Inyeccion automatica del Bearer token en cada request
// - Refresh automatico del token cuando expira
// - Redireccion a login cuando el refresh falla
//
// NOTA: En Terra Prime App, el frontend usa un proxy de Next.js
// para evitar CORS (las URLs son relativas: /api/...).
// En otro sistema, reemplazar baseURL con la URL del backend.
// ============================================================

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// ---- CONFIGURAR SEGUN TU ENTORNO ----
// En el sistema original usa proxy de Next.js (baseURL vacio en browser).
// Para otro sistema, usar directamente la URL del backend:
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ---- MANEJO DE TOKENS ----

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

function isAuthEndpoint(url?: string): boolean {
  return !!url && (url.includes('/auth/login') || url.includes('/auth/refresh'));
}

function isTokenExpired(token: string, bufferSeconds = 30): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now() + bufferSeconds * 1000;
  } catch {
    return true;
  }
}

function clearAuthAndRedirect(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.href = '/auth/login';
  }
}

async function doRefreshToken(): Promise<string> {
  const storedRefreshToken =
    typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;

  if (!storedRefreshToken) {
    clearAuthAndRedirect();
    throw new Error('No refresh token available');
  }

  const response = await axios.post(`${baseURL}/api/auth/refresh`, {
    refreshToken: storedRefreshToken,
  });

  const { accessToken, refreshToken: newRefreshToken, user } = response.data;

  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', newRefreshToken);
    localStorage.setItem('user', JSON.stringify(user));
  }

  return accessToken;
}

async function ensureValidToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;

  const token = localStorage.getItem('accessToken');

  if (!token || !isTokenExpired(token)) {
    return token;
  }

  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = doRefreshToken()
    .catch((error) => {
      clearAuthAndRedirect();
      throw error;
    })
    .finally(() => {
      isRefreshing = false;
      refreshPromise = null;
    });

  return refreshPromise;
}

// ---- INTERCEPTORES ----

// Request: inyecta Bearer token automaticamente
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (isAuthEndpoint(config.url)) {
      return config;
    }

    try {
      const token = await ensureValidToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Si el refresh falla, la request sigue sin token
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response: maneja 401 con retry automatico
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isAuthEndpoint(originalRequest.url)) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const newToken = await ensureValidToken();
        if (!newToken) {
          isRefreshing = false;
          refreshPromise = null;
          if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
          }
          const freshToken = await doRefreshToken();
          originalRequest.headers.Authorization = `Bearer ${freshToken}`;
          return apiClient(originalRequest);
        }

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch {
        clearAuthAndRedirect();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export { apiClient };
