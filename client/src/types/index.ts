export interface ProofLink {
  id: string;
  url: string;
  label: string;
  type?: 'github' | 'live' | 'figma' | 'document' | 'other';
}

export interface LogEntry {
  id: string;
  projectId: string;
  projectName: string;
  isStealthNda: boolean;
  title?: string;
  content: string;
  details?: string[];
  skills: string[];
  proofUrl?: string;
  proofType?: 'github' | 'live' | 'figma' | 'document';
  proofLinks?: ProofLink[];
  imageUrls?: string[];
  isProofVerified: boolean;
  isFeatured: boolean;
  isBackfill: boolean;
  kudosCount: number;
  logDate: string;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  isStealthNda: boolean;
  technologies?: string[];
  repoUrl?: string;
  liveUrl?: string;
  status: 'in_progress' | 'completed' | 'archived';
  logCount: number;
}

export interface UserProfile {
  username: string;
  fullName: string;
  headline: string;
  bio: string;
  location: string;
  avatarUrl: string;
  timezone: string;
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  streakDays: number;
  totalLogs: number;
  streakFreezeLeft: number;
  topSkills: { skill: string; count: number }[];
}

export interface RecruiterMessage {
  id: string;
  recruiterName: string;
  recruiterEmail: string;
  message: string;
  createdAt: string;
}
