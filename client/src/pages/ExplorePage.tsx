import React, { useState, useEffect } from 'react';
import { Search, Users, ArrowRight, BookOpen, Layers, Sparkles } from 'lucide-react';
import { api, type ExploreProfileItem } from '../services/api';

interface ExplorePageProps {
  onSelectUser: (username: string) => void;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({ onSelectUser }) => {
  const [profiles, setProfiles] = useState<ExploreProfileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      const data = await api.getExploreProfiles();
      setProfiles(data);
      setLoading(false);
    };
    fetchProfiles();
  }, []);

  const filtered = profiles.filter(p => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      p.username.toLowerCase().includes(term) ||
      p.fullName.toLowerCase().includes(term) ||
      (p.headline && p.headline.toLowerCase().includes(term)) ||
      (p.bio && p.bio.toLowerCase().includes(term))
    );
  });

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px 0' }}>
      <div style={{
        textAlign: 'center',
        marginBottom: '32px',
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: 'var(--radius-full)',
          background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(2, 132, 199, 0.1))',
          border: '1px solid rgba(79, 70, 229, 0.25)',
          color: 'var(--accent-primary)',
          fontSize: '0.78rem',
          fontWeight: 700,
          marginBottom: '12px',
        }}>
          <Sparkles size={14} />
          <span>Komunitas Pengembang Logfolio</span>
        </div>

        <h1 style={{
          fontSize: '2rem',
          fontWeight: 800,
          color: 'var(--text-primary)',
          margin: '0 0 8px 0',
          letterSpacing: '-0.02em',
        }}>
          Jelajahi Portofolio Developer
        </h1>
        <p style={{
          fontSize: '0.92rem',
          color: 'var(--text-secondary)',
          maxWidth: '560px',
          margin: '0 auto 24px auto',
        }}>
          Temukan talenta software engineer dengan rekam jejak konsisten dan bukti pengerjaan teknis nyata.
        </p>

        <div style={{
          maxWidth: '460px',
          margin: '0 auto',
          position: 'relative',
        }}>
          <Search size={17} style={{
            position: 'absolute',
            left: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)',
          }} />
          <input
            type="text"
            placeholder="Cari berdasarkan nama, username, atau keahlian..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px 12px 42px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              fontSize: '0.88rem',
              outline: 'none',
              boxShadow: 'var(--shadow-subtle)',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
          <p>Memuat profil developer...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '48px 20px' }}>
          <Users size={32} color="var(--text-muted)" style={{ margin: '0 auto 12px auto' }} />
          <h3 style={{ margin: '0 0 6px 0', color: 'var(--text-primary)' }}>Tidak ada profil yang ditemukan</h3>
          <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            Coba gunakan kata kunci pencarian yang lain.
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px',
        }}>
          {filtered.map((item) => (
            <div
              key={item.username}
              className="glass-panel"
              style={{
                padding: '22px',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '16px',
                cursor: 'pointer',
                transition: 'transform 0.15s ease, border-color 0.15s ease',
              }}
              onClick={() => onSelectUser(item.username)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.borderColor = 'var(--accent-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <img
                    src={item.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${item.username}`}
                    alt={item.fullName}
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      objectFit: 'cover',
                      border: '1px solid var(--border-medium)',
                    }}
                  />
                  <div>
                    <h3 style={{ margin: '0 0 2px 0', fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {item.fullName}
                    </h3>
                    <span style={{ fontSize: '0.76rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                      @{item.username}
                    </span>
                  </div>
                </div>

                <p style={{
                  fontSize: '0.82rem',
                  color: 'var(--text-secondary)',
                  margin: '0 0 12px 0',
                  lineHeight: '1.4',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>
                  {item.headline || item.bio || 'Software Engineer di Logfolio'}
                </p>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  fontSize: '0.76rem',
                  color: 'var(--text-muted)',
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <BookOpen size={13} color="var(--accent-emerald)" />
                    <b>{item.totalLogs}</b> Catatan
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Layers size={13} color="var(--accent-cyan)" />
                    <b>{item.totalProjects}</b> Proyek
                  </span>
                </div>
              </div>

              <div style={{
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--accent-primary)', fontWeight: 700 }}>
                  Lihat Portofolio
                </span>
                <ArrowRight size={14} color="var(--accent-primary)" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
