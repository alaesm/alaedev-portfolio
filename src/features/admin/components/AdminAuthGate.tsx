'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAdminAuthStore } from '../stores/auth.store';
import { adminAuthService } from '../services/admin-auth.service';
import { cn } from '@/shared/lib/cn';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});
type FormValues = z.infer<typeof schema>;

const inputClass =
  'w-full bg-s3 border border-ln rounded-sm px-3 py-2.5 font-mono text-sm text-f0 placeholder-f3 focus:outline-none focus:border-mint/50 transition-colors';

export function AdminAuthGate() {
  const setTokens = useAdminAuthStore((s) => s.setTokens);
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async ({ email, password }: FormValues) => {
    setServerError('');
    setIsLoading(true);
    try {
      const { accessToken, refreshToken } = await adminAuthService.login(email, password);
      setTokens(accessToken, refreshToken);
    } catch {
      setServerError('Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-s0 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="border border-ln bg-s1 rounded-sm overflow-hidden">
          {/* Terminal title bar */}
          <div className="px-4 py-2.5 border-b border-ln bg-s2 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose/50" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber/50" />
            <span className="w-2.5 h-2.5 rounded-full bg-mint/50" />
            <span className="ml-2 font-mono text-xs text-f3">admin-login.sh</span>
          </div>

          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="space-y-1">
              <div className="font-mono text-xs text-mint tracking-widest uppercase">
                // AlaeDev Admin
              </div>
              <p className="font-mono text-sm text-f1">Sign in to continue.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="font-mono text-xs text-f3 block">email</label>
                <input
                  type="email"
                  autoComplete="username"
                  autoFocus
                  className={cn(inputClass, errors.email && 'border-rose/40')}
                  placeholder="admin@example.com"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="font-mono text-xs text-rose">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="font-mono text-xs text-f3 block">password</label>
                <input
                  type="password"
                  autoComplete="current-password"
                  className={cn(inputClass, errors.password && 'border-rose/40')}
                  placeholder="••••••••••••"
                  {...register('password')}
                />
                {errors.password && (
                  <p className="font-mono text-xs text-rose">{errors.password.message}</p>
                )}
              </div>

              {/* Server error */}
              {serverError && (
                <div className="border border-rose/30 bg-rose/5 rounded-sm px-3 py-2">
                  <p className="font-mono text-xs text-rose">{serverError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={cn(
                  'w-full bg-mint text-fi font-mono text-sm py-2.5 rounded-sm hover:bg-mint/90 transition-colors',
                  isLoading && 'opacity-60 cursor-not-allowed',
                )}
              >
                {isLoading ? 'Signing in...' : 'Sign In →'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
