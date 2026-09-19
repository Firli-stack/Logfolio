import React, { useState, useRef, useEffect } from 'react';
import type { UserProfile } from '../../types';
import { Code2, Flame, Globe, PenSquare, ChevronDown, User, Settings, LogOut, Sparkles } from 'lucide-react';

interface NavbarProps {
  profile: UserProfile;
  activeTab: 'public_preview' | 'dashboard_composer';
  onTabChange: (tab: 'public_preview' | 'dashboard_composer') => void;
  onOpenEditProfile: () => void;
  onOpenSettings: () => void;
  onOpenAiDigest?: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  activeTab,
  onTabChange,
  onOpenEditProfile,
  onOpenSettings,
  onOpenAiDigest,
  onLogout
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isDropdownOpen]);

  return (
    <header className="app-header no-print">
      {/* Top row: Brand & User Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: '8px' }} className="app-header-top">
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, var(--accent-primary), #0284C7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 2px 8px rgba(79, 70, 229, 0.25)'
          }}>
            <Code2 size={18} strokeWidth={2.5} />
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            Logfolio<span style={{ color: 'var(--accent-primary)' }}>.dev</span>
          </span>
        </div>

        {/* Right Section: AI Digest Button, Streak & User Profile Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {onOpenAiDigest && (
            <button
              type="button"
              onClick={onOpenAiDigest}
              style={{
                background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(2, 132, 199, 0.1))',
                border: '1px solid rgba(79, 70, 229, 0.25)',
                borderRadius: 'var(--radius-full)',
                padding: '5px 12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: 'var(--accent-primary)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              title="Buat AI Executive Digest & LinkedIn Post"
            >
              <Sparkles size={14} color="var(--accent-primary)" />
              <span>AI Digest</span>
            </button>
          )}

          {/* Streak Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Flame size={15} color="var(--accent-emerald)" />
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
              {profile.streakDays}d Streak
            </span>
          </div>

          {/* User Profile Dropdown Menu */}
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{
                background: isDropdownOpen ? 'var(--bg-surface-elevated)' : 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-full)',
                padding: '3px 8px 3px 4px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: 'var(--shadow-subtle)'
              }}
            >
              <img
                src={profile.avatarUrl}
                alt={profile.fullName}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';
                }}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {profile.fullName.split(' ')[0]}
              </span>
              <ChevronDown size={14} color="var(--text-muted)" style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }} />
            </button>

            {/* Dropdown Popup Panel */}
            {isDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: '220px',
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: '12px',
                  padding: '6px',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.08)',
                  zIndex: 9999,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  border: '1px solid var(--border-medium)',
                  overflow: 'hidden'
                }}
              >
                {/* User Info Header */}
                <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '4px' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {profile.fullName}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    @{profile.username} · Active
                  </div>
                </div>

                {/* Option 1: Edit Profile */}
                <button
                  type="button"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onOpenEditProfile();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--text-primary)',
                    fontSize: '0.78rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                    transition: 'background 0.1s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-surface-elevated)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <User size={14} color="var(--accent-primary)" />
                  <span>Edit Profil</span>
                </button>

                {/* Option 2: Settings */}
                <button
                  type="button"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onOpenSettings();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--text-primary)',
                    fontSize: '0.78rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                    transition: 'background 0.1s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-surface-elevated)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <Settings size={14} color="var(--text-secondary)" />
                  <span>Pengaturan</span>
                </button>

                {/* Divider */}
                <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '4px 0' }} />

                {/* Option 3: Log Out */}
                <button
                  type="button"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onLogout();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--accent-danger)',
                    fontSize: '0.78rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                    transition: 'background 0.1s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <LogOut size={14} />
                  <span>Keluar / Mode Tamu</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* View Toggle Tabs */}
      <div className="header-nav-toggle" style={{ display: 'flex', background: '#F1F5F9', padding: '4px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)', width: '100%' }}>
        <button
          onClick={() => onTabChange('public_preview')}
          style={{
            flex: 1,
            padding: '6px 12px',
            borderRadius: 'var(--radius-full)',
            border: 'none',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer',
            background: activeTab === 'public_preview' ? 'var(--accent-primary)' : 'transparent',
            color: activeTab === 'public_preview' ? '#fff' : 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.15s ease'
          }}
        >
          <Globe size={14} />
          <span>Portofolio</span>
        </button>
        <button
          onClick={() => onTabChange('dashboard_composer')}
          style={{
            flex: 1,
            padding: '6px 12px',
            borderRadius: 'var(--radius-full)',
            border: 'none',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer',
            background: activeTab === 'dashboard_composer' ? 'var(--accent-primary)' : 'transparent',
            color: activeTab === 'dashboard_composer' ? '#fff' : 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.15s ease'
          }}
        >
          <PenSquare size={14} />
          <span>Quick-Log</span>
        </button>
      </div>
    </header>
  );
};
