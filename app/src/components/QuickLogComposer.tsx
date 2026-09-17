import React, { useState } from 'react';
import type { Project, LogEntry } from '../mockData';
import { Zap, Lock, Image as ImageIcon, Star, Send, X } from 'lucide-react';

interface QuickLogComposerProps {
  projects: Project[];
  onAddLog: (log: LogEntry) => void;
}

export const QuickLogComposer: React.FC<QuickLogComposerProps> = ({ projects, onAddLog }) => {
  const [content, setContent] = useState('');
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>(['PostgreSQL', 'Performance']);
  const [proofUrl, setProofUrl] = useState('');
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
    const newLog: LogEntry = {
      id: `log-${Date.now()}`,
      projectId,
      projectName: selectedProj?.title || 'Personal Work',
      isStealthNda: isStealth || (selectedProj?.isStealthNda || false),
      content: content.trim(),
      skills: skills.length > 0 ? skills : ['General'],
      proofUrl: proofUrl.trim() || undefined,
      proofType: proofUrl.includes('github') ? 'github' : 'live',
      isProofVerified: proofUrl.trim().length > 0,
      isFeatured,
      isBackfill: false,
      kudosCount: 0,
      logDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };

    onAddLog(newLog);
    setContent('');
    setProofUrl('');
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
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '14px' }}>
          <div style={{ flex: '1', minWidth: '220px' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Wadah Proyek:
            </label>
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

          <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '6px' }}>
            <label style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px', 
              fontSize: '0.8rem', 
              color: isStealth ? 'var(--accent-amber)' : 'var(--text-secondary)',
              cursor: 'pointer',
              background: 'var(--bg-surface-elevated)',
              padding: '6px 12px',
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

        {/* Text Area */}
        <textarea
          rows={3}
          maxLength={MAX_CHAR}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Apa yang berhasil kamu selesaikan / pecahkan hari ini? (Contoh: Menurunkan latensi API dari 400ms ke 40ms dengan redis caching...)"
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

        {/* Proof URL & WebP Image Upload */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
          <input
            type="url"
            value={proofUrl}
            onChange={(e) => setProofUrl(e.target.value)}
            placeholder="Tautan Bukti (GitHub PR, Live URL, Figma)"
            style={{
              flex: '1',
              minWidth: '240px',
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              background: '#FFFFFF',
              border: '1px solid var(--border-medium)',
              color: 'var(--text-primary)',
              fontSize: '0.8rem',
              outline: 'none'
            }}
          />

          <label style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.8rem',
            padding: '8px 14px',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            color: 'var(--text-secondary)'
          }}>
            <ImageIcon size={14} />
            {isCompressingImage ? 'Mengompres WebP...' : (imageBadge || 'Unggah Bukti Gambar')}
            <input type="file" accept="image/*" onChange={handleImageUploadSim} style={{ display: 'none' }} />
          </label>
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
