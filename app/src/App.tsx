import { useState, useEffect } from 'react';
import { INITIAL_PROFILE, INITIAL_PROJECTS, INITIAL_LOGS } from './mockData';
import type { LogEntry } from './mockData';
import { BentoHero } from './components/BentoHero';
import { EngineeringRhythm } from './components/EngineeringRhythm';
import { ProjectShowcase } from './components/ProjectShowcase';
import { QuickLogComposer } from './components/QuickLogComposer';
import { LogTimeline } from './components/LogTimeline';
import { ManageLogsTable } from './components/ManageLogsTable';
import { ContactModal } from './components/ContactModal';
import { Globe, PenSquare, Flame, Sparkles, FolderGit2, Terminal, Flag, ShieldCheck, Code2 } from 'lucide-react';

const STORAGE_KEY_LOGS = 'logfolio_entries_v1';

export function App() {
  const [profile] = useState(INITIAL_PROFILE);
  const [projects] = useState(INITIAL_PROJECTS);
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
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs));
    } catch {
      // Ignore quota errors
    }
  }, [logs]);

  const handleAddLog = (newLog: LogEntry) => {
    setLogs([newLog, ...logs]);
    setActiveTab('public_preview');
  };

  const handleDeleteLog = (logId: string) => {
    setLogs(logs.filter(l => l.id !== logId));
  };

  const handleAddKudos = (logId: string) => {
    setLogs(logs.map(l => l.id === logId ? { ...l, kudosCount: l.kudosCount + 1 } : l));
  };


  const handlePrintResume = () => {
    window.print();
  };

  return (
    <div className="app-container">
      {/* Top App Bar / Switcher */}
      <header className="app-header no-print">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: '8px' }} className="app-header-top">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, var(--accent-primary), #0284C7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 2px 8px rgba(79, 70, 229, 0.25)'
            }}>
              <Code2 size={18} strokeWidth={2.5} />
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              Logfolio<span style={{ color: 'var(--accent-primary)' }}>.dev</span>
            </span>
          </div>


          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Flame size={15} color="var(--accent-emerald)" />
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
              {profile.streakDays}d Streak
            </span>
          </div>
        </div>

        {/* View Toggle */}
        <div className="header-nav-toggle" style={{ display: 'flex', background: '#F1F5F9', padding: '4px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)', width: '100%' }}>
          <button
            onClick={() => setActiveTab('public_preview')}
            style={{
              flex: 1,
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              background: activeTab === 'public_preview' ? 'var(--accent-primary)' : 'transparent',
              color: activeTab === 'public_preview' ? '#fff' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
            }}
          >
            <Globe size={14} />
            <span>Portofolio</span>
          </button>
          <button
            onClick={() => setActiveTab('dashboard_composer')}
            style={{
              flex: 1,
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              background: activeTab === 'dashboard_composer' ? 'var(--accent-primary)' : 'transparent',
              color: activeTab === 'dashboard_composer' ? '#fff' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
            }}
          >
            <PenSquare size={14} />
            <span>Quick-Log</span>
          </button>
        </div>
      </header>



      {/* VIEW 1: DASHBOARD QUICK-LOG COMPOSER */}
      {activeTab === 'dashboard_composer' && (
        <main>
          <QuickLogComposer projects={projects} onAddLog={handleAddLog} />
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
            onPrintClick={handlePrintResume}
          />

          {/* Navigation Filter Pills (Showcase Mode) */}
          <div className="no-print" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '20px',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '12px'
          }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
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
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease'
                }}
              >
                <Sparkles size={13} />
                Semua Sorotan
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
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease'
                }}
              >
                <FolderGit2 size={13} />
                Arsitektur & Studi Kasus ({projects.length})
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
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease'
                }}
              >
                <Terminal size={13} />
                Live Engineering Logs ({logs.length})
              </button>
            </div>

            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Proof-of-Work Level: <b>Production Ready</b>
            </span>
          </div>

          {/* Section 1: Engineering Rhythm (Bento Metric, menggantikan GitHub Heatmap) */}
          {(publicViewMode === 'all' || publicViewMode === 'logs') && (
            <EngineeringRhythm logs={logs} />
          )}

          {/* Section 2: Workstreams & Case Studies */}
          {(publicViewMode === 'all' || publicViewMode === 'case_studies') && (
            <ProjectShowcase
              projects={projects}
              profile={profile}
              onFilterByProject={() => setPublicViewMode('logs')}
            />
          )}

          {/* Section 3: Deep Timeline & Micro-Logbook */}
          {(publicViewMode === 'all' || publicViewMode === 'logs') && (
            <LogTimeline logs={logs} projects={projects} onAddKudos={handleAddKudos} />
          )}
        </main>
      )}


      {/* Footer */}
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
        <span>Ditenagai oleh <b>Logfolio</b> · Micro-Journaling & Proof-of-Work</span>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <a href="#report" onClick={(e) => { e.preventDefault(); alert('Laporan terkirim untuk ditinjau oleh tim keamanan.'); }} style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Flag size={13} />
            Laporkan Profil / DMCA
          </a>
          <span style={{ color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={14} />
            Sistem Stabil
          </span>
        </div>
      </footer>


      {/* Contact Relay Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        candidateName={profile.fullName}
      />
    </div>
  );
}

export default App;
