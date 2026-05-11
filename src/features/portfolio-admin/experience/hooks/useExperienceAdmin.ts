import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { experienceAdminService, ExperienceFormData } from '../services/experience-admin.service';
import { toast } from '@/features/admin/stores/toast.store';

const KEY = ['admin-experience'];

export const useAdminExperience = () =>
  useQuery({ queryKey: KEY, queryFn: experienceAdminService.getAll, staleTime: 30_000 });

export const useCreateExperience = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ExperienceFormData) => experienceAdminService.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: KEY }); toast.success('Experience item created.'); },
    onError: (err: Error) => toast.error(err.message),
  });
};

export const useUpdateExperience = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ExperienceFormData> }) =>
      experienceAdminService.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: KEY }); toast.success('Experience item updated.'); },
    onError: (err: Error) => toast.error(err.message),
  });
};

export const useDeleteExperience = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => experienceAdminService.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: KEY }); toast.success('Experience item deleted.'); },
    onError: (err: Error) => toast.error(err.message),
  });
};
