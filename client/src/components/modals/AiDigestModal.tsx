import React, { useState } from 'react';
import type { LogEntry, Project, UserProfile } from '../../types';
import { generateAiDigest, type DigestResult } from '../../utils/aiDigestEngine';
import { 
  Sparkles, 
  X, 
  Copy, 
  Check, 
  Share2, 
  Briefcase, 
  Calendar, 
  TrendingUp, 
  Code2, 
  FileText, 
  Flame,
  Languages,
  Zap,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

interface AiDigestModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  logs: LogEntry[];
  projects: Project[];
}

export const AiDigestModal: React.FC<AiDigestModalProps> = ({
  isOpen,
  onClose,
  profile,
  logs,
  projects,
}) => {
  const [outputLang, setOutputLang] = useState<'id' | 'en'>('en');
  const [timeframe, setTimeframe] = useState<'7days' | '30days' | 'all'>('7days');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'executive' | 'technical' | 'linkedin'>('executive');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const isEn = outputLang === 'en';
  const digest: DigestResult = generateAiDigest(profile, logs, projects, {
    timeframe,
    projectId: selectedProjectId,
    lang: outputLang,
  });

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  return (
    <div 
      className="no-print"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.72)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '760px',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--bg-surface)',
          animation: 'fadeIn 0.2s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-surface)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-cyan))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 2px 8px rgba(79, 70, 229, 0.3)',
            }}>
              <Zap size={18} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  AI Summary & Digest Generator
                </h3>
                <span style={{
                  fontSize: '0.68rem',
                  padding: '1px 6px',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(79, 70, 229, 0.1)',
                  color: 'var(--accent-primary)',
                  fontWeight: 700,
                }}>
                  SMART AI
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {}
        <div style={{
          padding: '10px 20px',
          background: 'var(--bg-surface-elevated)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
        }}>
          {}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={14} color="var(--text-muted)" />
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              {isEn ? 'Timeframe:' : 'Periode:'}
            </span>
            <div style={{ display: 'flex', gap: '2px', background: 'var(--bg-base)', padding: '2px', borderRadius: 'var(--radius-sm)' }}>
              <button
                type="button"
                onClick={() => setTimeframe('7days')}
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  cursor: 'pointer',
                  background: timeframe === '7days' ? 'var(--accent-primary)' : 'transparent',
                  color: timeframe === '7days' ? '#FFFFFF' : 'var(--text-muted)',
                  transition: 'all 0.15s ease',
                }}
              >
                {isEn ? '7 Days' : '7 Hari'}
              </button>
              <button
                type="button"
                onClick={() => setTimeframe('30days')}
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  cursor: 'pointer',
                  background: timeframe === '30days' ? 'var(--accent-primary)' : 'transparent',
                  color: timeframe === '30days' ? '#FFFFFF' : 'var(--text-muted)',
                  transition: 'all 0.15s ease',
                }}
              >
                {isEn ? '30 Days' : '30 Hari'}
              </button>
              <button
                type="button"
                onClick={() => setTimeframe('all')}
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  cursor: 'pointer',
                  background: timeframe === 'all' ? 'var(--accent-primary)' : 'transparent',
                  color: timeframe === 'all' ? '#FFFFFF' : 'var(--text-muted)',
                  transition: 'all 0.15s ease',
                }}
              >
                {isEn ? 'All Logs' : 'Semua'}
              </button>
            </div>
          </div>

          {}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Briefcase size={14} color="var(--text-muted)" />
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                style={{
                  fontSize: '0.76rem',
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-base)',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="all">{isEn ? 'All Projects' : 'Semua Proyek'}</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>

            {}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Languages size={14} color="var(--text-muted)" />
              <div style={{ display: 'flex', gap: '2px', background: 'var(--bg-base)', padding: '2px', borderRadius: 'var(--radius-sm)' }}>
                <button
                  type="button"
                  onClick={() => setOutputLang('en')}
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '3px 7px',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    cursor: 'pointer',
                    background: outputLang === 'en' ? 'var(--accent-primary)' : 'transparent',
                    color: outputLang === 'en' ? '#FFFFFF' : 'var(--text-muted)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  🇬🇧 EN
                </button>
                <button
                  type="button"
                  onClick={() => setOutputLang('id')}
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '3px 7px',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    cursor: 'pointer',
                    background: outputLang === 'id' ? 'var(--accent-primary)' : 'transparent',
                    color: outputLang === 'id' ? '#FFFFFF' : 'var(--text-muted)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  🇮🇩 ID
                </button>
              </div>
            </div>
          </div>
        </div>

        {}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '6px',
          padding: '10px 20px',
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          {}
          <button
            type="button"
            onClick={() => setActiveTab('executive')}
            style={{
              padding: '8px 10px',
              borderRadius: 'var(--radius-md)',
              border: activeTab === 'executive' ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
              background: activeTab === 'executive' ? 'rgba(79, 70, 229, 0.08)' : 'var(--bg-surface-elevated)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '2px',
              textAlign: 'left',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <TrendingUp size={14} color="var(--accent-primary)" />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: activeTab === 'executive' ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                1. Executive Pitch
              </span>
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {isEn ? 'For CV / Screening' : 'Untuk CV / Review Rekruter'}
            </span>
          </button>

          {}
          <button
            type="button"
            onClick={() => setActiveTab('technical')}
            style={{
              padding: '8px 10px',
              borderRadius: 'var(--radius-md)',
              border: activeTab === 'technical' ? '1.5px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
              background: activeTab === 'technical' ? 'rgba(2, 132, 199, 0.08)' : 'var(--bg-surface-elevated)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '2px',
              textAlign: 'left',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Code2 size={14} color="var(--accent-cyan)" />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: activeTab === 'technical' ? 'var(--accent-cyan)' : 'var(--text-primary)' }}>
                2. Tech Highlights ({digest.technicalHighlights.length})
              </span>
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {isEn ? 'Problem Solving Proof' : 'Bukti Solusi Masalah Nyata'}
            </span>
          </button>

          {}
          <button
            type="button"
            onClick={() => setActiveTab('linkedin')}
            style={{
              padding: '8px 10px',
              borderRadius: 'var(--radius-md)',
              border: activeTab === 'linkedin' ? '1.5px solid #0A66C2' : '1px solid var(--border-subtle)',
              background: activeTab === 'linkedin' ? 'rgba(10, 102, 194, 0.08)' : 'var(--bg-surface-elevated)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '2px',
              textAlign: 'left',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Share2 size={14} color="#0A66C2" />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: activeTab === 'linkedin' ? '#0A66C2' : 'var(--text-primary)' }}>
                3. Social / LinkedIn
              </span>
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {isEn ? 'Copy-paste for LinkedIn' : 'Siap Salin & Posting'}
            </span>
          </button>
        </div>

        {}
        <div style={{ padding: '18px 20px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {}
          {activeTab === 'executive' && (
            <>
              {}
              <div style={{
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-surface-elevated)',
                border: '1.5px solid var(--accent-primary)',
                overflow: 'hidden',
              }}>
                <div style={{
                  padding: '8px 14px',
                  background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.12), rgba(2, 132, 199, 0.08))',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={14} color="var(--accent-primary)" />
                    <span style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {isEn ? 'Executive Screening Pitch' : 'Elevator Pitch untuk Rekruter'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(digest.executivePitch, 'pitch')}
                    style={{
                      background: copiedKey === 'pitch' ? 'var(--accent-emerald)' : 'var(--accent-primary)',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      padding: '4px 10px',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {copiedKey === 'pitch' ? <Check size={13} /> : <Copy size={13} />}
                    {copiedKey === 'pitch' ? (isEn ? 'Copied!' : 'Tersalin!') : (isEn ? 'Copy Pitch' : 'Salin Pitch')}
                  </button>
                </div>
                <div style={{ padding: '16px' }}>
                  <p style={{ fontSize: '0.9rem', lineHeight: '1.65', color: 'var(--text-primary)', margin: 0 }}>
                    "{digest.executivePitch}"
                  </p>
                </div>
              </div>

              {}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '10px',
              }}>
                <div style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-base)',
                  border: '1px solid var(--border-subtle)',
                }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                    {isEn ? 'Logs Analyzed' : 'Log Terverifikasi'}
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                    ⚡ {digest.totalLogsAnalyzed}
                  </div>
                </div>

                <div style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-base)',
                  border: '1px solid var(--border-subtle)',
                }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                    {isEn ? 'Consistency' : 'Konsistensi'}
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-emerald)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Flame size={16} /> {profile.streakDays} {isEn ? 'Days' : 'Hari'}
                  </div>
                </div>

                <div style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-base)',
                  border: '1px solid var(--border-subtle)',
                }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                    {isEn ? 'Active Stacks' : 'Keahlian Aktif'}
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-primary)', marginTop: '2px' }}>
                    🎯 {digest.skillsFrequency.length}
                  </div>
                </div>
              </div>

              {}
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  {isEn ? 'Top Proven Skills in this Period:' : 'Keahlian yang Paling Banyak Dibuktikan:'}
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                  {digest.skillsFrequency.map((s) => (
                    <span
                      key={s.skill}
                      style={{
                        fontSize: '0.78rem',
                        padding: '4px 10px',
                        background: 'var(--bg-surface-elevated)',
                        borderRadius: 'var(--radius-full)',
                        border: '1px solid var(--border-subtle)',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                      }}
                    >
                      #{s.skill} <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>({s.count}x)</span>
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}

          {}
          {activeTab === 'technical' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {isEn ? 'Key problem-solving extracted from your log entries:' : 'Pencapaian penyelesaian masalah teknis dari catatan kerja Anda:'}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(digest.keyAchievements.join('\n'), 'achievements')}
                  style={{
                    background: copiedKey === 'achievements' ? 'var(--accent-emerald)' : 'var(--bg-surface)',
                    color: copiedKey === 'achievements' ? '#FFFFFF' : 'var(--text-primary)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '4px 10px',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  {copiedKey === 'achievements' ? <Check size={12} /> : <Copy size={12} />}
                  {copiedKey === 'achievements' ? (isEn ? 'Copied All!' : 'Tersalin Semua!') : (isEn ? 'Copy Bullet Points' : 'Salin Semua Poin')}
                </button>
              </div>

              {digest.technicalHighlights.map((th, index) => (
                <div
                  key={index}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderLeft: '4px solid var(--accent-cyan)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={15} color="var(--accent-cyan)" />
                      <h4 style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                        {th.title}
                      </h4>
                    </div>
                    {th.proofUrl && (
                      <a
                        href={th.proofUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          fontSize: '0.72rem',
                          color: 'var(--accent-cyan)',
                          textDecoration: 'none',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px',
                        }}
                      >
                        <ExternalLink size={12} />
                        {isEn ? 'Proof' : 'Bukti'}
                      </a>
                    )}
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: '4px 0 8px 0' }}>
                    {th.description}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {th.skills.map((sk) => (
                      <span
                        key={sk}
                        style={{
                          fontSize: '0.7rem',
                          padding: '1px 6px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'rgba(2, 132, 199, 0.08)',
                          color: 'var(--accent-cyan)',
                          fontWeight: 600,
                        }}
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {}
          {activeTab === 'linkedin' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {isEn ? 'Formatted social update ready to paste into LinkedIn:' : 'Draft update terformat siap ditempel langsung ke postingan LinkedIn:'}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(digest.socialPostDraft, 'social')}
                  style={{
                    background: copiedKey === 'social' ? 'var(--accent-emerald)' : '#0A66C2',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    padding: '6px 14px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {copiedKey === 'social' ? <Check size={14} /> : <Copy size={14} />}
                  {copiedKey === 'social' ? (isEn ? 'Copied to Clipboard!' : 'Berhasil Disalin!') : (isEn ? 'Copy Post Content' : 'Salin Draft Postingan')}
                </button>
              </div>

              <div
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-base)',
                  border: '1px solid var(--border-medium)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.84rem',
                  lineHeight: '1.65',
                  whiteSpace: 'pre-wrap',
                  color: 'var(--text-primary)',
                  maxHeight: '260px',
                  overflowY: 'auto',
                }}
              >
                {digest.socialPostDraft}
              </div>
            </div>
          )}

        </div>

        {}
        <div style={{
          padding: '12px 20px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-surface)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            <FileText size={13} />
            <span>{digest.scopeTitle} · {digest.totalLogsAnalyzed} {isEn ? 'logs analyzed' : 'log dianalisis'}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'var(--accent-primary)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              padding: '7px 18px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {isEn ? 'Close' : 'Tutup'}
          </button>
        </div>

      </div>
    </div>
  );
};
