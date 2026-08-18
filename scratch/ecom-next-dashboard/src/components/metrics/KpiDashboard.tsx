"use client";

import React from 'react';
import { ArrowUpRight, ArrowDownRight, AlertCircle } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const mockSparklineData = [
  { value: 40 }, { value: 30 }, { value: 60 }, { value: 45 }, { value: 80 }, { value: 65 }, { value: 90 }
];

const mockSparklineDataDown = [
  { value: 90 }, { value: 85 }, { value: 60 }, { value: 75 }, { value: 50 }, { value: 45 }, { value: 30 }
];

interface KpiDashboardProps {
  selectedBrand: string;
  timeRange: string;
}

export default function KpiDashboard({ selectedBrand, timeRange }: KpiDashboardProps) {
  // In a real app, this data would stem from the selected `timeRange` and `selectedBrand`
  const metrics = [
    {
      id: 'gross',
      title: 'Doanh thu Gross',
      value: '124.500.000₫',
      change: '12.5%',
      isUp: true,
      sparkline: mockSparklineData,
    },
    {
      id: 'net',
      title: 'Doanh thu Net',
      value: '108.200.000₫',
      change: '10.2%',
      isUp: true,
      sparkline: mockSparklineData,
    },
    {
      id: 'cancel_rate',
      title: 'Tỷ lệ hủy đơn',
      value: '4.8%',
      change: '1.2%',
      isUp: false, // bad trend
      alertThreshold: 4.0, // Alert if > 4%
      sparkline: mockSparklineDataDown,
    },
    {
      id: 'costs',
      title: 'Tổng chi phí',
      value: '42.300.000₫',
      change: '5.4%',
      isUp: false, // costs went up, which is technically bad, so down arrow or negative logic
      sparkline: mockSparklineData,
      inverseLogic: true, // Up is negative semantics
    },
    {
      id: 'roas',
      title: 'ROAS Blended',
      value: '2.94x',
      change: '8.4%',
      isUp: true,
      sparkline: mockSparklineData,
    },
    {
      id: 'aov',
      title: 'AOV (Trung bình đơn)',
      value: '85.700₫',
      change: '2.1%',
      isUp: true,
      sparkline: mockSparklineData,
    },
    {
      id: 'orders',
      title: 'Tổng số đơn',
      value: '1.452',
      change: '4.5%',
      isUp: false,
      sparkline: mockSparklineDataDown,
    },
    {
      id: 'margin',
      title: 'Biên lợi nhuận gộp',
      value: '64.2%',
      change: '0.8%',
      isUp: true,
      sparkline: mockSparklineData,
    }
  ];

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metrics.map((metric) => (
          <KpiCard key={metric.id} {...metric} />
        ))}
      </div>
    </div>
  );
}

function KpiCard({ title, value, change, isUp, sparkline, inverseLogic, alertThreshold }: any) {
  // Determine semantics
  let textColor = isUp ? 'text-emerald-500' : 'text-rose-500';
  let bgColor = isUp ? 'bg-emerald-500/10' : 'bg-rose-500/10';
  
  if (inverseLogic) {
    textColor = isUp ? 'text-rose-500' : 'text-emerald-500';
    bgColor = isUp ? 'bg-rose-500/10' : 'bg-emerald-500/10';
  }

  // Value parsing for alert
  const numericVal = parseFloat(value.replace(/[^0-9.]/g, ''));
  const isAlerting = alertThreshold && numericVal > alertThreshold;

  return (
    <div className={`relative flex flex-col p-5 bg-[#151821]/60 backdrop-blur-xl border rounded-2xl transition-all hover:border-white/20
      ${isAlerting ? 'border-rose-500/50' : 'border-white/10'}`}
    >
      {isAlerting && (
        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2 py-1 bg-rose-500/10 text-rose-500 text-xs font-semibold rounded-md">
          <AlertCircle size={14} />
          High
        </div>
      )}

      <h3 className="text-sm font-medium text-gray-400">{title}</h3>
      <div className="mt-2 text-3xl font-bold tracking-tight text-white">{value}</div>
      
      <div className="mt-4 flex items-end justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-0.5 px-2 py-1 rounded-full text-xs font-semibold ${bgColor} ${textColor}`}>
              {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {change}
            </span>
          </div>
          <span className="text-xs text-gray-500 font-medium">vs cùng kỳ</span>
        </div>
        
        <div style={{ width: '96px', height: '48px', opacity: 0.8 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparkline}>
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={textColor === 'text-emerald-500' ? '#10b981' : '#f43f5e'} 
                strokeWidth={2} 
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
