import React from 'react';
import type { PriceDirection } from '../types/price';
import { formatPrice } from '../lib/formatPrice';

interface PriceFlashProps {
  price: string | number;
  direction: PriceDirection;
  flashKey?: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const PriceFlash: React.FC<PriceFlashProps> = ({
  price,
  direction,
  size = 'md',
  showIcon = true,
}) => {
  const formattedPrice = formatPrice(price);

  const colorClass =
    direction === 'up'
      ? 'text-emerald-400'
      : direction === 'down'
      ? 'text-rose-400'
      : 'text-gray-100';

  const sizeClass = {
    sm: 'text-sm font-medium',
    md: 'text-base font-semibold',
    lg: 'text-xl font-bold',
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1 tabular-numbers ${sizeClass} ${colorClass}`}
      data-testid="price-flash-value"
    >
      <span>${formattedPrice}</span>
      {showIcon && (
        <span className="text-xs">
          {direction === 'up' && '▲'}
          {direction === 'down' && '▼'}
        </span>
      )}
    </span>
  );
};
