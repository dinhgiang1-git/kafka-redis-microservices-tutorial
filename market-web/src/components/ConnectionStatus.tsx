import React from 'react';
import type { MarketStatusLevel } from '../types/price';
import { formatTime } from '../lib/formatPrice';

interface ConnectionStatusProps {
  statusLevel: MarketStatusLevel;
  isFetching: boolean;
  isError: boolean;
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
  onRetry: () => void;
  lastUpdatedAt: Date | null;
  serverUpdateAt?: string;
  worstAgeSeconds: number;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  statusLevel,
  isError,
  isDemoMode,
  onToggleDemoMode,
  onRetry,
  lastUpdatedAt,
  worstAgeSeconds,
}) => {
  const timeDisplay = lastUpdatedAt
    ? formatTime(lastUpdatedAt.toISOString())
    : '—';

  const statusColor =
    statusLevel === 'healthy'
      ? 'text-emerald-400'
      : statusLevel === 'warning'
      ? 'text-amber-400'
      : 'text-rose-400';

  const statusText = isDemoMode
    ? 'DEMO MÔ PHỎNG'
    : statusLevel === 'healthy'
    ? 'LIVE'
    : statusLevel === 'warning'
    ? 'CHẬM'
    : 'MẤT KẾT NỐI';

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-3">
        <span className={`font-semibold flex items-center gap-1.5 ${statusColor}`}>
          <span>●</span>
          <span>{statusText}</span>
        </span>

        <span className="text-gray-400">
          Cập nhật: <span className="text-gray-200 tabular-numbers">{timeDisplay}</span>
        </span>

        {worstAgeSeconds > 3 && (
          <span className={worstAgeSeconds > 15 ? 'text-rose-400' : 'text-amber-400'}>
            (Trễ {worstAgeSeconds}s)
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {isError && (
          <button
            onClick={onRetry}
            className="px-2 py-1 text-xs bg-rose-900/40 text-rose-300 border border-rose-800 rounded hover:bg-rose-900/60 cursor-pointer"
          >
            Thử lại
          </button>
        )}

        <button
          onClick={onToggleDemoMode}
          className={`px-2.5 py-1 text-xs rounded border cursor-pointer ${
            isDemoMode
              ? 'bg-amber-950/40 text-amber-300 border-amber-800'
              : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
          }`}
        >
          {isDemoMode ? 'Tắt Demo' : 'Bật Demo'}
        </button>
      </div>
    </div>
  );
};
