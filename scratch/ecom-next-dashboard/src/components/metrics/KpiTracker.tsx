"use client";

import React, { useMemo } from 'react';
import { LineChart, Line, ResponsiveContainer, ReferenceLine, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { Target, TrendingUp, Calendar, Zap, AlertTriangle, ChevronDown } from 'lucide-react';
import { formatNumber, formatCurrency } from '@/lib/utils';

type PeriodView = 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly';

const BRANDS = ['Tất cả các Brand', 'Macaron Cos', 'Tech Haven', 'Aura Beauty', 'Daily Fits', 'Home Luxe'];

const mockData: Record<string, any> = {
  'Monthly': {
    target: 500000,
    actual: 320000,
    daysInPeriod: 30,
    daysPassed: 18,
    chartData: [
      { name: 'Week 1', revenue: 75000, target: 125000 },
      { name: 'Week 2', revenue: 110000, target: 125000 },
      { name: 'Week 3', revenue: 135000, target: 125000, current: true },
      { name: 'Week 4', revenue: 0, target: 125000 },
    ]
  },
  'Weekly': {
    target: 125000,
    actual: 85000,
    daysInPeriod: 7,
    daysPassed: 4,
    chartData: [
      { name: 'Mon', revenue: 15000, target: 17857 },
      { name: 'Tue', revenue: 22000, target: 17857 },
      { name: 'Wed', revenue: 18000, target: 17857 },
      { name: 'Thu', revenue: 30000, target: 17857, current: true },
      { name: 'Fri', revenue: 0, target: 17857 },
      { name: 'Sat', revenue: 0, target: 17857 },
      { name: 'Sun', revenue: 0, target: 17857 },
    ]
  }
};

interface KpiTrackerProps {
  selectedBrand: string;
  timeRange: string;
}

export default function KpiTracker({ selectedBrand, timeRange }: KpiTrackerProps) {
  // Map timeRange to a view if possible, or keep Monthly as default for this demo
  const view: PeriodView = timeRange === 'today' || timeRange === 'yesterday' ? 'Weekly' : 'Monthly';

  const data = useMemo(() => {
    // Basic fallback logic for Quarter/Year for solo demo
    return mockData[view] || mockData['Monthly'];
  }, [view]);

  const progress = (data.actual / data.target) * 100;
  const timeProgress = (data.daysPassed / data.daysInPeriod) * 100;
  const isAhead = progress >= timeProgress;
  
  const daysRemaining = data.daysInPeriod - data.daysPassed;
  const remainingTarget = Math.max(0, data.target - data.actual);
  const dailyNeeded = daysRemaining > 0 ? remainingTarget / daysRemaining : 0;
  
  const currentPace = data.actual / data.daysPassed;
  const forecast = currentPace * data.daysInPeriod;
  const forecastPercent = (forecast / data.target) * 100;

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center gap-3 bg-[#151821]/40 p-3 rounded-2xl border border-white/5 backdrop-blur-md">
        <div className="p-1.5 bg-indigo-500/20 rounded-lg text-indigo-400">
          <Target size={18} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Theo dõi mục tiêu: {selectedBrand}</h2>
          <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-0.5">Tiến độ thời gian thực</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Progress & Logic */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Progress Card */}
          <div className="bg-[#151821]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-4 flex flex-col gap-4">
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Tiến độ tổng thể</span>
                <span className="text-xl font-bold text-white">{progress.toFixed(1)}%</span>
              </div>
              <div className="h-3 w-full bg-[#0B0E14] rounded-full overflow-hidden p-0.5 border border-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(99,102,241,0.4)]"
                  style={{ width: `${Math.min(100, progress)}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-3 text-xs font-medium">
                <span className="text-indigo-400">{formatCurrency(data.actual)}</span>
                <span className="text-gray-500">Target: {formatCurrency(data.target)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#0B0E14]/40 rounded-2xl border border-white/5">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Trạng thái nhịp độ (Pace)</span>
                <div className={`flex items-center gap-1.5 font-bold ${isAhead ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {isAhead ? <Zap size={12} /> : <AlertTriangle size={12} />}
                  {isAhead ? 'ĐANG NHANH HƠN' : 'ĐANG CHẬM HƠN'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-gray-500 mb-1">Thời gian đã trôi qua</div>
                <div className="text-xs font-bold text-gray-300">{timeProgress.toFixed(0)}%</div>
              </div>
            </div>
          </div>

          {/* Daily Average Card */}
          <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-xl border border-indigo-500/20 rounded-3xl p-4 relative overflow-hidden group">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2.5 bg-indigo-500/20 rounded-xl text-indigo-400">
                <Calendar size={20} />
              </div>
              <div className="px-2.5 py-1 bg-white/5 rounded-full text-[10px] font-bold text-indigo-300 uppercase tracking-widest border border-white/5">
                Target Logic
              </div>
            </div>
            
            <h3 className="text-xs text-gray-400 font-medium italic">★ MỨC CẦN ĐẠT TRUNG BÌNH NGÀY</h3>
            <div className="mt-2 flex flex-col">
              <span className="text-xl font-black text-white tracking-tight">{formatCurrency(Math.round(dailyNeeded))} / ngày</span>
              <p className="mt-2 text-sm text-gray-400">
                Cần đạt <span className="text-indigo-400 font-bold">{formatCurrency(Math.round(dailyNeeded))}đ/ngày</span> trong <span className="text-white font-bold">{daysRemaining} ngày</span> còn lại
              </p>
            </div>

            {/* Decorative background circle */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full group-hover:bg-indigo-500/20 transition-all"></div>
          </div>

          {/* Forecast Card */}
          <div className="bg-[#151821]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                <TrendingUp size={18} />
              </div>
               <span className="text-xs font-semibold text-gray-300">Dự báo cuối kỳ</span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-xl font-bold text-white">{formatCurrency(Math.round(forecast))}</div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-bold ${forecastPercent >= 100 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {forecastPercent.toFixed(1)}% KPI
                </span>
                <div className="h-1 w-1 bg-gray-600 rounded-full"></div>
                <span className="text-xs text-gray-500">Dựa trên nhịp độ hiện tại</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Chart */}
        <div className="lg:col-span-8 bg-[#151821]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-5 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-white">Chi tiết {view}</h3>
              <p className="text-sm text-gray-500">So sánh doanh thu thực tế vs mục tiêu</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                <span className="text-xs text-gray-400 font-medium">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-white/20 rounded-full border border-dashed border-white/40"></div>
                <span className="text-xs text-gray-400 font-medium">KPI Target</span>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full min-h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: '#ffffff05' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-[#1A1E29] border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-md">
                          <p className="text-xs text-gray-400 font-bold mb-1 uppercase tracking-widest">{payload[0].payload.name}</p>
                          <p className="text-lg font-black text-white">{formatCurrency(payload[0].value)}</p>
                          <div className="h-px bg-white/5 my-2"></div>
                          <p className="text-[10px] text-indigo-400 font-bold">TARGET: {formatCurrency(payload[0].payload.target)}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="revenue" radius={[6, 6, 0, 0]} barSize={40}>
                  {data.chartData.map((entry: any, index: number) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.current ? '#6366F1' : '#6366F140'} 
                      stroke={entry.current ? '#818CF8' : 'transparent'}
                      strokeWidth={2}
                    />
                  ))}
                </Bar>
                <ReferenceLine y={data.chartData[0].target} stroke="#6366F140" strokeDasharray="5 5" strokeWidth={2} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
