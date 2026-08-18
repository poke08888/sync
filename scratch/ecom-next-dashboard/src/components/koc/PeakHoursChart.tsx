"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PeakHoursChartProps {
  hourlyData: any[];
}

export default function PeakHoursChart({ hourlyData }: PeakHoursChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1A1E29] border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-md">
          <p className="text-xs text-gray-400 font-bold mb-2 uppercase tracking-widest">{label}</p>
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center gap-6">
              <span className="text-xs text-indigo-400">Có doanh thu:</span>
              <span className="text-sm font-bold text-white">{payload[0].value} phiên</span>
            </div>
            <div className="flex justify-between items-center gap-6">
              <span className="text-xs text-gray-500">Chưa có doanh thu:</span>
              <span className="text-sm font-bold text-white">{payload[1].value} phiên</span>
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
          <h3 className="text-lg font-bold text-white">Khung giờ Peak LIVE</h3>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-black">Phân bổ phiên live theo giờ</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-indigo-500 rounded-sm"></div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Có đơn</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-white/10 rounded-sm"></div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Không đơn</span>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={hourlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
            <XAxis 
              dataKey="hour" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6B7280', fontSize: 10, fontWeight: 700 }}
              interval={2}
            />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Bar dataKey="withRevenue" stackId="a" fill="#6366F1" radius={[0, 0, 0, 0]} barSize={20} />
            <Bar dataKey="withoutRevenue" stackId="a" fill="rgba(255,255,255,0.1)" radius={[4, 4, 0, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
