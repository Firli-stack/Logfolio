import React from 'react';
import type { UserProfile } from '../mockData';
import { MapPin, Mail, FileDown, CheckCircle2, Award, Flame, Download } from 'lucide-react';


interface BentoHeroProps {
  profile: UserProfile;
  onContactClick: () => void;
  onPrintClick: () => void;
  onExportClick?: () => void;
}

export const BentoHero: React.FC<BentoHeroProps> = ({ profile, onContactClick, onPrintClick, onExportClick }) => {
  return (
    <div className="bento-hero-grid" style={{
      display: 'grid',
      gap: '16px',
      marginBottom: '28px'
    }}>
      {/* CARD 1: Identity & Elevator Pitch */}
      <div
        className="glass-panel bento-main-card"
        style={{
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(248,250,252,0.9))'
        }}
      >

        <div>
          {/* Availability Badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '18px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(5, 150, 105, 0.08)',
              border: '1px solid rgba(5, 150, 105, 0.25)',
              color: 'var(--accent-emerald)',
              fontSize: '0.78rem',
              fontWeight: 600,
              maxWidth: '100%',
              lineHeight: '1.4'
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-emerald)', display: 'inline-block', flexShrink: 0 }} />
              <span>Tersedia untuk Peran Senior / Staff Backend</span>
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
              <MapPin size={13} />
              {profile.location} · {profile.timezone}
            </div>
          </div>



          {/* Profile Details */}
          <div className="bento-avatar-row" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <img
              src={profile.avatarUrl}
              alt={profile.fullName}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                objectFit: 'cover',
                border: '2px solid #FFFFFF',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                flexShrink: 0
              }}
            />
            <div style={{ flex: '1 1 200px', minWidth: 0 }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)', lineHeight: '1.2', wordBreak: 'break-word' }}>
                {profile.fullName}
              </h1>
              <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent-primary)', marginTop: '4px', wordBreak: 'break-word' }}>
                {profile.headline}
              </p>
            </div>
          </div>


          {/* Key Value Bullets (Scannable untuk Rekruter) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '10px',
            marginTop: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              <CheckCircle2 size={16} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span style={{ wordBreak: 'break-word', flex: 1 }}><b>High Uptime:</b> Merancang sistem cloud dengan SLA 99.99%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              <CheckCircle2 size={16} color="var(--accent-cyan)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span style={{ wordBreak: 'break-word', flex: 1 }}><b>Fintech Core:</b> Spesialis payment gateway & idempotent flow</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              <CheckCircle2 size={16} color="var(--accent-emerald)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span style={{ wordBreak: 'break-word', flex: 1 }}><b>Performance First:</b> Optimasi latency DB & konkurensi Go</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              <CheckCircle2 size={16} color="var(--accent-amber)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span style={{ wordBreak: 'break-word', flex: 1 }}><b>Cloud Cost:</b> Efisiensi resource container hingga 70%</span>
            </div>
          </div>
        </div>


        {/* Action Button Bar */}
        <div className="no-print bento-action-btns" style={{ display: 'flex', gap: '10px', marginTop: '24px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={onContactClick}
            style={{
              background: 'var(--accent-primary)',
              color: '#fff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-glow)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Mail size={15} />
            Hubungi / Jadwalkan Diskusi
          </button>

          <button
            type="button"
            onClick={onPrintClick}
            style={{
              background: 'var(--bg-surface-elevated)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
              padding: '10px 18px',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <FileDown size={15} />
            Ekspor PDF Ringkasan
          </button>

          {onExportClick && (
            <button
              type="button"
              onClick={onExportClick}
              style={{
                background: 'var(--bg-surface-elevated)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                padding: '10px 18px',
                borderRadius: 'var(--radius-md)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Download size={15} />
              Ekspor Data (.md / .json)
            </button>
          )}
        </div>

      </div>

      {/* CARD 2: Verified Impact Metrics */}
      <div
        className="glass-panel bento-side-card"
        style={{
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.03), rgba(2, 132, 199, 0.04))'
        }}
      >

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Award size={16} color="var(--accent-amber)" />
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Rekapitulasi Dampak Teknis
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ padding: '10px 12px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>LATENCY OPTIMIZATION</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-primary)', marginTop: '2px' }}>
                450ms → 35ms
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>PostgreSQL aggregation queries</div>
            </div>

            <div style={{ padding: '10px 12px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>IMAGE CONTAINER SLIMMING</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-cyan)', marginTop: '2px' }}>
                1.2 GB → 24 MB
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Multi-stage Docker Alpine build</div>
            </div>

            <div style={{ padding: '10px 12px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>CONSISTENCY & STREAK</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-emerald)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Flame size={18} color="var(--accent-emerald)" />
                {profile.streakDays} Hari Aktif
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{profile.totalLogs} catatan rekayasa terverifikasi</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
