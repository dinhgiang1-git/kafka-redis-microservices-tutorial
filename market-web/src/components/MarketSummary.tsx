import React from 'react';
import type { PriceDocument } from '../types/price';
import { calculateChange } from '../lib/calculateChange';
import { formatPercent } from '../lib/formatPrice';

interface MarketSummaryProps {
  prices: PriceDocument[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export const MarketSummary: React.FC<MarketSummaryProps> = ({
  prices,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
}) => {
  const stats = React.useMemo(() => {
    let up = 0;
    let down = 0;
    let unchanged = 0;
    let totalChangePercent = 0;
    let validCount = 0;

    for (const doc of prices) {
      const change = calculateChange(doc.price, doc.initialPrice);
      if (change.isValid) {
        if (change.direction === 'up') up++;
        else if (change.direction === 'down') down++;
        else unchanged++;

        totalChangePercent += change.changePercent;
        validCount++;
      }
    }

    const avgChange = validCount > 0 ? totalChangePercent / validCount : 0;

    return {
      total: prices.length,
      up,
      down,
      unchanged,
      avgChange,
    };
  }, [prices]);

  return (
    <div className="bg-[#131720] border border-gray-800 rounded-lg p-3 space-y-3">
      {/* Metrics Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4 text-gray-300">
          <span>Tổng: <strong className="text-white">{stats.total} cặp</strong></span>
          <span>Tăng: <strong className="text-emerald-400">{stats.up}</strong></span>
          <span>Giảm: <strong className="text-rose-400">{stats.down}</strong></span>
          <span>
            TB Phiên:{' '}
            <strong className={stats.avgChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
              {formatPercent(stats.avgChange)}
            </strong>
          </span>
        </div>

        {/* Search & Sort */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Tìm mã..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="px-2.5 py-1 bg-gray-900 border border-gray-700 rounded text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gray-500"
          />

          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-2 py-1 bg-gray-900 border border-gray-700 rounded text-xs text-gray-300 focus:outline-none"
          >
            <option value="default">Thứ tự chuẩn</option>
            <option value="price-desc">Giá cao → thấp</option>
            <option value="price-asc">Giá thấp → cao</option>
            <option value="change-desc">% Tăng nhiều</option>
            <option value="change-asc">% Giảm nhiều</option>
          </select>
        </div>
      </div>
    </div>
  );
};
