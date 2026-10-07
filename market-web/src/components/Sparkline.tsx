import React from 'react';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  isPositive?: boolean;
  className?: string;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  width = 100,
  height = 28,
  isPositive = true,
  className = '',
}) => {
  if (!data || data.length < 2) {
    return (
      <div
        className={`flex items-center text-xs text-neutral-500 ${className}`}
        style={{ width, height }}
      >
        <span>—</span>
      </div>
    );
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min === 0 ? 1 : max - min;
  const paddingY = 2;
  const usableHeight = height - paddingY * 2;

  const points = data.map((val, index) => {
    const x = (index / (data.length - 1)) * (width - 4) + 2;
    const y = height - paddingY - ((val - min) / range) * usableHeight;
    return `${x},${y}`;
  });

  const strokeColor = isPositive ? '#10b981' : '#f43f5e';

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={`select-none ${className}`}
      aria-label="Xu hướng giá ngắn hạn"
    >
      <polyline
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points.join(' ')}
      />
    </svg>
  );
};
