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
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Micro-Logbook & Proof-of-Work
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Riwayat pengerjaan harian terverifikasi ({filteredLogs.length} catatan)
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


            {/* Content text: scannable bullet formatting */}
            <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: '1.6', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span style={{ color: 'var(--accent-primary)', fontSize: '1rem', lineHeight: '1.4' }}>▸</span>
                <span>{log.content}</span>
              </div>
            </div>

            {/* Footer tags and Proof link */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {log.skills.map(s => (
                  <span key={s} className="skill-badge">#{s}</span>
                ))}
              </div>

              {log.proofUrl && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="status-badge status-verified" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCheck size={12} />
                    Verified Proof
                  </span>
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
                    <span>Inspect</span>
                    <ExternalLink size={11} />
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

