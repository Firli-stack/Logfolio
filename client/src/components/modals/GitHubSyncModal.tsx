import React, { useState, useEffect } from 'react';
import { 
  X, 
  GitBranch, 
  RefreshCw, 
  ExternalLink, 
  Sparkles, 
  ArrowRight,
  Check,
  Tag
} from 'lucide-react';
import { fetchGitHubCommits, type GitHubCommitItem } from '../../services/githubService';

interface GitHubSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultUsername: string;
  onSelectCommit: (commit: GitHubCommitItem) => void;
}

export const GitHubSyncModal: React.FC<GitHubSyncModalProps> = ({
  isOpen,
  onClose,
  defaultUsername,
  onSelectCommit
}) => {
  const [username, setUsername] = useState(defaultUsername || 'Firli-stack');
  const [commits, setCommits] = useState<GitHubCommitItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [importedId, setImportedId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const u = defaultUsername || 'Firli-stack';
      setUsername(u);
      loadCommits(u);
    }
  }, [isOpen, defaultUsername]);

  if (!isOpen) return null;

  const loadCommits = async (targetUser: string) => {
    setIsLoading(true);
    const results = await fetchGitHubCommits(targetUser);
    setCommits(results);
    setIsLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      loadCommits(username.trim());
    }
  };

  const handleImport = (commit: GitHubCommitItem) => {
    setImportedId(commit.id);
    onSelectCommit(commit);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

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
          maxWidth: '640px',
          maxHeight: '85vh',
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
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 22px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-surface-elevated)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #24292e, #0f172a)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}>
              <GitBranch size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.02rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Tarik Aktivitas Commit GitHub
              </h3>
              <p style={{ margin: 0, fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                Ubah commit real-time menjadi entri log portofolio terverifikasi
              </p>
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
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--border-subtle)' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username GitHub (misal: Firli-stack)"
              style={{
                flex: 1,
                padding: '9px 12px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontSize: '0.84rem',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              disabled={isLoading}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 16px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--accent-primary)',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              <RefreshCw size={14} className={isLoading ? 'spin' : ''} />
              <span>{isLoading ? 'Menarik...' : 'Tarik'}</span>
            </button>
          </form>
        </div>

        <div style={{
          padding: '16px 22px',
          overflowY: 'auto',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {isLoading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.84rem' }}>
              <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite', marginBottom: '8px' }} />
              <div>Menghubungkan ke GitHub API...</div>
            </div>
          ) : commits.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.84rem' }}>
              Tidak ada aktivitas commit publik ditemukan untuk akun ini.
            </div>
          ) : (
            commits.map((commit) => {
              const isImported = importedId === commit.id;
              return (
                <div
                  key={commit.id}
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    transition: 'border-color 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{
                        fontSize: '0.72rem',
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: 'rgba(79, 70, 229, 0.1)',
                        color: 'var(--accent-primary)'
                      }}>
                        {commit.shortSha}
                      </span>
                      <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                        {commit.repoName}
                      </span>
                    </div>

                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {formatDate(commit.date)}
                    </span>
                  </div>

                  <p style={{
                    margin: 0,
                    fontSize: '0.84rem',
                    color: 'var(--text-primary)',
                    fontWeight: 600,
                    lineHeight: '1.4'
                  }}>
                    {commit.message}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {commit.detectedSkills.map((sk) => (
                        <span
                          key={sk}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px',
                            fontSize: '0.68rem',
                            padding: '1px 6px',
                            borderRadius: 'var(--radius-full)',
                            background: 'var(--bg-surface)',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--text-secondary)'
                          }}
                        >
                          <Tag size={10} />
                          {sk}
                        </span>
                      ))}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <a
                        href={commit.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: '0.74rem',
                          color: 'var(--text-muted)',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}
                      >
                        <span>GitHub</span>
                        <ExternalLink size={11} />
                      </a>

                      <button
                        type="button"
                        onClick={() => handleImport(commit)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '6px 12px',
                          borderRadius: 'var(--radius-sm)',
                          background: isImported ? 'var(--accent-emerald)' : 'var(--accent-primary)',
                          color: '#FFFFFF',
                          border: 'none',
                          fontWeight: 700,
                          fontSize: '0.74rem',
                          cursor: 'pointer'
                        }}
                      >
                        {isImported ? (
                          <>
                            <Check size={12} />
                            <span>Dimuat!</span>
                          </>
                        ) : (
                          <>
                            <Sparkles size={12} />
                            <span>Jadikan Log</span>
                            <ArrowRight size={11} />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div style={{
          padding: '12px 22px',
          background: 'var(--bg-surface-elevated)',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.74rem',
          color: 'var(--text-muted)'
        }}>
          <span>Commit terverifikasi otomatis menyertakan GitHub Proof Link</span>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '0.74rem'
            }}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
