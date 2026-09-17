import React from 'react';
import type { LogEntry } from '../mockData';
import { Trash2, Lock } from 'lucide-react';

interface ManageLogsProps {
  logs: LogEntry[];
  onDeleteLog: (logId: string) => void;
}

export const ManageLogsTable: React.FC<ManageLogsProps> = ({ logs, onDeleteLog }) => {
  return (
    <div className="glass-panel" style={{ padding: '20px', marginBottom: '28px', background: '#FFFFFF' }}>
      <div style={{ marginBottom: '14px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
          Daftar Catatan Tersimpan ({logs.length})
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
          Data tersimpan di browser Anda
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {logs.map((log) => (
          <div
            key={log.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              flexWrap: 'wrap',
              gap: '10px'
            }}
          >
            <div style={{ flex: '1 1 280px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '3px' }}>
                <span>{log.logDate}</span>
                <span>·</span>
                <span style={{ fontWeight: 600, color: log.isStealthNda ? 'var(--text-secondary)' : 'var(--accent-primary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  {log.isStealthNda && <Lock size={11} />}
                  {log.projectName}
                </span>
              </div>

              <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 3px 0' }}>
                {log.title || log.content}
              </h4>

              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {log.skills.map(s => (
                  <span key={s} className="skill-badge" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (window.confirm('Hapus catatan ini?')) {
                  onDeleteLog(log.id);
                }
              }}
              style={{
                background: 'none',
                color: 'var(--accent-danger)',
                border: '1px solid rgba(220, 38, 38, 0.2)',
                padding: '5px 10px',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Trash2 size={12} />
              <span>Hapus</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
