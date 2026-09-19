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
import { AiDigestModal } from './components/AiDigestModal';
import { RecruiterSnapshot } from './components/RecruiterSnapshot';
import { Navbar } from './components/Navbar';
import { api } from './services/api';
import { Sparkles, ArrowRight } from 'lucide-react';
import { parseCurrentRoute, navigateTo } from './utils/router';

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

  const [activeTab, setActiveTab] = useState<'public_preview' | 'dashboard_composer'>(() => {
    const r = parseCurrentRoute();
    return r.route === 'dashboard' ? 'dashboard_composer' : 'public_preview';
  });

  // Sync route saat browser URL berubah (Back / Forward button)
  useEffect(() => {
    const handlePopState = () => {
      const r = parseCurrentRoute();
      if (r.route === 'dashboard') {
        setActiveTab('dashboard_composer');
      } else {
        setActiveTab('public_preview');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Fetch dari API saat load (fallback ke localStorage/mockData bila offline)
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
  const [publicViewMode, setPublicViewMode] = useState<'all' | 'case_studies' | 'logs'>('all');
  const [timelineProjectFilter, setTimelineProjectFilter] = useState<string>('all');
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAiDigestOpen, setIsAiDigestOpen] = useState(false);

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

  const handleDeleteLog = async (logId: string) => {
    // Optimistic delete
    setLogs(logs.filter(l => l.id !== logId));
    // Sync to backend database
    await api.deleteLog(logId);
  };

  const handleSaveProfile = async (updatedProfile: typeof profile) => {
    // Optimistic update
    setProfile(updatedProfile);
    // Sync to backend database
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
    // Optimistic update
    setLogs(logs.map(l => l.id === logId ? { ...l, kudosCount: l.kudosCount + 1 } : l));
    // Sync to backend
    await api.addKudos(logId);
  };

  const handleTabChange = (tab: 'public_preview' | 'dashboard_composer') => {
    setActiveTab(tab);
    if (tab === 'dashboard_composer') {
      navigateTo('/dashboard');
    } else {
      navigateTo(`/p/${profile.username}`);
    }
  };

  const handleShareLink = () => {
    const publicUrl = `${window.location.origin}/p/${profile.username}`;
    navigator.clipboard.writeText(publicUrl);
    alert(`Tautan portofolio publik Anda berhasil disalin!\n${publicUrl}`);
  };

  return (
    <div className="app-container">
      {/* Top App Bar / Switcher & Profile Dropdown */}
      <Navbar
        profile={profile}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onOpenEditProfile={() => setIsEditProfileOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAiDigest={() => setIsAiDigestOpen(true)}
        onShareLink={handleShareLink}
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
            onOpenAiDigest={() => setIsAiDigestOpen(true)}
            onShareClick={handleShareLink}
          />

          {/* AI Showcase Feature Banner: Jelas, Menarik, dan Mudah Dipahami */}
          <div 
            className="glass-panel no-print" 
            style={{
              padding: '18px 24px',
              marginBottom: '24px',
              background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.08) 0%, rgba(2, 132, 199, 0.06) 100%)',
              border: '1px solid rgba(79, 70, 229, 0.25)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: '1 1 320px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-cyan))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow: '0 4px 14px rgba(79, 70, 229, 0.28)',
                flexShrink: 0,
              }}>
                <Sparkles size={22} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--text-primary)' }}>
                    AI Executive Digest & Social Showcase
                  </span>
                  <span style={{
                    fontSize: '0.68rem',
                    padding: '2px 7px',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(5, 150, 105, 0.1)',
                    color: 'var(--accent-emerald)',
                    fontWeight: 700,
                  }}>
                    Bilingual ID / EN
                  </span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '3px 0 0 0', lineHeight: '1.4' }}>
                  Otomatis ekstrak seluruh log aktivitas harian menjadi <b>Executive Pitch</b>, <b>Highlight Solusi Teknis</b>, dan <b>Draft LinkedIn Siap Posting</b>.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsAiDigestOpen(true)}
              style={{
                background: 'linear-gradient(135deg, var(--accent-primary), #4338CA)',
                color: '#FFFFFF',
                border: 'none',
                padding: '10px 18px',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                fontSize: '0.84rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
                transition: 'transform 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
            >
              <Sparkles size={15} />
              <span>Coba Generate Sekarang</span>
              <ArrowRight size={14} />
            </button>
          </div>

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

          {/* TIER 1.5: Recruiter Executive Snapshot & AI Highlights */}
          <RecruiterSnapshot
            profile={profile}
            projects={projects}
            onOpenAiDigest={() => setIsAiDigestOpen(true)}
          />

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
        onSaveProfile={handleSaveProfile}
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

      {/* AI Engineering Digest & Weekly Showcase Modal */}
      <AiDigestModal
        isOpen={isAiDigestOpen}
        onClose={() => setIsAiDigestOpen(false)}
        profile={profile}
        logs={logs}
        projects={projects}
      />
    </div>
  );
}

export default App;
