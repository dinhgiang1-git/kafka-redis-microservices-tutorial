/**
 * Formats a price value according to financial dashboard standards:
 * - Price >= 1,000: 2 decimal places (e.g. 65,321.12)
 * - Price >= 1: 2 to 4 decimal places (e.g. 3,487.40, 582.15)
 * - Price < 1: up to 6 decimal places (e.g. 0.523410)
 */
export function formatPrice(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === '') {
    return '—';
  }

  const num = typeof value === 'number' ? value : parseFloat(String(value));
  if (!Number.isFinite(num)) {
    return '—';
  }

  if (num >= 1000) {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  }

  if (num >= 1) {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(num);
  }

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 6,
  }).format(num);
}

/**
 * Formats percentage change with '+' sign for positive values
 */
export function formatPercent(percent: number | null | undefined): string {
  if (percent === null || percent === undefined || !Number.isFinite(percent)) {
    return '—';
  }

  const sign = percent > 0 ? '+' : '';
  return `${sign}${percent.toFixed(2)}%`;
}

/**
 * Formats a date/timestamp to time string (HH:mm:ss) or relative time
 */
export function formatTime(isoString: string | null | undefined): string {
  if (!isoString) return '—';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '—';
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  } catch {
    return '—';
  }
}

/**
 * Format relative elapsed time in seconds
 */
export function formatRelativeTime(isoString: string | null | undefined, nowMs: number = Date.now()): string {
  if (!isoString) return '—';
  try {
    const time = new Date(isoString).getTime();
    if (isNaN(time)) return '—';
    const diffSec = Math.max(0, Math.floor((nowMs - time) / 1000));
    if (diffSec < 2) return 'vừa xong';
    if (diffSec < 60) return `${diffSec}s trước`;
    const diffMin = Math.floor(diffSec / 60);
    return `${diffMin}m trước`;
  } catch {
    return '—';
  }
}
