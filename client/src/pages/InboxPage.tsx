import React, { useState } from 'react';
import type { RecruiterMessage } from '../types';
import { Mail, Clock, Send, ChevronDown, ChevronUp, Inbox, Search, ShieldCheck, CheckCheck, Archive } from 'lucide-react';

interface InboxPageProps {
  messages: RecruiterMessage[];
  candidateUsername: string;
  onUpdateMessageStatus?: (id: string, status: 'unread' | 'replied' | 'archived' | 'starred') => void;
}

export const InboxPage: React.FC<InboxPageProps> = ({
  messages,
  candidateUsername,
  onUpdateMessageStatus,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'replied' | 'archived'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(messages[0]?.id || null);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const filteredMessages = messages.filter((msg) => {
    const status = msg.status || 'unread';
    if (activeFilter === 'unread' && status !== 'unread') return false;
    if (activeFilter === 'replied' && status !== 'replied') return false;
    if (activeFilter === 'archived' && status !== 'archived') return false;

    const q = searchQuery.toLowerCase();
    return (
      msg.recruiterName.toLowerCase().includes(q) ||
      msg.recruiterEmail.toLowerCase().includes(q) ||
      msg.message.toLowerCase().includes(q)
    );
  });

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
    <main style={{ maxWidth: '980px', margin: '0 auto', width: '100%' }}>
      <div className="glass-panel" style={{ padding: '28px', marginBottom: '24px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '20px',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '18px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.15), rgba(2, 132, 199, 0.15))',
              color: 'var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.1)',
            }}>
              <Inbox size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                Inbox Pesan Rekruter
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                Pesan masuk eksklusif dari calon perekrut melalui sistem Masked Contact Relay @{candidateUsername}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '0.78rem',
              padding: '5px 12px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(16, 185, 129, 0.12)',
              color: 'var(--accent-emerald)',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <ShieldCheck size={14} />
              Honeypot + Relay Aman
            </span>
            <span style={{
              fontSize: '0.78rem',
              padding: '5px 12px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              fontWeight: 700,
            }}>
              {messages.length} Total Pesan
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {(['all', 'unread', 'replied', 'archived'] as const).map((filter) => {
            const labels = {
              all: 'Semua Pesan',
              unread: 'Belum Dibalas',
              replied: 'Sudah Dibalas',
              archived: 'Diarsipkan',
            };
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-subtle)',
                  background: isActive ? 'var(--accent-primary)' : 'var(--bg-surface)',
                  color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {labels[filter]}
              </button>
            );
          })}
        </div>

        {messages.length > 0 && (
          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Cari nama, email, atau isi pesan rekruter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px 10px 38px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
        )}

        {messages.length === 0 ? (
          <div style={{
            padding: '48px 20px',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '0.9rem',
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--bg-surface-elevated)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              color: 'var(--text-muted)',
            }}>
              <Mail size={32} />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px' }}>
              Belum Ada Pesan Masuk
            </h3>
            <p style={{ margin: 0, maxWidth: '440px', marginLeft: 'auto', marginRight: 'auto', lineHeight: '1.5', fontSize: '0.82rem' }}>
              Saat calon perekrut atau kolaborator mengirim pesan melalui tombol <b>"Hubungi Kandidat"</b> di portofolio publik Anda, pesan dan email mereka akan terarsip di sini secara aman.
            </p>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div style={{
            padding: '36px 16px',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '0.85rem',
          }}>
            Tidak ditemukan pesan yang cocok dengan filter aktif.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredMessages.map((item) => {
              const isExpanded = expandedId === item.id;
              const msgStatus = item.status || 'unread';
              return (
                <div
                  key={item.id}
                  style={{
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    background: isExpanded ? 'var(--bg-surface-elevated)' : 'var(--bg-surface)',
                    boxShadow: isExpanded ? '0 4px 14px rgba(0,0,0,0.04)' : 'none',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div
                    onClick={() => toggleExpand(item.id)}
                    style={{
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      userSelect: 'none',
                      gap: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.12), rgba(2, 132, 199, 0.12))',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        color: 'var(--accent-primary)',
                        flexShrink: 0,
                      }}>
                        {item.recruiterName.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{
                          fontSize: '0.92rem',
                          fontWeight: 700,
                          color: 'var(--text-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          flexWrap: 'wrap',
                        }}>
                          <span>{item.recruiterName}</span>
                          <span style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-muted)' }}>
                            &lt;{item.recruiterEmail}&gt;
                          </span>
                          {msgStatus === 'replied' && (
                            <span style={{
                              fontSize: '0.7rem',
                              padding: '2px 8px',
                              borderRadius: 'var(--radius-full)',
                              background: 'rgba(16, 185, 129, 0.12)',
                              color: 'var(--accent-emerald)',
                              fontWeight: 600,
                            }}>
                              Sudah Dibalas
                            </span>
                          )}
                          {msgStatus === 'archived' && (
                            <span style={{
                              fontSize: '0.7rem',
                              padding: '2px 8px',
                              borderRadius: 'var(--radius-full)',
                              background: 'var(--bg-surface-elevated)',
                              border: '1px solid var(--border-subtle)',
                              color: 'var(--text-muted)',
                              fontWeight: 600,
                            }}>
                              Diarsipkan
                            </span>
                          )}
                        </div>
                        {!isExpanded && (
                          <p style={{
                            fontSize: '0.8rem',
                            color: 'var(--text-secondary)',
                            margin: '3px 0 0',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '520px',
                          }}>
                            {item.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
                      <span style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontWeight: 500,
                      }}>
                        <Clock size={13} />
                        {formatDate(item.createdAt)}
                      </span>
                      {isExpanded ? <ChevronUp size={18} color="var(--text-muted)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div style={{
                      padding: '0 20px 20px 72px',
                      borderTop: '1px solid var(--border-subtle)',
                      marginTop: '4px',
                      paddingTop: '16px',
                    }}>
                      <div style={{
                        fontSize: '0.88rem',
                        lineHeight: '1.65',
                        color: 'var(--text-primary)',
                        whiteSpace: 'pre-wrap',
                        background: 'rgba(0, 0, 0, 0.025)',
                        padding: '16px 18px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        marginBottom: '14px',
                      }}>
                        {item.message}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <a
                            href={`mailto:${encodeURIComponent(item.recruiterEmail)}?subject=${encodeURIComponent(`Re: Respon Portofolio Logfolio - ${candidateUsername}`)}`}
                            onClick={() => {
                              if (onUpdateMessageStatus && msgStatus === 'unread') {
                                onUpdateMessageStatus(item.id, 'replied');
                              }
                            }}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '8px 16px',
                              borderRadius: 'var(--radius-md)',
                              background: 'var(--accent-primary)',
                              color: '#FFFFFF',
                              fontSize: '0.82rem',
                              fontWeight: 600,
                              textDecoration: 'none',
                              boxShadow: '0 2px 6px rgba(79, 70, 229, 0.25)',
                            }}
                          >
                            <Send size={14} />
                            Balas via Email Langsung
                          </a>

                          {onUpdateMessageStatus && msgStatus !== 'replied' && (
                            <button
                              type="button"
                              onClick={() => onUpdateMessageStatus(item.id, 'replied')}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '8px 14px',
                                borderRadius: 'var(--radius-md)',
                                background: 'transparent',
                                border: '1px solid var(--border-subtle)',
                                color: 'var(--accent-emerald)',
                                fontSize: '0.78rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                              }}
                            >
                              <CheckCheck size={14} />
                              Tandai Dibalas
                            </button>
                          )}
                        </div>

                        {onUpdateMessageStatus && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button
                              type="button"
                              onClick={() => onUpdateMessageStatus(item.id, msgStatus === 'archived' ? 'unread' : 'archived')}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '6px 12px',
                                borderRadius: 'var(--radius-md)',
                                background: 'transparent',
                                border: '1px solid var(--border-subtle)',
                                color: 'var(--text-secondary)',
                                fontSize: '0.75rem',
                                fontWeight: 500,
                                cursor: 'pointer',
                              }}
                            >
                              <Archive size={13} />
                              {msgStatus === 'archived' ? 'Keluarkan dari Arsip' : 'Arsipkan'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};
