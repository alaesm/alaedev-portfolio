'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/shared/lib/cn';
import { useAdminAuthStore } from '../stores/auth.store';
import { adminAuthService } from '../services/admin-auth.service';

const NAV_ITEMS = [
  { label: 'Dashboard',        href: '/admin',                  icon: '◈' },
  { label: 'Profile',          href: '/admin/profile',          icon: '▸' },
  { label: 'Projects',         href: '/admin/projects',         icon: '◻' },
  { label: 'Skills',           href: '/admin/skills',           icon: '◆' },
  { label: 'Experience',       href: '/admin/experience',       icon: '◉' },
  { label: 'Education',        href: '/admin/education',        icon: '◎' },
  { label: 'Testimonials',     href: '/admin/testimonials',     icon: '◇' },
  { label: 'Messages',         href: '/admin/contact-messages', icon: '◈' },
  { label: 'Settings',         href: '/admin/settings',         icon: '⚙' },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout, getRefreshToken } = useAdminAuthStore();

  return (
    <aside className="w-56 shrink-0 h-screen sticky top-0 flex flex-col border-r border-ln bg-s1 overflow-y-auto">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-ln">
        <div className="font-mono text-xs text-f3 tracking-widest uppercase">// AlaeDev</div>
        <div className="font-mono text-sm text-mint mt-0.5">admin panel</div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-0.5">
        {NAV_ITEMS.map(({ label, href, icon }) => {
          const isActive =
            href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-sm font-mono text-xs transition-all duration-base',
                isActive
                  ? 'bg-s3 text-mint border border-ln'
                  : 'text-f2 hover:text-f0 hover:bg-s2 border border-transparent',
              )}
            >
              <span className="text-f3 w-4 text-center">{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-ln">
        <button
          onClick={async () => {
              const rt = getRefreshToken();
              if (rt) await adminAuthService.logout(rt);
              logout();
            }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-sm font-mono text-xs text-f3 hover:text-rose hover:bg-s2 border border-transparent transition-all duration-base"
        >
          <span className="w-4 text-center">↩</span>
          Logout
        </button>
      </div>
    </aside>
  );
}
