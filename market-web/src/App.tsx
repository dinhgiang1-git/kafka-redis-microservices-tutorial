import React, { useState, useMemo } from 'react';
import { AppHeader } from './components/AppHeader';
import { ConnectionStatus } from './components/ConnectionStatus';
import { MarketSummary } from './components/MarketSummary';
import { PriceTable } from './components/PriceTable';
import { useMarketPrices } from './hooks/useMarketPrices';
import { usePriceDirections } from './hooks/usePriceDirections';
import { usePriceHistory } from './hooks/usePriceHistory';
import { evaluateSystemHealth, evaluateSymbolStaleness } from './lib/marketStatus';
import { calculateChange } from './lib/calculateChange';
import { sortCoinsByDefinedOrder } from './lib/coinConstants';

export const App: React.FC = () => {
  const {
    prices,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    isDemoMode,
    setIsDemoMode,
    lastUpdatedAt,
  } = useMarketPrices();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');

  const directions = usePriceDirections(prices);
  const histories = usePriceHistory(prices);

  const worstAgeSeconds = useMemo(() => {
    if (!prices || prices.length === 0) return 0;
    const now = Date.now();
    let maxAge = 0;
    for (const p of prices) {
      const evalResult = evaluateSymbolStaleness(p.updateAt, now);
      if (evalResult.ageSeconds > maxAge) {
        maxAge = evalResult.ageSeconds;
      }
    }
    return maxAge;
  }, [prices]);

  const systemHealth = evaluateSystemHealth(
    isError,
    isFetching,
    prices.length > 0,
    worstAgeSeconds
  );

  const displayedPrices = useMemo(() => {
    let result = [...prices];

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.symbol.toLowerCase().includes(q) ||
          p.symbol.replace('/', '').toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case 'price-desc':
        result.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case 'price-asc':
        result.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case 'change-desc':
        result.sort((a, b) => {
          const ca = calculateChange(a.price, a.initialPrice).changePercent;
          const cb = calculateChange(b.price, b.initialPrice).changePercent;
          return cb - ca;
        });
        break;
      case 'change-asc':
        result.sort((a, b) => {
          const ca = calculateChange(a.price, a.initialPrice).changePercent;
          const cb = calculateChange(b.price, b.initialPrice).changePercent;
          return ca - cb;
        });
        break;
      case 'default':
      default:
        result = sortCoinsByDefinedOrder(result);
        break;
    }

    return result;
  }, [prices, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-[#0f131a] text-gray-200 flex flex-col text-sm">
      <AppHeader />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-4 space-y-3">
        <ConnectionStatus
          statusLevel={systemHealth.level}
          isFetching={isFetching}
          isError={isError}
          isDemoMode={isDemoMode}
          onToggleDemoMode={() => setIsDemoMode((prev) => !prev)}
          onRetry={refetch}
          lastUpdatedAt={lastUpdatedAt}
          worstAgeSeconds={worstAgeSeconds}
        />

        {isError && prices.length === 0 && !isDemoMode && (
          <div className="p-3 bg-amber-950/40 border border-amber-800 text-amber-200 text-xs rounded flex items-center justify-between gap-2">
            <span>
              Chưa kết nối được backend ({error?.message || 'Port 8082'}). Bật Demo để xem trước dữ liệu.
            </span>
            <button
              onClick={() => setIsDemoMode(true)}
              className="px-2 py-1 bg-amber-800 text-amber-100 rounded text-xs cursor-pointer hover:bg-amber-700 shrink-0"
            >
              Bật Demo
            </button>
          </div>
        )}

        <MarketSummary
          prices={prices}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        <PriceTable
          prices={displayedPrices}
          directions={directions}
          histories={histories}
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
          searchQuery={searchQuery}
        />
      </main>

      <footer className="border-t border-gray-800 py-3 text-center text-xs text-gray-500">
        Market Pulse • Polling 1s REST API
      </footer>
    </div>
  );
};

export default App;
