'use client';

import Link from 'next/link';
import { AdminTopbar } from './AdminTopbar';
import { AdminStatCard } from './AdminStatCard';
import { AdminStatsSkeleton } from './AdminLoadingSkeleton';
import { AdminErrorState } from './AdminErrorState';
import { useAdminStats } from '../hooks/useAdminStats';

const QUICK_ACTIONS = [
  { label: '+ New Project',     href: '/admin/projects',         accent: 'text-mint' },
  { label: '+ New Skill Group', href: '/admin/skills',           accent: 'text-sky' },
  { label: '+ New Testimonial', href: '/admin/testimonials',     accent: 'text-amber' },
  { label: 'View Messages',     href: '/admin/contact-messages', accent: 'text-rose' },
  { label: 'Edit Profile',      href: '/admin/profile',          accent: 'text-f1' },
];

export function AdminDashboardPage() {
  const { data: stats, isLoading, isError, refetch } = useAdminStats();

  return (
    <>
      <AdminTopbar title="dashboard" />
      <div className="p-6 space-y-8">
        {/* Stats */}
        <section className="space-y-3">
          <div className="font-mono text-xs text-f3 tracking-widest uppercase">
            // [00] System Overview
          </div>
          {isLoading && <AdminStatsSkeleton />}
          {isError && (
            <AdminErrorState
              message="Could not load stats. Is the backend running?"
              onRetry={() => refetch()}
            />
          )}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <AdminStatCard label="Projects"     value={stats.totalProjects}     accent="mint" />
              <AdminStatCard label="Featured"     value={stats.featuredProjects}  accent="sky" />
              <AdminStatCard label="Skill Groups" value={stats.totalSkillGroups}  accent="amber" />
              <AdminStatCard label="Testimonials" value={stats.totalTestimonials} accent="mint" />
              <AdminStatCard label="Messages"     value={stats.totalMessages}     sub="total" />
              <AdminStatCard label="New Messages" value={stats.newMessages}       accent="rose" sub="unread" />
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section className="space-y-3">
          <div className="font-mono text-xs text-f3 tracking-widest uppercase">
            // [01] Quick Actions
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {QUICK_ACTIONS.map(({ label, href, accent }) => (
              <Link
                key={href}
                href={href}
                className="border border-ln bg-s1 hover:bg-s2 hover:border-ln2 px-4 py-3 rounded-sm font-mono text-xs transition-all duration-base"
              >
                <span className={accent}>{label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* System info */}
        <section className="space-y-3">
          <div className="font-mono text-xs text-f3 tracking-widest uppercase">
            // [02] System Info
          </div>
          <div className="border border-ln bg-s1 rounded-sm p-4 font-mono text-xs space-y-2">
            <div className="flex gap-4">
              <span className="text-f3 w-32">api_base:</span>
              <span className="text-mint">{process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1'}</span>
            </div>
            <div className="flex gap-4">
              <span className="text-f3 w-32">auth_mode:</span>
              <span className="text-amber">x-admin-secret (dev)</span>
            </div>
            <div className="flex gap-4">
              <span className="text-f3 w-32">database:</span>
              <span className="text-sky">Firebase Firestore</span>
            </div>
            <div className="flex gap-4">
              <span className="text-f3 w-32">todo:</span>
              <span className="text-rose">Replace admin secret with JWT auth in production</span>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
