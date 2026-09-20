import React, { useState } from 'react';
import { Flame, Bell, BellRing, X } from 'lucide-react';
import type { LogEntry } from '../../types';

interface DailyStreakNudgeProps {
  logs: LogEntry[];
  streakDays: number;
}

export const DailyStreakNudge: React.FC<DailyStreakNudgeProps> = ({ logs, streakDays }) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );

  const todayIso = new Date().toISOString().split('T')[0];
  const hasLoggedToday = logs.some((l) => {
    return l.createdAt?.startsWith(todayIso) || l.logDate === todayIso;
  });

  const requestNotification = async () => {
    if (typeof Notification === 'undefined') return;
    try {
      const perm = await Notification.requestPermission();
      setNotificationPermission(perm);
      if (perm === 'granted') {
        new Notification('Logfolio Streak Reminder Aktif! 🔥', {
          body: `Kami akan mengingatkan Anda untuk menjaga streak ${streakDays} hari Anda sebelum hari berganti.`,
          icon: '/favicon.svg',
        });
      }
    } catch {
    }
  };

  if (hasLoggedToday || isDismissed) {
    return null;
  }

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(239, 68, 68, 0.08))',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        borderRadius: 'var(--radius-lg)',
        padding: '12px 18px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        animation: 'fadeIn 0.2s ease-out',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #F59E0B, #EF4444)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)',
            flexShrink: 0,
          }}
        >
          <Flame size={20} />
        </div>
        <div>
          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Pertahankan Streak {streakDays} Hari Anda Hari Ini!
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Anda belum mencatat progres hari ini. Luangkan 1 menit untuk menulis quick-log agar ritme kerja tetap tercatat rapi.
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {typeof Notification !== 'undefined' && notificationPermission !== 'granted' && (
          <button
            type="button"
            onClick={requestNotification}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <Bell size={13} color="var(--accent-primary)" />
            <span>Aktifkan Reminder</span>
          </button>
        )}

        {notificationPermission === 'granted' && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.72rem',
              color: 'var(--accent-emerald)',
              fontWeight: 600,
            }}
          >
            <BellRing size={13} />
            <span>Reminder Aktif</span>
          </span>
        )}

        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title="Tutup pengingat"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
