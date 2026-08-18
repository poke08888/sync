"use client";

import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Info } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

const mockHourlyData = [
  { hour: '0h', actual: 450, previous: 400 }, { hour: '1h', actual: 320, previous: 350 },
  { hour: '2h', actual: 210, previous: 250 }, { hour: '3h', actual: 150, previous: 180 },
  { hour: '4h', actual: 120, previous: 150 }, { hour: '5h', actual: 280, previous: 250 },
  { hour: '6h', actual: 450, previous: 400 }, { hour: '7h', actual: 680, previous: 600 },
  { hour: '8h', actual: 850, previous: 800 }, { hour: '9h', actual: 920, previous: 850 },
  { hour: '10h', actual: 1050, previous: 950 }, { hour: '11h', actual: 1250, previous: 1100 },
  { hour: '12h', actual: 1450, previous: 1300 }, { hour: '13h', actual: 1350, previous: 1250 },
  { hour: '14h', actual: 1200, previous: 1150 }, { hour: '15h', actual: 1550, previous: 1400 },
  { hour: '16h', actual: 1400, previous: 1350 }, { hour: '17h', actual: 1300, previous: 1200 },
  { hour: '18h', actual: 1500, previous: 1400 }, { hour: '19h', actual: 1750, previous: 1600 },
  { hour: '20h', actual: 1950, previous: 1800 }, { hour: '21h', actual: 1650, previous: 1550 },
  { hour: '22h', actual: 1250, previous: 1100 }, { hour: '23h', actual: 850, previous: 800 },
];

interface HourlySalesChartProps {
  brand: string;
}

export default function HourlySalesChart({ brand }: HourlySalesChartProps) {
  // Find top 3 peak hours
  const peakHours = useMemo(() => {
    return [...mockHourlyData]
      .sort((a, b) => b.actual - a.actual)
      .slice(0, 3)
      .map(d => d.hour);
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const actual = payload[0].value;
      const prev = payload[1].value;
      const diff = ((actual - prev) / prev) * 100;
      
      return (
        <div className="bg-[#1A1E29] border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-md">
          <p className="text-xs text-gray-400 font-bold mb-2 uppercase tracking-widest">{label}</p>
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center gap-6">
              <span className="text-xs text-gray-400">Kỳ này:</span>
              <span className="text-sm font-bold text-white">{formatCurrency(actual)}</span>
            </div>
            <div className="flex justify-between items-center gap-6">
              <span className="text-xs text-gray-400">Cùng kỳ:</span>
              <span className="text-sm font-medium text-gray-500">{formatCurrency(prev)}</span>
            </div>
            <div className="h-px bg-white/5 my-1"></div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Chênh lệch:</span>
              <span className={`text-xs font-bold ${diff >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {diff >= 0 ? '+' : ''}{diff.toFixed(1)}%
              </span>
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
          <h3 className="text-lg font-bold text-white">Doanh số theo giờ: {brand}</h3>
          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
            <Info size={12} /> So sánh hôm nay vs cùng kỳ
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-indigo-500"></div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Kỳ này</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-gray-600 border-t border-dashed border-gray-400"></div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Cùng kỳ</span>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockHourlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
            <XAxis 
              dataKey="hour" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6B7280', fontSize: 10, fontWeight: 500 }}
              interval={2}
            />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff10', strokeWidth: 1 }} />
            
            <Line 
              type="monotone" 
              dataKey="previous" 
              stroke="#4B5563" 
              strokeWidth={2} 
              strokeDasharray="5 5" 
              dot={false} 
              activeDot={false}
            />
            <Line 
              type="monotone" 
              dataKey="actual" 
              stroke="#6366F1" 
              strokeWidth={3} 
              dot={(props: any) => {
                const { cx, cy, payload } = props;
                if (peakHours.includes(payload.hour)) {
                  return (
                    <svg key={payload.hour} x={cx - 10} y={cy - 10} width={20} height={20} fill="none" viewBox="0 0 20 20">
                      <circle cx="10" cy="10" r="4" fill="#6366F1" />
                      <circle cx="10" cy="10" r="8" stroke="#6366F1" strokeOpacity="0.3" strokeWidth="2" />
                    </svg>
                  );
                }
                return <></>;
              }}
              activeDot={{ r: 6, fill: '#6366F1', stroke: '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex gap-2">
        {peakHours.map((h, i) => (
          <div key={h} className="px-2 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-md text-[10px] font-bold text-indigo-400 uppercase">
            Đỉnh #{i+1}: {h}
          </div>
        ))}
      </div>
    </div>
  );
}
