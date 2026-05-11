import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  contactMessagesAdminService,
  ReplyFormData,
} from '../services/contact-messages-admin.service';
import type { ContactMessageStatus } from '@/features/admin/types/admin.types';
import { toast } from '@/features/admin/stores/toast.store';

const KEY = ['admin-contact-messages'];

export const useAdminContactMessages = () =>
  useQuery({ queryKey: KEY, queryFn: contactMessagesAdminService.getAll, staleTime: 30_000 });

export const useUpdateMessageStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ContactMessageStatus }) =>
      contactMessagesAdminService.updateStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      qc.invalidateQueries({ queryKey: ['admin-stats'] });
      toast.success('Status updated.');
    },
    onError: (err: Error) => toast.error(err.message),
  });
};

export const useReplyToMessage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ReplyFormData }) =>
      contactMessagesAdminService.reply(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success('Reply sent successfully.');
    },
    onError: (err: Error) => toast.error(err.message),
  });
};

export const useDeleteMessage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => contactMessagesAdminService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      qc.invalidateQueries({ queryKey: ['admin-stats'] });
      toast.success('Message deleted.');
    },
    onError: (err: Error) => toast.error(err.message),
  });
};
