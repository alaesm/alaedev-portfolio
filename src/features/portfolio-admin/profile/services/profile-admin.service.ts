import { adminApiClient } from '@/shared/api/admin-client';
import type { Profile } from '@/features/portfolio/types/portfolio.types';

const BASE = '/admin/profile';
const extract = <T>(res: { data: { data: T } }) => res.data.data;

export interface ProfileFormData {
  fullName?: string;
  brand?: string;
  role?: string;
  location?: string;
  email?: string;
  bio?: string;
  freelanceSince?: number;
  target?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
}

export const profileAdminService = {
  get: () => adminApiClient.get<{ data: Profile }>(BASE).then(extract<Profile>),
  update: (data: ProfileFormData) =>
    adminApiClient.put<{ data: Profile }>(BASE, data).then(extract<Profile>),
};
