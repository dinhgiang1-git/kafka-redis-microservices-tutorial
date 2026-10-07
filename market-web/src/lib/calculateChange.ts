import type { PriceChangeInfo } from '../types/price';

export function calculateChange(
  priceInput: string | number | null | undefined,
  initialPriceInput: string | number | null | undefined
): PriceChangeInfo {
  if (priceInput === null || priceInput === undefined || initialPriceInput === null || initialPriceInput === undefined) {
    return { changeAmount: 0, changePercent: 0, direction: 'unchanged', isValid: false };
  }

  const price = typeof priceInput === 'number' ? priceInput : parseFloat(String(priceInput));
  const initialPrice = typeof initialPriceInput === 'number' ? initialPriceInput : parseFloat(String(initialPriceInput));

  if (!Number.isFinite(price) || !Number.isFinite(initialPrice) || initialPrice <= 0) {
    return {
      changeAmount: 0,
      changePercent: 0,
      direction: 'unchanged',
      isValid: false,
    };
  }

  const changeAmount = price - initialPrice;
  const changePercent = (changeAmount / initialPrice) * 100;

  let direction: 'up' | 'down' | 'unchanged' = 'unchanged';
  if (changeAmount > 0.00000001) {
    direction = 'up';
  } else if (changeAmount < -0.00000001) {
    direction = 'down';
  }

  return {
    changeAmount,
    changePercent,
    direction,
    isValid: true,
  };
}
