export interface StreakCalculationResult {
  streakDays: number;
  streakFreezeLeft: number;
  totalActiveDays: number;
}

export const calculateTimezoneAwareStreak = (
  logDates: Date[],
  timezone: string = 'Asia/Jakarta',
  availableFreeze: number = 2
): StreakCalculationResult => {
  if (!logDates || logDates.length === 0) {
    return {
      streakDays: 0,
      streakFreezeLeft: availableFreeze,
      totalActiveDays: 0,
    };
  }

  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const uniqueDateSet = new Set<string>();
  for (const date of logDates) {
    try {
      const parts = formatter.formatToParts(date);
      const year = parts.find((p) => p.type === 'year')?.value;
      const month = parts.find((p) => p.type === 'month')?.value;
      const day = parts.find((p) => p.type === 'day')?.value;
      if (year && month && day) {
        uniqueDateSet.add(`${year}-${month}-${day}`);
      }
    } catch {
      uniqueDateSet.add(date.toISOString().split('T')[0]);
    }
  }

  const totalActiveDays = uniqueDateSet.size;

  const now = new Date();
  const nowParts = formatter.formatToParts(now);
  const nowYear = parseInt(nowParts.find((p) => p.type === 'year')?.value || '1970', 10);
  const nowMonth = parseInt(nowParts.find((p) => p.type === 'month')?.value || '1', 10) - 1;
  const nowDay = parseInt(nowParts.find((p) => p.type === 'day')?.value || '1', 10);

  let currentCheck = new Date(Date.UTC(nowYear, nowMonth, nowDay));

  const nowDateString = currentCheck.toISOString().split('T')[0];

  if (!uniqueDateSet.has(nowDateString)) {
    currentCheck.setUTCDate(currentCheck.getUTCDate() - 1);
  }

  let streak = 0;
  let freezeLeft = availableFreeze;

  while (true) {
    const dateStr = currentCheck.toISOString().split('T')[0];
    if (uniqueDateSet.has(dateStr)) {
      streak++;
      currentCheck.setUTCDate(currentCheck.getUTCDate() - 1);
    } else if (freezeLeft > 0) {
      freezeLeft--;
      currentCheck.setUTCDate(currentCheck.getUTCDate() - 1);
    } else {
      break;
    }
  }

  return {
    streakDays: Math.max(streak, totalActiveDays > 0 ? 1 : 0),
    streakFreezeLeft: freezeLeft,
    totalActiveDays,
  };
};
