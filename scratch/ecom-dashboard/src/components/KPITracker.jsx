import React, { useState, useMemo } from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { Target, TrendingUp, TrendingDown, Clock, AlertCircle, CheckCircle2, Zap } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const BRANDS = ['All Brands', 'Brand A - Cosmetics', 'Brand B - Fashion', 'Brand C - Home'];
const PERIODS = ['Tuần', 'Tháng', 'Quý', 'Năm'];
const PERIOD_MAP = { 'Tuần': 'week', 'Tháng': 'month', 'Quý': 'quarter', 'Năm': 'year' };

import { useAuthStore } from '../store/useAuthStore';

export default function KPITracker({ data: apiData }) {
  const [period, setPeriod] = useState('Tháng');
  const { globalBrand: brand } = useAuthStore();

  const selectedData = useMemo(() => {
    if (!apiData) return null;
    const key = PERIOD_MAP[period];
    return apiData[key];
  }, [apiData, period]);

  if (!selectedData) return null;

  const { target, current: achieved, percentage: percentAchieved, remaining_days: daysRemaining, daily_required: dailyAverageNeeded } = selectedData;
  
  // Estimate total days and elapsed days for UI markers
  const daysTotal = period === 'Tháng' ? 30 : (period === 'Tuần' ? 7 : (period === 'Quý' ? 90 : 365));
  const daysElapsed = daysTotal - daysRemaining;
  const timeElapsedPercent = (daysElapsed / daysTotal) * 100;
  
  const isPaceGood = percentAchieved >= timeElapsedPercent;
  const currentDailyAverage = daysElapsed > 0 ? achieved / daysElapsed : 0;
  const forecast = currentDailyAverage * daysTotal;
  const forecastPercent = (forecast / target) * 100;

  // Format currency
  const fmt = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(Math.round(val));
  const fmtShort = (val) => `₫${new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 }).format(val / 1000000)}M`;

  // Mock data cho Weekly Breakdown Chart (Chỉ mock logic mô phỏng 4 tuần của Tháng)
  const chartData = useMemo(() => {
    const weeklyTarget = target / 4;
    return [
      { name: 'Tuần 1', achieved: weeklyTarget * 0.95, target: weeklyTarget, isCurrent: false },
      { name: 'Tuần 2', achieved: weeklyTarget * 1.1, target: weeklyTarget, isCurrent: true },
      { name: 'Tuần 3', achieved: 0, target: weeklyTarget, isCurrent: false },
      { name: 'Tuần 4', achieved: 0, target: weeklyTarget, isCurrent: false },
    ];
  }, [target]);

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 mt-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-pantone-293/20 flex items-center justify-center">
            <Target className="w-5 h-5 text-pantone-light" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">KPI Tracker & Forecast</h2>
            <p className="text-sm text-textMuted sm:whitespace-nowrap">Theo dõi tiến độ doanh thu thực tế so với mục tiêu chiến lược</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-background/50 px-3 py-1 rounded-md border border-border text-pantone-light text-sm font-medium">
            {brand}
          </div>
          <div className="flex bg-background p-1 rounded-lg border border-border">
            {PERIODS.map(p => (
              <button 
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  "px-4 py-1.5 rounded-md text-sm font-medium transition-colors",
                  period === p ? "bg-pantone-293 text-white" : "text-textMuted hover:text-white"
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main KPI Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Progress & Numbers */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Progress Bar Section */}
          <div className="bg-background/50 border border-border p-5 rounded-xl">
            <div className="flex justify-between items-end mb-2">
              <div>
                <p className="text-sm text-textMuted mb-1">Doanh thu đã đạt</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-bold text-white">{fmt(achieved)}</h3>
                  <span className="text-textMuted text-sm">/ {fmt(target)}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-pantone-light">{percentAchieved.toFixed(1)}%</span>
              </div>
            </div>
            
            {/* The Bar */}
            <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden relative mt-4">
              <div 
                className={cn("h-full absolute top-0 left-0 rounded-full transition-all duration-1000", isPaceGood ? "bg-green-500" : "bg-pantone-293")} 
                style={{ width: `${Math.min(percentAchieved, 100)}%` }} 
              />
              {/* Target Marker */}
              <div className="absolute top-0 bottom-0 w-0.5 bg-white/20 z-10" style={{ left: '100%' }} />
              {/* Current Time Elapsed Marker */}
              <div 
                className="absolute top-0 bottom-0 w-1 bg-yellow-400 z-10 shadow-[0_0_8px_rgba(250,204,21,0.8)]" 
                style={{ left: `${timeElapsedPercent}%` }} 
                title={`Thời gian trôi qua: ${timeElapsedPercent.toFixed(1)}%`}
              />
            </div>
            
            {/* Pace Indicator Text */}
            <div className="flex items-center gap-2 mt-4 text-sm">
              <Clock className="w-4 h-4 text-textMuted" />
              <span className="text-textMuted">
                Đã qua <strong className="text-white">{timeElapsedPercent.toFixed(1)}%</strong> thời gian ({daysElapsed}/{daysTotal} ngày).
              </span>
              <span className="mx-2 text-border">|</span>
              {isPaceGood ? (
                <span className="flex items-center gap-1 text-green-400 font-medium bg-green-500/10 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Đang vượt tiến độ
                </span>
              ) : (
                <span className="flex items-center gap-1 text-red-400 font-medium bg-red-500/10 px-2 py-0.5 rounded-full">
                  <AlertCircle className="w-3.5 h-3.5" /> Đang chậm tiến độ
                </span>
              )}
            </div>
          </div>

          {/* Actionable Insights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Daily Needed Box */}
            <div className="bg-gradient-to-br from-pantone-dark to-background border border-pantone-293/50 p-5 rounded-xl shadow-lg shadow-pantone-293/10 relative overflow-hidden">
              <Zap className="absolute -right-4 -top-4 w-24 h-24 text-pantone-293/20 transform rotate-12" />
              <h4 className="text-pantone-light text-sm font-semibold mb-3 flex items-center gap-2 relative z-10">
                DAILY AVERAGE NEEDED
              </h4>
              <p className="text-white text-sm mb-1 relative z-10">
                Để đạt chuẩn 100% KPI, cần duy trì:
              </p>
              <h3 className="text-2xl font-bold text-white relative z-10 my-1">
                {fmt(dailyAverageNeeded)} <span className="text-base font-normal text-textMuted">/ ngày</span>
              </h3>
              <p className="text-sm text-pantone-light font-medium relative z-10">
                trong {daysRemaining} ngày còn lại
              </p>
            </div>

            {/* Forecast Box */}
            <div className="bg-surface border border-border p-5 rounded-xl">
              <h4 className="text-textMuted text-sm font-medium mb-3">DỰ BÁO CUỐI KỲ (FORECAST)</h4>
              <p className="text-sm text-textMuted mb-2">Nếu tiếp tục duy trì pace hiện tại:</p>
              <div className="flex items-end gap-3 mb-1">
                <h3 className="text-2xl font-bold text-white tracking-tight">{fmt(forecast)}</h3>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className={cn(
                  "px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1",
                  forecastPercent >= 100 ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                )}>
                  {forecastPercent >= 100 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  {forecastPercent.toFixed(1)}% KPI
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Mini Chart */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="flex-1 min-h-[300px] bg-background/50 border border-border rounded-xl p-5 flex flex-col">
            <h4 className="text-white font-semibold text-sm mb-1">Weekly Breakdown</h4>
            <p className="text-textMuted text-xs mb-6">Mô phỏng doanh thu theo từng tuần trong chu kỳ</p>
            
            <div className="w-full relative h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={fmtShort} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', color: '#F8FAFC', borderRadius: '8px' }}
                    itemStyle={{ color: '#F8FAFC' }}
                    formatter={(value) => fmt(value)}
                  />
                  
                  {/* KPI Line */}
                  <Line 
                    type="step" 
                    name="KPI Target/Tuần" 
                    dataKey="target" 
                    stroke="#003DA5" 
                    strokeWidth={2} 
                    strokeDasharray="4 4"
                    dot={false}
                    activeDot={false}
                  />

                  {/* Achieved Bars */}
                  <Bar dataKey="achieved" name="Thực đạt" radius={[4, 4, 0, 0]} maxBarSize={40}>
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.isCurrent ? '#4ADE80' : '#3364B7'} 
                        fillOpacity={entry.isCurrent ? 1 : 0.7}
                      />
                    ))}
                  </Bar>
                </ComposedChart>
              </ResponsiveContainer>
              
              {/* Chart Legend Custom */}
              <div className="flex items-center justify-center gap-4 mt-2 text-xs text-textMuted">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-pantone-light opacity-70 rounded-sm"></div>Đã chốt</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-green-400 rounded-sm"></div>Tuần hiện tại</div>
                <div className="flex items-center gap-1.5"><div className="w-6 h-0 border-t-2 border-dashed border-pantone-293"></div>KPI trung bình</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
