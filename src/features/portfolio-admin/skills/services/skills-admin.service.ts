import { adminApiClient } from '@/shared/api/admin-client';

const BASE = '/admin/skills';

export interface SkillGroupWithId {
  id: string;
  category: string;
  skills: string[];
  order?: number;
}

export interface SkillGroupFormData {
  category: string;
  skills: string[];
  order?: number;
}

const extract = <T>(res: { data: { data: T } }) => res.data.data;

export const skillsAdminService = {
  getAll: () =>
    adminApiClient.get<{ data: SkillGroupWithId[] }>(BASE).then(extract<SkillGroupWithId[]>),
  create: (data: SkillGroupFormData) =>
    adminApiClient.post<{ data: SkillGroupWithId }>(BASE, data).then(extract<SkillGroupWithId>),
  update: (id: string, data: Partial<SkillGroupFormData>) =>
    adminApiClient
      .put<{ data: SkillGroupWithId }>(`${BASE}/${id}`, data)
      .then(extract<SkillGroupWithId>),
  delete: (id: string) => adminApiClient.delete(`${BASE}/${id}`),
};
