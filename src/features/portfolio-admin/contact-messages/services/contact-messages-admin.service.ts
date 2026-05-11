import { adminApiClient } from '@/shared/api/admin-client';
import type { ContactMessage, ContactMessageStatus } from '@/features/admin/types/admin.types';

const BASE = '/admin/contact-messages';
const extract = <T>(res: { data: { data: T } }) => res.data.data;

export interface ReplyFormData {
  subject: string;
  message: string;
}

export const contactMessagesAdminService = {
  getAll: () =>
    adminApiClient.get<{ data: ContactMessage[] }>(BASE).then(extract<ContactMessage[]>),
  getById: (id: string) =>
    adminApiClient.get<{ data: ContactMessage }>(`${BASE}/${id}`).then(extract<ContactMessage>),
  updateStatus: (id: string, status: ContactMessageStatus) =>
    adminApiClient
      .patch<{ data: ContactMessage }>(`${BASE}/${id}/status`, { status })
      .then(extract<ContactMessage>),
  reply: (id: string, data: ReplyFormData) =>
    adminApiClient
      .post<{ data: ContactMessage }>(`${BASE}/${id}/reply`, data)
      .then(extract<ContactMessage>),
  delete: (id: string) => adminApiClient.delete(`${BASE}/${id}`),
};
