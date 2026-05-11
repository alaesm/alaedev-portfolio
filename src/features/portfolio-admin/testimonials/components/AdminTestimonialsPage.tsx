'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AdminTopbar } from '@/features/admin/components/AdminTopbar';
import { AdminPageHeader } from '@/features/admin/components/AdminPageHeader';
import { AdminTableSkeleton } from '@/features/admin/components/AdminLoadingSkeleton';
import { AdminEmptyState } from '@/features/admin/components/AdminEmptyState';
import { AdminErrorState } from '@/features/admin/components/AdminErrorState';
import { AdminFormDrawer } from '@/features/admin/components/AdminFormDrawer';
import { AdminConfirmDialog } from '@/features/admin/components/AdminConfirmDialog';
import { useAdminTestimonials, useCreateTestimonial, useUpdateTestimonial, useDeleteTestimonial } from '../hooks/useTestimonialsAdmin';
import type { Testimonial } from '@/features/portfolio/types/portfolio.types';
import type { TestimonialFormData } from '../services/testimonials-admin.service';
import { cn } from '@/shared/lib/cn';

const schema = z.object({
  clientName: z.string().min(2),
  clientTitle: z.string().optional(),
  clientLocation: z.string().min(2),
  rating: z.coerce.number().int().min(1).max(5),
  content: z.string().min(5),
  projectType: z.string().min(2),
  date: z.string().min(4),
  approved: z.boolean().default(false),
  order: z.coerce.number().int().optional(),
});
type FormValues = z.infer<typeof schema>;

const inputClass =
  'w-full bg-s3 border border-ln rounded-sm px-3 py-2.5 font-mono text-xs text-f0 placeholder-f3 focus:outline-none focus:border-mint/50 transition-colors';

function TestimonialForm({
  defaultValues,
  onSubmit,
  isLoading,
  submitLabel,
}: {
  defaultValues?: Partial<Testimonial>;
  onSubmit: (d: TestimonialFormData) => void;
  isLoading?: boolean;
  submitLabel?: string;
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      clientName: defaultValues?.clientName ?? '',
      clientTitle: defaultValues?.clientTitle ?? '',
      clientLocation: defaultValues?.clientLocation ?? '',
      rating: defaultValues?.rating ?? 5,
      content: defaultValues?.content ?? 'Client recommendation to be added after approval.',
      projectType: defaultValues?.projectType ?? '',
      date: defaultValues?.date ?? new Date().getFullYear().toString(),
      approved: defaultValues?.approved ?? false,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="font-mono text-xs text-f3 block mb-1">client name *</label>
          <input className={inputClass} {...register('clientName')} />
          {errors.clientName && <p className="font-mono text-xs text-rose mt-1">{errors.clientName.message}</p>}
        </div>
        <div>
          <label className="font-mono text-xs text-f3 block mb-1">title / role</label>
          <input className={inputClass} placeholder="Business Owner" {...register('clientTitle')} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="font-mono text-xs text-f3 block mb-1">location *</label>
          <input className={inputClass} placeholder="Saudi Arabia" {...register('clientLocation')} />
        </div>
        <div>
          <label className="font-mono text-xs text-f3 block mb-1">project type *</label>
          <input className={inputClass} placeholder="Web Application" {...register('projectType')} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="font-mono text-xs text-f3 block mb-1">date *</label>
          <input className={inputClass} placeholder="2024" {...register('date')} />
        </div>
        <div>
          <label className="font-mono text-xs text-f3 block mb-1">rating (1-5) *</label>
          <input type="number" min={1} max={5} className={inputClass} {...register('rating')} />
        </div>
      </div>
      <div>
        <label className="font-mono text-xs text-f3 block mb-1">content *</label>
        <textarea className={cn(inputClass, 'resize-none h-24')} {...register('content')} />
        {errors.content && <p className="font-mono text-xs text-rose mt-1">{errors.content.message}</p>}
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="approved" className="accent-mint" {...register('approved')} />
        <label htmlFor="approved" className="font-mono text-xs text-f2 cursor-pointer">
          Approved (show on portfolio)
        </label>
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className={cn('w-full bg-mint text-fi font-mono text-xs py-2.5 rounded-sm hover:bg-mint/90 transition-colors', isLoading && 'opacity-50 cursor-not-allowed')}
      >
        {isLoading ? 'Saving...' : (submitLabel ?? 'Save')}
      </button>
    </form>
  );
}

export function AdminTestimonialsPage() {
  const { data: items, isLoading, isError, refetch } = useAdminTestimonials();
  const createMutation = useCreateTestimonial();
  const updateMutation = useUpdateTestimonial();
  const deleteMutation = useDeleteTestimonial();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);

  const closeDrawer = () => { setDrawerOpen(false); setEditing(null); };

  return (
    <>
      <AdminTopbar title="testimonials" />
      <div className="p-6 space-y-6">
        <AdminPageHeader
          title="Testimonials"
          description={`${items?.length ?? 0} items`}
          action={
            <button
              onClick={() => { setEditing(null); setDrawerOpen(true); }}
              className="font-mono text-xs bg-mint text-fi px-4 py-2 rounded-sm hover:bg-mint/90 transition-colors"
            >
              + Add Testimonial
            </button>
          }
        />

        {isLoading && <AdminTableSkeleton />}
        {isError && <AdminErrorState onRetry={() => refetch()} />}
        {!isLoading && !isError && items?.length === 0 && <AdminEmptyState message="No testimonials yet." />}

        {!isLoading && !isError && (items?.length ?? 0) > 0 && (
          <div className="border border-ln rounded-sm overflow-hidden">
            <div className="grid grid-cols-[1fr_80px_80px_80px] gap-4 px-4 py-2.5 bg-s2 border-b border-ln">
              {['Client', 'Location', 'Approved', 'Actions'].map((h) => (
                <span key={h} className="font-mono text-xs text-f3 uppercase tracking-wider">{h}</span>
              ))}
            </div>
            {items?.map((item) => (
              <div key={item.id} className="grid grid-cols-[1fr_80px_80px_80px] gap-4 px-4 py-3 border-b border-ln last:border-0 hover:bg-s2/50 items-center">
                <div>
                  <div className="font-mono text-xs text-f1">{item.clientName}</div>
                  <div className="font-mono text-xs text-f3">{item.clientTitle}</div>
                </div>
                <span className="font-mono text-xs text-f2">{item.clientLocation}</span>
                <span className="font-mono text-xs">
                  {item.approved ? <span className="text-mint">✓ yes</span> : <span className="text-f3">placeholder</span>}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => { setEditing(item); setDrawerOpen(true); }} className="font-mono text-xs text-f2 hover:text-mint transition-colors">Edit</button>
                  <button onClick={() => setDeleteTarget(item)} className="font-mono text-xs text-f3 hover:text-rose transition-colors">Del</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AdminFormDrawer open={drawerOpen} title={editing ? `Edit: ${editing.clientName}` : 'New Testimonial'} onClose={closeDrawer}>
        <TestimonialForm
          defaultValues={editing ?? undefined}
          onSubmit={(data) => {
            if (editing) updateMutation.mutate({ id: editing.id, data }, { onSuccess: closeDrawer });
            else createMutation.mutate(data, { onSuccess: closeDrawer });
          }}
          isLoading={createMutation.isPending || updateMutation.isPending}
          submitLabel={editing ? 'Update' : 'Create'}
        />
      </AdminFormDrawer>

      <AdminConfirmDialog
        open={!!deleteTarget}
        title={`Delete testimonial from "${deleteTarget?.clientName}"?`}
        description="This will permanently remove the testimonial."
        onConfirm={() => { if (deleteTarget) deleteMutation.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) }); }}
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}
