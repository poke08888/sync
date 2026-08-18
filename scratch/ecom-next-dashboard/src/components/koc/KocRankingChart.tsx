"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatKocCurrency, formatNumber } from '@/lib/utils';

interface KocRankingChartProps {
  data: any[];
  onBarClick?: (kocName: string) => void;
}

export default function KocRankingChart({ data, onBarClick }: KocRankingChartProps) {
  const chartData = data.slice(0, 10);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-[#1A1E29] border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-md">
          <p className="text-xs text-gray-400 font-bold mb-2 uppercase tracking-widest">{label}</p>
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center gap-6">
              <span className="text-xs text-gray-400">GMV:</span>
              <span className="text-sm font-bold text-white">{formatKocCurrency(item.gmv)}</span>
            </div>
            <div className="flex justify-between items-center gap-6">
              <span className="text-xs text-gray-400">Đơn hàng:</span>
              <span className="text-sm font-bold text-indigo-400">{formatNumber(item.orders)}</span>
            </div>
            <div className="flex justify-between items-center gap-6">
              <span className="text-xs text-gray-400">Phiên LIVE:</span>
              <span className="text-sm font-bold text-gray-300">{item.sessions}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">Top 10 KOC theo doanh thu</h3>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-black">Xếp hạng Hiệu suất Tài chính</p>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            onClick={(state) => {
              if (state && state.activeLabel) onBarClick?.(state.activeLabel);
            }}
          >
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#2DD4BF" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" horizontal={true} vertical={false} />
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 700 }}
              width={100}
              tickFormatter={(value) => value.length > 15 ? value.substring(0, 15) + '...' : value}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Bar 
              dataKey="gmv" 
              fill="url(#barGradient)" 
              radius={[0, 4, 4, 0]} 
              barSize={24}
              style={{ cursor: 'pointer' }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
