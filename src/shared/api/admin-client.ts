/**
 * Admin Axios Client
 *
 * - Attaches  Authorization: Bearer <accessToken>  on every request.
 * - On 401, automatically tries to refresh via POST /admin/refresh.
 * - If the refresh succeeds the original request is retried transparently.
 * - If the refresh fails the user is logged out.
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { AppError } from '../errors/app.error';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1';

export const adminApiClient = axios.create({
  baseURL: BASE,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

// ── Request interceptor: inject access token ──────────────────────────────
adminApiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // Access token lives in Zustand (memory) — import lazily to avoid circular deps
  const { useAdminAuthStore } = require('@/features/admin/stores/auth.store');
  const token: string | null = useAdminAuthStore.getState().accessToken;
  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor: auto-refresh on 401 ────────────────────────────
let isRefreshing = false;
let pendingQueue: Array<{ resolve: (t: string) => void; reject: (e: unknown) => void }> = [];

const processQueue = (error: unknown, token: string | null) => {
  pendingQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)));
  pendingQueue = [];
};

adminApiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string; errors?: unknown }>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue the request until the refresh resolves
        return new Promise((resolve, reject) => {
          pendingQueue.push({
            resolve: (token) => {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
              resolve(adminApiClient(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { useAdminAuthStore } = require('@/features/admin/stores/auth.store');
        const store = useAdminAuthStore.getState();
        const refreshToken = store.getRefreshToken();

        if (!refreshToken) throw new Error('No refresh token available.');

        const res = await axios.post<{
          data: { accessToken: string; refreshToken: string };
        }>(`${BASE}/admin/refresh`, { refreshToken });

        const { accessToken: newAccess, refreshToken: newRefresh } = res.data.data;

        store.setTokens(newAccess, newRefresh);
        processQueue(null, newAccess);

        originalRequest.headers['Authorization'] = `Bearer ${newAccess}`;
        return adminApiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Refresh failed — force logout
        const { useAdminAuthStore } = require('@/features/admin/stores/auth.store');
        useAdminAuthStore.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    const status = error.response?.status ?? 0;
    const message = error.response?.data?.message ?? error.message;
    return Promise.reject(new AppError(message, status, error.response?.data?.errors));
  },
);
