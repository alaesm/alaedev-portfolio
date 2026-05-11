'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAdminAuthStore } from '../stores/auth.store';
import { AdminSidebar } from './AdminSidebar';
import { AdminToast } from './AdminToast';
import { AdminAuthGate } from './AdminAuthGate';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1';

export function AdminLayout({ children }: AdminLayoutProps) {
  const { isAuthenticated, hydrate, setTokens, logout } = useAdminAuthStore();
  const getRefreshToken = useAdminAuthStore((s) => s.getRefreshToken);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const restore = async () => {
      const { hasRefreshToken } = hydrate();

      if (hasRefreshToken) {
        const refreshToken = getRefreshToken();
        try {
          const res = await axios.post<{
            data: { accessToken: string; refreshToken: string };
          }>(`${BASE}/admin/refresh`, { refreshToken });
          const { accessToken, refreshToken: newRefresh } = res.data.data;
          setTokens(accessToken, newRefresh);
        } catch {
          // Refresh token expired or revoked — show login
          logout();
        }
      }

      setChecking(false);
    };

    restore();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen bg-s0 flex items-center justify-center">
        <span className="font-mono text-xs text-f3 animate-pulse">Checking session...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminAuthGate />;
  }

  return (
    <div className="flex min-h-screen bg-s0">
      <AdminSidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {children}
      </main>
      <AdminToast />
    </div>
  );
}
