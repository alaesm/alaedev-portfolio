import { adminApiClient } from '@/shared/api/admin-client';
import type { ExperienceItem } from '@/features/portfolio/types/portfolio.types';

const BASE = '/admin/experience';
const extract = <T>(res: { data: { data: T } }) => res.data.data;

export interface ExperienceFormData {
  title: string;
  type: 'freelance' | 'employment' | 'internship';
  company?: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  highlights: string[];
  technologies: string[];
  order?: number;
}

export const experienceAdminService = {
  getAll: () =>
    adminApiClient.get<{ data: ExperienceItem[] }>(BASE).then(extract<ExperienceItem[]>),
  create: (data: ExperienceFormData) =>
    adminApiClient.post<{ data: ExperienceItem }>(BASE, data).then(extract<ExperienceItem>),
  update: (id: string, data: Partial<ExperienceFormData>) =>
    adminApiClient.put<{ data: ExperienceItem }>(`${BASE}/${id}`, data).then(extract<ExperienceItem>),
  delete: (id: string) => adminApiClient.delete(`${BASE}/${id}`),
};
