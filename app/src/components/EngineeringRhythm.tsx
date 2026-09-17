import React, { useState } from 'react';
import type { LogEntry } from '../mockData';
import { Activity, BarChart3, Target } from 'lucide-react';

interface RhythmProps {
  logs: LogEntry[];
}

export const EngineeringRhythm: React.FC<RhythmProps> = ({ logs }) => {
  const [activeMetricTab, setActiveMetricTab] = useState<'cadence' | 'domains'>('cadence');

  // Weekly activity cadence simulation based on current logs
  const weeks = [
    { label: 'W1 (Agt)', count: 12, impact: 'High DB Tune', focus: 'Database' },
    { label: 'W2 (Agt)', count: 18, impact: 'Kafka Consumer', focus: 'Infra' },
    { label: 'W3 (Agt)', count: 15, impact: 'Security Patch', focus: 'Security' },
    { label: 'W4 (Agt)', count: 24, impact: 'Engine Refactor', focus: 'Core Dev' },
    { label: 'W1 (Sep)', count: 20, impact: 'Redis Cache Layer', focus: 'Distributed' },
    { label: 'W2 (Sep)', count: 28, impact: 'SSRF & WebP Fix', focus: 'Security' },
    { label: 'W3 (Sep)', count: 22, impact: 'DB Latency 35ms', focus: 'Performance' },
  ];

  const maxCount = Math.max(...weeks.map(w => w.count));

  const domainBreakdown = [
    { name: 'Distributed Systems & DB', percent: 45, color: 'var(--accent-primary)', notes: 'PostgreSQL, Redis Cluster, Sharding' },
    { name: 'Cloud & Infrastructure', percent: 28, color: 'var(--accent-cyan)', notes: 'Docker Multi-stage, K8s, Autoscaling' },
    { name: 'API Security & Guardrails', percent: 17, color: 'var(--accent-emerald)', notes: 'SSRF Shield, AES-256, Idempotency' },
    { name: 'Frontend Engine & Tools', percent: 10, color: 'var(--accent-amber)', notes: 'TypeScript, WebP compression, React' },
  ];

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px', position: 'relative', overflow: 'hidden' }}>
      {/* Header section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '26px',
              height: '26px',
              borderRadius: '6px',
              background: 'rgba(79, 70, 229, 0.1)',
              color: 'var(--accent-primary)',
            }}>
              <Activity size={15} />
            </span>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
              Ritme Rekayasa & Fokus Teknis
            </h3>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            Konsistensi penyelesaian masalah mingguan dan proporsi fokus arsitektur berdasarkan {logs.length} bukti pengerjaan terverifikasi.
          </p>
        </div>

        {/* Tab switch */}
        <div style={{ display: 'flex', background: 'var(--bg-surface-elevated)', padding: '3px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
          <button
            type="button"
            onClick={() => setActiveMetricTab('cadence')}
            style={{
              padding: '5px 12px',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              background: activeMetricTab === 'cadence' ? 'var(--bg-surface)' : 'transparent',
              color: activeMetricTab === 'cadence' ? 'var(--accent-primary)' : 'var(--text-muted)',
              boxShadow: activeMetricTab === 'cadence' ? 'var(--shadow-subtle)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
            }}
          >
            <BarChart3 size={13} />
            Ritme Mingguan
          </button>
          <button
            type="button"
            onClick={() => setActiveMetricTab('domains')}
            style={{
              padding: '5px 12px',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              background: activeMetricTab === 'domains' ? 'var(--bg-surface)' : 'transparent',
              color: activeMetricTab === 'domains' ? 'var(--accent-primary)' : 'var(--text-muted)',
              boxShadow: activeMetricTab === 'domains' ? 'var(--shadow-subtle)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
            }}
          >
            <Target size={13} />
            Domain Fokus
          </button>
        </div>
      </div>

      {/* Cadence View */}
      {activeMetricTab === 'cadence' && (
        <div>
          <div style={{ overflowX: 'auto', paddingBottom: '8px' }}>
            <div
              className="weekly-cadence-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${weeks.length}, minmax(44px, 1fr))`,
                gap: '10px',
                alignItems: 'end',
                minHeight: '140px',
                paddingTop: '20px',
                paddingBottom: '10px',
                minWidth: '320px'
              }}
            >

            {weeks.map((w, idx) => {
              const heightPct = Math.round((w.count / maxCount) * 100);
              const isCurrent = idx === weeks.length - 1;
              return (
                <div key={w.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  {/* Tooltip-like badge */}
                  <span style={{
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)',
                    color: isCurrent ? 'var(--accent-primary)' : 'var(--text-muted)',
                    fontWeight: isCurrent ? 700 : 500
                  }}>
                    {w.count}h
                  </span>

                  {/* Bar container */}
                  <div style={{
                    width: '100%',
                    maxWidth: '42px',
                    height: '100px',
                    background: 'var(--bg-surface-elevated)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: '3px',
                    border: isCurrent ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)'
                  }}>
                    <div
                      style={{
                        width: '100%',
                        height: `${heightPct}%`,
                        borderRadius: '5px',
                        background: isCurrent 
                          ? 'linear-gradient(180deg, var(--accent-cyan), var(--accent-primary))'
                          : 'linear-gradient(180deg, #93C5FD, #4F46E5)',
                        opacity: isCurrent ? 1 : 0.75,
                        transition: 'height 0.4s ease'
                      }}
                      title={`${w.label}: ${w.count} jam rekayasa (${w.impact})`}
                    />
                  </div>

                  <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    {w.label}
                  </span>
                </div>
              );
            })}
            </div>
          </div>

          {/* Context banner under chart */}
          <div style={{
            marginTop: '16px',
            padding: '10px 14px',
            background: 'var(--bg-surface-elevated)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
            fontSize: '0.78rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>● Status: In-Flow Active</span>
              <span style={{ color: 'var(--text-muted)' }}>| Rata-rata 21 jam/minggu pemecahan masalah arsitektural</span>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              Zona Waktu: Asia/Jakarta (UTC+7)
            </span>
          </div>
        </div>
      )}

      {/* Domain Breakdown View */}
      {activeMetricTab === 'domains' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingTop: '8px' }}>
          {domainBreakdown.map((item) => (
            <div key={item.name}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({item.notes})</span>
                </div>
                <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: item.color }}>
                  {item.percent}%
                </span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--bg-surface-elevated)', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${item.percent}%`,
                    height: '100%',
                    background: item.color,
                    borderRadius: '4px',
                    transition: 'width 0.5s ease'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
