import React, { useState } from 'react';
import type { RecruiterMessage } from '../../types';
import { Mail, Clock, Send, ChevronDown, ChevronUp, UserCheck, Inbox } from 'lucide-react';

interface RecruiterInboxCardProps {
  messages: RecruiterMessage[];
  candidateUsername: string;
}

export const RecruiterInboxCard: React.FC<RecruiterInboxCardProps> = ({
  messages,
  candidateUsername,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(messages[0]?.id || null);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '20px',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '14px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'rgba(79, 70, 229, 0.12)',
            color: 'var(--accent-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Inbox size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Inbox Pesan Rekruter ({messages.length})
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
              Pesan yang dikirim oleh rekruter melalui Masked Contact Relay di profil @{candidateUsername}
            </p>
          </div>
        </div>

        {messages.length > 0 && (
          <span style={{
            fontSize: '0.75rem',
            padding: '3px 10px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(16, 185, 129, 0.1)',
            color: 'var(--accent-emerald)',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
          }}>
            <UserCheck size={13} />
            Relay Aktif
          </span>
        )}
      </div>

      {messages.length === 0 ? (
        <div style={{
          padding: '32px 16px',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.85rem',
        }}>
          <Mail size={32} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
          <p style={{ margin: 0 }}>Belum ada pesan rekruter yang masuk.</p>
          <p style={{ fontSize: '0.75rem', marginTop: '4px', opacity: 0.8 }}>
            Saat calon perekrut mengisi form kontak di halaman publik Anda, pesan mereka akan muncul di sini.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {messages.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                style={{
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  background: isExpanded ? 'var(--bg-surface-elevated)' : 'var(--bg-surface)',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                }}
              >
                <div
                  onClick={() => toggleExpand(item.id)}
                  style={{
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    userSelect: 'none',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      color: 'var(--accent-primary)',
                      flexShrink: 0,
                    }}>
                      {item.recruiterName.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{
                        fontSize: '0.88rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        flexWrap: 'wrap',
                      }}>
                        <span>{item.recruiterName}</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-muted)' }}>
                          &lt;{item.recruiterEmail}&gt;
                        </span>
                      </div>
                      {!isExpanded && (
                        <p style={{
                          fontSize: '0.78rem',
                          color: 'var(--text-secondary)',
                          margin: '2px 0 0',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '450px',
                        }}>
                          {item.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                    <span style={{
                      fontSize: '0.72rem',
                      color: 'var(--text-muted)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}>
                      <Clock size={12} />
                      {formatDate(item.createdAt)}
                    </span>
                    {isExpanded ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
                  </div>
                </div>

                {isExpanded && (
                  <div style={{
                    padding: '0 18px 16px 62px',
                    borderTop: '1px solid var(--border-subtle)',
                    marginTop: '4px',
                    paddingTop: '14px',
                  }}>
                    <div style={{
                      fontSize: '0.85rem',
                      lineHeight: '1.6',
                      color: 'var(--text-primary)',
                      whiteSpace: 'pre-wrap',
                      background: 'rgba(0, 0, 0, 0.03)',
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-subtle)',
                      marginBottom: '12px',
                    }}>
                      {item.message}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <a
                        href={`mailto:${encodeURIComponent(item.recruiterEmail)}?subject=${encodeURIComponent(`Re: Respon Portofolio Logfolio - ${candidateUsername}`)}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 14px',
                          borderRadius: 'var(--radius-md)',
                          background: 'var(--accent-primary)',
                          color: '#FFFFFF',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          textDecoration: 'none',
                        }}
                      >
                        <Send size={13} />
                        Balas via Email Langsung
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
