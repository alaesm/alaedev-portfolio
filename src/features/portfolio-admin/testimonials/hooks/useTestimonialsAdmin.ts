import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { testimonialsAdminService, TestimonialFormData } from '../services/testimonials-admin.service';
import { toast } from '@/features/admin/stores/toast.store';

const KEY = ['admin-testimonials'];

export const useAdminTestimonials = () =>
  useQuery({ queryKey: KEY, queryFn: testimonialsAdminService.getAll, staleTime: 30_000 });

export const useCreateTestimonial = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: TestimonialFormData) => testimonialsAdminService.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: KEY }); qc.invalidateQueries({ queryKey: ['admin-stats'] }); toast.success('Testimonial created.'); },
    onError: (err: Error) => toast.error(err.message),
  });
};

export const useUpdateTestimonial = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TestimonialFormData> }) =>
      testimonialsAdminService.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: KEY }); toast.success('Testimonial updated.'); },
    onError: (err: Error) => toast.error(err.message),
  });
};

export const useDeleteTestimonial = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => testimonialsAdminService.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: KEY }); qc.invalidateQueries({ queryKey: ['admin-stats'] }); toast.success('Testimonial deleted.'); },
    onError: (err: Error) => toast.error(err.message),
  });
};
