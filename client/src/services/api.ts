import type { Project, LogEntry, RecruiterMessage } from '../types';

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
  async getProfile(username: string): Promise<ProfileResponse | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/profile/${username}`);
      if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const json = await res.json();
      return json.data;
    } catch {
      return null;
    }
  },
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
  async updateProfile(username: string, payload: {
    fullName?: string;
    headline?: string;
    bio?: string;
    avatarUrl?: string;
    timezone?: string;
    socialLinks?: Record<string, string>;
  }): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/profile/${username}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return true;
    } catch (err) {
      console.error('API updateProfile failed:', err);
      return false;
    }
  },
  async deleteLog(logId: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/logs/${logId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return true;
    } catch (err) {
      console.error('API deleteLog failed:', err);
      return false;
    }
  },
  async sendContactMessage(payload: {
    targetUsername: string;
    recruiterName: string;
    recruiterEmail: string;
    message: string;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Gagal mengirim pesan relay.' };
      }
      return { success: true };
    } catch {
      return { success: false, error: 'Terjadi kesalahan koneksi server.' };
    }
  },
  async reportProfile(payload: {
    targetUsername: string;
    reason: 'copyright' | 'spam' | 'nsfw' | 'other';
    details?: string;
    reporterEmail?: string;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Gagal mengirim laporan.' };
      }
      return { success: true };
    } catch {
      return { success: false, error: 'Terjadi kesalahan koneksi server.' };
    }
  },
  async getContactMessages(username: string): Promise<RecruiterMessage[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/profile/${username}/messages`);
      if (!res.ok) return [];
      const json = await res.json();
      return json.data || [];
    } catch (err) {
      console.error('API getContactMessages failed:', err);
      return [];
    }
  },
  async verifyProofLink(url: string): Promise<{ isValid: boolean; httpStatus?: number; error?: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/logs/verify-proof`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const json = await res.json();
      if (!res.ok) {
        return { isValid: false, error: json.error || 'Verifikasi gagal' };
      }
      return json.data || { isValid: false, error: 'Respon server tidak valid' };
    } catch {
      return { isValid: false, error: 'Gagal menghubungi validator URL' };
    }
  },
};
