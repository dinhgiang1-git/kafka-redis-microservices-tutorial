import { describe, it, expect } from 'vitest';
import { calculateChange } from '../calculateChange';

describe('calculateChange', () => {
  it('correctly calculates positive price change and percentage', () => {
    const result = calculateChange(65321.12, 65000);
    expect(result.isValid).toBe(true);
    expect(result.direction).toBe('up');
    expect(result.changeAmount).toBeCloseTo(321.12, 2);
    expect(result.changePercent).toBeCloseTo(0.494, 2);
  });

  it('correctly calculates negative price change and percentage', () => {
    const result = calculateChange(3487.4, 3500);
    expect(result.isValid).toBe(true);
    expect(result.direction).toBe('down');
    expect(result.changeAmount).toBeCloseTo(-12.6, 2);
    expect(result.changePercent).toBeCloseTo(-0.36, 2);
  });

  it('detects unchanged price', () => {
    const result = calculateChange(500, 500);
    expect(result.isValid).toBe(true);
    expect(result.direction).toBe('unchanged');
    expect(result.changeAmount).toBe(0);
    expect(result.changePercent).toBe(0);
  });

  it('handles string number inputs cleanly', () => {
    const result = calculateChange('150.75', '150');
    expect(result.isValid).toBe(true);
    expect(result.direction).toBe('up');
    expect(result.changePercent).toBeCloseTo(0.5, 2);
  });

  it('returns invalid when initialPrice is 0 or negative', () => {
    const resultZero = calculateChange(100, 0);
    expect(resultZero.isValid).toBe(false);
    expect(resultZero.changePercent).toBe(0);

    const resultNeg = calculateChange(100, -50);
    expect(resultNeg.isValid).toBe(false);
  });

  it('handles null, undefined, and NaN gracefully', () => {
    expect(calculateChange(null, 100).isValid).toBe(false);
    expect(calculateChange(100, undefined).isValid).toBe(false);
    expect(calculateChange('invalid', 100).isValid).toBe(false);
  });
});
