import axios from 'axios';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1';

export interface LoginTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data: LoginTokens;
}

export const adminAuthService = {
  login: async (email: string, password: string): Promise<LoginTokens> => {
    const res = await axios.post<LoginResponse>(`${BASE}/admin/login`, { email, password });
    return res.data.data;
  },

  logout: async (refreshToken: string): Promise<void> => {
    await axios.post(`${BASE}/admin/logout`, { refreshToken }).catch(() => {
      // Best-effort — always clear client-side session regardless
    });
  },
};
