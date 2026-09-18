import { useState, useEffect } from 'react';
import { INITIAL_PROFILE, INITIAL_PROJECTS, INITIAL_LOGS } from './mockData';
import type { LogEntry, Project } from './mockData';
import { BentoHero } from './components/BentoHero';
import { EngineeringRhythm } from './components/EngineeringRhythm';
import { ProjectShowcase } from './components/ProjectShowcase';
import { QuickLogComposer } from './components/QuickLogComposer';
import { LogTimeline } from './components/LogTimeline';
import { ManageLogsTable } from './components/ManageLogsTable';
import { ContactModal } from './components/ContactModal';
import { CreateProjectModal } from './components/CreateProjectModal';
import { ExportModal } from './components/ExportModal';
import { EditProfileModal } from './components/EditProfileModal';
import { SettingsModal } from './components/SettingsModal';
import { Navbar } from './components/Navbar';
import { api } from './services/api';

const STORAGE_KEY_PROFILE = 'logfolio_profile_v1';
const STORAGE_KEY_LOGS = 'logfolio_entries_v1';
const STORAGE_KEY_PROJECTS = 'logfolio_projects_v1';
const STORAGE_KEY_THEME = 'logfolio_theme_v1';
const STORAGE_KEY_LANG = 'logfolio_lang_v1';

export function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem(STORAGE_KEY_THEME) as 'light' | 'dark') || 'light';
  });

  const [appLang, setAppLang] = useState<'id' | 'en'>(() => {
    return (localStorage.getItem(STORAGE_KEY_LANG) as 'id' | 'en') || 'id';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY_THEME, theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_LANG, appLang);
  }, [appLang]);

  // Fetch dari API saat load (fallback ke localStorage/mockData bila offline)
  useEffect(() => {
    const fetchApiData = async () => {
      const data = await api.getProfile('alexdev');
      if (data) {
        setProfile({
          username: data.username,
          fullName: data.fullName,
          headline: data.headline,
          bio: data.bio,
          avatarUrl: data.avatarUrl,
          timezone: data.timezone,
          socialLinks: data.socialLinks,
          streakFreezeLeft: data.streakFreezeLeft,
          streakDays: data.streakDays,
          totalLogs: data.totalLogs,
          topSkills: data.topSkills,
          location: 'Jakarta, Indonesia',
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
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return INITIAL_PROFILE;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROJECTS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return INITIAL_PROJECTS;
  });

  const [logs, setLogs] = useState<LogEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LOGS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return INITIAL_LOGS;
  });
  const [activeTab, setActiveTab] = useState<'public_preview' | 'dashboard_composer'>('public_preview');
  const [publicViewMode, setPublicViewMode] = useState<'all' | 'case_studies' | 'logs'>('all');
  const [timelineProjectFilter, setTimelineProjectFilter] = useState<string>('all');
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleResetData = () => {
    localStorage.removeItem(STORAGE_KEY_PROFILE);
    localStorage.removeItem(STORAGE_KEY_LOGS);
    localStorage.removeItem(STORAGE_KEY_PROJECTS);
    setProfile(INITIAL_PROFILE);
    setProjects(INITIAL_PROJECTS);
    setLogs(INITIAL_LOGS);
  };

  const handleLogout = () => {
    if (window.confirm('Keluar dari sesi profil aktif dan beralih ke Mode Tamu?')) {
      setActiveTab('public_preview');
    }
  };

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
    } catch {
      // Ignore quota errors
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs));
    } catch {
      // Ignore quota errors
    }
  }, [logs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
    } catch {
      // Ignore quota errors
    }
  }, [projects]);

  const handleAddLog = async (newLog: LogEntry) => {
    // Optimistic update
    setLogs([newLog, ...logs]);
    setProjects(projects.map(p => p.id === newLog.projectId ? { ...p, logCount: p.logCount + 1 } : p));
    setActiveTab('public_preview');

    // Sync to backend API
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
      // Perbarui ID jika berhasil disimpan di database PostgreSQL
      setLogs((prev) => [created, ...prev.filter((l) => l.id !== newLog.id)]);
    }
  };

  const handleCreateProject = async (newProject: Project) => {
    // Optimistic update
    setProjects([newProject, ...projects]);

    // Sync to backend API
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

  const handleDeleteLog = (logId: string) => {
    setLogs(logs.filter(l => l.id !== logId));
  };

  const handleAddKudos = async (logId: string) => {
    // Optimistic update
    setLogs(logs.map(l => l.id === logId ? { ...l, kudosCount: l.kudosCount + 1 } : l));
    // Sync to backend
    await api.addKudos(logId);
  };

  return (
    <div className="app-container">
      {/* Top App Bar / Switcher & Profile Dropdown */}
      <Navbar
        profile={profile}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        onOpenEditProfile={() => setIsEditProfileOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onLogout={handleLogout}
      />

      {/* VIEW 1: DASHBOARD QUICK-LOG COMPOSER */}
      {activeTab === 'dashboard_composer' && (
        <main>
          <QuickLogComposer
            projects={projects}
            onAddLog={handleAddLog}
            onOpenCreateProject={() => setIsCreateProjectOpen(true)}
          />
          <ManageLogsTable logs={logs} onDeleteLog={handleDeleteLog} />
          <EngineeringRhythm logs={logs} />
        </main>
      )}

      {/* VIEW 2: PUBLIC PORTFOLIO SHOWCASE (/p/:username) */}
      {activeTab === 'public_preview' && (
        <main>
          {/* TIER 1: Modern Bento Grid Hero & Identity */}
          <BentoHero
            profile={profile}
            onContactClick={() => setIsContactOpen(true)}
            onExportClick={() => setIsExportOpen(true)}
          />

          {/* Navigation Filter Pills */}
          <div className="no-print" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: '8px',
            marginBottom: '20px',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '12px'
          }}>
            <button
              type="button"
              onClick={() => setPublicViewMode('all')}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-subtle)',
                background: publicViewMode === 'all' ? 'var(--accent-primary)' : 'var(--bg-surface)',
                color: publicViewMode === 'all' ? '#fff' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Semua
            </button>
            <button
              type="button"
              onClick={() => setPublicViewMode('case_studies')}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-subtle)',
                background: publicViewMode === 'case_studies' ? 'var(--accent-primary)' : 'var(--bg-surface)',
                color: publicViewMode === 'case_studies' ? '#fff' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Proyek ({projects.length})
            </button>
            <button
              type="button"
              onClick={() => setPublicViewMode('logs')}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-subtle)',
                background: publicViewMode === 'logs' ? 'var(--accent-primary)' : 'var(--bg-surface)',
                color: publicViewMode === 'logs' ? '#fff' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Catatan ({logs.length})
            </button>
          </div>

          {/* Section 1: Workstreams & Case Studies (Karya Nyata Ditampilkan Terlebih Dahulu) */}
          {(publicViewMode === 'all' || publicViewMode === 'case_studies') && (
            <ProjectShowcase
              projects={projects}
              onFilterByProject={(projId) => {
                setTimelineProjectFilter(projId);
                setPublicViewMode('all');
                // Smooth scroll ke bagian log
                const el = document.getElementById('log-timeline-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          )}

          {/* Section 2: Engineering Rhythm & Momentum (Bukti Konsistensi & Fokus) */}
          {(publicViewMode === 'all' || publicViewMode === 'logs') && (
            <EngineeringRhythm logs={logs} />
          )}

          {/* Section 3: Engineering Logbook Stream (Catatan Pengerjaan Harian) */}
          {(publicViewMode === 'all' || publicViewMode === 'logs') && (
            <div id="log-timeline-section">
              <LogTimeline
                logs={logs}
                projects={projects}
                onAddKudos={handleAddKudos}
                initialSelectedProject={timelineProjectFilter}
              />
            </div>
          )}
        </main>
      )}


      {/* Footer Branding & Disclaimer */}
      <footer className="no-print" style={{
        marginTop: '60px',
        paddingTop: '20px',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        fontSize: '0.8rem',
        color: 'var(--text-muted)'
      }}>
        <span>Portofolio dibuat dengan <b>Logfolio</b></span>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span>Alex Pratama &copy; {new Date().getFullYear()}</span>
        </div>
      </footer>


      {/* Contact Relay Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        candidateName={profile.fullName}
      />

      {/* Create Project Container Modal */}
      <CreateProjectModal
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
        onCreateProject={handleCreateProject}
      />

      {/* Export Data Modal (.md & .json) */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        profile={profile}
        projects={projects}
        logs={logs}
      />

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        profile={profile}
        onSaveProfile={(updatedProfile) => setProfile(updatedProfile)}
      />

      {/* Settings & Data Reset Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        profile={profile}
        onResetData={handleResetData}
        theme={theme}
        onThemeChange={(newTheme) => setTheme(newTheme)}
        appLang={appLang}
        onLangChange={(newLang) => setAppLang(newLang)}
      />
    </div>
  );
}

export default App;
