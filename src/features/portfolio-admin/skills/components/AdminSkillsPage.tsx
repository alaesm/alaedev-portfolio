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
  useAdminSkills,
  useCreateSkillGroup,
  useUpdateSkillGroup,
  useDeleteSkillGroup,
} from '../hooks/useSkillsAdmin';
import type { SkillGroupWithId } from '../services/skills-admin.service';
import { cn } from '@/shared/lib/cn';

const schema = z.object({
  category: z.string().min(2, 'Category is required'),
  skills: z.string().min(1, 'Add at least one skill'),
  order: z.coerce.number().int().optional(),
});
type FormValues = z.infer<typeof schema>;

const inputClass =
  'w-full bg-s3 border border-ln rounded-sm px-3 py-2.5 font-mono text-xs text-f0 placeholder-f3 focus:outline-none focus:border-mint/50 transition-colors';

function SkillGroupForm({
  defaultValues,
  onSubmit,
  isLoading,
  submitLabel,
}: {
  defaultValues?: Partial<SkillGroupWithId>;
  onSubmit: (data: { category: string; skills: string[]; order?: number }) => void;
  isLoading?: boolean;
  submitLabel?: string;
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      category: defaultValues?.category ?? '',
      skills: defaultValues?.skills?.join(', ') ?? '',
      order: undefined,
    },
  });

  return (
    <form
      onSubmit={handleSubmit((v) =>
        onSubmit({
          category: v.category,
          skills: v.skills.split(',').map((s) => s.trim()).filter(Boolean),
          order: v.order,
        }),
      )}
      className="space-y-4"
    >
      <div>
        <label className="font-mono text-xs text-f3 block mb-1">category *</label>
        <input className={inputClass} placeholder="Frontend" {...register('category')} />
        {errors.category && <p className="font-mono text-xs text-rose mt-1">{errors.category.message}</p>}
      </div>
      <div>
        <label className="font-mono text-xs text-f3 block mb-1">skills (comma-separated) *</label>
        <textarea
          className={cn(inputClass, 'resize-none h-24')}
          placeholder="React, TypeScript, Tailwind CSS"
          {...register('skills')}
        />
        {errors.skills && <p className="font-mono text-xs text-rose mt-1">{errors.skills.message}</p>}
      </div>
      <div>
        <label className="font-mono text-xs text-f3 block mb-1">order</label>
        <input type="number" className={inputClass} placeholder="0" {...register('order')} />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className={cn(
          'w-full bg-mint text-fi font-mono text-xs py-2.5 rounded-sm hover:bg-mint/90 transition-colors',
          isLoading && 'opacity-50 cursor-not-allowed',
        )}
      >
        {isLoading ? 'Saving...' : (submitLabel ?? 'Save')}
      </button>
    </form>
  );
}

export function AdminSkillsPage() {
  const { data: groups, isLoading, isError, refetch } = useAdminSkills();
  const createMutation = useCreateSkillGroup();
  const updateMutation = useUpdateSkillGroup();
  const deleteMutation = useDeleteSkillGroup();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<SkillGroupWithId | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SkillGroupWithId | null>(null);

  const openCreate = () => { setEditing(null); setDrawerOpen(true); };
  const openEdit = (g: SkillGroupWithId) => { setEditing(g); setDrawerOpen(true); };
  const closeDrawer = () => { setDrawerOpen(false); setEditing(null); };

  return (
    <>
      <AdminTopbar title="skills" />
      <div className="p-6 space-y-6">
        <AdminPageHeader
          title="Skill Groups"
          description={`${groups?.length ?? 0} skill categories`}
          action={
            <button
              onClick={openCreate}
              className="font-mono text-xs bg-mint text-fi px-4 py-2 rounded-sm hover:bg-mint/90 transition-colors"
            >
              + New Group
            </button>
          }
        />

        {isLoading && <AdminTableSkeleton />}
        {isError && <AdminErrorState onRetry={() => refetch()} />}

        {!isLoading && !isError && groups?.length === 0 && (
          <AdminEmptyState message="No skill groups yet." />
        )}

        {!isLoading && !isError && (groups?.length ?? 0) > 0 && (
          <div className="border border-ln rounded-sm overflow-hidden">
            <div className="grid grid-cols-[1fr_80px] gap-4 px-4 py-2.5 bg-s2 border-b border-ln">
              <span className="font-mono text-xs text-f3 uppercase tracking-wider">Category / Skills</span>
              <span className="font-mono text-xs text-f3 uppercase tracking-wider">Actions</span>
            </div>
            {groups?.map((g) => (
              <div
                key={g.id}
                className="grid grid-cols-[1fr_80px] gap-4 px-4 py-3 border-b border-ln last:border-0 hover:bg-s2/50 transition-colors items-start"
              >
                <div className="space-y-1">
                  <div className="font-mono text-xs text-mint">{g.category}</div>
                  <div className="flex flex-wrap gap-1">
                    {g.skills.map((s) => (
                      <span key={s} className="font-mono text-xs text-f3 border border-ln px-1.5 py-0.5 rounded-sm">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(g)} className="font-mono text-xs text-f2 hover:text-mint transition-colors">Edit</button>
                  <button onClick={() => setDeleteTarget(g)} className="font-mono text-xs text-f3 hover:text-rose transition-colors">Del</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AdminFormDrawer open={drawerOpen} title={editing ? `Edit: ${editing.category}` : 'New Skill Group'} onClose={closeDrawer}>
        <SkillGroupForm
          defaultValues={editing ?? undefined}
          onSubmit={(data) => {
            if (editing) {
              updateMutation.mutate({ id: editing.id, data }, { onSuccess: closeDrawer });
            } else {
              createMutation.mutate(data, { onSuccess: closeDrawer });
            }
          }}
          isLoading={createMutation.isPending || updateMutation.isPending}
          submitLabel={editing ? 'Update Group' : 'Create Group'}
        />
      </AdminFormDrawer>

      <AdminConfirmDialog
        open={!!deleteTarget}
        title={`Delete "${deleteTarget?.category}"?`}
        description="All skills in this group will be removed."
        confirmLabel="Delete Group"
        onConfirm={() => { if (deleteTarget) deleteMutation.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) }); }}
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}
