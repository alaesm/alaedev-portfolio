'use client';

import { useState } from 'react';
import { AdminTopbar } from '@/features/admin/components/AdminTopbar';
import { AdminPageHeader } from '@/features/admin/components/AdminPageHeader';
import { AdminTableSkeleton } from '@/features/admin/components/AdminLoadingSkeleton';
import { AdminEmptyState } from '@/features/admin/components/AdminEmptyState';
import { AdminErrorState } from '@/features/admin/components/AdminErrorState';
import { AdminFormDrawer } from '@/features/admin/components/AdminFormDrawer';
import { AdminConfirmDialog } from '@/features/admin/components/AdminConfirmDialog';
import { ProjectForm } from './ProjectForm';
import {
  useAdminProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
} from '../hooks/useProjectsAdmin';
import type { Project } from '@/features/portfolio/types/portfolio.types';
import type { ProjectFormData } from '../services/projects-admin.service';
import type { ProjectSubmitData } from './ProjectForm';
import { cn } from '@/shared/lib/cn';

const statusColors: Record<string, string> = {
  public: 'text-mint border-mint/30',
  private: 'text-amber border-amber/30',
  'coming-soon': 'text-sky border-sky/30',
};

export function AdminProjectsPage() {
  const { data: projects, isLoading, isError, refetch } = useAdminProjects();
  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();
  const deleteMutation = useDeleteProject();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);

  const openCreate = () => { setEditing(null); setDrawerOpen(true); };
  const openEdit = (p: Project) => { setEditing(p); setDrawerOpen(true); };
  const closeDrawer = () => { setDrawerOpen(false); setEditing(null); };

  const handleSubmit = (data: ProjectSubmitData) => {
    const payload: ProjectFormData = { ...data };
    if (editing) {
      updateMutation.mutate({ id: editing.id, data: payload }, { onSuccess: closeDrawer });
    } else {
      createMutation.mutate(payload, { onSuccess: closeDrawer });
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
  };

  return (
    <>
      <AdminTopbar title="projects" />
      <div className="p-6 space-y-6">
        <AdminPageHeader
          title="Projects"
          description={`${projects?.length ?? 0} total projects`}
          action={
            <button
              onClick={openCreate}
              className="font-mono text-xs bg-mint text-fi px-4 py-2 rounded-sm hover:bg-mint/90 transition-colors"
            >
              + New Project
            </button>
          }
        />

        {isLoading && <AdminTableSkeleton />}
        {isError && <AdminErrorState message="Could not load projects." onRetry={() => refetch()} />}

        {!isLoading && !isError && projects?.length === 0 && (
          <AdminEmptyState
            message="No projects yet."
            action={
              <button onClick={openCreate} className="font-mono text-xs text-mint hover:underline">
                Create first project →
              </button>
            }
          />
        )}

        {!isLoading && !isError && (projects?.length ?? 0) > 0 && (
          <div className="border border-ln rounded-sm overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[1fr_100px_80px_80px_100px] gap-4 px-4 py-2.5 bg-s2 border-b border-ln">
              {['Title', 'Category', 'Status', 'Featured', 'Actions'].map((h) => (
                <span key={h} className="font-mono text-xs text-f3 uppercase tracking-wider">{h}</span>
              ))}
            </div>

            {/* Rows */}
            {projects?.map((p) => (
              <div
                key={p.id}
                className="grid grid-cols-[1fr_100px_80px_80px_100px] gap-4 px-4 py-3 border-b border-ln last:border-0 hover:bg-s2/50 transition-colors items-center"
              >
                <div>
                  <div className="font-mono text-xs text-f1">{p.title}</div>
                  <div className="font-mono text-xs text-f3">{p.slug}</div>
                </div>
                <span className="font-mono text-xs text-f2">{p.category}</span>
                <span
                  className={cn(
                    'font-mono text-xs border px-2 py-0.5 rounded-sm w-fit',
                    statusColors[p.status] ?? 'text-f3 border-ln',
                  )}
                >
                  {p.status}
                </span>
                <span className="font-mono text-xs text-f3">
                  {p.featured ? <span className="text-mint">✓ yes</span> : '—'}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(p)}
                    className="font-mono text-xs text-f2 hover:text-mint transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteTarget(p)}
                    className="font-mono text-xs text-f3 hover:text-rose transition-colors"
                  >
                    Del
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Drawer */}
      <AdminFormDrawer
        open={drawerOpen}
        title={editing ? `Edit: ${editing.title}` : 'New Project'}
        onClose={closeDrawer}
      >
        <ProjectForm
          defaultValues={editing ?? undefined}
          onSubmit={handleSubmit}
          isLoading={createMutation.isPending || updateMutation.isPending}
          submitLabel={editing ? 'Update Project' : 'Create Project'}
        />
      </AdminFormDrawer>

      {/* Confirm Delete */}
      <AdminConfirmDialog
        open={!!deleteTarget}
        title={`Delete "${deleteTarget?.title}"?`}
        description="This action cannot be undone. The project will be permanently removed from Firestore."
        confirmLabel="Delete Project"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}
