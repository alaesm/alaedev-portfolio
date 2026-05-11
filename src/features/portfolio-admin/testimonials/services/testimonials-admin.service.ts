import { adminApiClient } from '@/shared/api/admin-client';
import type { Testimonial } from '@/features/portfolio/types/portfolio.types';

const BASE = '/admin/testimonials';
const extract = <T>(res: { data: { data: T } }) => res.data.data;

export interface TestimonialFormData {
  clientName: string;
  clientTitle?: string;
  clientLocation: string;
  rating: number;
  content: string;
  projectType: string;
  date: string;
  approved: boolean;
  order?: number;
}

export const testimonialsAdminService = {
  getAll: () =>
    adminApiClient.get<{ data: Testimonial[] }>(BASE).then(extract<Testimonial[]>),
  create: (data: TestimonialFormData) =>
    adminApiClient.post<{ data: Testimonial }>(BASE, data).then(extract<Testimonial>),
  update: (id: string, data: Partial<TestimonialFormData>) =>
    adminApiClient.put<{ data: Testimonial }>(`${BASE}/${id}`, data).then(extract<Testimonial>),
  delete: (id: string) => adminApiClient.delete(`${BASE}/${id}`),
};
