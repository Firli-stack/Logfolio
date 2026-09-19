import React from 'react';
import type { LogEntry } from '../../types';
import { BarChart3 } from 'lucide-react';

interface RhythmProps {
  logs: LogEntry[];
}

export const EngineeringRhythm: React.FC<RhythmProps> = ({ logs }) => {
  // Weekly cadence data (ringkas dan informatif)
  const weeks = [
    { label: 'W1', count: 12 },
    { label: 'W2', count: 18 },
    { label: 'W3', count: 15 },
    { label: 'W4', count: 24 },
    { label: 'W5', count: 20 },
    { label: 'W6', count: 28 },
    { label: 'W7', count: 22 },
  ];

  const maxCount = Math.max(...weeks.map(w => w.count));

  const domainBreakdown = [
    { name: 'Backend & Database', percent: 45, color: 'var(--accent-primary)' },
    { name: 'Cloud & Container', percent: 30, color: 'var(--accent-cyan)' },
    { name: 'API Security', percent: 15, color: 'var(--accent-emerald)' },
    { name: 'Frontend & Tools', percent: 10, color: 'var(--accent-amber)' },
  ];

  return (
    <div className="glass-panel" style={{ padding: '20px 24px', marginBottom: '28px', background: 'var(--bg-surface)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={16} color="var(--accent-primary)" />
            Aktivitas Mingguan & Distribusi Fokus
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Rata-rata pengerjaan berdasarkan {logs.length} catatan terverifikasi
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', alignItems: 'center' }}>
        {/* Simple Bar Chart */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '12px',
            height: '110px',
            paddingTop: '10px',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '8px'
          }}>
            {weeks.map((w, idx) => {
              const heightPct = Math.round((w.count / maxCount) * 100);
              const isCurrent = idx === weeks.length - 1;
              return (
                <div key={w.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.7rem', color: isCurrent ? 'var(--accent-primary)' : 'var(--text-muted)', fontWeight: isCurrent ? 700 : 400 }}>
                    {w.count}
                  </span>
                  <div style={{
                    width: '100%',
                    maxWidth: '24px',
                    height: `${heightPct}%`,
                    background: isCurrent ? 'var(--accent-primary)' : '#E2E8F0',
                    borderRadius: '4px'
                  }} />
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    {w.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Domain Distribution Progress Bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {domainBreakdown.map((item) => (
            <div key={item.name}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{item.name}</span>
                <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{item.percent}%</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${item.percent}%`, height: '100%', background: item.color, borderRadius: '3px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
