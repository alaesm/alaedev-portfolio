export interface AdminStats {
  totalProjects: number;
  featuredProjects: number;
  totalSkillGroups: number;
  totalTestimonials: number;
  totalMessages: number;
  newMessages: number;
}

export interface AdminNavItem {
  label: string;
  href: string;
  icon: string;
}

export type ContactMessageStatus = 'new' | 'read' | 'replied' | 'archived';
export type EmailStatus = 'pending' | 'sent' | 'failed';

export interface ReplyRecord {
  subject: string;
  message: string;
  sentAt: string;
  sentBy: 'admin';
  provider: 'resend';
  resendEmailId?: string;
  status: 'sent' | 'failed';
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  source: string;
  status: ContactMessageStatus;
  emailStatus: EmailStatus;
  emailError?: string;
  replies?: ReplyRecord[];
  createdAt: string;
  updatedAt: string;
}
