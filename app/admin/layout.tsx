import type { Metadata } from 'next';
import { QueryProvider } from '@/shared/tanstack/providers';
import { AdminLayout } from '@/features/admin/components/AdminLayout';

export const metadata: Metadata = {
  title: 'AlaeDev Admin',
  description: 'Portfolio admin panel — AlaeDev',
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AdminLayout>
        {children}
      </AdminLayout>
    </QueryProvider>
  );
}
