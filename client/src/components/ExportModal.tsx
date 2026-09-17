import React, { useState, useEffect } from 'react';
import type { UserProfile, Project, LogEntry } from '../mockData';
import { exportToMarkdown, exportToJson, exportToPdfPrint } from '../utils/exportData';
import type { CvTemplateStyle, CvLanguage } from '../utils/exportData';
import { X, Download, FileText, Code2, CheckCircle2, ShieldCheck, Printer, Languages } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  projects: Project[];
  logs: LogEntry[];
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  profile,
  projects,
  logs
}) => {
  const [downloadedFormat, setDownloadedFormat] = useState<'md' | 'json' | 'pdf' | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<CvTemplateStyle>('classic_ats');
  const [selectedLang, setSelectedLang] = useState<CvLanguage>('id');

  // Prevent background scroll when modal is active
  useEffect(() => {
    if (isOpen) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      const originalTouchAction = document.body.style.touchAction;

      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';

      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.body.style.touchAction = originalTouchAction;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleExportPdf = (tpl: CvTemplateStyle = selectedTemplate, lang: CvLanguage = selectedLang) => {
    exportToPdfPrint(profile, projects, logs, tpl, lang);
    setDownloadedFormat('pdf');
    setTimeout(() => setDownloadedFormat(null), 3500);
  };

  const handleExportMd = () => {
    exportToMarkdown(profile, projects, logs);
    setDownloadedFormat('md');
    setTimeout(() => setDownloadedFormat(null), 3500);
  };

  const handleExportJson = () => {
    exportToJson(profile, projects, logs);
    setDownloadedFormat('json');
    setTimeout(() => setDownloadedFormat(null), 3500);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '12px 10px',
        overflowY: 'auto',
        overscrollBehavior: 'contain'
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '520px',
          maxHeight: 'min(90vh, 720px)',
          background: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          padding: '18px 16px',
          boxShadow: 'var(--shadow-xl)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          margin: 'auto',
          boxSizing: 'border-box',
          overscrollBehavior: 'contain',
          touchAction: 'pan-y'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', flex: 1 }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(79, 70, 229, 0.1)',
              color: 'var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: '1px'
            }}>
              <Download size={18} />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.25 }}>
                Ekspor & Portabilitas Data
              </h2>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px', lineHeight: 1.35 }}>
                Unduh seluruh riwayat portofolio & bukti kerja tanpa terkunci (*Zero Lock-in*).
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '6px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Notifikasi Sukses */}
        {downloadedFormat && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            color: 'var(--accent-emerald)',
            padding: '8px 12px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '14px',
            fontSize: '0.8rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
            <span style={{ lineHeight: 1.3 }}>
              {downloadedFormat === 'pdf' 
                ? 'Jendela cetak / simpan PDF resume berhasil dibuka!' 
                : `File .${downloadedFormat} berhasil diunduh ke komputer Anda!`}
            </span>
          </div>
        )}

        {/* Options List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '14px' }}>
          {/* Option 1: PDF Resume Resmi (A4 Clean) */}
          <div
            style={{
              border: '1.5px solid var(--accent-primary)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              background: 'rgba(79, 70, 229, 0.03)'
            }}
          >
            {/* Top row: Icon + Title + Rekomendasi badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(79, 70, 229, 0.12)',
                color: 'var(--accent-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Printer size={15} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    PDF Resume Resmi (Layout A4)
                  </h4>
                  <span style={{ fontSize: '0.62rem', fontWeight: 700, background: 'var(--accent-primary)', color: '#fff', padding: '1px 5px', borderRadius: '4px' }}>
                    Rekomendasi
                  </span>
                </div>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.25, marginTop: '1px' }}>
                  Format dokumen cetak A4 siap simpan PDF sesuai standar industri.
                </p>
              </div>
            </div>

            {/* Template Selector & Language Switcher */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '8px', borderTop: '1px solid rgba(79, 70, 229, 0.12)' }}>
              
              {/* Bahasa Resume */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Languages size={12} />
                  Bahasa CV:
                </span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedLang('id')}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: selectedLang === 'id' ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                      background: selectedLang === 'id' ? 'var(--accent-primary)' : '#FFFFFF',
                      color: selectedLang === 'id' ? '#FFFFFF' : 'var(--text-secondary)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    Bahasa Indonesia
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedLang('en')}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: selectedLang === 'en' ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                      background: selectedLang === 'en' ? 'var(--accent-primary)' : '#FFFFFF',
                      color: selectedLang === 'en' ? '#FFFFFF' : 'var(--text-secondary)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    English (International)
                  </button>
                </div>
              </div>

              {/* Template Options */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '6px' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 8px',
                    borderRadius: 'var(--radius-sm)',
                    border: selectedTemplate === 'classic_ats' ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                    background: selectedTemplate === 'classic_ats' ? '#FFFFFF' : 'transparent',
                    cursor: 'pointer',
                    fontSize: '0.74rem'
                  }}
                >
                  <input
                    type="radio"
                    name="cvTemplate"
                    checked={selectedTemplate === 'classic_ats'}
                    onChange={() => setSelectedTemplate('classic_ats')}
                  />
                  <div>
                    <b style={{ color: 'var(--text-primary)', display: 'block' }}>Harvard / ATS Standard</b>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Format 1-kolom resmi referensi</span>
                  </div>
                </label>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 8px',
                    borderRadius: 'var(--radius-sm)',
                    border: selectedTemplate === 'modern_clean' ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                    background: selectedTemplate === 'modern_clean' ? '#FFFFFF' : 'transparent',
                    cursor: 'pointer',
                    fontSize: '0.74rem'
                  }}
                >
                  <input
                    type="radio"
                    name="cvTemplate"
                    checked={selectedTemplate === 'modern_clean'}
                    onChange={() => setSelectedTemplate('modern_clean')}
                  />
                  <div>
                    <b style={{ color: 'var(--text-primary)', display: 'block' }}>Modern Sans-Serif</b>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Layout kontemporer</span>
                  </div>
                </label>
              </div>

              {/* Tombol Cetak diposisikan DI BAWAH pilihan konfigurasi */}
              <button
                type="button"
                onClick={() => handleExportPdf(selectedTemplate, selectedLang)}
                style={{
                  marginTop: '4px',
                  padding: '9px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--accent-primary)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: 'var(--shadow-glow)',
                  width: '100%'
                }}
              >
                <Printer size={15} />
                <span>Cetak / Simpan PDF ({selectedLang === 'en' ? 'English' : 'Bahasa Indonesia'})</span>
              </button>
            </div>
          </div>

          {/* Option 2: Markdown (.md) */}
          <div
            style={{
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '8px',
              background: 'var(--bg-surface)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 auto', minWidth: '180px' }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(2, 132, 199, 0.1)',
                color: 'var(--accent-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <FileText size={14} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Dokumen Markdown (.md)
                </h4>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: 1.25 }}>
                  Format rapi untuk GitHub Profile README atau Notion.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleExportMd}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-surface-elevated)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                fontWeight: 600,
                fontSize: '0.74rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                flex: '1 1 auto',
                minWidth: '100px'
              }}
            >
              <Download size={12} />
              <span>Unduh .md</span>
            </button>
          </div>

          {/* Option 3: JSON Backup (.json) */}
          <div
            style={{
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '8px',
              background: 'var(--bg-surface)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 auto', minWidth: '180px' }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(245, 158, 11, 0.1)',
                color: 'var(--accent-amber)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Code2 size={14} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Raw JSON Payload (.json)
                </h4>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: 1.25 }}>
                  Metadata lengkap profil, wadah proyek, dan tautan bukti.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleExportJson}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-surface-elevated)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                fontWeight: 600,
                fontSize: '0.74rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                flex: '1 1 auto',
                minWidth: '100px'
              }}
            >
              <Download size={12} />
              <span>Unduh .json</span>
            </button>
          </div>
        </div>

        {/* Footer Guarantee */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 10px',
          borderRadius: 'var(--radius-sm)',
          background: '#F8FAFC',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.72rem',
          color: 'var(--text-muted)'
        }}>
          <ShieldCheck size={14} color="var(--accent-emerald)" style={{ flexShrink: 0 }} />
          <span><b>Data Ownership Guarantee</b>: Data Anda 100% milik Anda dan tidak pernah dikunci.</span>
        </div>
      </div>
    </div>
  );
};
