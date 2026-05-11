import { adminApiClient } from '@/shared/api/admin-client';
import type { EducationItem } from '@/features/portfolio/types/portfolio.types';

const BASE = '/admin/education';
const extract = <T>(res: { data: { data: T } }) => res.data.data;

export interface EducationFormData {
  degree: string;
  field: string;
  institution: string;
  location: string;
  startYear: number;
  graduationYear: number;
  graduationProject?: string;
  description: string;
  achievements: string[];
  order?: number;
}

export const educationAdminService = {
  getAll: () => adminApiClient.get<{ data: EducationItem[] }>(BASE).then(extract<EducationItem[]>),
  create: (data: EducationFormData) =>
    adminApiClient.post<{ data: EducationItem }>(BASE, data).then(extract<EducationItem>),
  update: (id: string, data: Partial<EducationFormData>) =>
    adminApiClient.put<{ data: EducationItem }>(`${BASE}/${id}`, data).then(extract<EducationItem>),
  delete: (id: string) => adminApiClient.delete(`${BASE}/${id}`),
};
