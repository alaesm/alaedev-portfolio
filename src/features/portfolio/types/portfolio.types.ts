export interface SocialLinks {
  linkedin: string;
  github: string;
  portfolio: string;
}

export interface Profile {
  id: string;
  fullName: string;
  brand: string;
  role: string;
  location: string;
  email: string;
  bio: string;
  freelanceSince: number;
  target: string;
  socialLinks: SocialLinks;
}

export interface SkillGroup {
  id: string;
  category: string;
  skills: string[];
  order?: number;
}

export type ProjectStatus = 'public' | 'private' | 'coming-soon';

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  /** Short summary (cards); same semantics as README “short description”. */
  description: string;
  longDescription?: string;
  technologies: string[];
  features?: string[];
  role?: string;
  challenges?: string[];
  solutions?: string[];
  status: ProjectStatus;
  featured: boolean;
  githubUrl?: string;
  liveUrl?: string;
  image?: string;
  screenshots?: string[];
  year?: string;
  type?: string;
  clientType?: string;
  tags?: string[];
  /** Sort order (lower comes first alongside featured precedence from API). */
  order?: number;
}

export interface ExperienceItem {
  id: string;
  title: string;
  type: 'freelance' | 'employment' | 'internship';
  company?: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  highlights: string[];
  technologies: string[];
  order?: number;
}

export interface EducationItem {
  id: string;
  degree: string;
  field: string;
  institution: string;
  location: string;
  startYear: number;
  graduationYear: number;
  graduationProject?: string;
  description: string;
  achievements: string[];
  order?: number;
}

export interface Testimonial {
  id: string;
  clientName: string;
  clientTitle?: string;
  clientLocation: string;
  rating: number;
  content: string;
  projectType: string;
  date: string;
  approved: boolean;
  order?: number;
}

export interface ContactInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactResult {
  received: boolean;
  submittedAt: string;
}
