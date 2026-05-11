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
import {
  useAdminExperience,
  useCreateExperience,
  useUpdateExperience,
  useDeleteExperience,
} from '../hooks/useExperienceAdmin';
import type { ExperienceItem } from '@/features/portfolio/types/portfolio.types';
import type { ExperienceFormData } from '../services/experience-admin.service';
import { cn } from '@/shared/lib/cn';

const schema = z.object({
  title: z.string().min(2),
  type: z.enum(['freelance', 'employment', 'internship']),
  company: z.string().optional(),
  location: z.string().min(2),
  startDate: z.string().min(4),
  endDate: z.string().min(4),
  description: z.string().min(10),
  highlights: z.string(),
  technologies: z.string(),
  order: z.coerce.number().int().optional(),
});
type FormValues = z.infer<typeof schema>;

const inputClass =
  'w-full bg-s3 border border-ln rounded-sm px-3 py-2.5 font-mono text-xs text-f0 placeholder-f3 focus:outline-none focus:border-mint/50 transition-colors';

function ExperienceForm({
  defaultValues,
  onSubmit,
  isLoading,
  submitLabel,
}: {
  defaultValues?: Partial<ExperienceItem>;
  onSubmit: (d: ExperienceFormData) => void;
  isLoading?: boolean;
  submitLabel?: string;
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: defaultValues?.title ?? '',
      type: defaultValues?.type ?? 'freelance',
      company: defaultValues?.company ?? '',
      location: defaultValues?.location ?? '',
      startDate: defaultValues?.startDate ?? '',
      endDate: defaultValues?.endDate ?? '',
      description: defaultValues?.description ?? '',
      highlights: defaultValues?.highlights?.join('\n') ?? '',
      technologies: defaultValues?.technologies?.join(', ') ?? '',
    },
  });

  const submit = (v: FormValues) =>
    onSubmit({
      ...v,
      highlights: v.highlights.split('\n').map((s) => s.trim()).filter(Boolean),
      technologies: v.technologies.split(',').map((s) => s.trim()).filter(Boolean),
    });

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="font-mono text-xs text-f3 block mb-1">title *</label>
          <input className={inputClass} placeholder="Freelance Developer" {...register('title')} />
          {errors.title && <p className="font-mono text-xs text-rose mt-1">{errors.title.message}</p>}
        </div>
        <div>
          <label className="font-mono text-xs text-f3 block mb-1">type *</label>
          <select className={cn(inputClass, 'cursor-pointer')} {...register('type')}>
            <option value="freelance">freelance</option>
            <option value="employment">employment</option>
            <option value="internship">internship</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="font-mono text-xs text-f3 block mb-1">company</label>
          <input className={inputClass} placeholder="Self-employed" {...register('company')} />
        </div>
        <div>
          <label className="font-mono text-xs text-f3 block mb-1">location *</label>
          <input className={inputClass} placeholder="Tlemcen, Algeria" {...register('location')} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="font-mono text-xs text-f3 block mb-1">start date *</label>
          <input className={inputClass} placeholder="2024" {...register('startDate')} />
        </div>
        <div>
          <label className="font-mono text-xs text-f3 block mb-1">end date *</label>
          <input className={inputClass} placeholder="Present" {...register('endDate')} />
        </div>
      </div>
      <div>
        <label className="font-mono text-xs text-f3 block mb-1">description *</label>
        <textarea className={cn(inputClass, 'resize-none h-16')} {...register('description')} />
        {errors.description && <p className="font-mono text-xs text-rose mt-1">{errors.description.message}</p>}
      </div>
      <div>
        <label className="font-mono text-xs text-f3 block mb-1">highlights (one per line)</label>
        <textarea className={cn(inputClass, 'resize-none h-20')} placeholder="Built X&#10;Delivered Y" {...register('highlights')} />
      </div>
      <div>
        <label className="font-mono text-xs text-f3 block mb-1">technologies (comma-separated)</label>
        <input className={inputClass} placeholder="React, Node.js" {...register('technologies')} />
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

export function AdminExperiencePage() {
  const { data: items, isLoading, isError, refetch } = useAdminExperience();
  const createMutation = useCreateExperience();
  const updateMutation = useUpdateExperience();
  const deleteMutation = useDeleteExperience();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<ExperienceItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ExperienceItem | null>(null);

  const openCreate = () => { setEditing(null); setDrawerOpen(true); };
  const openEdit = (i: ExperienceItem) => { setEditing(i); setDrawerOpen(true); };
  const closeDrawer = () => { setDrawerOpen(false); setEditing(null); };

  return (
    <>
      <AdminTopbar title="experience" />
      <div className="p-6 space-y-6">
        <AdminPageHeader
          title="Experience"
          description={`${items?.length ?? 0} items`}
          action={
            <button onClick={openCreate} className="font-mono text-xs bg-mint text-fi px-4 py-2 rounded-sm hover:bg-mint/90 transition-colors">
              + Add Experience
            </button>
          }
        />

        {isLoading && <AdminTableSkeleton />}
        {isError && <AdminErrorState onRetry={() => refetch()} />}
        {!isLoading && !isError && items?.length === 0 && <AdminEmptyState message="No experience items yet." />}

        {!isLoading && !isError && (items?.length ?? 0) > 0 && (
          <div className="border border-ln rounded-sm overflow-hidden">
            <div className="grid grid-cols-[1fr_80px_80px] gap-4 px-4 py-2.5 bg-s2 border-b border-ln">
              {['Role / Period', 'Type', 'Actions'].map((h) => (
                <span key={h} className="font-mono text-xs text-f3 uppercase tracking-wider">{h}</span>
              ))}
            </div>
            {items?.map((item) => (
              <div key={item.id} className="grid grid-cols-[1fr_80px_80px] gap-4 px-4 py-3 border-b border-ln last:border-0 hover:bg-s2/50 items-center">
                <div>
                  <div className="font-mono text-xs text-f1">{item.title}</div>
                  <div className="font-mono text-xs text-f3">{item.startDate} — {item.endDate}</div>
                </div>
                <span className="font-mono text-xs text-sky">{item.type}</span>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(item)} className="font-mono text-xs text-f2 hover:text-mint transition-colors">Edit</button>
                  <button onClick={() => setDeleteTarget(item)} className="font-mono text-xs text-f3 hover:text-rose transition-colors">Del</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AdminFormDrawer open={drawerOpen} title={editing ? `Edit: ${editing.title}` : 'New Experience'} onClose={closeDrawer}>
        <ExperienceForm
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
        title={`Delete "${deleteTarget?.title}"?`}
        description="This experience entry will be permanently removed."
        onConfirm={() => { if (deleteTarget) deleteMutation.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) }); }}
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}
