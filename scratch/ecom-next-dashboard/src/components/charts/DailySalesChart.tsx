"use client";

import React from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { formatCurrency } from '@/lib/utils';

const mockDailyData = [
  { date: '01/04', sales: 45000, ma7: 42000, previous: 38000 },
  { date: '02/04', sales: 52000, ma7: 44000, previous: 41000 },
  { date: '03/04', sales: 48000, ma7: 45500, previous: 40000 },
  { date: '04/04', sales: 85000, ma7: 48000, previous: 45000, event: 'Payday Sale' },
  { date: '05/04', sales: 92000, ma7: 52000, previous: 48000, event: 'Flash Deal' },
  { date: '06/04', sales: 65000, ma7: 55000, previous: 52000 },
  { date: '07/04', sales: 58000, ma7: 57000, previous: 55000 },
  { date: '08/04', sales: 62000, ma7: 59000, previous: 58000 },
  { date: '09/04', sales: 125000, ma7: 65000, previous: 60000, event: '9.4 Mega' },
  { date: '10/04', sales: 110000, ma7: 72000, previous: 65000 },
  { date: '11/04', sales: 75000, ma7: 75000, previous: 68000 },
  { date: '12/04', sales: 68000, ma7: 76000, previous: 70000 },
];

interface DailySalesChartProps {
  brand: string;
}

export default function DailySalesChart({ brand }: DailySalesChartProps) {
  const KPI_TARGET = 80000;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#1A1E29] border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-md">
          <p className="text-xs text-gray-400 font-bold mb-2 uppercase tracking-widest">{label}</p>
          {data.event && (
            <div className="mb-2 px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded text-[10px] font-bold text-amber-500 uppercase">
              ✨ {data.event}
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center gap-6">
              <span className="text-xs text-gray-400">Doanh số:</span>
              <span className="text-sm font-bold text-white">{formatCurrency(data.sales)}</span>
            </div>
            <div className="flex justify-between items-center gap-6">
              <span className="text-xs text-gray-400">MA7:</span>
              <span className="text-xs font-medium text-indigo-400">{formatCurrency(data.ma7)}</span>
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
          <h3 className="text-lg font-bold text-white">Hiệu suất theo ngày: {brand}</h3>
          <p className="text-xs text-gray-500 mt-1">Khối lượng đơn hàng vs Đường trung bình động</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2">
             <div className="w-3 h-3 bg-indigo-500/30 rounded-sm"></div>
             <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Doanh số</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-3 h-0.5 bg-indigo-400"></div>
             <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">MA7</span>
           </div>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={mockDailyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6B7280', fontSize: 10, fontWeight: 500 }}
            />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff05' }} />
            
            <ReferenceLine y={KPI_TARGET} stroke="#F59E0B" strokeDasharray="5 5" strokeOpacity={0.5} label={{ position: 'right', value: 'KPI', fill: '#F59E0B', fontSize: 10, fontWeight: 'bold' }} />
            
            <Bar dataKey="sales" barSize={32} radius={[4, 4, 0, 0]}>
              {mockDailyData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.sales >= KPI_TARGET ? '#6366F1' : '#6366F140'} 
                />
              ))}
            </Bar>

            <Line 
              type="monotone" 
              dataKey="previous" 
              stroke="#4B5563" 
              strokeWidth={1} 
              strokeDasharray="4 4" 
              dot={false} 
            />

            <Line 
              type="monotone" 
              dataKey="ma7" 
              stroke="#818CF8" 
              strokeWidth={2} 
              dot={false}
              animationDuration={1000}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
         {mockDailyData.filter(d => d.event).map(d => (
           <div key={d.date} className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-md border border-white/5">
              <span className="text-[10px] text-gray-500 font-bold">{d.date}</span>
              <span className="text-[10px] text-white font-medium">{d.event}</span>
           </div>
         ))}
      </div>
    </div>
  );
}
