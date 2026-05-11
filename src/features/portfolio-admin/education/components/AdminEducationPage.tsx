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
import { useAdminEducation, useCreateEducation, useUpdateEducation, useDeleteEducation } from '../hooks/useEducationAdmin';
import type { EducationItem } from '@/features/portfolio/types/portfolio.types';
import type { EducationFormData } from '../services/education-admin.service';
import { cn } from '@/shared/lib/cn';

const schema = z.object({
  degree: z.string().min(2),
  field: z.string().min(2),
  institution: z.string().min(2),
  location: z.string().min(2),
  startYear: z.coerce.number().int().min(1990),
  graduationYear: z.coerce.number().int().min(1990),
  graduationProject: z.string().optional(),
  description: z.string().min(10),
  achievements: z.string(),
  order: z.coerce.number().int().optional(),
});
type FormValues = z.infer<typeof schema>;

const inputClass =
  'w-full bg-s3 border border-ln rounded-sm px-3 py-2.5 font-mono text-xs text-f0 placeholder-f3 focus:outline-none focus:border-mint/50 transition-colors';

function EducationForm({
  defaultValues,
  onSubmit,
  isLoading,
  submitLabel,
}: {
  defaultValues?: Partial<EducationItem>;
  onSubmit: (d: EducationFormData) => void;
  isLoading?: boolean;
  submitLabel?: string;
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      degree: defaultValues?.degree ?? '',
      field: defaultValues?.field ?? '',
      institution: defaultValues?.institution ?? '',
      location: defaultValues?.location ?? '',
      startYear: defaultValues?.startYear ?? 2021,
      graduationYear: defaultValues?.graduationYear ?? 2025,
      graduationProject: defaultValues?.graduationProject ?? '',
      description: defaultValues?.description ?? '',
      achievements: defaultValues?.achievements?.join('\n') ?? '',
    },
  });

  const submit = (v: FormValues) =>
    onSubmit({ ...v, achievements: v.achievements.split('\n').map((s) => s.trim()).filter(Boolean) });

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="font-mono text-xs text-f3 block mb-1">degree *</label>
          <input className={inputClass} placeholder="Licence" {...register('degree')} />
          {errors.degree && <p className="font-mono text-xs text-rose mt-1">{errors.degree.message}</p>}
        </div>
        <div>
          <label className="font-mono text-xs text-f3 block mb-1">field *</label>
          <input className={inputClass} placeholder="Information Systems" {...register('field')} />
        </div>
      </div>
      <div>
        <label className="font-mono text-xs text-f3 block mb-1">institution *</label>
        <input className={inputClass} placeholder="Abou Bekr Belkaid University" {...register('institution')} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="font-mono text-xs text-f3 block mb-1">location *</label>
          <input className={inputClass} placeholder="Tlemcen, Algeria" {...register('location')} />
        </div>
        <div>
          <label className="font-mono text-xs text-f3 block mb-1">graduation project</label>
          <input className={inputClass} placeholder="Algecom" {...register('graduationProject')} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="font-mono text-xs text-f3 block mb-1">start year *</label>
          <input type="number" className={inputClass} {...register('startYear')} />
        </div>
        <div>
          <label className="font-mono text-xs text-f3 block mb-1">graduation year *</label>
          <input type="number" className={inputClass} {...register('graduationYear')} />
        </div>
      </div>
      <div>
        <label className="font-mono text-xs text-f3 block mb-1">description *</label>
        <textarea className={cn(inputClass, 'resize-none h-16')} {...register('description')} />
        {errors.description && <p className="font-mono text-xs text-rose mt-1">{errors.description.message}</p>}
      </div>
      <div>
        <label className="font-mono text-xs text-f3 block mb-1">achievements (one per line)</label>
        <textarea className={cn(inputClass, 'resize-none h-16')} {...register('achievements')} />
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

export function AdminEducationPage() {
  const { data: items, isLoading, isError, refetch } = useAdminEducation();
  const createMutation = useCreateEducation();
  const updateMutation = useUpdateEducation();
  const deleteMutation = useDeleteEducation();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<EducationItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<EducationItem | null>(null);

  const openCreate = () => { setEditing(null); setDrawerOpen(true); };
  const closeDrawer = () => { setDrawerOpen(false); setEditing(null); };

  return (
    <>
      <AdminTopbar title="education" />
      <div className="p-6 space-y-6">
        <AdminPageHeader
          title="Education"
          description={`${items?.length ?? 0} items`}
          action={
            <button onClick={openCreate} className="font-mono text-xs bg-mint text-fi px-4 py-2 rounded-sm hover:bg-mint/90 transition-colors">
              + Add Education
            </button>
          }
        />

        {isLoading && <AdminTableSkeleton />}
        {isError && <AdminErrorState onRetry={() => refetch()} />}
        {!isLoading && !isError && items?.length === 0 && <AdminEmptyState message="No education items yet." />}

        {!isLoading && !isError && (items?.length ?? 0) > 0 && (
          <div className="border border-ln rounded-sm overflow-hidden">
            <div className="grid grid-cols-[1fr_80px] gap-4 px-4 py-2.5 bg-s2 border-b border-ln">
              {['Degree / Institution', 'Actions'].map((h) => (
                <span key={h} className="font-mono text-xs text-f3 uppercase tracking-wider">{h}</span>
              ))}
            </div>
            {items?.map((item) => (
              <div key={item.id} className="grid grid-cols-[1fr_80px] gap-4 px-4 py-3 border-b border-ln last:border-0 hover:bg-s2/50 items-center">
                <div>
                  <div className="font-mono text-xs text-amber">{item.degree} — {item.field}</div>
                  <div className="font-mono text-xs text-f2">{item.institution}</div>
                  <div className="font-mono text-xs text-f3">{item.startYear} — {item.graduationYear}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditing(item); setDrawerOpen(true); }} className="font-mono text-xs text-f2 hover:text-mint transition-colors">Edit</button>
                  <button onClick={() => setDeleteTarget(item)} className="font-mono text-xs text-f3 hover:text-rose transition-colors">Del</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AdminFormDrawer open={drawerOpen} title={editing ? 'Edit Education' : 'New Education'} onClose={closeDrawer}>
        <EducationForm
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
        title={`Delete "${deleteTarget?.degree}"?`}
        description="This education entry will be permanently removed."
        onConfirm={() => { if (deleteTarget) deleteMutation.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) }); }}
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}
