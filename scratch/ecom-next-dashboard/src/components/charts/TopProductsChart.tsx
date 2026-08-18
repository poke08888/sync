"use client";

import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, ShoppingBag, DollarSign, Percent } from 'lucide-react';
import { formatNumber, formatCurrency } from '@/lib/utils';

type SortType = 'revenue' | 'qty' | 'margin';

const mockProducts = [
  { id: 1, name: 'Silk Serenity Mask', revenue: 45000, qty: 1200, margin: 35, trend: [20, 40, 30, 70, 40, 60, 90] },
  { id: 2, name: 'Luxe Sleep Gown', revenue: 38000, qty: 450, margin: 42, trend: [30, 20, 50, 40, 70, 50, 80] },
  { id: 3, name: 'Cloud Comfort Pillow', revenue: 32000, qty: 800, margin: 28, trend: [60, 70, 50, 40, 30, 40, 50] },
  { id: 4, name: 'Aura Glow Serum', revenue: 29000, qty: 1500, margin: 12, trend: [90, 80, 70, 60, 50, 40, 30] },
  { id: 5, name: 'Dreamy Mist Spray', revenue: 24000, qty: 2200, margin: 18, trend: [10, 20, 25, 40, 45, 60, 75] },
  { id: 6, name: 'Velvet Ribbon Scrunchie', revenue: 18000, qty: 4000, margin: 45, trend: [40, 45, 40, 50, 45, 50, 55] },
  { id: 7, name: 'Midnight Eye Cream', revenue: 15000, qty: 300, margin: 8, trend: [20, 20, 15, 25, 20, 25, 20] },
  { id: 8, name: 'Satin Bedding Set', revenue: 12000, qty: 100, margin: 25, trend: [50, 50, 55, 60, 65, 70, 75] },
];

interface TopProductsChartProps {
  brand: string;
}

export default function TopProductsChart({ brand }: TopProductsChartProps) {
  const [sortBy, setSortBy] = useState<SortType>('revenue');

  const sortedData = useMemo(() => {
    return [...mockProducts].sort((a: any, b: any) => b[sortBy] - a[sortBy]).slice(0, 10);
  }, [sortBy]);

  const getMarginColor = (margin: number) => {
    if (margin > 30) return '#10B981'; // Green
    if (margin >= 15) return '#F59E0B'; // Amber
    return '#EF4444'; // Red
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="text-lg font-bold text-white">Top 10 Sản phẩm: {brand}</h3>
          <p className="text-xs text-gray-500 mt-1">Xếp hạng hiệu suất sản phẩm</p>
        </div>
        
        <div className="flex p-1 bg-[#0B0E14] rounded-xl border border-white/5">
          {[
            { id: 'revenue', label: 'Doanh thu' },
            { id: 'qty', label: 'Số lượng' },
            { id: 'margin', label: 'Lợi nhuận' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setSortBy(item.id as SortType)}
              className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                sortBy === item.id 
                  ? 'bg-indigo-500 text-white shadow-lg' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
        {sortedData.map((prod, index) => (
          <div key={prod.id} className="flex flex-col gap-2 group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 overflow-hidden">
                <span className="text-[10px] font-black text-gray-600 w-4">#{index + 1}</span>
                <span className="text-xs font-bold text-gray-300 truncate group-hover:text-white transition-colors">
                  {prod.name}
                </span>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                   <div className="text-[10px] font-black text-white">
                      {sortBy === 'revenue' ? `₫${(prod.revenue/1000).toFixed(1)}k` : sortBy === 'qty' ? formatNumber(prod.qty) : `${prod.margin}%`}
                   </div>
                </div>
                {/* 7-day Mini Sparkline */}
                <div className="w-12 h-6 opacity-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={prod.trend.map(v => ({ v }))}>
                      <Line 
                        type="monotone" 
                        dataKey="v" 
                        stroke={getMarginColor(prod.margin)} 
                        strokeWidth={1.5} 
                        dot={false} 
                        isAnimationActive={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{ 
                  width: `${(prod[sortBy] / sortedData[0][sortBy]) * 100}%`,
                  backgroundColor: getMarginColor(prod.margin)
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-3 gap-2">
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Khỏe (&gt;30%)</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Rủi ro (15-30%)</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-rose-500"></div>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Nguy cấp (&lt;15%)</span>
         </div>
      </div>
    </div>
  );
}
