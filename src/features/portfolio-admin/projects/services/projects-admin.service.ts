import { adminApiClient } from '@/shared/api/admin-client';
import type { Project } from '@/features/portfolio/types/portfolio.types';

const BASE = '/admin/projects';

export type ProjectStatus = 'public' | 'private' | 'coming-soon';

export interface ProjectFormData {
  title: string;
  slug: string;
  category: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  features?: string[];
  challenges?: string[];
  solutions?: string[];
  tags?: string[];
  screenshots?: string[];
  role?: string;
  type?: string;
  clientType?: string;
  year?: string;
  status: ProjectStatus;
  featured: boolean;
  githubUrl?: string;
  liveUrl?: string;
  image?: string;
  order?: number;
}

const extract = <T>(res: { data: { data: T } }) => res.data.data;

export const projectsAdminService = {
  getAll: () => adminApiClient.get<{ data: Project[] }>(BASE).then(extract<Project[]>),
  getById: (id: string) =>
    adminApiClient.get<{ data: Project }>(`${BASE}/${id}`).then(extract<Project>),
  create: (data: ProjectFormData) =>
    adminApiClient.post<{ data: Project }>(BASE, data).then(extract<Project>),
  update: (id: string, data: Partial<ProjectFormData>) =>
    adminApiClient.put<{ data: Project }>(`${BASE}/${id}`, data).then(extract<Project>),
  delete: (id: string) => adminApiClient.delete(`${BASE}/${id}`),
};
