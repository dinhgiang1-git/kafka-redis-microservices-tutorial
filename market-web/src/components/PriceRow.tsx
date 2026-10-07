import React from 'react';
import type { PriceDocument, PriceDirection } from '../types/price';
import { getCoinMetadata } from '../lib/coinConstants';
import { calculateChange } from '../lib/calculateChange';
import { formatPercent, formatTime } from '../lib/formatPrice';
import { evaluateSymbolStaleness } from '../lib/marketStatus';
import { PriceFlash } from './PriceFlash';
import { Sparkline } from './Sparkline';

interface PriceRowProps {
  doc: PriceDocument;
  direction: PriceDirection;
  history: number[];
}

export const PriceRow: React.FC<PriceRowProps> = ({
  doc,
  direction,
  history,
}) => {
  const meta = getCoinMetadata(doc.symbol);
  const change = calculateChange(doc.price, doc.initialPrice);
  const staleness = evaluateSymbolStaleness(doc.updateAt);
  const isPositive = change.changePercent >= 0;

  return (
    <tr
      className="border-b border-gray-800 hover:bg-gray-800/40 text-sm"
      data-testid={`price-row-${doc.symbol}`}
    >
      {/* 1. Symbol */}
      <td className="py-3 px-4 font-semibold text-white">
        <span>{meta.base}</span>
        <span className="text-gray-400 text-xs font-normal"> / {meta.quote}</span>
      </td>

      {/* 2. Latest Price */}
      <td className="py-3 px-4 text-left">
        <PriceFlash
          price={doc.price}
          direction={direction}
          size="md"
        />
      </td>

      {/* 3. Session Change % */}
      <td className="py-3 px-4 text-left tabular-numbers">
        <span className={isPositive ? 'text-emerald-400 font-medium' : 'text-rose-400 font-medium'}>
          {formatPercent(change.changePercent)}
        </span>
      </td>

      {/* 4. Sparkline */}
      <td className="py-3 px-4 hidden md:table-cell">
        <Sparkline
          data={history}
          width={90}
          height={24}
          isPositive={isPositive}
        />
      </td>

      {/* 5. Update Time */}
      <td className="py-3 px-4 text-right text-xs text-gray-400 tabular-numbers">
        <div className="flex items-center justify-end gap-2">
          <span>{formatTime(doc.updateAt)}</span>
          {staleness.level !== 'healthy' && (
            <span
              className={
                staleness.level === 'warning'
                  ? 'text-amber-400 font-medium'
                  : 'text-rose-400 font-medium'
              }
            >
              [{staleness.label}]
            </span>
          )}
        </div>
      </td>
    </tr>
  );
};
