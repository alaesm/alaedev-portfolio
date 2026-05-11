import { create } from 'zustand';

const REFRESH_TOKEN_KEY = 'admin_refresh_token';

interface AdminAuthStore {
  /** Short-lived access token — kept in memory only */
  accessToken: string | null;
  isAuthenticated: boolean;

  setTokens: (accessToken: string, refreshToken: string) => void;
  setAccessToken: (token: string) => void;
  logout: () => void;
  /** Call on app mount to restore session from persisted refresh token */
  hydrate: () => { hasRefreshToken: boolean };
  getRefreshToken: () => string | null;
}

export const useAdminAuthStore = create<AdminAuthStore>((set) => ({
  accessToken: null,
  isAuthenticated: false,

  setTokens: (accessToken, refreshToken) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
    set({ accessToken, isAuthenticated: true });
  },

  setAccessToken: (token) => {
    set({ accessToken: token, isAuthenticated: true });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
    set({ accessToken: null, isAuthenticated: false });
  },

  hydrate: () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(REFRESH_TOKEN_KEY);
      return { hasRefreshToken: !!stored };
    }
    return { hasRefreshToken: false };
  },

  getRefreshToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    }
    return null;
  },
}));
