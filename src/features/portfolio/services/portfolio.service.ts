import { apiClient } from '@/shared/api/client';
import type { ApiResponse } from '@/shared/types/api.types';
import type {
  Profile,
  SkillGroup,
  Project,
  ExperienceItem,
  EducationItem,
  Testimonial,
  ContactInput,
  ContactResult,
} from '../types/portfolio.types';

// Axios wraps the HTTP body in `response.data`.
// Our API wraps content in `{ success, message, data }`.
// So the actual payload is at `response.data.data`.

const extract = <T>(res: { data: ApiResponse<T> }): T => res.data.data;

export const portfolioService = {
  async getProfile(): Promise<Profile> {
    return extract<Profile>(await apiClient.get('/profile'));
  },

  async getSkills(): Promise<SkillGroup[]> {
    return extract<SkillGroup[]>(await apiClient.get('/skills'));
  },

  async getProjects(): Promise<Project[]> {
    return extract<Project[]>(await apiClient.get('/projects'));
  },

  async getProjectById(id: string): Promise<Project> {
    return extract<Project>(await apiClient.get(`/projects/${id}`));
  },

  async getExperience(): Promise<ExperienceItem[]> {
    return extract<ExperienceItem[]>(await apiClient.get('/experience'));
  },

  async getEducation(): Promise<EducationItem[]> {
    return extract<EducationItem[]>(await apiClient.get('/education'));
  },

  async getTestimonials(): Promise<Testimonial[]> {
    return extract<Testimonial[]>(await apiClient.get('/testimonials'));
  },

  async sendContact(input: ContactInput): Promise<ContactResult> {
    return extract<ContactResult>(await apiClient.post('/contact', input));
  },
};
