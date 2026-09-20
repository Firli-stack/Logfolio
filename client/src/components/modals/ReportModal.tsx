import React, { useState } from 'react';
import { Flag, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUsername: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  targetUsername,
}) => {
  const [reason, setReason] = useState<'copyright' | 'spam' | 'nsfw' | 'other'>('spam');
  const [details, setDetails] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    const result = await api.reportProfile({
      targetUsername,
      reason,
      details: details.trim() || undefined,
      reporterEmail: reporterEmail.trim() || undefined,
    });

    setIsSubmitting(false);

    if (result.success) {
      setSubmitted(true);
      setDetails('');
      setReporterEmail('');
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2000);
    } else {
      setErrorMessage(result.error || 'Gagal mengirim laporan.');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '16px'
    }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '460px', padding: '28px', position: 'relative' }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px'
          }}
        >
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Flag size={18} color="#ef4444" />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            Laporkan Profil @{targetUsername}
          </h3>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '18px', lineHeight: '1.4' }}>
          Bantu kami menjaga komunitas Logfolio tetap bersih dan kredibel. Laporan Anda akan ditinjau secara berkala oleh tim moderator.
        </p>

        {submitted ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--accent-emerald)', fontSize: '0.92rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} />
            <span>Terima kasih! Laporan Anda telah kami terima dan akan segera ditinjau.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Alasan Pelaporan
              </label>
              <select
                value={reason}
                onChange={e => setReason(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem'
                }}
              >
                <option value="spam">Spam / Informasi Palsu</option>
                <option value="copyright">Pelanggaran Hak Cipta / Plagiarisme</option>
                <option value="nsfw">Konten Tidak Pantas / NSFW</option>
                <option value="other">Lainnya</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Rincian Pelanggaran (Opsional)
              </label>
              <textarea
                rows={3}
                value={details}
                onChange={e => setDetails(e.target.value)}
                placeholder="Jelaskan bukti atau tautan yang mencurigakan..."
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  resize: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Email Anda (Opsional, untuk konfirmasi)
              </label>
              <input
                type="email"
                value={reporterEmail}
                onChange={e => setReporterEmail(e.target.value)}
                placeholder="anda@domain.com"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            {errorMessage && (
              <div style={{
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#ef4444',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                background: isSubmitting ? 'var(--text-muted)' : '#ef4444',
                color: '#fff',
                border: 'none',
                padding: '10px',
                borderRadius: 'var(--radius-md)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                marginTop: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={15} className="spin" />
                  <span>Mengirim Laporan...</span>
                </>
              ) : (
                <>
                  <Flag size={14} />
                  <span>Kirim Laporan</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
