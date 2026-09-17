import React, { useState, useRef } from 'react';
import type { Project, LogEntry, ProofLink } from '../mockData';
import { Send, X, FolderPlus, Link as LinkIcon, Lock, Image as ImageIcon, Plus, Info } from 'lucide-react';

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
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>(['PostgreSQL', 'Performance']);
  const [proofLinks, setProofLinks] = useState<{ id: string; url: string; label: string }[]>([
    { id: '1', url: '', label: '' }
  ]);
  const [images, setImages] = useState<string[]>([]);
  const [isStealth, setIsStealth] = useState(false);
  const [showNdaInfo, setShowNdaInfo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ',') && skillInput.trim()) {
      e.preventDefault();
      const clean = skillInput.trim().replace(/^#/, '');
      if (clean && !skills.includes(clean) && skills.length < 5) {
        setSkills([...skills, clean]);
        setSkillInput('');
      }
    }
  };

  const handleRemoveSkill = (tag: string) => {
    setSkills(skills.filter(s => s !== tag));
  };

  const handleAddProofLink = () => {
    if (proofLinks.length < 4) {
      setProofLinks([...proofLinks, { id: Date.now().toString(), url: '', label: '' }]);
    }
  };

  const handleRemoveProofLink = (id: string) => {
    if (proofLinks.length > 1) {
      setProofLinks(proofLinks.filter(l => l.id !== id));
    } else {
      setProofLinks([{ id: '1', url: '', label: '' }]);
    }
  };

  const handleUpdateProofLink = (id: string, field: 'url' | 'label', val: string) => {
    setProofLinks(proofLinks.map(l => l.id === id ? { ...l, [field]: val } : l));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      if (images.length >= 3) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages(prev => prev.length < 3 ? [...prev, event.target!.result as string] : prev);
        }
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveTitle = title.trim();
    if (!effectiveTitle) return;

    const selectedProj = projects.find(p => p.id === projectId);
    const validLinks: ProofLink[] = proofLinks
      .filter(l => l.url.trim().length > 0)
      .map(l => {
        let label = l.label.trim();
        if (!label) {
          const urlLower = l.url.toLowerCase();
          if (urlLower.includes('github.com')) label = 'GitHub';
          else if (urlLower.includes('gitlab.com')) label = 'GitLab';
          else if (urlLower.includes('figma.com')) label = 'Figma';
          else if (urlLower.includes('drive.google.com') || urlLower.includes('docs.google.com')) label = 'Dokumen';
          else label = 'Demo / Web';
        }
        return {
          id: l.id,
          url: l.url.trim(),
          label,
          type: l.url.includes('github') ? 'github' : 'live'
        };
      });

    const primaryProof = validLinks[0]?.url;

    // Pisahkan baris detail
    const parsedDetails = content
      .split('\n')
      .map(line => line.replace(/^[•\-\*▸\d\.]+\s*/, '').trim())
      .filter(line => line.length > 0);

    const now = new Date();
    const dateStr = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

    const newLog: LogEntry = {
      id: `log-${Date.now()}`,
      projectId,
      projectName: selectedProj?.title || 'Proyek Pribadi',
      isStealthNda: isStealth || (selectedProj?.isStealthNda || false),
      title: effectiveTitle,
      content: content.trim() || effectiveTitle,
      details: parsedDetails.length > 0 ? parsedDetails : undefined,
      skills: skills.length > 0 ? skills : ['General'],
      proofUrl: primaryProof,
      proofType: primaryProof?.includes('github') ? 'github' : 'live',
      proofLinks: validLinks,
      imageUrls: images.length > 0 ? images : undefined,
      isProofVerified: validLinks.length > 0,
      isFeatured: false,
      isBackfill: false,
      kudosCount: 0,
      logDate: dateStr,
      createdAt: now.toISOString()
    };

    onAddLog(newLog);
    setTitle('');
    setContent('');
    setImages([]);
    setProofLinks([{ id: '1', url: '', label: '' }]);
  };

  return (
    <div className="glass-panel composer-panel" style={{ padding: '16px 20px', marginBottom: '22px', background: '#FFFFFF' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
        
        {/* Row 1: Proyek & Opsi NDA */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 200px', minWidth: 0 }}>
            <select
              value={projectId}
              onChange={(e) => {
                setProjectId(e.target.value);
                const proj = projects.find(p => p.id === e.target.value);
                if (proj) setIsStealth(proj.isStealthNda);
              }}
              style={{
                flex: '1',
                minWidth: 0,
                padding: '6px 8px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontSize: '0.8rem',
                outline: 'none',
                fontWeight: 500
              }}
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>
                  {p.title} {p.isStealthNda ? '(NDA)' : ''}
                </option>
              ))}
            </select>

            {onOpenCreateProject && (
              <button
                type="button"
                onClick={onOpenCreateProject}
                title="Proyek Baru"
                style={{
                  background: 'none',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '6px 8px',
                  color: 'var(--text-secondary)',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
              >
                <FolderPlus size={13} />
                <span>+ Proyek</span>
              </button>
            )}
          </div>

          {/* Opsi NDA dengan tombol info yang bisa diklik */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            <label style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '0.76rem',
              color: isStealth ? 'var(--accent-amber)' : 'var(--text-secondary)',
              cursor: 'pointer',
              userSelect: 'none',
              fontWeight: 600,
              whiteSpace: 'nowrap'
            }}>
              <input
                type="checkbox"
                checked={isStealth}
                onChange={(e) => setIsStealth(e.target.checked)}
              />
              <Lock size={12} />
              <span>Mode NDA</span>
            </label>
            <button
              type="button"
              onClick={() => setShowNdaInfo(!showNdaInfo)}
              title="Klik untuk melihat fungsi Mode NDA"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: showNdaInfo ? 'rgba(79, 70, 229, 0.1)' : 'none',
                border: 'none',
                borderRadius: '50%',
                padding: '2px',
                color: showNdaInfo ? 'var(--accent-primary)' : 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <Info size={14} />
            </button>
          </div>
        </div>

        {/* Banner Penjelasan Fungsi NDA jika tombol info diklik */}
        {showNdaInfo && (
          <div style={{
            background: '#F8FAFC',
            border: '1px solid #CBD5E1',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 12px',
            fontSize: '0.78rem',
            color: '#334155',
            lineHeight: '1.45',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '8px'
          }}>
            <div>
              <b style={{ color: '#0F172A' }}>Fungsi Mode NDA:</b> Menjaga kerahasiaan proyek kantor/klien. Kode sumber dan rahasia bisnis tetap terlindungi, sementara pencapaian rekayasa, metrik performa, dan solusi teknis Anda tetap bisa dipamerkan secara profesional di portofolio & CV.
            </div>
            <button
              type="button"
              onClick={() => setShowNdaInfo(false)}
              style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: 0 }}
            >
              <X size={13} />
            </button>
          </div>
        )}

        {/* Row 2: Input Ringkasan Tugas */}
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ringkasan tugas atau fitur yang diselesaikan..."
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: 'var(--radius-sm)',
            background: '#FFFFFF',
            border: '1px solid var(--border-medium)',
            color: 'var(--text-primary)',
            fontSize: '0.86rem',
            outline: 'none'
          }}
        />

        {/* Row 3: Detail Poin Teknis */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Rincian teknis / dampak penyelesaian (opsional)..."
          rows={2}
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: 'var(--radius-sm)',
            background: '#FFFFFF',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
            fontSize: '0.82rem',
            resize: 'none',
            outline: 'none',
            lineHeight: '1.4'
          }}
        />

        {/* Row 4: Multi-Link Bukti Pengerjaan */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <LinkIcon size={12} />
              Tautan Bukti Pengerjaan
            </span>
            {proofLinks.length < 4 && (
              <button
                type="button"
                onClick={handleAddProofLink}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-primary)',
                  fontSize: '0.73rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                  padding: 0
                }}
              >
                <Plus size={11} />
                <span>Tambah Link</span>
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {proofLinks.map((link) => (
              <div key={link.id} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => handleUpdateProofLink(link.id, 'label', e.target.value)}
                  placeholder="Platform / Nama"
                  style={{
                    width: '115px',
                    padding: '5px 8px',
                    borderRadius: '4px',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.75rem',
                    outline: 'none'
                  }}
                />
                <input
                  type="url"
                  value={link.url}
                  onChange={(e) => handleUpdateProofLink(link.id, 'url', e.target.value)}
                  placeholder="https://..."
                  style={{
                    flex: '1',
                    padding: '5px 8px',
                    borderRadius: '4px',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.75rem',
                    outline: 'none'
                  }}
                />
                {proofLinks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveProofLink(link.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Row 5: Bukti Foto / Screenshot (Jelas & Nyaman Digunakan) */}
        <div>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px dashed var(--border-medium)',
                background: images.length > 0 ? 'var(--bg-surface-elevated)' : '#F8FAFC',
                color: 'var(--text-secondary)',
                fontSize: '0.78rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <ImageIcon size={14} style={{ color: 'var(--accent-primary)' }} />
              <span>{images.length > 0 ? `+ Tambah Foto (${images.length}/3)` : 'Lampirkan Foto / Tangkapan Layar'}</span>
            </button>

            {/* Thumbnail Foto Terunggah */}
            {images.map((img, idx) => (
              <div
                key={idx}
                style={{
                  position: 'relative',
                  width: '68px',
                  height: '48px',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  border: '1px solid var(--border-medium)',
                  background: '#F1F5F9'
                }}
              >
                <img
                  src={img}
                  alt="Bukti kerja"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  title="Hapus foto"
                  style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    background: 'rgba(15, 23, 42, 0.75)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '50%',
                    width: '16px',
                    height: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Row 6: Skill Tags & Tombol Simpan */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-subtle)' }}>
          
          {/* Tag Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center' }}>
            {skills.map(tag => (
              <span key={tag} className="skill-badge" style={{ fontSize: '0.72rem', padding: '2px 6px' }}>
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(tag)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginLeft: '4px', color: 'var(--text-muted)' }}
                >
                  <X size={10} />
                </button>
              </span>
            ))}
            {skills.length < 4 && (
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleAddSkill}
                placeholder="+ Tag"
                style={{
                  padding: '2px 6px',
                  fontSize: '0.72rem',
                  border: '1px dashed var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  outline: 'none',
                  background: 'transparent',
                  width: '60px'
                }}
              />
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!title.trim()}
            style={{
              background: title.trim() ? 'var(--accent-primary)' : '#CBD5E1',
              color: '#FFFFFF',
              border: 'none',
              padding: '6px 18px',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: title.trim() ? 'pointer' : 'not-allowed',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>Simpan</span>
            <Send size={12} />
          </button>
        </div>

      </form>
    </div>
  );
};
