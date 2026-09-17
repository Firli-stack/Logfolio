import React, { useState } from 'react';
import type { UserProfile, Project, LogEntry } from '../mockData';
import { exportToMarkdown, exportToJson, exportToPdfPrint } from '../utils/exportData';
import type { CvTemplateStyle } from '../utils/exportData';
import { X, Download, FileText, Code2, CheckCircle2, ShieldCheck, Printer } from 'lucide-react';

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

  if (!isOpen) return null;

  const handleExportPdf = (tpl: CvTemplateStyle = selectedTemplate) => {
    exportToPdfPrint(profile, projects, logs, tpl);
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
          maxWidth: '520px',
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
              <Download size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Ekspor & Portabilitas Data
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Unduh seluruh riwayat portofolio & bukti kerja milik Anda tanpa terkunci (*Zero Lock-in*).
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

        {/* Notifikasi Sukses */}
        {downloadedFormat && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            color: 'var(--accent-emerald)',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '16px',
            fontSize: '0.82rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckCircle2 size={16} />
            <span>
              {downloadedFormat === 'pdf' 
                ? 'Jendela cetak / simpan PDF resume berhasil dibuka!' 
                : `File .${downloadedFormat} berhasil diunduh ke komputer Anda!`}
            </span>
          </div>
        )}

        {/* Options List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          {/* Option 1: PDF Resume Resmi (A4 Clean) */}
          <div
            style={{
              border: '1.5px solid var(--accent-primary)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              background: 'rgba(79, 70, 229, 0.03)',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(79, 70, 229, 0.12)',
                  color: 'var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '2px'
                }}>
                  <Printer size={17} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                    <h4 style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      PDF Resume Resmi (Layout A4)
                    </h4>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, background: 'var(--accent-primary)', color: '#fff', padding: '1px 6px', borderRadius: '4px' }}>
                      Rekomendasi
                    </span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    Format dokumen cetak A4. Pilih gaya template di bawah ini sebelum mencetak/menyimpan PDF:
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleExportPdf(selectedTemplate)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--accent-primary)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                  boxShadow: 'var(--shadow-glow)'
                }}
              >
                <Printer size={13} />
                Cetak PDF
              </button>
            </div>

            {/* Template Selector Pills */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', paddingTop: '6px', borderTop: '1px solid rgba(79, 70, 229, 0.12)' }}>
              <label
                style={{
                  flex: 1,
                  minWidth: '200px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: selectedTemplate === 'classic_ats' ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                  background: selectedTemplate === 'classic_ats' ? '#FFFFFF' : 'transparent',
                  cursor: 'pointer',
                  fontSize: '0.78rem'
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
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Nama di tengah, font serif klasik, 1-kolom</span>
                </div>
              </label>

              <label
                style={{
                  flex: 1,
                  minWidth: '200px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: selectedTemplate === 'modern_clean' ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                  background: selectedTemplate === 'modern_clean' ? '#FFFFFF' : 'transparent',
                  cursor: 'pointer',
                  fontSize: '0.78rem'
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
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Layout bersih kontemporer</span>
                </div>
              </label>
            </div>
          </div>

          {/* Option 2: Markdown (.md) */}
          <div
            style={{
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'var(--bg-surface)',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(2, 132, 199, 0.1)',
                color: 'var(--accent-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '2px'
              }}>
                <FileText size={16} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '3px' }}>
                  Dokumen Markdown (.md)
                </h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  Format rapi berhierarki siap dipasang di GitHub Profile README, Notion, atau blog.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleExportMd}
              style={{
                padding: '8px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-surface-elevated)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap'
              }}
            >
              <Download size={13} />
              Unduh .md
            </button>
          </div>

          {/* Option 2: JSON Backup (.json) */}
          <div
            style={{
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'var(--bg-surface)',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(245, 158, 11, 0.1)',
                color: 'var(--accent-amber)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '2px'
              }}>
                <Code2 size={16} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '3px' }}>
                  Raw JSON Payload (.json)
                </h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  Seluruh metadata mentah: profil, wadah proyek, metrik dampak, dan semua link bukti kerja.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleExportJson}
              style={{
                padding: '8px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-surface-elevated)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap'
              }}
            >
              <Download size={13} />
              Unduh .json
            </button>
          </div>
        </div>

        {/* Footer Guarantee */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 12px',
          borderRadius: 'var(--radius-sm)',
          background: '#F8FAFC',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.75rem',
          color: 'var(--text-muted)'
        }}>
          <ShieldCheck size={16} color="var(--accent-emerald)" />
          <span><b>Data Ownership Guarantee</b>: Data Anda 100% milik Anda dan tidak pernah dikunci.</span>
        </div>
      </div>
    </div>
  );
};
