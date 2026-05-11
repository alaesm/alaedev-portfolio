import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsAdminService, ProjectFormData } from '../services/projects-admin.service';
import { toast } from '@/features/admin/stores/toast.store';
import type { Project } from '@/features/portfolio/types/portfolio.types';

const KEY = ['admin-projects'];

export const useAdminProjects = () =>
  useQuery<Project[]>({
    queryKey: KEY,
    queryFn: projectsAdminService.getAll,
    staleTime: 30_000,
  });

export const useCreateProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ProjectFormData) => projectsAdminService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      qc.invalidateQueries({ queryKey: ['admin-stats'] });
      toast.success('Project created successfully.');
    },
    onError: (err: Error) => toast.error(err.message),
  });
};

export const useUpdateProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProjectFormData> }) =>
      projectsAdminService.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success('Project updated successfully.');
    },
    onError: (err: Error) => toast.error(err.message),
  });
};

export const useDeleteProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => projectsAdminService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      qc.invalidateQueries({ queryKey: ['admin-stats'] });
      toast.success('Project deleted successfully.');
    },
    onError: (err: Error) => toast.error(err.message),
  });
};
