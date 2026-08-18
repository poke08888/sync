"use client";

import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Label } from 'recharts';
import { formatKocCurrency, formatNumber } from '@/lib/utils';

interface KocEfficiencyScatterProps {
  scatterData: {
    data: any[];
    medianX: number;
    medianY: number;
  };
}

export default function KocEfficiencyScatter({ scatterData }: KocEfficiencyScatterProps) {
  const { data, medianX, medianY } = scatterData;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-[#1A1E29] border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-md min-w-[180px]">
          <p className="text-xs text-white font-black mb-2 uppercase tracking-tight">{item.name}</p>
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center gap-6">
              <span className="text-xs text-gray-400">Giờ live:</span>
              <span className="text-sm font-bold text-white">{item.x.toFixed(1)}h</span>
            </div>
            <div className="flex justify-between items-center gap-6">
              <span className="text-xs text-gray-400">GMV:</span>
              <span className="text-sm font-bold text-teal-400">{formatKocCurrency(item.y)}</span>
            </div>
            <div className="flex justify-between items-center gap-6">
              <span className="text-xs text-gray-400">Đơn hàng:</span>
              <span className="text-sm font-bold text-amber-500">{formatNumber(item.z)}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">Hiệu suất KOC</h3>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-black">Phân loại theo Nỗ lực & Kết quả</p>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" />
            <XAxis 
              type="number" 
              dataKey="x" 
              name="Giờ live" 
              unit="h" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6B7280', fontSize: 10 }}
            >
              <Label value="Tổng giờ LIVE" position="bottom" offset={0} fill="#4B5563" fontSize={10} fontWeight="bold" />
            </XAxis>
            <YAxis 
              type="number" 
              dataKey="y" 
              name="GMV" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6B7280', fontSize: 10 }}
              tickFormatter={(val) => `₫${(val/1e6).toFixed(0)}m`}
            >
              <Label value="Doanh thu (GMV)" angle={-90} position="left" offset={0} fill="#4B5563" fontSize={10} fontWeight="bold" />
            </YAxis>
            <ZAxis type="number" dataKey="z" range={[50, 400]} name="Đơn hàng" />
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
            
            {/* Median Lines for Quadrants */}
            <ReferenceLine x={medianX} stroke="#ffffff10" strokeWidth={2} />
            <ReferenceLine y={medianY} stroke="#ffffff10" strokeWidth={2} />
            
            <Scatter name="KOCs" data={data} fill="#6366F1">
               {data.map((entry, index) => (
                 <circle 
                   key={`dot-${index}`} 
                   cx={0} cy={0} r={0} // These are placeholders, Recharts handles positioning
                   fill={entry.y >= medianY ? (entry.x >= medianX ? '#10B981' : '#3B82F6') : (entry.x >= medianX ? '#F59E0B' : '#6B7280')} 
                   fillOpacity={0.6}
                 />
               ))}
            </Scatter>

            {/* Quadrant Labels */}
            <text x="75%" y="15%" textAnchor="middle" fill="#10B981" fontSize="10" fontWeight="bold" opacity="0.4">HIỆU QUẢ CAO / NỖ LỰC LỚN</text>
            <text x="25%" y="15%" textAnchor="middle" fill="#3B82F6" fontSize="10" fontWeight="bold" opacity="0.4">HIỆU QUẢ CAO / TỐI ƯU</text>
            <text x="75%" y="85%" textAnchor="middle" fill="#F59E0B" fontSize="10" fontWeight="bold" opacity="0.4">CẦN CẢI THIỆN CHUYỂN ĐỔI</text>
            <text x="25%" y="85%" textAnchor="middle" fill="#6B7280" fontSize="10" fontWeight="bold" opacity="0.4">TIỀM NĂNG MỚI</text>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
