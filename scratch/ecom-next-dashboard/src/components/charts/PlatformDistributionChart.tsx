"use client";

import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from 'recharts';
import { ArrowLeft } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

const COLORS = ['#6366F1', '#EC4899', '#F59E0B', '#10B981'];

const platformData = [
  { name: 'TikTok Shop', value: 450000, prevValue: 380000, color: '#6366F1' },
  { name: 'Shopee', value: 320000, prevValue: 350000, color: '#EC4899' },
  { name: 'Direct/Web', value: 120000, prevValue: 100000, color: '#10B981' },
];

const brandBreakdown: Record<string, any[]> = {
  'TikTok Shop': [
    { name: 'Macaron Cos', value: 200000, prevValue: 180000 },
    { name: 'Tech Haven', value: 150000, prevValue: 130000 },
    { name: 'Aura Beauty', value: 100000, prevValue: 70000 },
  ],
  'Shopee': [
    { name: 'Macaron Cos', value: 120000, prevValue: 100000 },
    { name: 'Tech Haven', value: 100000, prevValue: 120000 },
    { name: 'Daily Fits', value: 100000, prevValue: 130000 },
  ],
  'Direct/Web': [
    { name: 'Home Luxe', value: 70000, prevValue: 60000 },
    { name: 'Aura Beauty', value: 50000, prevValue: 40000 },
  ],
};

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

interface PlatformDistributionChartProps {
  brand: string;
}

export default function PlatformDistributionChart({ brand }: PlatformDistributionChartProps) {
  const [drillDown, setDrillDown] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const displayData = drillDown ? brandBreakdown[drillDown] : platformData;
  const totalValue = displayData.reduce((sum, item) => sum + item.value, 0);

  const onPieClick = (data: any, index: number) => {
    if (!drillDown) {
      setDrillDown(data.name);
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white">
            {drillDown ? `Chi tiết kênh ${drillDown}: ${brand}` : `Tỷ trọng theo kênh: ${brand}`}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {drillDown ? 'Đóng góp của Brand vào kênh này' : 'Phân chia doanh thu theo các sàn'}
          </p>
        </div>
        {drillDown && (
          <button 
            onClick={() => setDrillDown(null)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold text-gray-400 transition-all"
          >
            <ArrowLeft size={14} /> Quay lại
          </button>
        )}
      </div>

      <div className="flex-1 w-full min-h-[300px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={displayData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onClick={onPieClick}
              style={{ cursor: 'pointer' }}
              stroke="none"
              animationBegin={0}
              animationDuration={800}
            >
              {displayData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-[#1A1E29] border border-white/10 p-2.5 rounded-lg shadow-xl backdrop-blur-md">
                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{payload[0].name}</p>
                       <p className="text-sm font-black text-white">{formatCurrency(payload[0].value)}</p>
                       <p className="text-[10px] text-indigo-400 font-bold mt-1">
                         {((payload[0].value / totalValue) * 100).toFixed(1)}% OF TOTAL
                       </p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Tổng</p>
          <p className="text-xl font-black text-white">₫{(totalValue / 1000).toFixed(0)}k</p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {displayData.map((item, index) => {
          const diff = item.prevValue ? ((item.value - item.prevValue) / item.prevValue) * 100 : 0;
          const isUp = diff >= 0;
          
          return (
            <div key={item.name} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-all group">
               <div className="flex items-center gap-3">
                 <div className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]" style={{ backgroundColor: item.color || COLORS[index % COLORS.length] }}></div>
                 <div className="flex flex-col">
                    <span className="text-xs text-white font-bold leading-none group-hover:text-indigo-400 transition-colors">{item.name}</span>
                    <span className="text-[10px] text-gray-500 font-medium mt-1">
                      tỷ trọng {((item.value / totalValue) * 100).toFixed(1)}%
                    </span>
                 </div>
               </div>
               
               <div className="flex flex-col items-end">
                  <span className="text-xs font-black text-gray-300">{formatCurrency(item.value)}</span>
                  <div className={`text-[10px] font-bold flex items-center gap-0.5 mt-1 ${isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                    <span>{isUp ? '▲' : '▼'}</span>
                    <span>{Math.abs(diff).toFixed(1)}% cùng kỳ</span>
                  </div>
               </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
