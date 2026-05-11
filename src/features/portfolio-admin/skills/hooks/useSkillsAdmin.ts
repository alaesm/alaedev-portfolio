import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { skillsAdminService, SkillGroupFormData } from '../services/skills-admin.service';
import { toast } from '@/features/admin/stores/toast.store';

const KEY = ['admin-skills'];

export const useAdminSkills = () =>
  useQuery({ queryKey: KEY, queryFn: skillsAdminService.getAll, staleTime: 30_000 });

export const useCreateSkillGroup = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: SkillGroupFormData) => skillsAdminService.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: KEY }); qc.invalidateQueries({ queryKey: ['admin-stats'] }); toast.success('Skill group created.'); },
    onError: (err: Error) => toast.error(err.message),
  });
};

export const useUpdateSkillGroup = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SkillGroupFormData> }) =>
      skillsAdminService.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: KEY }); toast.success('Skill group updated.'); },
    onError: (err: Error) => toast.error(err.message),
  });
};

export const useDeleteSkillGroup = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => skillsAdminService.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: KEY }); qc.invalidateQueries({ queryKey: ['admin-stats'] }); toast.success('Skill group deleted.'); },
    onError: (err: Error) => toast.error(err.message),
  });
};
