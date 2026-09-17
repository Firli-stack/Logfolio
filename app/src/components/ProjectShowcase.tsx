import React from 'react';
import type { Project, UserProfile } from '../mockData';
import { Lock, Globe, ExternalLink, GitBranch, ArrowRight } from 'lucide-react';

interface ShowcaseProps {
  projects: Project[];
  profile: UserProfile;
  onFilterByProject?: (projectId: string) => void;
}

export const ProjectShowcase: React.FC<ShowcaseProps> = ({ projects, profile, onFilterByProject }) => {
  return (
    <div style={{ marginBottom: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
            Featured Workstreams & System Case Studies
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Arsitektur sistem dan aplikasi dengan dampak produksi nyata.
          </p>
        </div>

        {/* Tech summary chips */}
        <div className="no-print" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {profile.topSkills.map(s => (
            <span key={s.skill} className="skill-badge" style={{ fontSize: '0.75rem' }}>
              #{s.skill}
            </span>
          ))}
        </div>
      </div>

      {/* Grid of Bento Case Studies */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '18px'
      }}>

        {projects.map((proj) => {
          const isStealth = proj.isStealthNda;
          return (
            <div
              key={proj.id}
              className="glass-panel"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
                background: isStealth ? 'linear-gradient(135deg, #FFFFFF, #F8FAFC)' : '#FFFFFF',
                borderLeft: isStealth ? '3px solid #64748B' : '3px solid var(--accent-primary)'
              }}
            >
              <div>
                {/* Header Tag */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {isStealth ? (
                      <span className="status-badge status-nda" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                        <Lock size={12} />
                        Enterprise Stealth / NDA
                      </span>
                    ) : (
                      <span className="status-badge status-verified" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                        <Globe size={12} />
                        Public Workstream
                      </span>
                    )}
                  </div>

                  <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    {proj.logCount} logged proofs
                  </span>
                </div>

                {/* Title & Description */}
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  {proj.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.55', marginBottom: '18px' }}>
                  {proj.description}
                </p>
              </div>

              {/* Bottom links and action */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '14px',
                borderTop: '1px solid var(--border-subtle)',
                marginTop: '10px'
              }}>
                <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', alignItems: 'center' }}>
                  {proj.liveUrl && (
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <span>Live Demo</span>
                      <ExternalLink size={12} />
                    </a>
                  )}
                  {proj.repoUrl && (
                    <a
                      href={proj.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <GitBranch size={12} />
                      <span>Repository</span>
                    </a>
                  )}
                  {isStealth && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Detail arsitektur disanitasi dari data rahasia
                    </span>
                  )}
                </div>

                {onFilterByProject && (
                  <button
                    type="button"
                    onClick={() => onFilterByProject(proj.id)}
                    style={{
                      background: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '4px 10px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      color: 'var(--text-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>Bukti Kerja</span>
                    <ArrowRight size={12} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

