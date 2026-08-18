import React, { useState, useMemo } from 'react';
import { topProductsData } from '../../utils/mockChartData';
import { ArrowUpRight } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Mini SVG sparkline component
const MiniSparkline = ({ data, color, className }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  // map to 0-1
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 40;
    const y = 14 - ((d - min) / range) * 14; 
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width="40" height="15" className={cn("overflow-visible", className)}>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default function TopProductsChart({ products: apiData }) {
  const [sortBy, setSortBy] = useState('revenue'); 

  const data = useMemo(() => {
    if (!apiData) return [];
    // Convert API revenue string (formatted with ₫) back to number for sorting if needed, 
    // or just use as is since API already sorts by revenue rank.
    return apiData.map(p => ({
      ...p,
      revenueNum: parseInt(p.revenue.replace(/[^\d]/g, '')),
      qty: Math.floor(Math.random() * 1000), // Mock qty since API doesn't have it yet
      margin: Math.floor(Math.random() * 40) + 5, // Mock margin
      trend: [10, 20, 15, 25, 30] // Mock trend
    }));
  }, [apiData]);

  const sortedData = useMemo(() => {
    const key = sortBy === 'revenue' ? 'revenueNum' : sortBy;
    return [...data].sort((a, b) => b[key] - a[key]);
  }, [data, sortBy]);

  const maxVal = Math.max(...sortedData.map(d => d[sortBy === 'revenue' ? 'revenueNum' : sortBy]));

  const fmtCurrency = (v) => `${new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 }).format(v / 1000000)}M`;
  const fmtNumber = (v) => new Intl.NumberFormat('vi-VN').format(v);

  const getMarginColorInfo = (margin) => {
    if (margin >= 30) return { bg: 'bg-green-500', text: 'text-green-400', hex: '#4ADE80' };
    if (margin >= 15) return { bg: 'bg-yellow-500', text: 'text-yellow-400', hex: '#EAB308' };
    return { bg: 'bg-red-500', text: 'text-red-400', hex: '#EF4444' };
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-5 flex flex-col h-[480px]">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-white font-semibold flex items-center gap-2">Top 10 Sản Phẩm</h3>
          <p className="text-xs text-textMuted mt-1">Sắp xếp theo các chỉ số quan trọng, màu đánh dấu Margin</p>
        </div>
        
        <div className="flex bg-background p-1 rounded-lg border border-border shrink-0">
          {[
            { id: 'revenue', label: 'Doanh thu' },
            { id: 'qty', label: 'Số lượng' },
            { id: 'margin', label: 'Margin %' }
          ].map(opt => (
            <button 
              key={opt.id}
              onClick={() => setSortBy(opt.id)}
              className={cn(
                "px-3 py-1 rounded-md text-xs font-medium transition-colors",
                sortBy === opt.id ? "bg-pantone-293 text-white" : "text-textMuted hover:text-white"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 w-full overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        {sortedData.map((item, index) => {
          const mColor = getMarginColorInfo(item.margin);
          // Calculate width for the background progress bar
          const progressWidth = Math.max((item[sortBy] / maxVal) * 100, 2);

          let displayVal = '';
          if (sortBy === 'revenue') displayVal = fmtCurrency(item.revenue) + ' ₫';
          if (sortBy === 'qty') displayVal = fmtNumber(item.qty) + ' unit';
          if (sortBy === 'margin') displayVal = item.margin + '%';

          return (
            <div key={item.id} className="relative group rounded-lg overflow-hidden flex items-center p-2 bg-background/30 hover:bg-white/5 transition-colors">
              {/* Backing Progress Bar */}
              <div 
                className={cn("absolute left-0 top-0 bottom-0 opacity-10 transition-all duration-700", mColor.bg)}
                style={{ width: `${progressWidth}%` }}
              ></div>

              <div className="relative z-10 flex items-center w-full justify-between gap-2">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="text-textMuted text-xs font-bold w-4">{index + 1}</div>
                  <div className="truncate text-sm font-medium text-white max-w-[120px] sm:max-w-[200px]" title={item.name}>
                    {item.name}
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  {/* Margin Badge */}
                  <div className={cn("hidden lg:flex items-center gap-1 font-bold text-xs bg-background/50 px-2 py-0.5 rounded", mColor.text)}>
                    {item.margin}% MG
                  </div>

                  {/* Number Display */}
                  <div className="font-bold text-sm text-white w-20 text-right">
                    {displayVal}
                  </div>

                  {/* Sparkline Trend */}
                  <div className="hidden sm:block">
                    <MiniSparkline data={item.trend} color={mColor.hex} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border text-xs text-textMuted">
        <span>Margin:</span>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div> &gt;30% (Khỏe)</div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div> 15-30%</div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div> &lt;15% (Lỗ)</div>
      </div>
    </div>
  );
}
