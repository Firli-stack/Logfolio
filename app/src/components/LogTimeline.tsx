import React, { useState } from 'react';
import type { LogEntry, Project } from '../mockData';
import { ThumbsUp, ExternalLink, CheckCheck, Lock } from 'lucide-react';

interface LogTimelineProps {
  logs: LogEntry[];
  projects: Project[];
  onAddKudos: (logId: string) => void;
}

export const LogTimeline: React.FC<LogTimelineProps> = ({ logs, projects, onAddKudos }) => {
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [selectedSkill, setSelectedSkill] = useState<string>('all');

  const allSkills = Array.from(new Set(logs.flatMap(l => l.skills)));

  const filteredLogs = logs.filter(log => {
    const matchProj = selectedProject === 'all' || log.projectId === selectedProject;
    const matchSkill = selectedSkill === 'all' || log.skills.includes(selectedSkill);
    return matchProj && matchSkill;
  });

  return (
    <div style={{ marginBottom: '32px' }}>
      {/* Header & Filter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Catatan Pengerjaan
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Riwayat pemecahan masalah teknis ({filteredLogs.length} catatan)
          </p>
        </div>

        {/* Filter Dropdowns */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            style={{
              padding: '6px 10px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              fontSize: '0.78rem',
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
              padding: '6px 10px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              fontSize: '0.78rem',
              outline: 'none'
            }}
          >
            <option value="all">Semua Keahlian</option>
            {allSkills.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Daftar Catatan Bersih & Terbaca */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredLogs.map(log => (
          <div
            key={log.id}
            className="glass-panel"
            style={{
              padding: '16px 20px',
              background: '#FFFFFF'
            }}
          >
            {/* Header: Tanggal & Nama Proyek */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>{log.logDate}</span>
                <span style={{ color: 'var(--border-medium)' }}>·</span>
                <span style={{
                  fontWeight: 600,
                  color: log.isStealthNda ? 'var(--text-secondary)' : 'var(--accent-primary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  {log.isStealthNda && <Lock size={11} />}
                  {log.projectName}
                </span>
              </div>

              {/* Tombol Apresiasi Ringkas */}
              <button
                type="button"
                onClick={() => onAddKudos(log.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  padding: '3px 9px',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer',
                  fontSize: '0.74rem',
                  color: 'var(--text-secondary)'
                }}
              >
                <ThumbsUp size={11} />
                <span>Apresiasi</span>
                <b>{log.kudosCount}</b>
              </button>
            </div>

            {/* Judul Catatan Jelas (Tanpa simbol aneh) */}
            <h4 style={{
              fontSize: '0.98rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              margin: '0 0 6px 0',
              lineHeight: '1.4'
            }}>
              {log.title || log.content}
            </h4>

            {/* Poin-Poin Solusi Ringkas */}
            {log.details && log.details.length > 0 && (
              <ul style={{
                margin: '6px 0 12px 18px',
                padding: 0,
                fontSize: '0.84rem',
                color: 'var(--text-secondary)',
                lineHeight: '1.5'
              }}>
                {log.details.map((detail, idx) => (
                  <li key={idx} style={{ marginBottom: '3px' }}>
                    {detail}
                  </li>
                ))}
              </ul>
            )}

            {/* Footer: Tags & Bukti Kerja */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px',
              paddingTop: '8px',
              borderTop: '1px solid var(--border-subtle)',
              marginTop: '8px'
            }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {log.skills.map(s => (
                  <span key={s} className="skill-badge" style={{ fontSize: '0.7rem', padding: '1px 6px' }}>
                    {s}
                  </span>
                ))}
              </div>

              {/* Tautan Bukti */}
              {((log.proofLinks && log.proofLinks.length > 0) || log.proofUrl) && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  {log.proofLinks && log.proofLinks.length > 0 ? (
                    log.proofLinks.map((pl) => (
                      <a
                        key={pl.id || pl.url}
                        href={pl.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          fontSize: '0.74rem',
                          color: 'var(--accent-primary)',
                          background: 'rgba(79, 70, 229, 0.06)',
                          border: '1px solid rgba(79, 70, 229, 0.15)',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <CheckCheck size={11} color="var(--accent-emerald)" />
                        <span>{pl.label}</span>
                        <ExternalLink size={9} />
                      </a>
                    ))
                  ) : (
                    <a
                      href={log.proofUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--accent-primary)',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <CheckCheck size={11} color="var(--accent-emerald)" />
                      <span>Lihat Bukti</span>
                      <ExternalLink size={10} />
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
