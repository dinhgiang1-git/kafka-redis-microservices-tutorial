import React from 'react';

export const AppHeader: React.FC = () => {
  return (
    <header className="border-b border-gray-800 bg-[#131720]">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-white tracking-wide">
            MARKET PULSE
          </h1>
          <p className="text-xs text-gray-400">
            Theo dõi giá trực tiếp (Kafka → Redis → REST API)
          </p>
        </div>

        <div className="text-xs text-gray-400 flex items-center gap-3">
          <span>Port: <strong className="text-gray-200">8082</strong></span>
          <span>•</span>
          <span>Topic: <strong className="text-gray-200">market.price</strong></span>
        </div>
      </div>
    </header>
  );
};
