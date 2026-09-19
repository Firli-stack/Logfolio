import React from 'react';
import type { Project } from '../../types';
import { ExternalLink, GitBranch, Lock } from 'lucide-react';

interface ShowcaseProps {
  projects: Project[];
  onFilterByProject?: (projectId: string) => void;
}

export const ProjectShowcase: React.FC<ShowcaseProps> = ({ projects, onFilterByProject }) => {
  return (
    <div style={{ marginBottom: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '14px' }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Proyek & Arsitektur
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Sistem dan aplikasi yang pernah dibangun
          </p>
        </div>
      </div>

      {}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px'
      }}>
        {projects.map((proj) => {
          const isStealth = proj.isStealthNda;
          return (
            <div
              key={proj.id}
              className="glass-panel"
              style={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: 'var(--bg-surface)'
              }}
            >
              <div>
                {}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: isStealth ? '#F1F5F9' : 'rgba(79, 70, 229, 0.08)',
                    color: isStealth ? '#475569' : 'var(--accent-primary)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    {isStealth && <Lock size={11} />}
                    {isStealth ? 'NDA Kantor' : 'Proyek Publik'}
                  </span>

                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {proj.logCount} catatan
                  </span>
                </div>

                <h3 style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  {proj.title}
                </h3>

                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '14px' }}>
                  {proj.description}
                </p>

                {}
                {proj.technologies && proj.technologies.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                    {proj.technologies.map(t => (
                      <span key={t} className="skill-badge" style={{ fontSize: '0.72rem', padding: '2px 7px' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '12px',
                borderTop: '1px solid var(--border-subtle)',
                fontSize: '0.8rem'
              }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  {proj.liveUrl && (
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                    >
                      <span>Demo</span>
                      <ExternalLink size={11} />
                    </a>
                  )}
                  {proj.repoUrl && (
                    <a
                      href={proj.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                    >
                      <GitBranch size={11} />
                      <span>Repo</span>
                    </a>
                  )}
                  {isStealth && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Klien dirahasiakan
                    </span>
                  )}
                </div>

                {onFilterByProject && (
                  <button
                    type="button"
                    onClick={() => onFilterByProject(proj.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--accent-primary)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    Lihat Catatan →
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
