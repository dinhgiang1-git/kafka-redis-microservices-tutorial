import { requestJson } from './httpClient';
import type { PriceDocument } from '../types/price';
import { sortCoinsByDefinedOrder } from '../lib/coinConstants';

/**
 * Validates a single price document from server.
 * Returns true if valid, false otherwise.
 */
export function isValidPriceDocument(item: unknown): item is PriceDocument {
  if (!item || typeof item !== 'object') return false;
  const doc = item as Partial<PriceDocument>;

  if (typeof doc.symbol !== 'string' || doc.symbol.trim() === '') {
    return false;
  }

  if (doc.price === undefined || doc.price === null) {
    return false;
  }

  if (doc.initialPrice === undefined || doc.initialPrice === null) {
    return false;
  }

  if (typeof doc.sequence !== 'number' && typeof doc.sequence !== 'string') {
    return false;
  }

  if (typeof doc.updateAt !== 'string' || doc.updateAt.trim() === '') {
    return false;
  }

  return true;
}

/**
 * Fetches all prices from /api/prices
 */
export async function getMarketPrices(): Promise<PriceDocument[]> {
  const data = await requestJson<unknown[]>('/api/prices');

  if (!Array.isArray(data)) {
    throw new Error('Định dạng dữ liệu trả về từ server không phải là danh sách mảng');
  }

  const validDocuments: PriceDocument[] = [];

  for (const item of data) {
    if (isValidPriceDocument(item)) {
      validDocuments.push({
        symbol: item.symbol,
        initialPrice: item.initialPrice,
        price: item.price,
        sequence: Number(item.sequence),
        updateAt: item.updateAt,
      });
    } else {
      console.warn('[MarketWeb] Bỏ qua bản ghi giá không hợp lệ:', item);
    }
  }

  return sortCoinsByDefinedOrder(validDocuments);
}

// In-memory mock simulator state for offline demo / fallback preview
const mockState: Record<
  string,
  { basePrice: number; currentPrice: number; sequence: number }
> = {
  'BTC/USDT': { basePrice: 65000, currentPrice: 65342.5, sequence: 100 },
  'ETH/USDT': { basePrice: 3500, currentPrice: 3485.2, sequence: 100 },
  'BNB/USDT': { basePrice: 580, currentPrice: 584.75, sequence: 100 },
  'SOL/USDT': { basePrice: 150, currentPrice: 153.25, sequence: 100 },
  'XRP/USDT': { basePrice: 0.55, currentPrice: 0.5482, sequence: 100 },
};

export function getMockMarketPrices(): PriceDocument[] {
  const now = new Date().toISOString();

  return sortCoinsByDefinedOrder(
    Object.entries(mockState).map(([symbol, state]) => {
      // Small simulated random walk (-0.4% to +0.4%)
      const deltaPercent = (Math.random() - 0.49) * 0.008;
      const newPrice = Math.max(0.0001, state.currentPrice * (1 + deltaPercent));
      state.currentPrice = newPrice;
      state.sequence += 1;

      return {
        symbol,
        initialPrice: state.basePrice,
        price: Number(newPrice.toFixed(symbol === 'XRP/USDT' ? 4 : 2)),
        sequence: state.sequence,
        updateAt: now,
      };
    })
  );
}
