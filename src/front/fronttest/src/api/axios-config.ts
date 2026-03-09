import axios, { type InternalAxiosRequestConfig } from 'axios';
import { AuthService } from './auth-service';
import { useAuthStore } from '../store/use-auth-store';

const isAuthUrl = (url = '') => /\/auth\/(login|register|refresh|logout)(\?|$)/.test(url);

let refreshPromise: Promise<string> | null = null;

async function doRefresh(): Promise<string> {
  if (refreshPromise) return refreshPromise;
  refreshPromise = AuthService.refresh()
    .then((res) => {
      const token = res.data.accessToken;
      localStorage.setItem('accessToken', token);
      return token;
    })
    .finally(() => {
      refreshPromise = null;
    });
  return refreshPromise;
}

export function setupAxiosInterceptors() {
  axios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (typeof config.url === 'string' && !isAuthUrl(config.url)) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    config.withCredentials = true;
    return config;
  });

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalConfig = error.config;

      if (error.response?.status !== 401) {
        return Promise.reject(error);
      }

      if (typeof originalConfig.url === 'string' && originalConfig.url.includes('/auth/refresh')) {
        useAuthStore.getState().setIsAuth(false);
        useAuthStore.getState().setUser(null);
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      if (originalConfig._retry) {
        return Promise.reject(error);
      }

      try {
        const token = await doRefresh();
        originalConfig._retry = true;
        originalConfig.headers.Authorization = `Bearer ${token}`;
        return axios(originalConfig);
      } catch {
        useAuthStore.getState().setIsAuth(false);
        useAuthStore.getState().setUser(null);
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
  );
}
