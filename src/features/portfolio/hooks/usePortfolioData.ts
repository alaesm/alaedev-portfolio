import { useQuery } from '@tanstack/react-query';
import { portfolioService } from '../services/portfolio.service';

const STALE = 5 * 60 * 1000; // 5 minutes

export const QUERY_KEYS = {
  profile:      ['portfolio', 'profile'],
  skills:       ['portfolio', 'skills'],
  projects:     ['portfolio', 'projects'],
  experience:   ['portfolio', 'experience'],
  education:    ['portfolio', 'education'],
  testimonials: ['portfolio', 'testimonials'],
} as const;

export function useProfile() {
  return useQuery({
    queryKey: QUERY_KEYS.profile,
    queryFn:  portfolioService.getProfile,
    staleTime: STALE,
  });
}

export function useSkills() {
  return useQuery({
    queryKey: QUERY_KEYS.skills,
    queryFn:  portfolioService.getSkills,
    staleTime: STALE,
  });
}

export function useProjects() {
  return useQuery({
    queryKey: QUERY_KEYS.projects,
    queryFn:  portfolioService.getProjects,
    staleTime: STALE,
  });
}

export function useExperience() {
  return useQuery({
    queryKey: QUERY_KEYS.experience,
    queryFn:  portfolioService.getExperience,
    staleTime: STALE,
  });
}

export function useEducation() {
  return useQuery({
    queryKey: QUERY_KEYS.education,
    queryFn:  portfolioService.getEducation,
    staleTime: STALE,
  });
}

export function useTestimonials() {
  return useQuery({
    queryKey: QUERY_KEYS.testimonials,
    queryFn:  portfolioService.getTestimonials,
    staleTime: STALE,
  });
}
