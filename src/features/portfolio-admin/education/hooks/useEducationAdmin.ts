import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { educationAdminService, EducationFormData } from '../services/education-admin.service';
import { toast } from '@/features/admin/stores/toast.store';

const KEY = ['admin-education'];

export const useAdminEducation = () =>
  useQuery({ queryKey: KEY, queryFn: educationAdminService.getAll, staleTime: 30_000 });

export const useCreateEducation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: EducationFormData) => educationAdminService.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: KEY }); toast.success('Education item created.'); },
    onError: (err: Error) => toast.error(err.message),
  });
};

export const useUpdateEducation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<EducationFormData> }) =>
      educationAdminService.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: KEY }); toast.success('Education item updated.'); },
    onError: (err: Error) => toast.error(err.message),
  });
};

export const useDeleteEducation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => educationAdminService.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: KEY }); toast.success('Education item deleted.'); },
    onError: (err: Error) => toast.error(err.message),
  });
};
