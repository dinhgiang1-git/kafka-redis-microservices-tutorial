import type { CoinMetadata } from '../types/price';

export const ORDERED_SYMBOLS: readonly string[] = [
  'BTC/USDT',
  'ETH/USDT',
  'BNB/USDT',
  'SOL/USDT',
  'XRP/USDT',
] as const;

export const COIN_METADATA_MAP: Record<string, CoinMetadata> = {
  'BTC/USDT': {
    symbol: 'BTC/USDT',
    base: 'BTC',
    quote: 'USDT',
    name: 'Bitcoin',
    color: '#F7931A',
    iconBg: 'rgba(247, 147, 26, 0.15)',
  },
  'ETH/USDT': {
    symbol: 'ETH/USDT',
    base: 'ETH',
    quote: 'USDT',
    name: 'Ethereum',
    color: '#627EEA',
    iconBg: 'rgba(98, 126, 234, 0.15)',
  },
  'BNB/USDT': {
    symbol: 'BNB/USDT',
    base: 'BNB',
    quote: 'USDT',
    name: 'BNB',
    color: '#F3BA2F',
    iconBg: 'rgba(243, 186, 47, 0.15)',
  },
  'SOL/USDT': {
    symbol: 'SOL/USDT',
    base: 'SOL',
    quote: 'USDT',
    name: 'Solana',
    color: '#14F195',
    iconBg: 'rgba(20, 241, 149, 0.15)',
  },
  'XRP/USDT': {
    symbol: 'XRP/USDT',
    base: 'XRP',
    quote: 'USDT',
    name: 'XRP',
    color: '#23292F',
    iconBg: 'rgba(255, 255, 255, 0.15)',
  },
};

export function getCoinMetadata(symbol: string): CoinMetadata {
  return (
    COIN_METADATA_MAP[symbol] ?? {
      symbol,
      base: symbol.split('/')[0] || symbol,
      quote: symbol.split('/')[1] || 'USDT',
      name: symbol.split('/')[0] || symbol,
      color: '#3B82F6',
      iconBg: 'rgba(59, 130, 246, 0.15)',
    }
  );
}

export function sortCoinsByDefinedOrder<T extends { symbol: string }>(coins: T[]): T[] {
  return [...coins].sort((a, b) => {
    const indexA = ORDERED_SYMBOLS.indexOf(a.symbol);
    const indexB = ORDERED_SYMBOLS.indexOf(b.symbol);
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return a.symbol.localeCompare(b.symbol);
  });
}
