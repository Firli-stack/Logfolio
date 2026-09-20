import React, { useState } from 'react';
import { Send, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName: string;
  candidateUsername: string;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  candidateName,
  candidateUsername,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [websiteHoneypot, setWebsiteHoneypot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    const result = await api.sendContactMessage({
      targetUsername: candidateUsername,
      recruiterName: name,
      recruiterEmail: email,
      message,
      honeypot: websiteHoneypot,
    });

    setIsSubmitting(false);

    if (result.success) {
      setSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2000);
    } else {
      setErrorMessage(result.error || 'Gagal mengirim pesan relay.');
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
      <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '28px', position: 'relative' }}>
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


        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)' }}>
          Hubungi {candidateName}
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '18px', lineHeight: '1.4' }}>
          <b>Masked Email Relay:</b> Alamat email kandidat terlindungi dari bot spam. Pesan Anda akan langsung diteruskan ke inbox pribadi kandidat.
        </p>

        {submitted ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--accent-emerald)', fontSize: '0.92rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} />
            <span>Pesan berhasil diteruskan secara aman ke inbox kandidat!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Nama Rekruter / Perusahaan</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Misal: Sarah (Tech Recruiter di Fintech Corp)"
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

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Email Anda</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="sarah@company.com"
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

            <div style={{ display: 'none', position: 'absolute', left: '-9999px' }} aria-hidden="true">
              <label htmlFor="recruiter_website_hp">Website (Leave blank)</label>
              <input
                id="recruiter_website_hp"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={websiteHoneypot}
                onChange={e => setWebsiteHoneypot(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Pesan Singkat</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Hai Alex, saya terkesan dengan bukti optimasi PostgreSQL Anda..."
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
                background: isSubmitting ? 'var(--text-muted)' : 'var(--accent-primary)',
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
                  <span>Meneruskan Pesan...</span>
                </>
              ) : (
                <>
                  <span>Kirim Pesan Relay</span>
                  <Send size={14} />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

