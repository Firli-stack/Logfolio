import { useState, useEffect } from 'react';
import type { LogEntry, Project, UserProfile } from '../types';
import { INITIAL_PROFILE, INITIAL_PROJECTS, INITIAL_LOGS } from '../mockData';
import { api } from '../services/api';
import { parseCurrentRoute } from '../utils/router';

const STORAGE_KEY_PROFILE = 'logfolio_profile_v1';
const STORAGE_KEY_LOGS = 'logfolio_entries_v1';
const STORAGE_KEY_PROJECTS = 'logfolio_projects_v1';

export function usePortfolioData() {
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (saved) return JSON.parse(saved);
    } catch {
    }
    return INITIAL_PROFILE;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROJECTS);
      if (saved) return JSON.parse(saved);
    } catch {
    }
    return INITIAL_PROJECTS;
  });

  const [logs, setLogs] = useState<LogEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LOGS);
      if (saved) return JSON.parse(saved);
    } catch {
    }
    return INITIAL_LOGS;
  });

  useEffect(() => {
    const fetchApiData = async () => {
      const r = parseCurrentRoute();
      const targetUser = r.username || 'alexdev';

      const data = await api.getProfile(targetUser);
      if (data) {
        setProfile({
          username: data.username,
          fullName: data.fullName,
          headline: data.headline,
          bio: data.bio,
          location: 'Remote',
          avatarUrl: data.avatarUrl,
          timezone: data.timezone,
          socialLinks: data.socialLinks,
          streakDays: data.streakDays,
          totalLogs: data.totalLogs,
          streakFreezeLeft: data.streakFreezeLeft,
          topSkills: data.topSkills || [],
        });

        if (data.projects && data.projects.length > 0) {
          setProjects(data.projects);
        }
        if (data.logs && data.logs.length > 0) {
          setLogs(data.logs);
        }
      }
    };

    fetchApiData();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
      localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs));
      localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
    } catch {
    }
  }, [profile, logs, projects]);

  const handleAddLog = async (newLog: LogEntry) => {
    setLogs((prev) => [newLog, ...prev]);

    const created = await api.createLog({
      username: profile.username,
      projectId: newLog.projectId || null,
      content: newLog.content,
      proofUrl: newLog.proofUrl,
      skills: newLog.skills,
      isFeatured: newLog.isFeatured,
      isBackfill: newLog.isBackfill,
    });

    if (created) {
      setLogs((prev) => [created, ...prev.filter((l) => l.id !== newLog.id)]);
    }
  };

  const handleCreateProject = async (newProject: Project) => {
    setProjects((prev) => [newProject, ...prev]);

    await api.createProject({
      username: profile.username,
      title: newProject.title,
      description: newProject.description,
      repoUrl: newProject.repoUrl,
      liveUrl: newProject.liveUrl,
      isStealthNda: newProject.isStealthNda,
      status: newProject.status,
    });
  };

  const handleDeleteLog = async (logId: string) => {
    setLogs((prev) => prev.filter((l) => l.id !== logId));
    await api.deleteLog(logId);
  };

  const handleSaveProfile = async (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    await api.updateProfile(updatedProfile.username, {
      fullName: updatedProfile.fullName,
      headline: updatedProfile.headline,
      bio: updatedProfile.bio,
      avatarUrl: updatedProfile.avatarUrl,
      timezone: updatedProfile.timezone,
      socialLinks: updatedProfile.socialLinks,
    });
  };

  const handleAddKudos = async (logId: string) => {
    setLogs((prev) =>
      prev.map((l) => (l.id === logId ? { ...l, kudosCount: l.kudosCount + 1 } : l))
    );
    await api.addKudos(logId);
  };

  const handleResetData = () => {
    localStorage.removeItem(STORAGE_KEY_PROFILE);
    localStorage.removeItem(STORAGE_KEY_LOGS);
    localStorage.removeItem(STORAGE_KEY_PROJECTS);
    setProfile(INITIAL_PROFILE);
    setProjects(INITIAL_PROJECTS);
    setLogs(INITIAL_LOGS);
  };

  return {
    profile,
    setProfile,
    projects,
    setProjects,
    logs,
    setLogs,
    handleAddLog,
    handleCreateProject,
    handleDeleteLog,
    handleSaveProfile,
    handleAddKudos,
    handleResetData,
  };
}
