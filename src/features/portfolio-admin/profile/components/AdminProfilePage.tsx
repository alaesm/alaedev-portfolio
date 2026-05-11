'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AdminTopbar } from '@/features/admin/components/AdminTopbar';
import { AdminPageHeader } from '@/features/admin/components/AdminPageHeader';
import { AdminFormSkeleton } from '@/features/admin/components/AdminLoadingSkeleton';
import { AdminErrorState } from '@/features/admin/components/AdminErrorState';
import { useAdminProfile, useUpdateProfile } from '../hooks/useProfileAdmin';
import { cn } from '@/shared/lib/cn';
import { useEffect } from 'react';

const schema = z.object({
  fullName: z.string().min(2).optional(),
  brand: z.string().min(2).optional(),
  role: z.string().min(2).optional(),
  location: z.string().min(2).optional(),
  email: z.string().email().optional().or(z.literal('')),
  bio: z.string().min(10).optional(),
  freelanceSince: z.coerce.number().int().min(2000).optional(),
  target: z.string().optional(),
  linkedin: z.string().url().optional().or(z.literal('')),
  github: z.string().url().optional().or(z.literal('')),
  portfolio: z.string().url().optional().or(z.literal('')),
});

type FormValues = z.infer<typeof schema>;

const inputClass =
  'w-full bg-s3 border border-ln rounded-sm px-3 py-2.5 font-mono text-xs text-f0 placeholder-f3 focus:outline-none focus:border-mint/50 transition-colors';
const labelClass = 'font-mono text-xs text-f3 block mb-1';

export function AdminProfilePage() {
  const { data: profile, isLoading, isError, refetch } = useAdminProfile();
  const updateMutation = useUpdateProfile();

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (profile) {
      reset({
        fullName: profile.fullName ?? '',
        brand: profile.brand ?? '',
        role: profile.role ?? '',
        location: profile.location ?? '',
        email: profile.email ?? '',
        bio: profile.bio ?? '',
        freelanceSince: profile.freelanceSince,
        target: profile.target ?? '',
        linkedin: profile.socialLinks?.linkedin ?? '',
        github: profile.socialLinks?.github ?? '',
        portfolio: profile.socialLinks?.portfolio ?? '',
      });
    }
  }, [profile, reset]);

  const onSubmit = (values: FormValues) => {
    const { linkedin, github, portfolio: port, ...rest } = values;
    updateMutation.mutate({
      ...rest,
      socialLinks: {
        linkedin: linkedin || undefined,
        github: github || undefined,
        portfolio: port || undefined,
      },
    });
  };

  return (
    <>
      <AdminTopbar title="profile" />
      <div className="p-6 space-y-6">
        <AdminPageHeader
          title="Profile"
          description="Manage your public profile information"
        />

        {isLoading && <AdminFormSkeleton />}
        {isError && <AdminErrorState message="Could not load profile." onRetry={() => refetch()} />}

        {!isLoading && !isError && profile && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Identity */}
            <div className="border border-ln bg-s1 rounded-sm overflow-hidden">
              <div className="px-4 py-2.5 bg-s2 border-b border-ln">
                <span className="font-mono text-xs text-f3">// Identity</span>
              </div>
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>full name</label>
                  <input className={inputClass} placeholder="Said Medjahed Alaeddine" {...register('fullName')} />
                  {errors.fullName && <p className="font-mono text-xs text-rose mt-1">{errors.fullName.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>brand</label>
                  <input className={inputClass} placeholder="AlaeDev" {...register('brand')} />
                </div>
                <div>
                  <label className={labelClass}>role</label>
                  <input className={inputClass} placeholder="Software Developer" {...register('role')} />
                </div>
                <div>
                  <label className={labelClass}>location</label>
                  <input className={inputClass} placeholder="Tlemcen, Algeria" {...register('location')} />
                </div>
                <div>
                  <label className={labelClass}>email</label>
                  <input className={inputClass} placeholder="you@example.com" {...register('email')} />
                  {errors.email && <p className="font-mono text-xs text-rose mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>freelance since</label>
                  <input type="number" className={inputClass} placeholder="2024" {...register('freelanceSince')} />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>academic target</label>
                  <input className={inputClass} placeholder="Master's in AI · Saudi Arabia" {...register('target')} />
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="border border-ln bg-s1 rounded-sm overflow-hidden">
              <div className="px-4 py-2.5 bg-s2 border-b border-ln">
                <span className="font-mono text-xs text-f3">// Bio</span>
              </div>
              <div className="p-5">
                <textarea
                  className={cn(inputClass, 'resize-none h-28')}
                  placeholder="Short bio paragraph..."
                  {...register('bio')}
                />
                {errors.bio && <p className="font-mono text-xs text-rose mt-1">{errors.bio.message}</p>}
              </div>
            </div>

            {/* Social Links */}
            <div className="border border-ln bg-s1 rounded-sm overflow-hidden">
              <div className="px-4 py-2.5 bg-s2 border-b border-ln">
                <span className="font-mono text-xs text-f3">// Social Links</span>
              </div>
              <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: 'linkedin' as const, label: 'linkedin url' },
                  { name: 'github' as const, label: 'github url' },
                  { name: 'portfolio' as const, label: 'portfolio url' },
                ].map(({ name, label }) => (
                  <div key={name}>
                    <label className={labelClass}>{label}</label>
                    <input className={inputClass} placeholder="https://..." {...register(name)} />
                    {errors[name] && <p className="font-mono text-xs text-rose mt-1">{errors[name]?.message}</p>}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={updateMutation.isPending || !isDirty}
                className={cn(
                  'bg-mint text-fi font-mono text-xs px-6 py-2.5 rounded-sm hover:bg-mint/90 transition-colors',
                  (updateMutation.isPending || !isDirty) && 'opacity-50 cursor-not-allowed',
                )}
              >
                {updateMutation.isPending ? 'Saving...' : 'Save Profile'}
              </button>
              {!isDirty && (
                <span className="font-mono text-xs text-f3">No unsaved changes.</span>
              )}
            </div>
          </form>
        )}
      </div>
    </>
  );
}
