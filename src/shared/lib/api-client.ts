import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Use empty baseURL in browser to use Next.js proxy (avoids CORS)
// Use full backend URL on server-side
const baseURL =
  typeof window !== 'undefined'
    ? '' // Empty string makes axios use relative URLs through Next.js proxy
    : process.env.API_BACKENDL_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Track if we're currently refreshing to avoid multiple refresh calls
let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

function isAuthEndpoint(url?: string): boolean {
  return !!url && (url.includes('/auth/login') || url.includes('/auth/refresh'));
}

function getRefreshURL(): string {
  return typeof window !== 'undefined'
    ? '/api/auth/refresh'
    : `${process.env.API_BACKENDL_URL || 'http://localhost:5000'}/api/auth/refresh`;
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

  const response = await axios.post(getRefreshURL(), {
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

/**
 * Ensures a valid access token is available.
 * If a refresh is already in progress, all callers share the same promise.
 */
async function ensureValidToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;

  const token = localStorage.getItem('accessToken');

  if (!token || !isTokenExpired(token)) {
    return token;
  }

  // Token is expired or about to expire — refresh it
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

// Request interceptor - Proactively refresh expired tokens before sending requests
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
      // If refresh fails, the request will proceed without a token
      // and the response interceptor will handle the 401
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Fallback for unexpected 401s (e.g. token revoked server-side)
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
          // Force a refresh since the token we had was rejected
          isRefreshing = false;
          refreshPromise = null;
          // Remove the stale token so ensureValidToken sees it as missing
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
