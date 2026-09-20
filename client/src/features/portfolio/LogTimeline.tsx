import React, { useState } from 'react';
import type { LogEntry, Project } from '../../types';
import { ThumbsUp, ExternalLink, CheckCheck, Lock, Search, X, Filter, ShieldCheck } from 'lucide-react';

interface LogTimelineProps {
  logs: LogEntry[];
  projects: Project[];
  onAddKudos: (logId: string) => void;
  initialSelectedProject?: string;
}

export const LogTimeline: React.FC<LogTimelineProps> = ({ logs, projects, onAddKudos, initialSelectedProject = 'all' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<string>(initialSelectedProject);
  const [selectedSkill, setSelectedSkill] = useState<string>('all');

  React.useEffect(() => {
    if (initialSelectedProject) {
      setSelectedProject(initialSelectedProject);
    }
  }, [initialSelectedProject]);

  const allSkills = Array.from(new Set(logs.flatMap(l => l.skills)));
  const filteredLogs = logs.filter(log => {
    const matchProj = selectedProject === 'all' || log.projectId === selectedProject;
    const matchSkill = selectedSkill === 'all' || log.skills.includes(selectedSkill);
    
    const query = searchQuery.trim().toLowerCase();
    const matchSearch =
      !query ||
      (log.title && log.title.toLowerCase().includes(query)) ||
      log.content.toLowerCase().includes(query) ||
      log.projectName.toLowerCase().includes(query) ||
      log.skills.some(s => s.toLowerCase().includes(query)) ||
      (log.details && log.details.some(d => d.toLowerCase().includes(query)));

    return matchProj && matchSkill && matchSearch;
  });

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedProject('all');
    setSelectedSkill('all');
  };

  const hasActiveFilters = searchQuery.trim() !== '' || selectedProject !== 'all' || selectedSkill !== 'all';

  return (
    <div style={{ marginBottom: '32px' }}>
      {}
      <div style={{
        background: 'var(--bg-surface)',
        padding: '16px 20px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-subtle)',
        marginBottom: '16px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Catatan Pengerjaan</span>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                background: 'rgba(79, 70, 229, 0.08)',
                color: 'var(--accent-primary)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)'
              }}>
                {filteredLogs.length} dari {logs.length}
              </span>
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Riwayat pemecahan masalah teknis dan progres arsitektur terverifikasi
            </p>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              style={{
                background: 'transparent',
                border: '1px dashed var(--border-medium)',
                color: 'var(--accent-danger)',
                fontSize: '0.74rem',
                fontWeight: 600,
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <X size={12} />
              Reset Filter
            </button>
          )}
        </div>

        {}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '12px' }}>
          {}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari solusi, stack, atau judul..."
              style={{
                width: '100%',
                padding: '7px 10px 7px 32px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-surface-elevated)',
                color: 'var(--text-primary)',
                fontSize: '0.8rem',
                outline: 'none'
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '8px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '2px'
                }}
              >
                <X size={13} />
              </button>
            )}
          </div>

          {}
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            style={{
              padding: '7px 10px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              fontSize: '0.8rem',
              outline: 'none'
            }}
          >
            <option value="all">Semua Proyek ({projects.length})</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.title} {p.isStealthNda ? '(NDA)' : ''}</option>
            ))}
          </select>

          {}
          <select
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            style={{
              padding: '7px 10px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              fontSize: '0.8rem',
              outline: 'none'
            }}
          >
            <option value="all">Semua Keahlian ({allSkills.length})</option>
            {allSkills.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {}
        {allSkills.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', paddingTop: '6px', borderTop: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Filter size={11} /> Filter Cepat:
            </span>
            <button
              type="button"
              onClick={() => setSelectedSkill('all')}
              style={{
                fontSize: '0.7rem',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                border: selectedSkill === 'all' ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                background: selectedSkill === 'all' ? 'rgba(79, 70, 229, 0.1)' : 'transparent',
                color: selectedSkill === 'all' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontWeight: selectedSkill === 'all' ? 700 : 500,
                cursor: 'pointer'
              }}
            >
              Semua
            </button>
            {allSkills.slice(0, 8).map(s => {
              const isSelected = selectedSkill === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedSkill(isSelected ? 'all' : s)}
                  style={{
                    fontSize: '0.7rem',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                    background: isSelected ? 'var(--accent-primary)' : 'transparent',
                    color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                    fontWeight: isSelected ? 600 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  #{s}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {}
      {filteredLogs.length === 0 && (
        <div className="glass-panel" style={{ padding: '36px 20px', textAlign: 'center', background: 'var(--bg-surface)' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'rgba(79, 70, 229, 0.08)',
            color: 'var(--accent-primary)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px'
          }}>
            <Search size={20} />
          </div>
          <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
            Tidak ada catatan yang sesuai
          </h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '380px', margin: '0 auto 14px auto' }}>
            {searchQuery ? `Tidak ada hasil untuk pencarian "${searchQuery}".` : 'Coba pilih proyek atau filter keahlian yang lain.'}
          </p>
          <button
            type="button"
            onClick={resetFilters}
            style={{
              padding: '6px 16px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--accent-primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Reset Semua Filter
          </button>
        </div>
      )}

      {}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredLogs.map(log => (
          <div
            key={log.id}
            className="glass-panel"
            style={{
              padding: '16px 20px',
              background: 'var(--bg-surface)'
            }}
          >
            {}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>{log.logDate}</span>
                <span style={{ color: 'var(--border-medium)' }}>·</span>
                <span style={{
                  fontWeight: 600,
                  color: log.isStealthNda ? '#B45309' : 'var(--accent-primary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  {log.isStealthNda && <Lock size={11} />}
                  {log.projectName}
                </span>
                {log.isStealthNda && (
                  <span
                    title="Catatan ini berada di bawah perlindungan kerahasiaan (NDA). Menyajikan solusi rekayasa dan indikator performa tanpa membuka informasi kepemilikan bisnis."
                    style={{
                      fontSize: '0.68rem',
                      background: '#FEF3C7',
                      color: '#92400E',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      fontWeight: 600,
                      cursor: 'help'
                    }}
                  >
                    NDA Protected
                  </span>
                )}
              </div>

              {}
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

            {}
            <h4 style={{
              fontSize: '0.98rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              margin: '0 0 6px 0',
              lineHeight: '1.4'
            }}>
              {log.title || log.content}
            </h4>

            {}
            {log.details && log.details.length > 0 && (
              <ul style={{
                margin: '6px 0 10px 18px',
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

            {}
            {log.imageUrls && log.imageUrls.length > 0 && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '8px 0 10px 0' }}>
                {log.imageUrls.map((imgSrc, imgIdx) => (
                  <a
                    key={imgIdx}
                    href={imgSrc}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'block',
                      width: '120px',
                      height: '75px',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      border: '1px solid var(--border-medium)',
                      background: 'var(--bg-surface-elevated)'
                    }}
                  >
                    <img
                      src={imgSrc}
                      alt={`Dokumentasi ${imgIdx + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </a>
                ))}
              </div>
            )}

            {}
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
                {log.skills.map(s => {
                  const isFiltered = selectedSkill === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSkill(isFiltered ? 'all' : s)}
                      title={`Filter catatan dengan keahlian #${s}`}
                      className="skill-badge"
                      style={{
                        fontSize: '0.7rem',
                        padding: '1px 6px',
                        cursor: 'pointer',
                        border: isFiltered ? '1px solid var(--accent-primary)' : undefined,
                        background: isFiltered ? 'rgba(79, 70, 229, 0.15)' : undefined,
                        color: isFiltered ? 'var(--accent-primary)' : undefined
                      }}
                    >
                      #{s}
                    </button>
                  );
                })}
              </div>

              {}
              {((log.proofLinks && log.proofLinks.length > 0) || log.proofUrl) && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  {log.isProofVerified && (
                    <span
                      title="Bukti telah diverifikasi aktif (HTTP 200) melalui SSRF-Safe Server Proxy"
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        color: 'var(--accent-cyan)',
                        background: 'rgba(6, 182, 212, 0.1)',
                        border: '1px solid rgba(6, 182, 212, 0.25)',
                        padding: '2px 7px',
                        borderRadius: 'var(--radius-full)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        letterSpacing: '0.02em',
                      }}
                    >
                      <ShieldCheck size={11} />
                      <span>Verified Proof</span>
                    </span>
                  )}

                  {log.proofLinks && log.proofLinks.length > 0 ? (
                    log.proofLinks.map((pl) => (
                      <a
                        key={pl.id || pl.url}
                        href={pl.url}
                        target="_blank"
                        rel="noreferrer"
                        title={`Buka ${pl.label} (Tautan terverifikasi aktif)`}
                        style={{
                          fontSize: '0.74rem',
                          color: 'var(--accent-primary)',
                          background: 'rgba(79, 70, 229, 0.06)',
                          border: '1px solid rgba(79, 70, 229, 0.18)',
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
                      title="Buka bukti pengerjaan resmi"
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--accent-primary)',
                        background: 'rgba(79, 70, 229, 0.06)',
                        border: '1px solid rgba(79, 70, 229, 0.18)',
                        padding: '2px 8px',
                        borderRadius: '4px',
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
