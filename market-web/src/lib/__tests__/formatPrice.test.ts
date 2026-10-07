import { describe, it, expect } from 'vitest';
import { formatPrice, formatPercent, formatRelativeTime } from '../formatPrice';

describe('formatPrice', () => {
  it('formats prices >= 1000 with 2 decimal places and commas', () => {
    expect(formatPrice(65321.125)).toBe('65,321.13');
    expect(formatPrice('65000')).toBe('65,000.00');
  });

  it('formats prices >= 1 with 2 to 4 decimal places', () => {
    expect(formatPrice(582.15)).toBe('582.15');
    expect(formatPrice(1.2345)).toBe('1.2345');
  });

  it('formats prices < 1 with up to 6 decimal places', () => {
    expect(formatPrice(0.5482)).toBe('0.5482');
    expect(formatPrice(0.000123)).toBe('0.000123');
  });

  it('returns fallback dash for invalid values', () => {
    expect(formatPrice(null)).toBe('—');
    expect(formatPrice(undefined)).toBe('—');
    expect(formatPrice('')).toBe('—');
    expect(formatPrice('abc')).toBe('—');
  });
});

describe('formatPercent', () => {
  it('prefixes positive percentages with +', () => {
    expect(formatPercent(0.49)).toBe('+0.49%');
    expect(formatPercent(12.345)).toBe('+12.35%');
  });

  it('formats negative percentages without +', () => {
    expect(formatPercent(-0.36)).toBe('-0.36%');
  });

  it('handles null/undefined gracefully', () => {
    expect(formatPercent(null)).toBe('—');
  });
});

describe('formatRelativeTime', () => {
  it('returns "vừa xong" for recent times < 2s', () => {
    const now = 1000000;
    const iso = new Date(now - 1000).toISOString();
    expect(formatRelativeTime(iso, now)).toBe('vừa xong');
  });

  it('returns seconds ago for times < 60s', () => {
    const now = 1000000;
    const iso = new Date(now - 10000).toISOString();
    expect(formatRelativeTime(iso, now)).toBe('10s trước');
  });
});
