import type { Project, LogEntry } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export interface ProfileResponse {
  username: string;
  fullName: string;
  headline: string;
  bio: string;
  avatarUrl: string;
  timezone: string;
  socialLinks: Record<string, string>;
  streakFreezeLeft: number;
  streakDays: number;
  totalLogs: number;
  topSkills: { skill: string; count: number }[];
  projects: Project[];
  logs: LogEntry[];
}

export const api = {
  // 1. Ambil Profil Publik Lengkap
  async getProfile(username: string): Promise<ProfileResponse | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/profile/${username}`);
      if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const json = await res.json();
      return json.data;
    } catch (err) {
      console.warn('API getProfile failed, fallback to local cache/mock:', err);
      return null;
    }
  },

  // 2. Tambah Log Baru
  async createLog(payload: {
    username: string;
    projectId?: string | null;
    content: string;
    proofUrl?: string;
    proofImageUrl?: string;
    skills: string[];
    isFeatured?: boolean;
    isBackfill?: boolean;
    logDate?: string;
  }): Promise<LogEntry | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const json = await res.json();
      return json.data;
    } catch (err) {
      console.error('API createLog failed:', err);
      return null;
    }
  },

  // 3. Beri Kudos
  async addKudos(logId: string): Promise<number | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/logs/${logId}/kudos`, {
        method: 'PATCH',
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const json = await res.json();
      return json.kudosCount;
    } catch (err) {
      console.error('API addKudos failed:', err);
      return null;
    }
  },

  // 4. Buat Proyek Baru
  async createProject(payload: {
    username: string;
    title: string;
    description?: string;
    repoUrl?: string;
    liveUrl?: string;
    isStealthNda?: boolean;
    status?: 'in_progress' | 'completed' | 'archived';
    isFeatured?: boolean;
  }): Promise<Project | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const json = await res.json();
      return json.data;
    } catch (err) {
      console.error('API createProject failed:', err);
      return null;
    }
  },
};
