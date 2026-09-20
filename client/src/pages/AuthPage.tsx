import React, { useState } from 'react';
import { Lock, ArrowRight, Loader2, AlertCircle, CheckCircle2, Code2, ArrowLeft, ShieldCheck, Zap } from 'lucide-react';
import { api } from '../services/api';
import { navigateTo } from '../utils/router';

interface AuthPageProps {
  initialMode?: 'login' | 'register';
  onAuthSuccess: (userProfile: { username: string; fullName: string; avatarUrl?: string }) => void;
  onNavigateHome: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'login',
  onAuthSuccess,
  onNavigateHome,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [isOtpStep, setIsOtpStep] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [previewOtp, setPreviewOtp] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleReset = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setPassword('');
    setIsOtpStep(false);
    setOtpCode('');
  };

  const switchMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    handleReset();
    navigateTo(newMode === 'login' ? '/login' : '/register');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    const res = await api.login({ loginIdentifier, password });
    setIsSubmitting(false);

    if (res.success && res.data) {
      setSuccessMsg('Login berhasil! Mengalihkan ke dashboard...');
      setTimeout(() => {
        onAuthSuccess(res.data!.profile);
      }, 700);
    } else {
      if ((res as any).requiresOtp && (res as any).email) {
        setOtpEmail((res as any).email);
        setIsOtpStep(true);
        setErrorMsg('Email Anda belum dikonfirmasi. Masukkan kode OTP 6 digit yang telah dikirimkan.');
      } else {
        setErrorMsg(res.error || 'Login gagal. Cek kembali kredensial Anda.');
      }
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    const res = await api.register({
      username,
      email,
      password,
      fullName,
    });
    setIsSubmitting(false);

    if (res.success && res.data) {
      if (res.data.requiresOtp && res.data.email) {
        setOtpEmail(res.data.email);
        if (res.data.previewOtp) {
          setPreviewOtp(res.data.previewOtp);
        }
        setIsOtpStep(true);
        setSuccessMsg('Pendaftaran awal berhasil! Masukkan kode OTP 6-digit untuk mengaktifkan akun.');
      } else if (res.data.profile) {
        setSuccessMsg('Akun berhasil dibuat! Mengalihkan ke dashboard...');
        setTimeout(() => {
          onAuthSuccess(res.data!.profile!);
        }, 700);
      }
    } else {
      setErrorMsg(res.error || 'Pendaftaran gagal. Silakan coba lagi.');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    const res = await api.verifyOtp({
      email: otpEmail,
      otp: otpCode.trim(),
    });
    setIsSubmitting(false);

    if (res.success && res.data) {
      setSuccessMsg('Konfirmasi OTP berhasil! Akun Anda telah aktif.');
      setTimeout(() => {
        onAuthSuccess(res.data!.profile);
      }, 800);
    } else {
      setErrorMsg(res.error || 'Kode OTP salah atau telah kedaluwarsa.');
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isSubmitting) return;
    setErrorMsg(null);
    setIsSubmitting(true);

    const res = await api.resendOtp({ email: otpEmail });
    setIsSubmitting(false);

    if (res.success) {
      if (res.data?.previewOtp) {
        setPreviewOtp(res.data.previewOtp);
      }
      setSuccessMsg('Kode OTP baru telah dikirimkan!');
      setResendCooldown(60);
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setErrorMsg(res.error || 'Gagal mengirim ulang kode OTP.');
    }
  };

  const handleOAuth = async (provider: 'google' | 'github') => {
    setErrorMsg(null);
    setIsSubmitting(true);

    const demoUser = provider === 'github'
      ? {
          provider: 'github' as const,
          email: 'github.dev@logfolio.dev',
          fullName: 'GitHub Developer',
          username: 'github-dev',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        }
      : {
          provider: 'google' as const,
          email: 'google.dev@logfolio.dev',
          fullName: 'Google Cloud Engineer',
          username: 'google-dev',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        };

    const res = await api.oauthMockLogin(demoUser);
    setIsSubmitting(false);

    if (res.success && res.data) {
      setSuccessMsg(`Berhasil terhubung via ${provider.toUpperCase()}!`);
      setTimeout(() => {
        onAuthSuccess(res.data!.profile);
      }, 700);
    } else {
      setErrorMsg(res.error || `Login via ${provider} gagal.`);
    }
  };

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '480px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}>
        <button
          type="button"
          onClick={onNavigateHome}
          style={{
            background: 'none',
            border: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '0.84rem',
            fontWeight: 600,
            padding: 0,
            alignSelf: 'flex-start',
            transition: 'color 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
        >
          <ArrowLeft size={16} />
          <span>Kembali ke Portofolio Publik</span>
        </button>

        <div
          className="glass-panel"
          style={{
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-subtle)',
            boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.15)',
            overflow: 'hidden',
          }}
        >
          <div style={{
            padding: '32px 32px 24px 32px',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'linear-gradient(180deg, var(--bg-surface-elevated) 0%, var(--bg-surface) 100%)',
            textAlign: 'center',
          }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, var(--accent-primary), #0284C7)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              boxShadow: '0 6px 16px rgba(79, 70, 229, 0.3)',
            }}>
              <Code2 size={24} />
            </div>

            <h1 style={{
              fontSize: '1.4rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              margin: '0 0 6px 0',
              letterSpacing: '-0.02em',
            }}>
              {mode === 'login' ? 'Masuk ke Akun Logfolio' : 'Mulai Perjalanan Logfolio Anda'}
            </h1>
            <p style={{
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              margin: 0,
              lineHeight: 1.4,
            }}>
              {mode === 'login'
                ? 'Kelola daily log rekayasa & portofolio terverifikasi Anda'
                : 'Catat micro-progress, kumpulkan streak, dan pikat rekruter'}
            </p>
          </div>

          <div style={{ padding: '32px' }}>
            <div style={{
              display: 'flex',
              background: 'var(--bg-surface-elevated)',
              padding: '4px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '24px',
            }}>
              <button
                type="button"
                onClick={() => switchMode('login')}
                style={{
                  flex: 1,
                  padding: '9px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: mode === 'login' ? 'var(--accent-primary)' : 'transparent',
                  color: mode === 'login' ? '#FFFFFF' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease',
                  boxShadow: mode === 'login' ? '0 2px 8px rgba(79, 70, 229, 0.3)' : 'none',
                }}
              >
                Masuk (Login)
              </button>
              <button
                type="button"
                onClick={() => switchMode('register')}
                style={{
                  flex: 1,
                  padding: '9px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: mode === 'register' ? 'var(--accent-primary)' : 'transparent',
                  color: mode === 'register' ? '#FFFFFF' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease',
                  boxShadow: mode === 'register' ? '0 2px 8px rgba(79, 70, 229, 0.3)' : 'none',
                }}
              >
                Daftar Akun Baru
              </button>
            </div>

            {errorMsg && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                color: 'var(--accent-danger)',
                fontSize: '0.82rem',
                marginBottom: '20px',
              }}>
                <AlertCircle size={17} style={{ flexShrink: 0 }} />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                color: 'var(--accent-emerald)',
                fontSize: '0.82rem',
                marginBottom: '20px',
              }}>
                <CheckCircle2 size={17} style={{ flexShrink: 0 }} />
                <span>{successMsg}</span>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
              <button
                type="button"
                onClick={() => handleOAuth('github')}
                disabled={isSubmitting}
                style={{
                  flex: 1,
                  padding: '11px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'background 0.15s ease, border-color 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border-medium)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span>Lanjut via GitHub</span>
              </button>

              <button
                type="button"
                onClick={() => handleOAuth('google')}
                disabled={isSubmitting}
                style={{
                  flex: 1,
                  padding: '11px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'background 0.15s ease, border-color 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border-medium)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
              >
                <svg width="17" height="17" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.14z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.28 21.36 7.35 24 12 24z" />
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.6H1.25C.45 8.19 0 9.99 0 12s.45 3.81 1.25 5.4l4.03-3.13z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.28 2.64 1.25 6.6l4.03 3.13c.95-2.83 3.6-4.98 6.72-4.98z" />
                </svg>
                <span>Lanjut via Google</span>
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '22px' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>atau isi formulir email</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
            </div>

            {isOtpStep ? (
              <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.08) 0%, rgba(2, 132, 199, 0.08) 100%)',
                  border: '1px solid rgba(79, 70, 229, 0.25)',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '4px' }}>
                    Konfirmasi Email Anda
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Kode verifikasi 6 digit telah dikirim ke:
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--accent-primary)', marginTop: '2px' }}>
                    {otpEmail}
                  </div>
                  {previewOtp && (
                    <div style={{
                      marginTop: '10px',
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px dashed rgba(16, 185, 129, 0.3)',
                      color: 'var(--accent-emerald)',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                    }}>
                      Demo OTP Otomatis: <b>{previewOtp}</b>
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Masukkan 6 Digit Kode OTP
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    autoFocus
                    placeholder="Contoh: 123456"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: 'var(--radius-md)',
                      border: '2px solid var(--border-medium)',
                      background: 'var(--bg-surface)',
                      color: 'var(--text-primary)',
                      fontSize: '1.4rem',
                      fontWeight: 800,
                      letterSpacing: '0.35em',
                      textAlign: 'center',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || otpCode.length !== 6}
                  style={{
                    padding: '12px 20px',
                    borderRadius: 'var(--radius-md)',
                    background: otpCode.length === 6 ? 'var(--accent-primary)' : 'var(--bg-surface-elevated)',
                    color: otpCode.length === 6 ? '#FFFFFF' : 'var(--text-muted)',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: otpCode.length === 6 ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: otpCode.length === 6 ? '0 4px 12px rgba(79, 70, 229, 0.28)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {isSubmitting ? <Loader2 size={17} className="spinner" /> : <ArrowRight size={17} />}
                  <span>{isSubmitting ? 'Memverifikasi...' : 'Verifikasi OTP & Aktifkan Akun'}</span>
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOtpStep(false);
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      padding: 0,
                      textDecoration: 'underline',
                    }}
                  >
                    Ganti data pendaftaran
                  </button>

                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendCooldown > 0 || isSubmitting}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: resendCooldown > 0 ? 'var(--text-muted)' : 'var(--accent-primary)',
                      cursor: resendCooldown > 0 ? 'default' : 'pointer',
                      fontWeight: 600,
                      padding: 0,
                    }}
                  >
                    {resendCooldown > 0 ? `Kirim ulang (${resendCooldown}s)` : 'Kirim Ulang OTP'}
                  </button>
                </div>
              </form>
            ) : mode === 'login' ? (
              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Email atau Username
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Firli-stack atau firli@example.com"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                      background: 'var(--bg-surface)',
                      color: 'var(--text-primary)',
                      fontSize: '0.88rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Masukkan password Anda"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                      background: 'var(--bg-surface)',
                      color: 'var(--text-primary)',
                      fontSize: '0.88rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    marginTop: '8px',
                    padding: '12px 20px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--accent-primary)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.28)',
                  }}
                >
                  {isSubmitting ? <Loader2 size={17} className="spinner" /> : <ArrowRight size={17} />}
                  <span>{isSubmitting ? 'Memverifikasi...' : 'Masuk Sekarang'}</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Firli Hanifurahman"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                      background: 'var(--bg-surface)',
                      color: 'var(--text-primary)',
                      fontSize: '0.88rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Username Unik
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="firli-stack"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                      background: 'var(--bg-surface)',
                      color: 'var(--text-primary)',
                      fontSize: '0.88rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="firli@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                      background: 'var(--bg-surface)',
                      color: 'var(--text-primary)',
                      fontSize: '0.88rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Minimal 6 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                      background: 'var(--bg-surface)',
                      color: 'var(--text-primary)',
                      fontSize: '0.88rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    marginTop: '8px',
                    padding: '12px 20px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--accent-primary)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.28)',
                  }}
                >
                  {isSubmitting ? <Loader2 size={17} className="spinner" /> : <ArrowRight size={17} />}
                  <span>{isSubmitting ? 'Mendaftarkan...' : 'Lanjut ke Konfirmasi OTP'}</span>
                </button>
              </form>
            )}
          </div>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '24px',
          color: 'var(--text-muted)',
          fontSize: '0.78rem',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <ShieldCheck size={14} color="var(--accent-emerald)" />
            Privasi Terlindungi
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Zap size={14} color="var(--accent-primary)" />
            OAuth Sekali Klik
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Lock size={14} color="var(--accent-primary)" />
            Enkripsi BCrypt & JWT
          </span>
        </div>
      </div>
    </div>
  );
};
