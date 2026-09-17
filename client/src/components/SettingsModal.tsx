import React, { useState } from 'react';
import type { UserProfile } from '../types';
import { X, Settings, RotateCcw, Shield, Check, Sun, Moon, Languages } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onResetData: () => void;
  theme?: 'light' | 'dark';
  onThemeChange?: (theme: 'light' | 'dark') => void;
  appLang?: 'id' | 'en';
  onLangChange?: (lang: 'id' | 'en') => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  profile,
  onResetData,
  theme = 'light',
  onThemeChange,
  appLang = 'id',
  onLangChange
}) => {
  const [resetConfirmed, setResetConfirmed] = useState(false);
  const [saveNotification, setSaveNotification] = useState(false);

  if (!isOpen) return null;

  const isEn = appLang === 'en';

  const handleReset = () => {
    const confirmMsg = isEn
      ? 'Are you sure you want to reset all data to the initial defaults? Any unsaved local edits will be lost.'
      : 'Apakah Anda yakin ingin mengembalikan semua data ke status awal (default)? Perubahan lokal yang belum diekspor akan hilang.';

    if (window.confirm(confirmMsg)) {
      onResetData();
      setResetConfirmed(true);
      setTimeout(() => {
        setResetConfirmed(false);
        onClose();
      }, 1500);
    }
  };

  const handleSimulateSave = () => {
    setSaveNotification(true);
    setTimeout(() => {
      setSaveNotification(false);
      onClose();
    }, 1000);
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
        overflowY: 'auto'
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '480px',
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px 18px',
          boxShadow: 'var(--shadow-xl)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          margin: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
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
              <Settings size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {isEn ? 'Settings & Preferences' : 'Pengaturan & Preferensi'}
              </h2>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                {isEn ? 'Customize appearance, language, and system storage.' : 'Sesuaikan tampilan tema, bahasa, dan penyimpanan data.'}
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
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Theme & Language Configuration */}
        <div style={{
          padding: '14px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          {/* Theme Selector */}
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sun size={14} color="var(--accent-amber)" />
              <span>{isEn ? 'Appearance Theme' : 'Tema Tampilan'}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => onThemeChange && onThemeChange('light')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: theme === 'light' ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                  background: theme === 'light' ? 'var(--bg-surface)' : 'transparent',
                  color: theme === 'light' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  fontWeight: theme === 'light' ? 700 : 500,
                  fontSize: '0.76rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <Sun size={13} />
                <span>{isEn ? 'Light Theme' : 'Terang (Light)'}</span>
              </button>

              <button
                type="button"
                onClick={() => onThemeChange && onThemeChange('dark')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: theme === 'dark' ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                  background: theme === 'dark' ? 'var(--bg-surface)' : 'transparent',
                  color: theme === 'dark' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  fontWeight: theme === 'dark' ? 700 : 500,
                  fontSize: '0.76rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <Moon size={13} />
                <span>{isEn ? 'Dark Theme' : 'Gelap (Dark)'}</span>
              </button>
            </div>
          </div>

          {/* Language Selector */}
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Languages size={14} color="var(--accent-cyan)" />
              <span>{isEn ? 'Application Language' : 'Bahasa Aplikasi'}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => onLangChange && onLangChange('id')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: appLang === 'id' ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                  background: appLang === 'id' ? 'var(--bg-surface)' : 'transparent',
                  color: appLang === 'id' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  fontWeight: appLang === 'id' ? 700 : 500,
                  fontSize: '0.76rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>🇮🇩 Indonesia</span>
              </button>

              <button
                type="button"
                onClick={() => onLangChange && onLangChange('en')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: appLang === 'en' ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                  background: appLang === 'en' ? 'var(--bg-surface)' : 'transparent',
                  color: appLang === 'en' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  fontWeight: appLang === 'en' ? 700 : 500,
                  fontSize: '0.76rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>🇬🇧 English</span>
              </button>
            </div>
          </div>
        </div>

        {/* Status Info */}
        <div style={{
          padding: '12px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          fontSize: '0.78rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)' }}>{isEn ? 'Storage Engine:' : 'Penyimpanan:'}</span>
            <span style={{ fontWeight: 600, color: 'var(--accent-emerald)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Shield size={13} />
              {isEn ? 'Local Client-Side (Offline Ready)' : 'Tersimpan Lokal (Client-Side)'}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Username:</span>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>@{profile.username}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)' }}>{isEn ? 'Logfolio Version:' : 'Versi Logfolio:'}</span>
            <span style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>v1.0.0 (Release)</span>
          </div>
        </div>

        {/* Reset Section */}
        <div style={{
          padding: '12px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(239, 68, 68, 0.04)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <RotateCcw size={14} color="var(--accent-danger)" />
            <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-danger)' }}>
              {isEn ? 'Factory Reset (Sample Data)' : 'Reset Data Contoh (Factory Reset)'}
            </h4>
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
            {isEn
              ? 'Reset all logs, projects, and profile back to defaults. Useful if you wish to start your portfolio completely afresh.'
              : 'Kembalikan seluruh log, profil, dan wadah proyek ke sampel awal default. Cocok bila Anda ingin memulai portofolio dari nol.'}
          </p>

          <button
            type="button"
            onClick={handleReset}
            style={{
              alignSelf: 'flex-start',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-surface)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: 'var(--accent-danger)',
              fontWeight: 600,
              fontSize: '0.74rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RotateCcw size={12} />
            <span>
              {resetConfirmed
                ? (isEn ? 'Reset Successful!' : 'Data Berhasil Direset!')
                : (isEn ? 'Reset to Default Data' : 'Reset ke Data Default')}
            </span>
          </button>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button
            type="button"
            onClick={handleSimulateSave}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--accent-primary)',
              border: 'none',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '0.78rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: 'var(--shadow-glow)'
            }}
          >
            <Check size={14} />
            <span>{saveNotification ? (isEn ? 'Saved!' : 'Tersimpan!') : (isEn ? 'Done' : 'Selesai')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
