import React from 'react';
import type { UserProfile, Project } from '../mockData';

interface RecruiterSnapshotProps {
  profile: UserProfile;
  projects: Project[];
}

export const RecruiterSnapshot: React.FC<RecruiterSnapshotProps> = ({ profile, projects }) => {
  return (
    <div style={{ marginBottom: '36px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
        <span style={{ fontSize: '1.2rem' }}>⚡</span>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--text-primary)' }}>
          Recruiter Executive Snapshot (Screening 10-Detik)
        </h2>
      </div>

      {/* 3 Metrics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px',
        marginBottom: '20px'
      }}>
        {/* Card 1: Streak Consistency */}
        <div className="glass-panel" style={{ padding: '20px', borderLeft: '3px solid var(--accent-emerald)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
            Konsistensi Pembuktian
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🔥 {profile.streakDays} Hari
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {profile.totalLogs} total logbook bukti nyata terverifikasi.
          </div>
        </div>

        {/* Card 2: Top Skills */}
        <div className="glass-panel" style={{ padding: '20px', borderLeft: '3px solid var(--accent-primary)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
            Keahlian Paling Aktif Digunakan
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
            {profile.topSkills.map(s => (
              <span key={s.skill} className="skill-badge" style={{ fontSize: '0.8rem', padding: '4px 10px' }}>
                #{s.skill} <span style={{ color: 'var(--accent-primary)' }}>({s.count})</span>
              </span>
            ))}
          </div>
        </div>

        {/* Card 3: Key Highlights */}
        <div className="glass-panel" style={{ padding: '20px', borderLeft: '3px solid var(--accent-amber)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
            Pencapaian Teruji
          </div>
          <ul style={{ listStyle: 'none', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '6px' }}>
            <li>⭐ Optimasi Latency DB (450ms → 35ms)</li>
            <li>⭐ Multi-stage Docker terpangkas 70%</li>
            <li>⭐ Idempotent Payment Redis Cluster</li>
          </ul>
        </div>
      </div>

      {/* Projects Showcase Cards */}
      <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Wadah Proyek Aktif (Workstreams)
      </h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '16px'
      }}>
        {projects.map(proj => (
          <div key={proj.id} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {proj.title}
                </h4>
                {proj.isStealthNda ? (
                  <span className="status-badge status-stealth">🔒 Stealth NDA</span>
                ) : (
                  <span className="status-badge status-verified">🌐 Publik</span>
                )}
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: '1.5' }}>
                {proj.description}
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
              <span style={{ color: 'var(--text-muted)' }}>📊 {proj.logCount} progres tercatat</span>
              {proj.repoUrl && (
                <a 
                  href={proj.repoUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  style={{ color: 'var(--accent-cyan)', textDecoration: 'none', fontWeight: 500 }}
                >
                  Lihat Kode ↗
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
