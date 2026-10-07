import { describe, it, expect } from 'vitest';
import { isValidPriceDocument } from '../pricesApi';

describe('isValidPriceDocument', () => {
  it('validates correct document structure', () => {
    const valid = {
      symbol: 'BTC/USDT',
      initialPrice: 65000,
      price: 65300,
      sequence: 12,
      updateAt: '2026-10-07T12:00:00Z',
    };
    expect(isValidPriceDocument(valid)).toBe(true);
  });

  it('rejects document missing symbol', () => {
    const invalid = {
      initialPrice: 65000,
      price: 65300,
      sequence: 12,
      updateAt: '2026-10-07T12:00:00Z',
    };
    expect(isValidPriceDocument(invalid)).toBe(false);
  });

  it('rejects document missing price', () => {
    const invalid = {
      symbol: 'BTC/USDT',
      initialPrice: 65000,
      sequence: 12,
      updateAt: '2026-10-07T12:00:00Z',
    };
    expect(isValidPriceDocument(invalid)).toBe(false);
  });

  it('rejects null or non-object', () => {
    expect(isValidPriceDocument(null)).toBe(false);
    expect(isValidPriceDocument('string')).toBe(false);
  });
});
