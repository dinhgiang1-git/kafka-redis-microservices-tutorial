import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMarketPrices, getMockMarketPrices } from '../api/pricesApi';
import type { PriceDocument } from '../types/price';

const POLL_INTERVAL_MS = Number(import.meta.env.VITE_POLL_INTERVAL_MS) || 1000;

export interface UseMarketPricesReturn {
  prices: PriceDocument[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
  isDemoMode: boolean;
  setIsDemoMode: (enabled: boolean | ((prev: boolean) => boolean)) => void;
  lastUpdatedAt: Date | null;
}

export function useMarketPrices(): UseMarketPricesReturn {
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    // Check localStorage or query params
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('demo') === 'true') return true;
    return false;
  });

  const query = useQuery<PriceDocument[], Error>({
    queryKey: ['market-prices', isDemoMode],
    queryFn: async () => {
      if (isDemoMode) {
        return getMockMarketPrices();
      }
      return await getMarketPrices();
    },
    refetchInterval: POLL_INTERVAL_MS,
    refetchIntervalInBackground: true,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 3000),
    placeholderData: (previousData) => previousData,
  });

  return {
    prices: query.data ?? [],
    isLoading: query.isLoading && !query.data,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: () => {
      query.refetch();
    },
    isDemoMode,
    setIsDemoMode,
    lastUpdatedAt: query.dataUpdatedAt ? new Date(query.dataUpdatedAt) : null,
  };
}
