import React from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper for conditional tailwind classes
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function KPICard({ 
  title, 
  data, 
  isCurrency = false,
  formatter = null 
}) {
  if (!data) return null;

  const { value, changeStr, sparkline, invertColor, alertThreshold, isPercent, isMultiplier } = data;
  
  // Format the main value
  let displayValue = value;
  if (formatter) {
    displayValue = formatter(value);
  } else if (isCurrency) {
    displayValue = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value);
  } else if (isPercent) {
    displayValue = `${value}%`;
  } else if (isMultiplier) {
    displayValue = `${value}x`;
  } else {
    displayValue = new Intl.NumberFormat('vi-VN').format(value);
  }

  // Parse change string
  const isPositiveChange = changeStr.startsWith('+');
  const changeVal = changeStr.replace(/[+-]/g, '');

  // Determine Semantic Colors
  // Normally: up is green, down is red. 
  // If invertColor is true (like Cancel Rate, Cost): up is red, down is green.
  let colorClass = 'text-gray-400';
  let bgColorClass = 'bg-gray-500/10';
  let strokeColor = '#94A3B8'; // gray
  let fillGradient = 'colorGray';

  if (isPositiveChange) {
    colorClass = invertColor ? 'text-red-400' : 'text-green-400';
    bgColorClass = invertColor ? 'bg-red-500/10' : 'bg-green-500/10';
    strokeColor = invertColor ? '#F87171' : '#4ADE80';
    fillGradient = invertColor ? 'colorRed' : 'colorGreen';
  } else if (changeStr.startsWith('-')) {
    colorClass = invertColor ? 'text-green-400' : 'text-red-400';
    bgColorClass = invertColor ? 'bg-green-500/10' : 'bg-red-500/10';
    strokeColor = invertColor ? '#4ADE80' : '#F87171';
    fillGradient = invertColor ? 'colorGreen' : 'colorRed';
  }

  // Alert logic
  const isAlert = alertThreshold && value > alertThreshold;

  return (
    <div className={cn(
      "bg-surface border p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden group hover:border-pantone-light transition-colors duration-300",
      isAlert ? "border-red-500/50" : "border-border"
    )}>
      
      {/* Alert Ribbon */}
      {isAlert && (
        <div className="absolute top-0 right-0 bg-red-500/10 text-red-500 px-3 py-1 rounded-bl-lg text-xs font-bold flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          Vượt Ngưỡng
        </div>
      )}

      {/* Header */}
      <h3 className="text-textMuted text-sm font-medium mb-2">{title}</h3>
      
      <div className="flex items-end justify-between z-10 w-full mb-4 mt-2">
        {/* Main Number */}
        <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight truncate">
          {displayValue}
        </h2>

        {/* Change % */}
        <div className={cn("flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold whitespace-nowrap", bgColorClass, colorClass)}>
          {isPositiveChange ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
          {changeVal} <span className="opacity-75 font-normal ml-0.5 whitespace-nowrap hidden sm:inline">vs cùng kỳ</span>
        </div>
      </div>

      {/* Sparkline */}
      <div className="h-12 w-full mt-auto relative z-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sparkline}>
            <defs>
              <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4ADE80" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#4ADE80" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorRed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F87171" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#F87171" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorGray" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#94A3B8" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#94A3B8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={strokeColor} 
              strokeWidth={2}
              fillOpacity={1} 
              fill={`url(#${fillGradient})`} 
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
