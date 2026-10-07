import { useRef, useMemo } from 'react';
import type { PriceDocument, PriceDirection } from '../types/price';

export interface SymbolDirectionState {
  direction: PriceDirection;
  flashKey: string;
  previousPrice: number | null;
}

export function usePriceDirections(prices: PriceDocument[]): Record<string, SymbolDirectionState> {
  // Store previous price state: symbol -> { price, sequence }
  const prevMapRef = useRef<Map<string, { price: number; sequence: number }>>(new Map());

  const directions = useMemo(() => {
    const result: Record<string, SymbolDirectionState> = {};
    const prevMap = prevMapRef.current;

    for (const doc of prices) {
      const currentPrice = typeof doc.price === 'number' ? doc.price : parseFloat(String(doc.price));
      const currentSeq = Number(doc.sequence);
      const prev = prevMap.get(doc.symbol);

      if (!prev) {
        // Initial render: no animation/flash
        result[doc.symbol] = {
          direction: 'unchanged',
          flashKey: `${doc.symbol}-init`,
          previousPrice: null,
        };
        prevMap.set(doc.symbol, { price: currentPrice, sequence: currentSeq });
      } else {
        if (currentSeq <= prev.sequence) {
          // Sequence not newer: ignore effect
          result[doc.symbol] = {
            direction: 'unchanged',
            flashKey: `${doc.symbol}-${prev.sequence}`,
            previousPrice: prev.price,
          };
        } else {
          // Compare prices
          let dir: PriceDirection = 'unchanged';
          if (currentPrice > prev.price) {
            dir = 'up';
          } else if (currentPrice < prev.price) {
            dir = 'down';
          }

          result[doc.symbol] = {
            direction: dir,
            flashKey: `${doc.symbol}-${currentSeq}-${dir}`,
            previousPrice: prev.price,
          };

          // Update record with latest
          prevMap.set(doc.symbol, { price: currentPrice, sequence: currentSeq });
        }
      }
    }

    return result;
  }, [prices]);

  return directions;
}
