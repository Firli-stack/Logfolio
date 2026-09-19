import React, { useState, useEffect } from 'react';
import type { UserProfile } from '../../types';
import { X, UserCheck, Upload, Globe, MapPin, Sparkles, Link2 } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSaveProfile: (updatedProfile: UserProfile) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile
}) => {
  const [fullName, setFullName] = useState(profile.fullName);
  const [headline, setHeadline] = useState(profile.headline);
  const [bio, setBio] = useState(profile.bio);
  const [location, setLocation] = useState(profile.location);
  const [timezone, setTimezone] = useState(profile.timezone || 'WIB');
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const [website, setWebsite] = useState(profile.socialLinks.website || '');
  const [github, setGithub] = useState(profile.socialLinks.github || '');
  const [linkedin, setLinkedin] = useState(profile.socialLinks.linkedin || '');
  const [twitter, setTwitter] = useState(profile.socialLinks.twitter || '');

  useEffect(() => {
    if (isOpen) {
      setFullName(profile.fullName);
      setHeadline(profile.headline);
      setBio(profile.bio);
      setLocation(profile.location);
      setTimezone(profile.timezone || 'WIB');
      setAvatarUrl(profile.avatarUrl);
      setWebsite(profile.socialLinks.website || '');
      setGithub(profile.socialLinks.github || '');
      setLinkedin(profile.socialLinks.linkedin || '');
      setTwitter(profile.socialLinks.twitter || '');

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
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatarUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updated: UserProfile = {
      ...profile,
      fullName: fullName.trim() || profile.fullName,
      headline: headline.trim() || profile.headline,
      bio: bio.trim(),
      location: location.trim() || profile.location,
      timezone: timezone.trim() || 'WIB',
      avatarUrl: avatarUrl.trim() || profile.avatarUrl,
      socialLinks: {
        website: website.trim() || undefined,
        github: github.trim() || undefined,
        linkedin: linkedin.trim() || undefined,
        twitter: twitter.trim() || undefined
      }
    };

    onSaveProfile(updated);
    onClose();
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
          maxWidth: '540px',
          maxHeight: 'min(92vh, 760px)',
          background: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          padding: '20px 18px',
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
              <UserCheck size={18} />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.25 }}>
                Edit Profil & Identitas Rekayasa
              </h2>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px', lineHeight: 1.35 }}>
                Perbarui biodata, peran keahlian, dan tautan sosial media publik Anda.
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

        {/* Form Container */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* Avatar Upload / URL Section */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            padding: '12px',
            background: 'var(--bg-surface-elevated)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            <img
              src={avatarUrl}
              alt="Preview Avatar"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';
              }}
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '14px',
                objectFit: 'cover',
                border: '2px solid #FFFFFF',
                boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                flexShrink: 0
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                Foto Profil
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <label style={{
                  padding: '5px 10px',
                  borderRadius: 'var(--radius-sm)',
                  background: '#FFFFFF',
                  border: '1px solid var(--border-medium)',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  <Upload size={12} />
                  <span>Unggah Foto</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarFile}
                    style={{ display: 'none' }}
                  />
                </label>
                <input
                  type="text"
                  placeholder="Atau tempel URL gambar..."
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  style={{
                    flex: '1 1 160px',
                    padding: '5px 8px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                    background: '#FFFFFF',
                    fontSize: '0.72rem',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Full Name & Headline Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Nama Lengkap
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Contoh: Alex Pratama"
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.8rem',
                  background: '#FFFFFF',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Headline Keahlian / Spesialisasi
              </label>
              <input
                type="text"
                required
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Contoh: Backend & Systems Engineer"
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.8rem',
                  background: '#FFFFFF',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Location & Timezone Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                <MapPin size={12} />
                Lokasi Domisili
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Contoh: Batam, Kepulauan Riau / Jakarta"
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.8rem',
                  background: '#FFFFFF',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Zona Waktu
              </label>
              <input
                type="text"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                placeholder="Contoh: WIB / Asia/Jakarta"
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.8rem',
                  background: '#FFFFFF',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Bio / Professional Summary */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
              <Sparkles size={12} color="var(--accent-primary)" />
              Ringkasan Profesional / Bio Singkat
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Ceritakan fokus rekayasa sistem Anda secara padat dan berbobot..."
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.78rem',
                lineHeight: 1.4,
                background: '#FFFFFF',
                boxSizing: 'border-box',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Social Links Section */}
          <div style={{
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Tautan Media & Profil Publik
            </span>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '8px' }}>
              {/* GitHub */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#FFFFFF', padding: '5px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <Link2 size={14} color="var(--text-secondary)" style={{ flexShrink: 0 }} />
                <input
                  type="url"
                  placeholder="https://github.com/username"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.74rem', background: 'transparent' }}
                />
              </div>

              {/* LinkedIn */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#FFFFFF', padding: '5px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <Link2 size={14} color="#0A66C2" style={{ flexShrink: 0 }} />
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.74rem', background: 'transparent' }}
                />
              </div>

              {/* Website */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#FFFFFF', padding: '5px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <Globe size={14} color="var(--accent-primary)" style={{ flexShrink: 0 }} />
                <input
                  type="url"
                  placeholder="https://yourwebsite.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.74rem', background: 'transparent' }}
                />
              </div>

              {/* Twitter / X */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#FFFFFF', padding: '5px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <Link2 size={14} color="var(--text-secondary)" style={{ flexShrink: 0 }} />
                <input
                  type="url"
                  placeholder="https://twitter.com/username"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.74rem', background: 'transparent' }}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'transparent',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              Batal
            </button>
            <button
              type="submit"
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--accent-primary)',
                border: 'none',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: '#FFFFFF',
                boxShadow: 'var(--shadow-glow)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <UserCheck size={14} />
              <span>Simpan Profil</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
