import { useState, useEffect } from 'react';
import { usePortfolioData } from './hooks/usePortfolioData';
import { Navbar } from './components/common/Navbar';
import { PublicPortfolioPage } from './pages/PublicPortfolioPage';
import { DashboardPage } from './pages/DashboardPage';
import { ContactModal } from './components/modals/ContactModal';
import { CreateProjectModal } from './components/modals/CreateProjectModal';
import { ExportModal } from './components/modals/ExportModal';
import { EditProfileModal } from './components/modals/EditProfileModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { AiDigestModal } from './components/modals/AiDigestModal';
import { SharePortfolioModal } from './components/modals/SharePortfolioModal';
import { GitHubSyncModal } from './components/modals/GitHubSyncModal';
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

  const [activeTab, setActiveTab] = useState<'public_preview' | 'dashboard_composer'>(() => {
    const r = parseCurrentRoute();
    return r.route === 'dashboard' ? 'dashboard_composer' : 'public_preview';
  });

  useEffect(() => {
    const handlePopState = () => {
      const r = parseCurrentRoute();
      setActiveTab(r.route === 'dashboard' ? 'dashboard_composer' : 'public_preview');
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
    handleSaveProfile,
    handleAddKudos,
    handleResetData,
  } = usePortfolioData();

  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAiDigestOpen, setIsAiDigestOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isGitHubSyncOpen, setIsGitHubSyncOpen] = useState(false);
  const [importedCommit, setImportedCommit] = useState<GitHubCommitItem | null>(null);

  const handleTabChange = (tab: 'public_preview' | 'dashboard_composer') => {
    setActiveTab(tab);
    if (tab === 'dashboard_composer') {
      navigateTo('/dashboard');
    } else {
      navigateTo(`/p/${profile.username}`);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Keluar dari sesi profil aktif dan beralih ke Mode Tamu?')) {
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
        onTabChange={handleTabChange}
        onOpenEditProfile={() => setIsEditProfileOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAiDigest={() => setIsAiDigestOpen(true)}
        onLogout={handleLogout}
      />

      {activeTab === 'dashboard_composer' ? (
        <DashboardPage
          candidateUsername={profile.username}
          projects={projects}
          logs={logs}
          recruiterMessages={recruiterMessages}
          onAddLog={handleAddLog}
          onDeleteLog={handleDeleteLog}
          onOpenCreateProject={() => setIsCreateProjectOpen(true)}
          onOpenGitHubSync={() => setIsGitHubSyncOpen(true)}
          importedCommit={importedCommit}
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
        </div>
      </footer>

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
    </div>
  );
}

export default App;
