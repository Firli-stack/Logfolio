import React, { useState, useRef, useEffect } from 'react';
import type { Project } from '../../types';
import { X, FolderGit2, Shield, Globe, Plus } from 'lucide-react';
import { POPULAR_TECH_SUGGESTIONS } from '../../utils/techSuggestions';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (newProject: Project) => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onCreateProject
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isStealthNda, setIsStealthNda] = useState(false);
  const [techInput, setTechInput] = useState('');
  const [technologies, setTechnologies] = useState<string[]>(['TypeScript', 'React']);
  const [repoUrl, setRepoUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const suggestionBoxRef = useRef<HTMLDivElement | null>(null);

  // Filter recommendations based on user input
  const query = techInput.trim().toLowerCase().replace(/^#/, '');
  const suggestions = query
    ? POPULAR_TECH_SUGGESTIONS.filter(
        item =>
          item.toLowerCase().includes(query) &&
          !technologies.some(t => t.toLowerCase() === item.toLowerCase())
      ).slice(0, 8)
    : [];

  useEffect(() => {
    setHighlightedIndex(-1);
    if (query) {
      setShowSuggestions(true);
    }
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (suggestionBoxRef.current && !suggestionBoxRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addTechItem = (value: string) => {
    const clean = value.trim().replace(/^#/, '');
    if (!clean) return;
    if (!technologies.some(t => t.toLowerCase() === clean.toLowerCase())) {
      setTechnologies([...technologies, clean]);
    }
    setTechInput('');
    setShowSuggestions(false);
    setHighlightedIndex(-1);
  };

  const handleAddTech = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      if (suggestions.length > 0) {
        e.preventDefault();
        setHighlightedIndex(prev => (prev + 1) % suggestions.length);
      }
      return;
    }
    if (e.key === 'ArrowUp') {
      if (suggestions.length > 0) {
        e.preventDefault();
        setHighlightedIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
      }
      return;
    }
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      return;
    }
    if ((e.key === 'Enter' || e.key === ',') && (techInput.trim() || highlightedIndex >= 0)) {
      e.preventDefault();
      if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
        addTechItem(suggestions[highlightedIndex]);
      } else {
        addTechItem(techInput);
      }
    }
  };

  const handleRemoveTech = (tech: string) => {
    setTechnologies(technologies.filter(t => t !== tech));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      isStealthNda,
      technologies,
      repoUrl: repoUrl.trim() || undefined,
      liveUrl: liveUrl.trim() || undefined,
      status: 'in_progress',
      logCount: 0
    };

    onCreateProject(newProject);
    onClose();
    // Reset form
    setTitle('');
    setDescription('');
    setIsStealthNda(false);
    setRepoUrl('');
    setLiveUrl('');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '540px',
          background: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          padding: '28px',
          boxShadow: 'var(--shadow-xl)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(79, 70, 229, 0.1)',
              color: 'var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FolderGit2 size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Buat Wadah Proyek Baru
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Wadah payung untuk mengelompokkan catatan bukti kerja harian.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '4px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Judul Proyek */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
              Nama Wadah Proyek *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Payment Gateway Microservice, E-Commerce App"
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: 'var(--radius-md)',
                background: '#FFFFFF',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Deskripsi & Dampak */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
              Deskripsi Singkat & Target Dampak *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Arsitektur sistem dengan throughput 5k req/sec, enkripsi end-to-end, dan Redis multi-cluster."
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: 'var(--radius-md)',
                background: '#FFFFFF',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                outline: 'none',
                resize: 'none',
                lineHeight: '1.45'
              }}
            />
          </div>

          {/* NDA / Stealth Toggle */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 14px',
            borderRadius: 'var(--radius-md)',
            background: isStealthNda ? 'rgba(100, 116, 139, 0.08)' : '#F8FAFC',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {isStealthNda ? <Shield size={16} color="#475569" /> : <Globe size={16} color="var(--accent-primary)" />}
              <div>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block' }}>
                  {isStealthNda ? 'Proyek Stealth / Terikat NDA Klien' : 'Proyek Terbuka / Publik (Open Workstream)'}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {isStealthNda ? 'Nama klien disamarkan, aman memamerkan arsitektur tanpa melanggar kontrak.' : 'Repo dan URL demo dapat diakses bebas oleh rekruter.'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsStealthNda(!isStealthNda)}
              style={{
                padding: '4px 10px',
                fontSize: '0.75rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-subtle)',
                background: isStealthNda ? '#334155' : 'var(--bg-surface)',
                color: isStealthNda ? '#FFFFFF' : 'var(--text-secondary)',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {isStealthNda ? 'Stealth Aktif' : 'Publik'}
            </button>
          </div>

          {/* Tech Stack */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Teknologi / Stack Utama
              </label>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {technologies.length} dipilih (tidak terbatas)
              </span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center', marginBottom: '6px' }}>
              {technologies.map(t => (
                <span key={t} className="skill-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  #{t}
                  <button
                    type="button"
                    onClick={() => handleRemoveTech(t)}
                    title={`Hapus ${t}`}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--text-muted)' }}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}

              <div ref={suggestionBoxRef} style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => {
                    setTechInput(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => {
                    if (techInput.trim()) setShowSuggestions(true);
                  }}
                  onKeyDown={handleAddTech}
                  placeholder="+ Tambah Tech..."
                  style={{
                    padding: '4px 8px',
                    fontSize: '0.75rem',
                    border: '1px dashed var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    outline: 'none',
                    background: 'transparent',
                    width: '135px'
                  }}
                />

                {techInput.trim() && (
                  <button
                    type="button"
                    onClick={() => addTechItem(techInput)}
                    title="Tambah teknologi ini"
                    style={{
                      marginLeft: '4px',
                      padding: '3px 7px',
                      background: 'var(--accent-primary)',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '2px'
                    }}
                  >
                    <Plus size={11} /> Tambah
                  </button>
                )}

                {/* Suggestions Dropdown Popup */}
                {showSuggestions && suggestions.length > 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 4px)',
                      left: 0,
                      zIndex: 1000,
                      minWidth: '180px',
                      background: '#FFFFFF',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15), 0 8px 10px -6px rgba(0,0,0,0.1)',
                      border: '1px solid var(--border-medium)',
                      padding: '4px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px'
                    }}
                  >
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', padding: '4px 8px', fontWeight: 600, borderBottom: '1px solid var(--border-subtle)' }}>
                      Rekomendasi Cepat:
                    </div>
                    {suggestions.map((s, idx) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => addTechItem(s)}
                        onMouseEnter={() => setHighlightedIndex(idx)}
                        style={{
                          textAlign: 'left',
                          background: idx === highlightedIndex ? 'rgba(79, 70, 229, 0.08)' : 'transparent',
                          color: idx === highlightedIndex ? 'var(--accent-primary)' : 'var(--text-primary)',
                          border: 'none',
                          borderRadius: 'var(--radius-sm)',
                          padding: '6px 8px',
                          fontSize: '0.78rem',
                          fontWeight: idx === highlightedIndex ? 600 : 500,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <span>#{s}</span>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Pilih ↵</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Links (Optional) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Repo URL (Opsional)
              </label>
              <input
                type="url"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/..."
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.8rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Live Demo / Web URL (Opsional)
              </label>
              <input
                type="url"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                placeholder="https://..."
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.8rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                background: 'transparent',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Batal
            </button>
            <button
              type="submit"
              style={{
                padding: '8px 20px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--accent-primary)',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: 'var(--shadow-glow)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Plus size={15} />
              Simpan Proyek
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
