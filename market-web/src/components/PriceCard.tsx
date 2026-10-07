import React from 'react';
import type { PriceDocument, PriceDirection } from '../types/price';
import { getCoinMetadata } from '../lib/coinConstants';
import { calculateChange } from '../lib/calculateChange';
import { formatPercent, formatTime } from '../lib/formatPrice';
import { evaluateSymbolStaleness } from '../lib/marketStatus';
import { PriceFlash } from './PriceFlash';
import { Sparkline } from './Sparkline';

interface PriceCardProps {
  doc: PriceDocument;
  direction: PriceDirection;
  history: number[];
}

export const PriceCard: React.FC<PriceCardProps> = ({
  doc,
  direction,
  history,
}) => {
  const meta = getCoinMetadata(doc.symbol);
  const change = calculateChange(doc.price, doc.initialPrice);
  const staleness = evaluateSymbolStaleness(doc.updateAt);
  const isPositive = change.changePercent >= 0;

  return (
    <div
      className="bg-[#131720] border border-gray-800 rounded-lg p-3 space-y-2 text-sm"
      data-testid={`price-card-${doc.symbol}`}
    >
      <div className="flex items-center justify-between">
        <span className="font-semibold text-white">
          {meta.base} <span className="text-gray-400 text-xs font-normal">/ {meta.quote}</span>
        </span>
        <span className={`tabular-numbers font-medium ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
          {formatPercent(change.changePercent)}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <PriceFlash
          price={doc.price}
          direction={direction}
          size="lg"
        />

        <Sparkline
          data={history}
          width={80}
          height={24}
          isPositive={isPositive}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400 pt-1 border-t border-gray-800">
        <span>{formatTime(doc.updateAt)}</span>
        {staleness.level !== 'healthy' && (
          <span className={staleness.level === 'warning' ? 'text-amber-400' : 'text-rose-400'}>
            {staleness.label}
          </span>
        )}
      </div>
    </div>
  );
};
