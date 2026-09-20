const NOTIFICATION_PERMISSION_KEY = 'logfolio_streak_notif_enabled_v1';
const LAST_NOTIFIED_DATE_KEY = 'logfolio_last_streak_nudge_date_v1';

export function isStreakNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getStreakNotificationState(): boolean {
  if (!isStreakNotificationSupported()) return false;
  return Notification.permission === 'granted' && localStorage.getItem(NOTIFICATION_PERMISSION_KEY) === 'true';
}

export async function requestStreakNotificationPermission(): Promise<boolean> {
  if (!isStreakNotificationSupported()) return false;
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      localStorage.setItem(NOTIFICATION_PERMISSION_KEY, 'true');
      return true;
    }
  } catch {
  }
  localStorage.setItem(NOTIFICATION_PERMISSION_KEY, 'false');
  return false;
}

export function checkAndSendStreakNudge(streakDays: number, logsTodayCount: number): void {
  if (!isStreakNotificationSupported() || !getStreakNotificationState()) return;

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const lastDate = localStorage.getItem(LAST_NOTIFIED_DATE_KEY);

  if (lastDate === todayStr) return;

  if (now.getHours() >= 18 && logsTodayCount === 0) {
    try {
      new Notification(`Pertahankan Streak ${streakDays} Hari Anda! 🔥`, {
        body: 'Anda belum mencatat progres rekayasa hari ini. Luangkan 1 menit untuk mencatat micro-log Anda di Logfolio.',
        icon: '/favicon.ico',
        tag: 'streak-nudge',
      });
      localStorage.setItem(LAST_NOTIFIED_DATE_KEY, todayStr);
    } catch {
    }
  }
}
