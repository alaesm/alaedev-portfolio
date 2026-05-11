import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileAdminService, ProfileFormData } from '../services/profile-admin.service';
import { toast } from '@/features/admin/stores/toast.store';

const KEY = ['admin-profile'];

export const useAdminProfile = () =>
  useQuery({ queryKey: KEY, queryFn: profileAdminService.get, staleTime: 60_000 });

export const useUpdateProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ProfileFormData) => profileAdminService.update(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      qc.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile updated successfully.');
    },
    onError: (err: Error) => toast.error(err.message),
  });
};
