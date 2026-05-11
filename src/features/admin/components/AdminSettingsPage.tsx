'use client';

import { AdminTopbar } from './AdminTopbar';
import { AdminPageHeader } from './AdminPageHeader';
import { useAdminAuthStore } from '../stores/auth.store';
import { adminAuthService } from '../services/admin-auth.service';

export function AdminSettingsPage() {
  const { logout, getRefreshToken } = useAdminAuthStore();

  const handleLogout = async () => {
    const rt = getRefreshToken();
    if (rt) await adminAuthService.logout(rt);
    logout();
  };

  return (
    <>
      <AdminTopbar title="settings" />
      <div className="p-6 space-y-6">
        <AdminPageHeader title="Settings" description="Admin panel configuration" />

        {/* Auth */}
        <div className="border border-ln bg-s1 rounded-sm overflow-hidden">
          <div className="px-4 py-2.5 bg-s2 border-b border-ln">
            <span className="font-mono text-xs text-f3">// Authentication</span>
          </div>
          <div className="p-5 space-y-4">
            <div className="border border-mint/20 bg-mint/5 rounded-sm p-4 space-y-1">
              <p className="font-mono text-xs text-mint">✓ JWT Bearer token auth is active.</p>
              <p className="font-mono text-xs text-f3">
                Access token expires in 15 min and is refreshed automatically.
                Refresh token (7 days) is persisted in localStorage.
              </p>
            </div>

            <div className="pt-2 border-t border-ln">
              <button
                onClick={handleLogout}
                className="font-mono text-xs text-rose border border-rose/30 px-4 py-2 rounded-sm hover:bg-rose/10 transition-all"
              >
                ↩ Logout (revoke refresh token)
              </button>
            </div>
          </div>
        </div>

        {/* System info */}
        <div className="border border-ln bg-s1 rounded-sm overflow-hidden">
          <div className="px-4 py-2.5 bg-s2 border-b border-ln">
            <span className="font-mono text-xs text-f3">// System</span>
          </div>
          <div className="p-5 space-y-2 font-mono text-xs">
            {[
              { k: 'api_url',        v: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1' },
              { k: 'database',       v: 'Firebase Firestore' },
              { k: 'auth_strategy',  v: 'JWT Bearer (access 15m + refresh 7d)' },
              { k: 'token_storage',  v: 'access → memory · refresh → localStorage' },
              { k: 'framework',      v: 'Next.js 15 / App Router' },
            ].map(({ k, v }) => (
              <div key={k} className="flex gap-4">
                <span className="text-f3 w-40 shrink-0">{k}:</span>
                <span className="text-f1">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
