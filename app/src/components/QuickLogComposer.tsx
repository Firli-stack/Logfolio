import React, { useState } from 'react';
import type { Project, LogEntry, ProofLink } from '../mockData';
import { Send, X, FolderPlus, Link as LinkIcon, Lock } from 'lucide-react';

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
    { id: '1', url: '', label: 'GitHub PR' }
  ]);
  const [isStealth, setIsStealth] = useState(false);

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

  const handleUpdateProofLink = (id: string, field: 'url' | 'label', val: string) => {
    setProofLinks(proofLinks.map(l => l.id === id ? { ...l, [field]: val } : l));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveTitle = title.trim();
    if (!effectiveTitle) return;

    const selectedProj = projects.find(p => p.id === projectId);
    const validLinks: ProofLink[] = proofLinks
      .filter(l => l.url.trim().length > 0)
      .map(l => ({
        id: l.id,
        url: l.url.trim(),
        label: l.label.trim() || 'Link Bukti',
        type: l.url.includes('github') ? 'github' : 'live'
      }));

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
    setProofLinks([{ id: '1', url: '', label: 'GitHub PR' }]);
  };

  return (
    <div className="glass-panel" style={{ padding: '18px 20px', marginBottom: '24px', background: '#FFFFFF' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        
        {/* Row 1: Proyek & NDA */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1', minWidth: '240px' }}>
            <select
              value={projectId}
              onChange={(e) => {
                setProjectId(e.target.value);
                const proj = projects.find(p => p.id === e.target.value);
                if (proj) setIsStealth(proj.isStealthNda);
              }}
              style={{
                flex: '1',
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontSize: '0.82rem',
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
                  padding: '6px 10px',
                  color: 'var(--text-secondary)',
                  fontSize: '0.78rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  whiteSpace: 'nowrap'
                }}
              >
                <FolderPlus size={13} />
                <span>+ Proyek</span>
              </button>
            )}
          </div>

          <label style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.78rem',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            userSelect: 'none'
          }}>
            <input
              type="checkbox"
              checked={isStealth}
              onChange={(e) => setIsStealth(e.target.checked)}
            />
            <Lock size={12} />
            <span>NDA</span>
          </label>
        </div>

        {/* Row 2: Input Aktivitas / Judul */}
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ringkasan tugas atau fitur..."
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

        {/* Row 3: Detail Singkat */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Detail pengerjaan (opsional)..."
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

        {/* Row 4: Tag & Link Bukti */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', paddingTop: '2px' }}>
          {/* Tags */}
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
                  width: '65px'
                }}
              />
            )}
          </div>

          {/* Proof link input single / compact */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <LinkIcon size={12} style={{ color: 'var(--text-muted)' }} />
            <input
              type="url"
              value={proofLinks[0]?.url || ''}
              onChange={(e) => handleUpdateProofLink(proofLinks[0]?.id || '1', 'url', e.target.value)}
              placeholder="Link PR / Demo (opsional)"
              style={{
                width: '180px',
                padding: '4px 8px',
                borderRadius: '4px',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.75rem',
                outline: 'none'
              }}
            />

            <button
              type="submit"
              disabled={!title.trim()}
              style={{
                background: title.trim() ? 'var(--accent-primary)' : '#CBD5E1',
                color: '#FFFFFF',
                border: 'none',
                padding: '5px 14px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 600,
                fontSize: '0.78rem',
                cursor: title.trim() ? 'pointer' : 'not-allowed',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>Simpan</span>
              <Send size={11} />
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};
