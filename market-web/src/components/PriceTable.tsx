import React from 'react';
import type { PriceDocument, PriceDirection } from '../types/price';
import { PriceRow } from './PriceRow';
import { PriceCard } from './PriceCard';

interface PriceTableProps {
  prices: PriceDocument[];
  directions: Record<string, { direction: PriceDirection; flashKey: string }>;
  histories: Record<string, number[]>;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  searchQuery: string;
}

export const PriceTable: React.FC<PriceTableProps> = ({
  prices,
  directions,
  histories,
  isLoading,
  isError,
  onRetry,
  searchQuery,
}) => {
  // 1. Loading
  if (isLoading && prices.length === 0) {
    return (
      <div className="bg-[#131720] border border-gray-800 rounded-lg p-6 text-center text-sm text-gray-400">
        Đang tải dữ liệu thị trường...
      </div>
    );
  }

  // 2. Empty
  if (prices.length === 0) {
    return (
      <div className="bg-[#131720] border border-gray-800 rounded-lg p-6 text-center text-sm text-gray-400 space-y-3">
        <div>
          {searchQuery ? `Không tìm thấy cặp coin "${searchQuery}"` : 'Chưa có dữ liệu thị trường.'}
        </div>
        {isError && (
          <button
            onClick={onRetry}
            className="px-3 py-1 bg-gray-800 text-gray-200 border border-gray-700 rounded text-xs hover:bg-gray-700 cursor-pointer"
          >
            Thử lại kết nối
          </button>
        )}
      </div>
    );
  }

  // 3. Render Table (Desktop) & Cards (Mobile)
  return (
    <div className="space-y-3">
      {/* Desktop Table */}
      <div className="hidden md:block bg-[#131720] border border-gray-800 rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-900/60 text-xs text-gray-400">
              <th className="py-2.5 px-4 font-medium">Cặp giao dịch</th>
              <th className="py-2.5 px-4 font-medium text-left">Giá hiện tại</th>
              <th className="py-2.5 px-4 font-medium text-left">Biến động phiên</th>
              <th className="py-2.5 px-4 font-medium text-left">Xu hướng</th>
              <th className="py-2.5 px-4 font-medium text-right">Cập nhật</th>
            </tr>
          </thead>
          <tbody>
            {prices.map((doc) => {
              const dirState = directions[doc.symbol] ?? {
                direction: 'unchanged',
                flashKey: `${doc.symbol}-def`,
              };
              const history = histories[doc.symbol] ?? [];

              return (
                <PriceRow
                  key={doc.symbol}
                  doc={doc}
                  direction={dirState.direction}
                  history={history}
                />
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-2">
        {prices.map((doc) => {
          const dirState = directions[doc.symbol] ?? {
            direction: 'unchanged',
            flashKey: `${doc.symbol}-def`,
          };
          const history = histories[doc.symbol] ?? [];

          return (
            <PriceCard
              key={doc.symbol}
              doc={doc}
              direction={dirState.direction}
              history={history}
            />
          );
        })}
      </div>
    </div>
  );
};
