import React from 'react';
import type { UserProfile } from '../mockData';
import { MapPin, Mail, FileDown, Download, CheckCircle2 } from 'lucide-react';

interface BentoHeroProps {
  profile: UserProfile;
  onContactClick: () => void;
  onPrintClick: () => void;
  onExportClick?: () => void;
}

export const BentoHero: React.FC<BentoHeroProps> = ({
  profile,
  onContactClick,
  onPrintClick,
  onExportClick
}) => {
  return (
    <div className="glass-panel" style={{ padding: '28px', marginBottom: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
        {/* Left: Avatar & Identity */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '18px', flexWrap: 'wrap', flex: '1 1 360px' }}>
          <img
            src={profile.avatarUrl}
            alt={profile.fullName}
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '16px',
              objectFit: 'cover',
              border: '2px solid #FFFFFF',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              flexShrink: 0
            }}
          />

          <div style={{ flex: 1, minWidth: '220px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
                {profile.fullName}
              </h1>
              <span style={{
                fontSize: '0.75rem',
                color: 'var(--accent-emerald)',
                background: 'rgba(5, 150, 105, 0.08)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 600
              }}>
                Siap Bekerja
              </span>
            </div>

            <p style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--accent-primary)', marginBottom: '8px' }}>
              {profile.headline}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <MapPin size={13} />
              <span>{profile.location}</span>
              <span>·</span>
              <span>{profile.timezone}</span>
            </div>
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="no-print" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            type="button"
            onClick={onContactClick}
            style={{
              background: 'var(--accent-primary)',
              color: '#FFFFFF',
              border: 'none',
              padding: '9px 16px',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Mail size={14} />
            Hubungi
          </button>

          <button
            type="button"
            onClick={onPrintClick}
            style={{
              background: 'var(--bg-surface-elevated)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
              padding: '9px 14px',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <FileDown size={14} />
            PDF Resume
          </button>

          {onExportClick && (
            <button
              type="button"
              onClick={onExportClick}
              style={{
                background: 'var(--bg-surface-elevated)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
                padding: '9px 14px',
                borderRadius: 'var(--radius-md)',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Download size={14} />
              Ekspor
            </button>
          )}
        </div>
      </div>

      {/* Ringkasan Singkat (Manusiawi) */}
      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginTop: '18px', maxWidth: '720px' }}>
        {profile.bio}
      </p>

      {/* Poin Keahlian Utama (Kata Kunci Ringkas Saja) */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          borderRadius: '6px',
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.8rem',
          color: 'var(--text-primary)'
        }}>
          <CheckCircle2 size={13} color="var(--accent-primary)" />
          High Availability & Uptime
        </span>

        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          borderRadius: '6px',
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.8rem',
          color: 'var(--text-primary)'
        }}>
          <CheckCircle2 size={13} color="var(--accent-primary)" />
          Payment Gateway
        </span>

        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          borderRadius: '6px',
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.8rem',
          color: 'var(--text-primary)'
        }}>
          <CheckCircle2 size={13} color="var(--accent-primary)" />
          Database Tuning
        </span>

        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          borderRadius: '6px',
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.8rem',
          color: 'var(--text-primary)'
        }}>
          <CheckCircle2 size={13} color="var(--accent-primary)" />
          Container & Cloud
        </span>
      </div>
    </div>
  );
};
