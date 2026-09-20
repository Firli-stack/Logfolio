import React, { useState } from 'react';
import type { LogEntry } from '../../types';
import { Trash2, Lock, Edit3, Check, X, Star } from 'lucide-react';

interface ManageLogsProps {
  logs: LogEntry[];
  onDeleteLog: (logId: string) => void;
  onUpdateLog?: (logId: string, updates: { content?: string; proofUrl?: string; isFeatured?: boolean }) => void;
}

export const ManageLogsTable: React.FC<ManageLogsProps> = ({ logs, onDeleteLog, onUpdateLog }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editProofUrl, setEditProofUrl] = useState('');

  const startEdit = (log: LogEntry) => {
    setEditingId(log.id);
    setEditContent(log.content || log.title || '');
    setEditProofUrl(log.proofUrl || '');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent('');
    setEditProofUrl('');
  };

  const saveEdit = (logId: string) => {
    if (!editContent.trim()) return;
    if (onUpdateLog) {
      onUpdateLog(logId, {
        content: editContent.trim(),
        proofUrl: editProofUrl.trim(),
      });
    }
    setEditingId(null);
  };

  const toggleFeatured = (log: LogEntry) => {
    if (onUpdateLog) {
      onUpdateLog(log.id, {
        isFeatured: !log.isFeatured,
      });
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '20px', marginBottom: '28px', background: '#FFFFFF' }}>
      <div style={{ marginBottom: '14px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
          Daftar Catatan Tersimpan ({logs.length})
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
          Kelola, sunting teks, atur highlight unggulan, atau hapus entri catatan Anda
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {logs.map((log) => {
          const isEditing = editingId === log.id;
          return (
            <div
              key={log.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: isEditing ? 'flex-start' : 'center',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                background: isEditing ? 'var(--bg-surface)' : 'var(--bg-surface-elevated)',
                border: isEditing ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                flexWrap: 'wrap',
                gap: '12px',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ flex: '1 1 320px', minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  <span>{log.logDate}</span>
                  <span>·</span>
                  <span style={{ fontWeight: 600, color: log.isStealthNda ? 'var(--text-secondary)' : 'var(--accent-primary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    {log.isStealthNda && <Lock size={11} />}
                    {log.projectName}
                  </span>
                  {log.isFeatured && (
                    <span style={{
                      fontSize: '0.68rem',
                      padding: '1px 6px',
                      borderRadius: 'var(--radius-full)',
                      background: 'rgba(245, 158, 11, 0.15)',
                      color: '#D97706',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                    }}>
                      <Star size={10} fill="#D97706" />
                      Featured
                    </span>
                  )}
                </div>

                {isEditing ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '0.85rem',
                        color: 'var(--text-primary)',
                        background: '#FFFFFF',
                        resize: 'vertical',
                        boxSizing: 'border-box',
                      }}
                    />
                    <input
                      type="url"
                      placeholder="URL Bukti (Opsional): https://github.com/..."
                      value={editProofUrl}
                      onChange={(e) => setEditProofUrl(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '6px 10px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '0.8rem',
                        color: 'var(--text-primary)',
                        background: '#FFFFFF',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                ) : (
                  <>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px 0', lineHeight: 1.4 }}>
                      {log.content || log.title}
                    </h4>

                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {log.skills.map((s) => (
                        <span key={s} className="skill-badge" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={() => saveEdit(log.id)}
                      style={{
                        background: 'var(--accent-primary)',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Check size={13} />
                      <span>Simpan</span>
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      style={{
                        background: 'transparent',
                        color: 'var(--text-muted)',
                        border: '1px solid var(--border-subtle)',
                        padding: '6px 10px',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <X size={13} />
                      <span>Batal</span>
                    </button>
                  </>
                ) : (
                  <>
                    {onUpdateLog && (
                      <>
                        <button
                          type="button"
                          onClick={() => toggleFeatured(log)}
                          title={log.isFeatured ? 'Batalkan Featured' : 'Jadikan Highlight Unggulan'}
                          style={{
                            background: log.isFeatured ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                            color: log.isFeatured ? '#D97706' : 'var(--text-muted)',
                            border: '1px solid var(--border-subtle)',
                            padding: '6px 10px',
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <Star size={12} fill={log.isFeatured ? '#D97706' : 'none'} />
                        </button>
                        <button
                          type="button"
                          onClick={() => startEdit(log)}
                          title="Sunting catatan"
                          style={{
                            background: 'transparent',
                            color: 'var(--text-secondary)',
                            border: '1px solid var(--border-subtle)',
                            padding: '6px 10px',
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <Edit3 size={12} />
                          <span>Edit</span>
                        </button>
                      </>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Hapus catatan ini secara permanen?')) {
                          onDeleteLog(log.id);
                        }
                      }}
                      title="Hapus catatan"
                      style={{
                        background: 'none',
                        color: 'var(--accent-danger)',
                        border: '1px solid rgba(220, 38, 38, 0.2)',
                        padding: '6px 10px',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Trash2 size={12} />
                      <span>Hapus</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
