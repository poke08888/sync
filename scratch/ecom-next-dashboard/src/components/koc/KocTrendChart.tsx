"use client";

import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart } from 'recharts';
import { formatKocCurrency, formatNumber } from '@/lib/utils';
import { aggregateByHour } from '@/lib/koc-service';

interface KocTrendChartProps {
  dailyData: any[];
  sessions: any[];
}

export default function KocTrendChart({ dailyData, sessions }: KocTrendChartProps) {
  const isSingleDay = dailyData.length === 1;

  const chartData = useMemo(() => {
    if (isSingleDay) {
      return aggregateByHour(sessions);
    }
    return dailyData.map(d => ({
      ...d,
      displayDate: d.date.split('-').slice(1, 3).reverse().join('/') // "2026-04-06" -> "06/04"
    }));
  }, [dailyData, sessions, isSingleDay]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1A1E29] border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-md">
          <p className="text-xs text-gray-400 font-bold mb-2 uppercase tracking-widest">{label}</p>
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center gap-6">
              <span className="text-xs text-teal-400">GMV:</span>
              <span className="text-sm font-bold text-white">{formatKocCurrency(payload[0].value)}</span>
            </div>
            <div className="flex justify-between items-center gap-6">
              <span className="text-xs text-amber-500">Đơn hàng:</span>
              <span className="text-sm font-bold text-white">{formatNumber(payload[1].value)}</span>
            </div>
            {payload[0].payload.sessions && (
              <div className="flex justify-between items-center gap-6 border-t border-white/5 pt-1.5">
                <span className="text-xs text-gray-400">Số phiên:</span>
                <span className="text-sm font-bold text-gray-400">{payload[0].payload.sessions}</span>
              </div>
            )}
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
          <h3 className="text-lg font-bold text-white">Xu hướng Doanh thu</h3>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-black">
            {isSingleDay ? 'Phân tích theo khung giờ' : 'Diễn biến theo ngày'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-teal-500/20 border border-teal-500/50 rounded-sm"></div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">GMV</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-amber-500"></div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Đơn hàng</span>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="areaTeal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2DD4BF" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#2DD4BF" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
            <XAxis 
              dataKey={isSingleDay ? "hour" : "displayDate"} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6B7280', fontSize: 10, fontWeight: 700 }}
              interval={isSingleDay ? 2 : 0}
            />
            <YAxis yAxisId="left" hide />
            <YAxis yAxisId="right" orientation="right" hide />
            <Tooltip content={<CustomTooltip />} />
            
            <Area 
              yAxisId="left"
              type="monotone" 
              dataKey="gmv" 
              stroke="#2DD4BF" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#areaTeal)" 
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="orders" 
              stroke="#F59E0B" 
              strokeWidth={2}
              dot={{ r: 4, fill: '#F59E0B', strokeWidth: 0 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
