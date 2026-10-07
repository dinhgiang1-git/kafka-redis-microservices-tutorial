export type PriceDocument = {
  symbol: string;
  initialPrice: string | number;
  price: string | number;
  sequence: number;
  updateAt: string;
};

export type PriceDirection = 'up' | 'down' | 'unchanged';

export type MarketStatusLevel = 'healthy' | 'warning' | 'critical' | 'offline';

export type PriceHistoryPoint = {
  price: number;
  sequence: number;
  timestamp: number;
};

export type CoinMetadata = {
  symbol: string;
  base: string;
  quote: string;
  name: string;
  color: string;
  iconBg: string;
};

export type PriceChangeInfo = {
  changeAmount: number;
  changePercent: number;
  direction: 'up' | 'down' | 'unchanged';
  isValid: boolean;
};
