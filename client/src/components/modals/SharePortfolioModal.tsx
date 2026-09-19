import React, { useState, useEffect } from 'react';
import type { UserProfile } from '../../types';
import { 
  X, 
  Copy, 
  Check, 
  Share2, 
  Globe, 
  MessageCircle, 
  QrCode, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

// Custom SVG Icons for authentic branding
const LinkedInIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="#0A66C2" style={{ display: 'block' }}>
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c-.95 0-1.72-.77-1.72-1.72s.77-1.72 1.72-1.72 1.72.77 1.72 1.72-.77 1.72-1.72 1.72m1.4 9.74v-8.37H5.06v8.37h2.8z" />
  </svg>
);

const TwitterXIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'block' }}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

interface SharePortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
}

export const SharePortfolioModal: React.FC<SharePortfolioModalProps> = ({
  isOpen,
  onClose,
  profile,
}) => {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const publicUrl = `${window.location.origin}/p/${profile.username}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleShareLinkedIn = () => {
    const text = encodeURIComponent(`Lihat live portfolio & log rekayasa sistem saya di Logfolio:\n${publicUrl}`);
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(publicUrl)}&summary=${text}`;
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=600');
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(`Cek live engineering proof & portfolio saya karya ${profile.fullName} di @logfoliodev:\n${publicUrl}`);
    const url = `https://twitter.com/intent/tweet?text=${text}`;
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=500');
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`Halo! Silakan kunjungi portofolio rekayasa & riwayat proyek interaktif saya:\n${publicUrl}`);
    const url = `https://api.whatsapp.com/send?text=${text}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Google Chart API / QR Server fallback for instant clean QR rendering
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(publicUrl)}&margin=8`;

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div 
        className="modal-container glass-panel" 
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '520px',
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          color: 'var(--text-primary)'
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-surface-elevated)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-cyan))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)'
            }}>
              <Share2 size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Bagikan Portofolio Publik
              </h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Tautan publik langsung siap kirim ke rekruter & klien
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--text-primary)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-muted)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Status Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.08) 0%, rgba(16, 185, 129, 0.05) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            fontSize: '0.76rem',
            color: 'var(--accent-emerald)',
            fontWeight: 600
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-emerald)',
                boxShadow: '0 0 8px var(--accent-emerald)',
                display: 'inline-block'
              }} />
              <span>Akses Publik Aktif: Dapat dibuka tanpa login</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', opacity: 0.85 }}>
              <ShieldCheck size={14} />
              <span>Clean ATS Friendly</span>
            </div>
          </div>

          {/* Shareable Link Input Box */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: 'var(--text-secondary)',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}>
              URL Portofolio Interaktif
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '6px 8px 6px 14px',
              gap: '8px',
              transition: 'border-color 0.2s ease'
            }}>
              <Globe size={16} color="var(--accent-primary)" style={{ flexShrink: 0 }} />
              <input 
                type="text" 
                readOnly 
                value={publicUrl}
                aria-label="URL Portofolio Publik"
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  fontFamily: 'monospace',
                  userSelect: 'all'
                }}
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <button
                type="button"
                onClick={handleCopy}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-sm)',
                  background: copied ? 'var(--accent-emerald)' : 'var(--accent-primary)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  flexShrink: 0
                }}
              >
                {copied ? (
                  <>
                    <Check size={14} />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Salin URL</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Share Action Buttons */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: 'var(--text-secondary)',
              marginBottom: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}>
              Bagikan Langsung Ke Rekruter / Jejaring
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '10px'
            }}>
              {/* LinkedIn Share */}
              <button
                type="button"
                onClick={handleShareLinkedIn}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#0A66C2';
                  e.currentTarget.style.color = '#0A66C2';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
              >
                <LinkedInIcon />
                <span>LinkedIn</span>
              </button>

              {/* WhatsApp Share */}
              <button
                type="button"
                onClick={handleShareWhatsApp}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#25D366';
                  e.currentTarget.style.color = '#25D366';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
              >
                <MessageCircle size={15} color="#25D366" />
                <span>WhatsApp</span>
              </button>

              {/* Twitter / X Share */}
              <button
                type="button"
                onClick={handleShareTwitter}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-primary)';
                  e.currentTarget.style.color = 'var(--accent-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
              >
                <TwitterXIcon />
                <span>X (Twitter)</span>
              </button>
            </div>
          </div>

          {/* QR Code Toggle Section for In-Person / Mobile Interview */}
          <div style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '16px'
          }}>
            <button
              type="button"
              onClick={() => setShowQr(!showQr)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                background: showQr ? 'var(--bg-surface-elevated)' : 'transparent',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <QrCode size={16} color="var(--accent-primary)" />
                <span>QR Code untuk Scan di Mobile / Wawancara Offline</span>
              </div>
              <span style={{ fontSize: '0.74rem', color: 'var(--accent-primary)' }}>
                {showQr ? 'Sembunyikan' : 'Tampilkan QR'}
              </span>
            </button>

            {showQr && (
              <div style={{
                marginTop: '14px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px',
                background: 'var(--bg-surface-elevated)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                gap: '10px',
                animation: 'fadeIn 0.2s ease-out'
              }}>
                <div style={{
                  padding: '8px',
                  background: '#FFFFFF',
                  borderRadius: '10px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  display: 'inline-block'
                }}>
                  <img 
                    src={qrApiUrl} 
                    alt={`QR Code ${profile.fullName}`} 
                    width={160} 
                    height={160} 
                    style={{ display: 'block', borderRadius: '4px' }}
                  />
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Arahkan kamera smartphone rekruter untuk langsung membuka portofolio
                </span>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 24px',
          background: 'var(--bg-surface-elevated)',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <a
            href={`/p/${profile.username}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '0.76rem',
              color: 'var(--accent-primary)',
              textDecoration: 'none',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span>Buka di Tab Baru</span>
            <ExternalLink size={12} />
          </a>

          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '7px 16px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.78rem',
              cursor: 'pointer'
            }}
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
