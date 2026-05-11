import { useQuery } from '@tanstack/react-query';
import { adminApiClient } from '@/shared/api/admin-client';
import type { AdminStats, ContactMessage } from '../types/admin.types';
import type { Project } from '@/features/portfolio/types/portfolio.types';

interface SkillGroupItem { id: string; category: string; skills: string[] }
interface TestimonialItem { id: string; approved: boolean }

const fetchStats = async (): Promise<AdminStats> => {
  const [projects, skills, testimonials, messages] = await Promise.all([
    adminApiClient.get<{ data: Project[] }>('/admin/projects').then((r) => r.data.data),
    adminApiClient.get<{ data: SkillGroupItem[] }>('/admin/skills').then((r) => r.data.data),
    adminApiClient.get<{ data: TestimonialItem[] }>('/admin/testimonials').then((r) => r.data.data),
    adminApiClient.get<{ data: ContactMessage[] }>('/admin/contact-messages').then((r) => r.data.data),
  ]);

  return {
    totalProjects: projects.length,
    featuredProjects: projects.filter((p) => p.featured).length,
    totalSkillGroups: skills.length,
    totalTestimonials: testimonials.length,
    totalMessages: messages.length,
    newMessages: messages.filter((m) => m.status === 'new').length,
  };
};

export const useAdminStats = () =>
  useQuery<AdminStats>({
    queryKey: ['admin-stats'],
    queryFn: fetchStats,
    staleTime: 60_000,
  });
