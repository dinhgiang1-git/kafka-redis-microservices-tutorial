import { describe, it, expect } from 'vitest';
import { evaluateSymbolStaleness, evaluateSystemHealth } from '../marketStatus';

describe('evaluateSymbolStaleness', () => {
  const now = 1000000000000;

  it('reports healthy when age is under 5 seconds', () => {
    const updateAt = new Date(now - 2000).toISOString();
    const result = evaluateSymbolStaleness(updateAt, now);
    expect(result.level).toBe('healthy');
    expect(result.label).toBe('LIVE');
    expect(result.ageSeconds).toBe(2);
  });

  it('reports warning when age is between 5 and 15 seconds', () => {
    const updateAt = new Date(now - 7000).toISOString();
    const result = evaluateSymbolStaleness(updateAt, now);
    expect(result.level).toBe('warning');
    expect(result.label).toBe('Chậm trễ');
    expect(result.ageSeconds).toBe(7);
  });

  it('reports critical when age is over 15 seconds', () => {
    const updateAt = new Date(now - 20000).toISOString();
    const result = evaluateSymbolStaleness(updateAt, now);
    expect(result.level).toBe('critical');
    expect(result.label).toBe('Mất dữ liệu');
    expect(result.ageSeconds).toBe(20);
  });

  it('handles null timestamp', () => {
    const result = evaluateSymbolStaleness(null, now);
    expect(result.level).toBe('offline');
  });
});

describe('evaluateSystemHealth', () => {
  it('returns offline when hasError and no data', () => {
    const result = evaluateSystemHealth(true, false, false, 0);
    expect(result.level).toBe('offline');
  });

  it('returns warning when hasError but has cached data', () => {
    const result = evaluateSystemHealth(true, false, true, 2);
    expect(result.level).toBe('warning');
  });

  it('returns healthy when connected and fresh', () => {
    const result = evaluateSystemHealth(false, false, true, 1);
    expect(result.level).toBe('healthy');
  });
});
