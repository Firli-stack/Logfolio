import React, { useState } from 'react';
import type { UserProfile } from '../types';
import { X, Settings, RotateCcw, Shield, Check } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onResetData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  profile,
  onResetData
}) => {
  const [resetConfirmed, setResetConfirmed] = useState(false);
  const [saveNotification, setSaveNotification] = useState(false);

  if (!isOpen) return null;

  const handleReset = () => {
    if (window.confirm('Apakah Anda yakin ingin mengembalikan semua data ke status awal (default)? Perubahan lokal yang belum diekspor akan hilang.')) {
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
    }, 1200);
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
          background: '#FFFFFF',
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
                Pengaturan Akun & Data
              </h2>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Kelola privasi data lokal dan preferensi sistem Logfolio.
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

        {/* Status Info */}
        <div style={{
          padding: '12px',
          borderRadius: 'var(--radius-md)',
          background: '#F8FAFC',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          fontSize: '0.78rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Status Penyimpanan:</span>
            <span style={{ fontWeight: 600, color: 'var(--accent-emerald)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Shield size={13} />
              Tersimpan Lokal (Client-Side)
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Username:</span>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>@{profile.username}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Versi Logfolio:</span>
            <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>v2.4.0 (Stable)</span>
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
              Reset Data Contoh (Factory Reset)
            </h4>
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
            Kembalikan seluruh log, profil, dan wadah proyek ke sampel awal default. Cocok bila Anda ingin memulai portofolio dari nol.
          </p>

          <button
            type="button"
            onClick={handleReset}
            style={{
              alignSelf: 'flex-start',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              background: '#FFFFFF',
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
            <span>{resetConfirmed ? 'Data Berhasil Direset!' : 'Reset ke Data Default'}</span>
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
            <span>{saveNotification ? 'Tersimpan!' : 'Selesai'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
