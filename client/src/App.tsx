import { useState, useEffect } from 'react';
import { usePortfolioData } from './hooks/usePortfolioData';
import { Navbar } from './components/common/Navbar';
import { PublicPortfolioPage } from './pages/PublicPortfolioPage';
import { DashboardPage } from './pages/DashboardPage';
import { InboxPage } from './pages/InboxPage';
import { ContactModal } from './components/modals/ContactModal';
import { CreateProjectModal } from './components/modals/CreateProjectModal';
import { ExportModal } from './components/modals/ExportModal';
import { EditProfileModal } from './components/modals/EditProfileModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { AiDigestModal } from './components/modals/AiDigestModal';
import { SharePortfolioModal } from './components/modals/SharePortfolioModal';
import { GitHubSyncModal } from './components/modals/GitHubSyncModal';
import { ReportModal } from './components/modals/ReportModal';
import { AuthModal } from './components/modals/AuthModal';
import { api } from './services/api';
import type { GitHubCommitItem } from './services/githubService';
import { parseCurrentRoute, navigateTo } from './utils/router';

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

  const [activeTab, setActiveTab] = useState<'public_preview' | 'dashboard_composer' | 'inbox'>(() => {
    const r = parseCurrentRoute();
    if (r.route === 'dashboard') return 'dashboard_composer';
    if (r.route === 'inbox') return 'inbox';
    return 'public_preview';
  });

  useEffect(() => {
    const handlePopState = () => {
      const r = parseCurrentRoute();
      if (r.route === 'dashboard') {
        setActiveTab('dashboard_composer');
      } else if (r.route === 'inbox') {
        setActiveTab('inbox');
      } else {
        setActiveTab('public_preview');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const {
    profile,
    projects,
    logs,
    recruiterMessages,
    handleAddLog,
    handleCreateProject,
    handleDeleteLog,
    handleUpdateLog,
    handleSaveProfile,
    handleAddKudos,
    handleUpdateMessageStatus,
    handleResetData,
  } = usePortfolioData();

  useEffect(() => {
    if (activeTab === 'dashboard_composer') {
      document.title = `Dashboard Quick-Log — @${profile.username} | Logfolio`;
    } else if (activeTab === 'inbox') {
      document.title = `Inbox Pesan Rekruter (${recruiterMessages.length}) — @${profile.username} | Logfolio`;
    } else {
      document.title = `${profile.fullName} — ${profile.headline || 'Developer Portfolio'} | Logfolio`;
    }

    const metaDesc = document.querySelector('meta[name="description"]');
    const descriptionText = `${profile.fullName} (@${profile.username}) — ${profile.bio || profile.headline || 'Developer Portfolio'}. Portofolio berbasis bukti kerja terverifikasi.`;
    if (metaDesc) {
      metaDesc.setAttribute('content', descriptionText);
    }

    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }

    if (logs.length < 3) {
      robotsMeta.setAttribute('content', 'noindex, nofollow');
    } else {
      robotsMeta.setAttribute('content', 'index, follow');
    }

    const setOrCreateMeta = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', property);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    const currentUrl = `${window.location.origin}/p/${profile.username}`;
    setOrCreateMeta('og:title', `${profile.fullName} — ${profile.headline || 'Developer Portfolio'}`);
    setOrCreateMeta('og:description', descriptionText);
    setOrCreateMeta('og:url', currentUrl);
    setOrCreateMeta('og:type', 'profile');
    if (profile.avatarUrl) {
      setOrCreateMeta('og:image', profile.avatarUrl);
    }
  }, [profile.fullName, profile.username, profile.headline, profile.bio, profile.avatarUrl, activeTab, recruiterMessages.length, logs.length]);

  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAiDigestOpen, setIsAiDigestOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isGitHubSyncOpen, setIsGitHubSyncOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [importedCommit, setImportedCommit] = useState<GitHubCommitItem | null>(null);

  const handleTabChange = (tab: 'public_preview' | 'dashboard_composer' | 'inbox') => {
    setActiveTab(tab);
    if (tab === 'dashboard_composer') {
      navigateTo('/dashboard');
    } else if (tab === 'inbox') {
      navigateTo('/inbox');
    } else {
      navigateTo(`/p/${profile.username}`);
    }
  };

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ username: string; fullName: string; avatarUrl?: string } | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const profileData = await api.getCurrentUser();
      if (profileData) {
        setCurrentUser(profileData);
      }
    };
    checkAuth();
  }, []);

  const handleAuthSuccess = (userProfile: { username: string; fullName: string; avatarUrl?: string }) => {
    setCurrentUser(userProfile);
    if (userProfile.username && userProfile.username !== profile.username) {
      navigateTo(`/p/${userProfile.username}`);
      window.location.reload();
    }
  };

  const handleLogout = () => {
    if (window.confirm('Keluar dari sesi profil aktif dan beralih ke Mode Tamu?')) {
      api.logout();
      setCurrentUser(null);
      setActiveTab('public_preview');
    }
  };

  const handleSelectGitHubCommit = (commit: GitHubCommitItem) => {
    setImportedCommit(commit);
  };

  return (
    <div className="app-container">
      <Navbar
        profile={profile}
        activeTab={activeTab}
        unreadMessagesCount={recruiterMessages.length}
        isAuthenticated={!!currentUser}
        onTabChange={handleTabChange}
        onOpenEditProfile={() => setIsEditProfileOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAiDigest={() => setIsAiDigestOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
      />

      {activeTab === 'dashboard_composer' ? (
        <DashboardPage
          candidateUsername={profile.username}
          projects={projects}
          logs={logs}
          streakDays={profile.streakDays}
          onAddLog={handleAddLog}
          onDeleteLog={handleDeleteLog}
          onUpdateLog={handleUpdateLog}
          onOpenCreateProject={() => setIsCreateProjectOpen(true)}
          onOpenGitHubSync={() => setIsGitHubSyncOpen(true)}
          importedCommit={importedCommit}
        />
      ) : activeTab === 'inbox' ? (
        <InboxPage
          messages={recruiterMessages}
          candidateUsername={profile.username}
          onUpdateMessageStatus={handleUpdateMessageStatus}
        />
      ) : (
        <PublicPortfolioPage
          profile={profile}
          projects={projects}
          logs={logs}
          onContactClick={() => setIsContactOpen(true)}
          onExportClick={() => setIsExportOpen(true)}
          onOpenAiDigest={() => setIsAiDigestOpen(true)}
          onShareClick={() => setIsShareModalOpen(true)}
          onAddKudos={handleAddKudos}
        />
      )}

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
          <span>{profile.fullName} &copy; {new Date().getFullYear()}</span>
          <button
            type="button"
            onClick={() => setIsReportOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.78rem',
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: 0,
            }}
          >
            Laporkan Profil
          </button>
        </div>
      </footer>

      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        targetUsername={profile.username}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        candidateName={profile.fullName}
        candidateUsername={profile.username}
      />

      <CreateProjectModal
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
        onCreateProject={handleCreateProject}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        profile={profile}
        projects={projects}
        logs={logs}
      />

      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        profile={profile}
        onSaveProfile={handleSaveProfile}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        profile={profile}
        onResetData={handleResetData}
        theme={theme}
        onThemeChange={(newTheme: 'light' | 'dark') => setTheme(newTheme)}
        appLang={appLang}
        onLangChange={(newLang: 'id' | 'en') => setAppLang(newLang)}
      />

      <AiDigestModal
        isOpen={isAiDigestOpen}
        onClose={() => setIsAiDigestOpen(false)}
        profile={profile}
        logs={logs}
        projects={projects}
      />

      <SharePortfolioModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        profile={profile}
      />

      <GitHubSyncModal
        isOpen={isGitHubSyncOpen}
        onClose={() => setIsGitHubSyncOpen(false)}
        defaultUsername={profile.socialLinks?.github || 'Firli-stack'}
        onSelectCommit={handleSelectGitHubCommit}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}

export default App;
