import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Use empty baseURL in browser to use Next.js proxy (avoids CORS)
// Use full backend URL on server-side
const baseURL = typeof window !== 'undefined'
  ? '' // Empty string makes axios use relative URLs through Next.js proxy
  : process.env.API_BACKENDL_URL || 'http://localhost:5000';

// Log the base URL for debugging
if (typeof window !== 'undefined') {
  console.log('API Base URL: Using Next.js proxy (relative URLs)');
} else {
  console.log('API Base URL (Server):', baseURL);
}

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Track if we're currently refreshing to avoid multiple refresh calls
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Log the full URL being called
    if (typeof window !== 'undefined') {
      console.log('Making request to:', `${config.baseURL}${config.url}`);
    }

    // Skip token for login and refresh endpoints
    if (config.url?.includes('/auth/login') || config.url?.includes('/auth/refresh')) {
      return config;
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors and refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Skip refresh for login/refresh endpoints
      if (
        originalRequest.url?.includes('/auth/login') ||
        originalRequest.url?.includes('/auth/refresh')
      ) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;

      if (!refreshToken) {
        // No refresh token, redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/auth/login';
        }
        return Promise.reject(error);
      }

      try {
        // Call refresh endpoint
        // Use the same baseURL strategy: relative URL in browser, full URL on server
        const refreshURL = typeof window !== 'undefined'
          ? '/api/auth/refresh'
          : `${process.env.API_BACKENDL_URL || 'http://localhost:5000'}/api/auth/refresh`;

        const response = await axios.post(refreshURL, { refreshToken });

        const { accessToken, refreshToken: newRefreshToken, user } = response.data;

        // Store new tokens
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);
          localStorage.setItem('user', JSON.stringify(user));
        }

        // Update authorization header
        apiClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // Process queued requests
        processQueue(null, accessToken);

        // Retry original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        processQueue(refreshError as Error, null);

        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/auth/login';
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other errors
    if (error.response?.status === 500) {
      console.error('Server error');
    }

    return Promise.reject(error);
  }
);

export { apiClient };
