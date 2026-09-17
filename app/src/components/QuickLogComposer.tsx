import React, { useState } from 'react';
import type { Project, LogEntry, ProofLink } from '../mockData';
import { Zap, Lock, Image as ImageIcon, Star, Send, X, Plus, FolderPlus, Link as LinkIcon } from 'lucide-react';

interface QuickLogComposerProps {
  projects: Project[];
  onAddLog: (log: LogEntry) => void;
  onOpenCreateProject?: () => void;
}

export const QuickLogComposer: React.FC<QuickLogComposerProps> = ({
  projects,
  onAddLog,
  onOpenCreateProject
}) => {
  const [content, setContent] = useState('');
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>(['PostgreSQL', 'Performance']);
  const [proofLinks, setProofLinks] = useState<{ id: string; url: string; label: string }[]>([
    { id: '1', url: '', label: 'GitHub PR / Commit' }
  ]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isStealth, setIsStealth] = useState(false);
  const [isCompressingImage, setIsCompressingImage] = useState(false);
  const [imageBadge, setImageBadge] = useState<string | null>(null);

  const MAX_CHAR = 300;

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = skillInput.trim().replace(/^#/, '');
      if (trimmed && !skills.includes(trimmed) && skills.length < 5) {
        setSkills([...skills, trimmed]);
        setSkillInput('');
      }
    }
  };

  const handleRemoveSkill = (tag: string) => {
    setSkills(skills.filter(s => s !== tag));
  };

  const handleAddProofLink = () => {
    if (proofLinks.length < 5) {
      setProofLinks([...proofLinks, { id: Date.now().toString(), url: '', label: 'Link Bukti Tambahan' }]);
    }
  };

  const handleRemoveProofLink = (id: string) => {
    if (proofLinks.length > 1) {
      setProofLinks(proofLinks.filter(l => l.id !== id));
    } else {
      // Clear instead of removing last one
      setProofLinks([{ id: '1', url: '', label: 'GitHub PR / Commit' }]);
    }
  };

  const handleUpdateProofLink = (id: string, field: 'url' | 'label', val: string) => {
    setProofLinks(proofLinks.map(l => l.id === id ? { ...l, [field]: val } : l));
  };

  const handleImageUploadSim = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsCompressingImage(true);
      // Simulate client-side WebP compression
      setTimeout(() => {
        setIsCompressingImage(false);
        setImageBadge(`${file.name.slice(0, 15)}... (WebP 82 KB)`);
      }, 600);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const selectedProj = projects.find(p => p.id === projectId);
    const validLinks: ProofLink[] = proofLinks
      .filter(l => l.url.trim().length > 0)
      .map(l => ({
        id: l.id,
        url: l.url.trim(),
        label: l.label.trim() || 'Link Bukti',
        type: l.url.includes('github') ? 'github' : l.url.includes('figma') ? 'figma' : 'live'
      }));

    const primaryProof = validLinks[0]?.url;

    const newLog: LogEntry = {
      id: `log-${Date.now()}`,
      projectId,
      projectName: selectedProj?.title || 'Personal Work',
      isStealthNda: isStealth || (selectedProj?.isStealthNda || false),
      content: content.trim(),
      skills: skills.length > 0 ? skills : ['General'],
      proofUrl: primaryProof,
      proofType: primaryProof?.includes('github') ? 'github' : 'live',
      proofLinks: validLinks,
      isProofVerified: validLinks.length > 0,
      isFeatured,
      isBackfill: false,
      kudosCount: 0,
      logDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };

    onAddLog(newLog);
    setContent('');
    setProofLinks([{ id: '1', url: '', label: 'GitHub PR / Commit' }]);
    setImageBadge(null);
    setIsFeatured(false);
  };

  return (
    <div className="glass-panel composer-card" style={{ padding: '24px', marginBottom: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
            <Zap size={14} />
          </span>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Quick-Log Micro Journal (1–2 Menit)
          </h2>
        </div>
        <span style={{ 
          fontSize: '0.8rem', 
          fontFamily: 'var(--font-mono)',
          color: content.length > 270 ? 'var(--accent-danger)' : 'var(--text-muted)' 
        }}>
          {content.length}/{MAX_CHAR} Karakter
        </span>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Project Selector & Stealth Mode */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '14px', alignItems: 'flex-end' }}>
          <div style={{ flex: '1', minWidth: '220px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Wadah Proyek:
              </label>
              {onOpenCreateProject && (
                <button
                  type="button"
                  onClick={onOpenCreateProject}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-primary)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '0 2px'
                  }}
                >
                  <FolderPlus size={13} />
                  + Buat Proyek Baru
                </button>
              )}
            </div>
            <select
              value={projectId}
              onChange={(e) => {
                setProjectId(e.target.value);
                const proj = projects.find(p => p.id === e.target.value);
                if (proj) setIsStealth(proj.isStealthNda);
              }}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>
                  {p.title} {p.isStealthNda ? '(NDA)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '2px' }}>
            <label style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px', 
              fontSize: '0.8rem', 
              color: isStealth ? 'var(--accent-amber)' : 'var(--text-secondary)',
              cursor: 'pointer',
              background: 'var(--bg-surface-elevated)',
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)'
            }}>
              <input 
                type="checkbox" 
                checked={isStealth} 
                onChange={(e) => setIsStealth(e.target.checked)} 
              />
              <Lock size={12} />
              Stealth Mode (NDA Kantor)
            </label>
          </div>
        </div>

        {/* Quick Micro-Journal Input */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={MAX_CHAR}
          placeholder="Tulis ringkas apa yang Anda kerjakan & pecahkan hari ini (contoh: Mengurangi memory footprint container 30% dengan scratch base image)..."
          rows={3}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            background: '#FFFFFF',
            border: '1px solid var(--border-medium)',
            color: 'var(--text-primary)',
            fontSize: '0.9rem',
            resize: 'none',
            outline: 'none',
            lineHeight: '1.5',
            marginBottom: '12px'
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--border-focus)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
        />

        {/* Skill Tags */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center', marginBottom: '6px' }}>
            {skills.map(tag => (
              <span key={tag} className="skill-badge">
                #{tag}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(tag)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', padding: 0 }}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
            {skills.length < 5 && (
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleAddSkill}
                placeholder="+ Tambah Skill (Tekan Enter)"
                style={{
                  padding: '4px 8px',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  background: 'transparent',
                  border: '1px dashed var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  width: '160px'
                }}
              />
            )}
          </div>
        </div>

        {/* Multiple Proof Links Section */}
        <div style={{ marginBottom: '16px', background: 'var(--bg-surface)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <LinkIcon size={13} color="var(--accent-primary)" />
              Tautan Bukti Kerja Nyata (Bisa lebih dari 1)
            </span>
            {proofLinks.length < 5 && (
              <button
                type="button"
                onClick={handleAddProofLink}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-primary)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Plus size={12} />
                + Tambah Link Bukti
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {proofLinks.map((link) => (
              <div key={link.id} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => handleUpdateProofLink(link.id, 'label', e.target.value)}
                  placeholder="Nama Bukti (misal: PR GitHub / Live Demo)"
                  style={{
                    width: '160px',
                    padding: '7px 10px',
                    borderRadius: 'var(--radius-sm)',
                    background: '#FFFFFF',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.78rem',
                    color: 'var(--text-primary)',
                    outline: 'none'
                  }}
                />
                <input
                  type="url"
                  value={link.url}
                  onChange={(e) => handleUpdateProofLink(link.id, 'url', e.target.value)}
                  placeholder="https://github.com/... atau https://app.example.com"
                  style={{
                    flex: '1',
                    padding: '7px 10px',
                    borderRadius: 'var(--radius-sm)',
                    background: '#FFFFFF',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.78rem',
                    color: 'var(--text-primary)',
                    outline: 'none'
                  }}
                />
                {proofLinks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveProofLink(link.id)}
                    title="Hapus baris link"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* WebP Image Upload Simulation */}
          <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.75rem',
              padding: '6px 12px',
              background: '#FFFFFF',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              color: 'var(--text-secondary)'
            }}>
              <ImageIcon size={13} />
              {isCompressingImage ? 'Mengompres WebP...' : (imageBadge || 'Unggah Screenshot / Diagram (WebP auto)')}
              <input type="file" accept="image/*" onChange={handleImageUploadSim} style={{ display: 'none' }} />
            </label>
          </div>
        </div>

        {/* Action Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: isFeatured ? 'var(--accent-amber)' : 'var(--text-secondary)', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
            />
            <Star size={13} fill={isFeatured ? 'var(--accent-amber)' : 'none'} />
            Sorot sebagai Featured Highlight
          </label>

          <button
            type="submit"
            disabled={!content.trim()}
            style={{
              background: content.trim() ? 'var(--accent-primary)' : 'rgba(99, 102, 241, 0.3)',
              color: '#FFFFFF',
              border: 'none',
              padding: '8px 20px',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: content.trim() ? 'pointer' : 'not-allowed',
              boxShadow: content.trim() ? 'var(--shadow-glow)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            <span>Publikasikan Log</span>
            <Send size={13} />
          </button>
        </div>
      </form>
    </div>
  );
};
