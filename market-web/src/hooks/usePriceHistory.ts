import { useRef, useMemo } from 'react';
import type { PriceDocument, PriceHistoryPoint } from '../types/price';

const MAX_HISTORY_POINTS = 60;

export function usePriceHistory(prices: PriceDocument[]): Record<string, number[]> {
  const historyMapRef = useRef<Map<string, PriceHistoryPoint[]>>(new Map());

  const histories = useMemo(() => {
    const result: Record<string, number[]> = {};
    const map = historyMapRef.current;
    const now = Date.now();

    for (const doc of prices) {
      const price = typeof doc.price === 'number' ? doc.price : parseFloat(String(doc.price));
      if (!Number.isFinite(price)) continue;

      const seq = Number(doc.sequence);
      const existing = map.get(doc.symbol) || [];

      // Avoid adding duplicate sequence
      const lastPoint = existing[existing.length - 1];
      if (!lastPoint || lastPoint.sequence !== seq) {
        const updated = [...existing, { price, sequence: seq, timestamp: now }].slice(
          -MAX_HISTORY_POINTS
        );
        map.set(doc.symbol, updated);
      }

      result[doc.symbol] = (map.get(doc.symbol) || []).map((pt) => pt.price);
    }

    return result;
  }, [prices]);

  return histories;
}
