import type { ProjectStatus } from '../types/portfolio.types';

export function formatDateRange(startDate: string, endDate: string): string {
  const fmt = (d: string) => {
    if (d === 'Present') return 'Present';
    const date = new Date(d);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };
  return `${fmt(startDate)} — ${fmt(endDate)}`;
}

export function formatYear(year: number): string {
  return year.toString();
}

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  'public':       'SHIPPED',
  'private':      'PRIVATE',
  'coming-soon':  'IN PROGRESS',
};

export const STATUS_VARIANTS: Record<ProjectStatus, 'mint' | 'amber' | 'neutral'> = {
  'public':      'mint',
  'private':     'neutral',
  'coming-soon': 'amber',
};

export function getProjectCode(index: number): string {
  return `PRJ-${String(index + 1).padStart(3, '0')}`;
}
