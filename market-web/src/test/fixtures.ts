import type { PriceDocument } from '../types/price';

export const mockPriceDocuments: PriceDocument[] = [
  {
    symbol: 'BTC/USDT',
    initialPrice: 65000,
    price: 65321.12,
    sequence: 42,
    updateAt: new Date().toISOString(),
  },
  {
    symbol: 'ETH/USDT',
    initialPrice: 3500,
    price: 3487.4,
    sequence: 42,
    updateAt: new Date().toISOString(),
  },
  {
    symbol: 'BNB/USDT',
    initialPrice: 580,
    price: 582.15,
    sequence: 42,
    updateAt: new Date().toISOString(),
  },
  {
    symbol: 'SOL/USDT',
    initialPrice: 150,
    price: 151.75,
    sequence: 42,
    updateAt: new Date().toISOString(),
  },
  {
    symbol: 'XRP/USDT',
    initialPrice: 0.55,
    price: 0.5482,
    sequence: 42,
    updateAt: new Date().toISOString(),
  },
];
