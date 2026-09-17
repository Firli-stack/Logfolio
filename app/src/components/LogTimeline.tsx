import React, { useState } from 'react';
import type { LogEntry, Project } from '../mockData';
import { Lock, FolderGit2, Star, ThumbsUp, CheckCheck, ExternalLink } from 'lucide-react';

interface LogTimelineProps {
  logs: LogEntry[];
  projects: Project[];
  onAddKudos: (logId: string) => void;
}

export const LogTimeline: React.FC<LogTimelineProps> = ({ logs, projects, onAddKudos }) => {
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [selectedSkill, setSelectedSkill] = useState<string>('all');

  // Extract all unique skills
  const allSkills = Array.from(new Set(logs.flatMap(l => l.skills)));

  const filteredLogs = logs.filter(log => {
    const matchProj = selectedProject === 'all' || log.projectId === selectedProject;
    const matchSkill = selectedSkill === 'all' || log.skills.includes(selectedSkill);
    return matchProj && matchSkill;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Catatan Rekayasa Harian (Engineering Logbook)
          </h3>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            Rincian tantangan teknis, keputusan arsitektur, dan bukti penyelesaian harian ({filteredLogs.length} catatan)
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              fontSize: '0.8rem',
              outline: 'none'
            }}
          >
            <option value="all">Semua Proyek</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>

          <select
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              fontSize: '0.8rem',
              outline: 'none'
            }}
          >
            <option value="all">Semua Skill</option>
            {allSkills.map(s => (
              <option key={s} value={s}>#{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Timeline Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filteredLogs.map(log => (
          <div key={log.id} className="glass-panel" style={{ padding: '18px 20px', position: 'relative' }}>
            {/* Header info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  {log.logDate}
                </span>
                <span style={{ color: 'var(--border-medium)' }}>·</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: log.isStealthNda ? 'var(--text-secondary)' : 'var(--accent-primary)', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  {log.isStealthNda ? <Lock size={12} /> : <FolderGit2 size={12} />}
                  {log.projectName}
                </span>
                {log.isFeatured && (
                  <span className="status-badge status-featured" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Star size={11} fill="var(--accent-amber)" color="var(--accent-amber)" />
                    Featured
                  </span>
                )}
              </div>

              {/* Tombol Apresiasi (Pengganti Kudos) */}
              <button
                type="button"
                onClick={() => onAddKudos(log.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
              >
                <ThumbsUp size={12} />
                <span>Apresiasi</span>
                <b>{log.kudosCount}</b>
              </button>
            </div>


            {/* Content: Clear Headline + Scannable Technical Details */}
            <div style={{ marginBottom: '16px' }}>
              {/* Main Action Headline (Poin Utama) */}
              <h4 style={{
                fontSize: '1rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                lineHeight: '1.45',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px'
              }}>
                <span style={{ color: 'var(--accent-primary)', fontSize: '1.1rem', lineHeight: '1.3' }}>▸</span>
                <span>{log.title || log.content}</span>
              </h4>

              {/* Technical Context & Solution Details (Deskripsi & Bukti Konteks) */}
              {log.details && log.details.length > 0 ? (
                <div style={{
                  paddingLeft: '22px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  marginTop: '4px'
                }}>
                  {log.details.map((detail, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                      fontSize: '0.85rem',
                      color: 'var(--text-secondary)',
                      lineHeight: '1.5'
                    }}>
                      <span style={{ color: 'var(--border-medium)', fontSize: '0.9rem', lineHeight: '1.4' }}>•</span>
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              ) : (
                log.title && (
                  <p style={{
                    paddingLeft: '22px',
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                    lineHeight: '1.5',
                    marginTop: '4px'
                  }}>
                    {log.content}
                  </p>
                )
              )}
            </div>

            {/* Footer tags and Proof link */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {log.skills.map(s => (
                  <span key={s} className="skill-badge">#{s}</span>
                ))}
              </div>

              {/* Proof links (multiple supported) */}
              {((log.proofLinks && log.proofLinks.length > 0) || log.proofUrl) && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span className="status-badge status-verified" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCheck size={12} />
                    Verified Proof ({log.proofLinks?.length || 1})
                  </span>

                  {log.proofLinks && log.proofLinks.length > 0 ? (
                    log.proofLinks.map((pl) => (
                      <a
                        key={pl.id || pl.url}
                        href={pl.url}
                        target="_blank"
                        rel="noreferrer"
                        title={pl.url}
                        style={{
                          fontSize: '0.78rem',
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--accent-primary)',
                          background: 'rgba(79, 70, 229, 0.06)',
                          border: '1px solid rgba(79, 70, 229, 0.2)',
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-sm)',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <span>{pl.label || 'Tautan'}</span>
                        <ExternalLink size={10} />
                      </a>
                    ))
                  ) : (
                    <a
                      href={log.proofUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        fontSize: '0.8rem',
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--accent-cyan)',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <span>Inspect Proof</span>
                      <ExternalLink size={11} />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

