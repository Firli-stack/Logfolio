import React from 'react';
import type { LogEntry } from '../mockData';
import { Trash2, CheckCircle2, Lock, FolderGit2, Star, Calendar } from 'lucide-react';

interface ManageLogsProps {
  logs: LogEntry[];
  onDeleteLog: (logId: string) => void;
}

export const ManageLogsTable: React.FC<ManageLogsProps> = ({ logs, onDeleteLog }) => {
  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Daftar Catatan Tersimpan ({logs.length})
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Catatan tersimpan otomatis di penyimpanan lokal browser Anda (LocalStorage).
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {logs.map((log) => (
          <div
            key={log.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <div style={{ flex: '1 1 300px', minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={12} />
                  {log.logDate}
                </span>
                <span style={{ color: 'var(--border-medium)' }}>·</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: log.isStealthNda ? 'var(--text-secondary)' : 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {log.isStealthNda ? <Lock size={12} /> : <FolderGit2 size={12} />}
                  {log.projectName}
                </span>
                {log.isFeatured && (
                  <span className="status-badge status-featured" style={{ fontSize: '0.68rem', padding: '2px 6px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Star size={10} fill="var(--accent-amber)" />
                    Featured
                  </span>
                )}
                {log.isProofVerified && (
                  <span className="status-badge status-verified" style={{ fontSize: '0.68rem', padding: '2px 6px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <CheckCircle2 size={10} />
                    Verified
                  </span>
                )}
              </div>

              {log.title && (
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {log.title}
                </h4>
              )}

              <p style={{ fontSize: '0.82rem', color: log.title ? 'var(--text-secondary)' : 'var(--text-primary)', lineHeight: '1.45', wordBreak: 'break-word' }}>
                {log.content}
              </p>

              <div style={{ display: 'flex', gap: '4px', marginTop: '6px', flexWrap: 'wrap' }}>
                {log.skills.map(s => (
                  <span key={s} className="skill-badge" style={{ fontSize: '0.7rem', padding: '2px 6px' }}>
                    #{s}
                  </span>
                ))}
              </div>
            </div>

            {/* Tombol Aksi Hapus */}
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Yakin ingin menghapus catatan bukti kerja ini?')) {
                  onDeleteLog(log.id);
                }
              }}
              title="Hapus Log"
              style={{
                background: 'rgba(220, 38, 38, 0.08)',
                color: 'var(--accent-danger)',
                border: '1px solid rgba(220, 38, 38, 0.2)',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.15s ease'
              }}
            >
              <Trash2 size={13} />
              <span>Hapus</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
