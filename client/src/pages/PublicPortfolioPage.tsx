import React, { useState } from 'react';
import type { LogEntry, Project, UserProfile } from '../types';
import { BentoHero } from '../features/portfolio/BentoHero';
import { RecruiterSnapshot } from '../features/portfolio/RecruiterSnapshot';
import { ProjectShowcase } from '../features/portfolio/ProjectShowcase';
import { EngineeringRhythm } from '../features/portfolio/EngineeringRhythm';
import { LogTimeline } from '../features/portfolio/LogTimeline';
import { Sparkles, ArrowRight } from 'lucide-react';

interface PublicPortfolioPageProps {
  profile: UserProfile;
  projects: Project[];
  logs: LogEntry[];
  isAuthenticated?: boolean;
  onContactClick: () => void;
  onExportClick: () => void;
  onOpenAiDigest: () => void;
  onShareClick: () => void;
  onAddKudos: (logId: string) => void;
}

export const PublicPortfolioPage: React.FC<PublicPortfolioPageProps> = ({
  profile,
  projects,
  logs,
  isAuthenticated = false,
  onContactClick,
  onExportClick,
  onOpenAiDigest,
  onShareClick,
  onAddKudos,
}) => {
  const [publicViewMode, setPublicViewMode] = useState<'all' | 'case_studies' | 'logs'>('all');
  const [timelineProjectFilter, setTimelineProjectFilter] = useState<string>('all');

  return (
    <main>
      <BentoHero
        profile={profile}
        onContactClick={onContactClick}
        onExportClick={onExportClick}
        onOpenAiDigest={isAuthenticated ? onOpenAiDigest : undefined}
        onShareClick={onShareClick}
      />

      {isAuthenticated && (
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
            onClick={onOpenAiDigest}
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
      )}

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

      <RecruiterSnapshot
        profile={profile}
        projects={projects}
        onOpenAiDigest={isAuthenticated ? onOpenAiDigest : undefined}
      />

      {(publicViewMode === 'all' || publicViewMode === 'case_studies') && (
        <ProjectShowcase
          projects={projects}
          onFilterByProject={(projId: string) => {
            setTimelineProjectFilter(projId);
            setPublicViewMode('all');
            const el = document.getElementById('log-timeline-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      )}

      {(publicViewMode === 'all' || publicViewMode === 'logs') && (
        <EngineeringRhythm logs={logs} />
      )}

      {(publicViewMode === 'all' || publicViewMode === 'logs') && (
        <div id="log-timeline-section">
          <LogTimeline
            logs={logs}
            projects={projects}
            onAddKudos={onAddKudos}
            initialSelectedProject={timelineProjectFilter}
          />
        </div>
      )}
    </main>
  );
};
