'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AdminTopbar } from '@/features/admin/components/AdminTopbar';
import { AdminPageHeader } from '@/features/admin/components/AdminPageHeader';
import { AdminTableSkeleton } from '@/features/admin/components/AdminLoadingSkeleton';
import { AdminEmptyState } from '@/features/admin/components/AdminEmptyState';
import { AdminErrorState } from '@/features/admin/components/AdminErrorState';
import { AdminConfirmDialog } from '@/features/admin/components/AdminConfirmDialog';
import { AdminFormDrawer } from '@/features/admin/components/AdminFormDrawer';
import {
  useAdminContactMessages,
  useUpdateMessageStatus,
  useDeleteMessage,
  useReplyToMessage,
} from '../hooks/useContactMessagesAdmin';
import type {
  ContactMessage,
  ContactMessageStatus,
  EmailStatus,
} from '@/features/admin/types/admin.types';
import { cn } from '@/shared/lib/cn';

// ── Status colour maps ──────────────────────────────────────────────────────
const msgStatusColors: Record<ContactMessageStatus, string> = {
  new:      'text-rose border-rose/30 bg-rose/5',
  read:     'text-f2 border-ln',
  replied:  'text-mint border-mint/30 bg-mint/5',
  archived: 'text-f3 border-ln',
};

const emailStatusColors: Record<EmailStatus, string> = {
  pending: 'text-amber border-amber/30',
  sent:    'text-mint border-mint/30',
  failed:  'text-rose border-rose/30',
};

// ── Reply form schema ───────────────────────────────────────────────────────
const replySchema = z.object({
  subject: z.string().min(3, 'Min 3 characters').max(150),
  message: z.string().min(10, 'Min 10 characters').max(5000),
});
type ReplyFormValues = z.infer<typeof replySchema>;

const inputClass =
  'w-full bg-s3 border border-ln rounded-sm px-3 py-2.5 font-mono text-xs text-f0 placeholder-f3 focus:outline-none focus:border-mint/50 transition-colors';

// ── Reply Form ──────────────────────────────────────────────────────────────
function ReplyForm({
  message,
  onSubmit,
  isLoading,
}: {
  message: ContactMessage;
  onSubmit: (d: ReplyFormValues) => void;
  isLoading: boolean;
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<ReplyFormValues>({
    resolver: zodResolver(replySchema),
    defaultValues: { subject: `Re: ${message.subject}`, message: '' },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Recipient info */}
      <div className="border border-ln bg-s2 rounded-sm p-3 font-mono text-xs space-y-1">
        <div className="flex gap-3"><span className="text-f3 w-12">to:</span><span className="text-f0">{message.name}</span></div>
        <div className="flex gap-3"><span className="text-f3 w-12">email:</span><a href={`mailto:${message.email}`} className="text-mint hover:underline">{message.email}</a></div>
      </div>

      <div>
        <label className="font-mono text-xs text-f3 block mb-1">subject *</label>
        <input className={inputClass} {...register('subject')} />
        {errors.subject && <p className="font-mono text-xs text-rose mt-1">{errors.subject.message}</p>}
      </div>

      <div>
        <label className="font-mono text-xs text-f3 block mb-1">reply message *</label>
        <textarea
          className={cn(inputClass, 'resize-none h-48')}
          placeholder="Type your reply here..."
          {...register('message')}
        />
        {errors.message && <p className="font-mono text-xs text-rose mt-1">{errors.message.message}</p>}
      </div>

      {/* Original message ref */}
      <div className="border-l-2 border-ln pl-3 space-y-1">
        <p className="font-mono text-xs text-f3">Original:</p>
        <p className="font-mono text-xs text-f3 line-clamp-3">{message.message}</p>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={cn(
          'w-full bg-mint text-fi font-mono text-xs py-2.5 rounded-sm hover:bg-mint/90 transition-colors',
          isLoading && 'opacity-50 cursor-not-allowed',
        )}
      >
        {isLoading ? 'Sending...' : '↗ Send Reply via Resend'}
      </button>
    </form>
  );
}

// ── Message Detail Panel ────────────────────────────────────────────────────
function MessageDetailPanel({
  message,
  onClose,
  onStatusChange,
  onReply,
  isUpdating,
}: {
  message: ContactMessage;
  onClose: () => void;
  onStatusChange: (s: ContactMessageStatus) => void;
  onReply: () => void;
  isUpdating: boolean;
}) {
  return (
    <div className="fixed inset-0 z-[9990] flex">
      <div className="flex-1 bg-s0/70 backdrop-blur-sm" onClick={onClose} />
      <aside className="w-full sm:w-[540px] h-full flex flex-col bg-s1 border-l border-ln">
        <div className="px-4 py-3 border-b border-ln bg-s2 flex items-center gap-2">
          <span className="font-mono text-xs text-f3 flex-1">message.json</span>
          <button onClick={onReply} className="font-mono text-xs bg-mint text-fi px-3 py-1 rounded-sm hover:bg-mint/90 transition-colors mr-2">
            ↩ Reply
          </button>
          <button onClick={onClose} className="font-mono text-xs text-f3 hover:text-f1 w-6 h-6 flex items-center justify-center">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Fields */}
          <div className="border border-ln bg-s2 rounded-sm overflow-hidden">
            {[
              { k: 'from',      v: message.name },
              { k: 'email',     v: message.email },
              { k: 'subject',   v: message.subject },
              { k: 'status',    v: message.status },
              { k: 'email_notify', v: message.emailStatus ?? '—' },
              { k: 'received',  v: message.createdAt ? new Date(message.createdAt).toLocaleString() : '—' },
            ].map(({ k, v }) => (
              <div key={k} className="flex gap-4 px-4 py-2.5 border-b border-ln last:border-0">
                <span className="font-mono text-xs text-f3 w-24 shrink-0">{k}:</span>
                <span className={cn(
                  'font-mono text-xs',
                  k === 'status' && msgStatusColors[v as ContactMessageStatus],
                  k === 'email_notify' && emailStatusColors[v as EmailStatus],
                )}>
                  {v}
                </span>
              </div>
            ))}
          </div>

          {/* Message body */}
          <div>
            <div className="font-mono text-xs text-f3 mb-2">message:</div>
            <div className="border border-ln bg-s2 rounded-sm p-4 font-mono text-xs text-f1 leading-relaxed whitespace-pre-wrap">
              {message.message}
            </div>
          </div>

          {/* Reply history */}
          {(message.replies?.length ?? 0) > 0 && (
            <div className="space-y-2">
              <div className="font-mono text-xs text-f3">reply history:</div>
              {message.replies!.map((r, i) => (
                <div key={i} className="border border-mint/20 bg-mint/5 rounded-sm p-3 space-y-1">
                  <div className="flex justify-between">
                    <span className="font-mono text-xs text-mint">{r.subject}</span>
                    <span className="font-mono text-xs text-f3">{new Date(r.sentAt).toLocaleDateString()}</span>
                  </div>
                  <p className="font-mono text-xs text-f2 line-clamp-2">{r.message}</p>
                  <div className="font-mono text-xs text-f3">
                    via {r.provider} · id: {r.resendEmailId ?? '—'}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Status actions */}
          <div className="space-y-2">
            <div className="font-mono text-xs text-f3">update status:</div>
            <div className="flex gap-2 flex-wrap">
              {(['new', 'read', 'replied', 'archived'] as ContactMessageStatus[]).map((s) => (
                <button
                  key={s}
                  disabled={message.status === s || isUpdating}
                  onClick={() => onStatusChange(s)}
                  className={cn(
                    'font-mono text-xs border px-3 py-1.5 rounded-sm transition-all',
                    message.status === s
                      ? `${msgStatusColors[s]} cursor-default`
                      : 'text-f2 border-ln hover:border-ln2 hover:text-f1',
                    isUpdating && 'opacity-50 cursor-not-allowed',
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

// ── Main page ───────────────────────────────────────────────────────────────
export function AdminContactMessagesPage() {
  const { data: messages, isLoading, isError, refetch } = useAdminContactMessages();
  const updateStatusMutation = useUpdateMessageStatus();
  const deleteMutation = useDeleteMessage();
  const replyMutation = useReplyToMessage();

  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [replyTarget, setReplyTarget] = useState<ContactMessage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState<ContactMessageStatus | 'all'>('all');

  const filtered = messages?.filter((m) => filter === 'all' || m.status === filter) ?? [];

  const handleReply = (data: ReplyFormValues) => {
    if (!replyTarget) return;
    replyMutation.mutate(
      { id: replyTarget.id, data },
      {
        onSuccess: (updated) => {
          setReplyTarget(null);
          setSelected(updated);
        },
      },
    );
  };

  return (
    <>
      <AdminTopbar title="contact-messages" />
      <div className="p-6 space-y-6">
        <AdminPageHeader
          title="Contact Messages"
          description={`${messages?.length ?? 0} total · ${messages?.filter((m) => m.status === 'new').length ?? 0} new`}
        />

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap">
          {(['all', 'new', 'read', 'replied', 'archived'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                'font-mono text-xs border px-3 py-1.5 rounded-sm transition-all',
                filter === s
                  ? 'border-mint/40 text-mint bg-mint/5'
                  : 'border-ln text-f3 hover:text-f1 hover:border-ln2',
              )}
            >
              {s}
              {s === 'new' && messages && messages.filter(m => m.status === 'new').length > 0 && (
                <span className="ml-1.5 text-rose">
                  {messages.filter(m => m.status === 'new').length}
                </span>
              )}
            </button>
          ))}
        </div>

        {isLoading && <AdminTableSkeleton />}
        {isError && <AdminErrorState onRetry={() => refetch()} />}
        {!isLoading && !isError && filtered.length === 0 && (
          <AdminEmptyState message="No messages match this filter." />
        )}

        {!isLoading && !isError && filtered.length > 0 && (
          <div className="border border-ln rounded-sm overflow-hidden">
            <div className="grid grid-cols-[1fr_100px_70px_70px_100px] gap-3 px-4 py-2.5 bg-s2 border-b border-ln">
              {['From / Subject', 'Email', 'Status', 'Notif', 'Actions'].map((h) => (
                <span key={h} className="font-mono text-xs text-f3 uppercase tracking-wider">{h}</span>
              ))}
            </div>

            {filtered.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  'grid grid-cols-[1fr_100px_70px_70px_100px] gap-3 px-4 py-3 border-b border-ln last:border-0 hover:bg-s2/50 transition-colors items-center',
                  msg.status === 'new' && 'border-l-2 border-l-rose',
                  msg.status === 'replied' && 'border-l-2 border-l-mint',
                )}
              >
                <div className="min-w-0">
                  <div className="font-mono text-xs text-f1 truncate">{msg.name}</div>
                  <div className="font-mono text-xs text-f3 truncate">{msg.subject}</div>
                </div>
                <span className="font-mono text-xs text-f2 truncate">{msg.email.split('@')[0]}…</span>
                <span className={cn('font-mono text-xs border px-1.5 py-0.5 rounded-sm w-fit text-center', msgStatusColors[msg.status])}>
                  {msg.status}
                </span>
                <span className={cn('font-mono text-xs border px-1.5 py-0.5 rounded-sm w-fit', emailStatusColors[msg.emailStatus ?? 'pending'])}>
                  {msg.emailStatus ?? '—'}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => setSelected(msg)} className="font-mono text-xs text-f2 hover:text-mint transition-colors">View</button>
                  <button onClick={() => { setReplyTarget(msg); }} className="font-mono text-xs text-f2 hover:text-sky transition-colors">Reply</button>
                  <button onClick={() => setDeleteTarget(msg)} className="font-mono text-xs text-f3 hover:text-rose transition-colors">Del</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail panel */}
      {selected && (
        <MessageDetailPanel
          message={selected}
          onClose={() => setSelected(null)}
          onStatusChange={(status) =>
            updateStatusMutation.mutate(
              { id: selected.id, status },
              { onSuccess: (updated) => setSelected(updated) },
            )
          }
          onReply={() => { setReplyTarget(selected); setSelected(null); }}
          isUpdating={updateStatusMutation.isPending}
        />
      )}

      {/* Reply drawer */}
      <AdminFormDrawer
        open={!!replyTarget}
        title={`Reply to ${replyTarget?.name ?? ''}`}
        onClose={() => setReplyTarget(null)}
      >
        {replyTarget && (
          <ReplyForm
            message={replyTarget}
            onSubmit={handleReply}
            isLoading={replyMutation.isPending}
          />
        )}
      </AdminFormDrawer>

      {/* Delete confirm */}
      <AdminConfirmDialog
        open={!!deleteTarget}
        title="Delete this message?"
        description={`From: ${deleteTarget?.name} — ${deleteTarget?.subject}`}
        confirmLabel="Delete Message"
        onConfirm={() => {
          if (deleteTarget) {
            deleteMutation.mutate(deleteTarget.id, {
              onSuccess: () => { setDeleteTarget(null); setSelected(null); },
            });
          }
        }}
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}
