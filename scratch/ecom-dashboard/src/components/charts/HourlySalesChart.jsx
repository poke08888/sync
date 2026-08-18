import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts';
import { generateHourlyData } from '../../utils/mockChartData';

export default function HourlySalesChart({ data: apiData }) {
  const data = useMemo(() => {
    if (!apiData) return [];
    
    // Map API format { labels: [], current: [], previous: [] } to Recharts format
    let raw = apiData.labels.map((label, idx) => ({
      hour: label,
      current: apiData.current[idx],
      previous: apiData.previous[idx]
    }));

    // Sort to find top 3
    let sorted = [...raw].sort((a, b) => b.current - a.current);
    const top3Hours = sorted.slice(0, 3).map(d => d.hour);
    return raw.map(d => ({ ...d, isPeak: top3Hours.includes(d.hour) }));
  }, [apiData]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length >= 2) {
      const current = payload[0].value;
      const previous = payload[1].value;
      const diff = current - previous;
      const pct = (diff / previous) * 100;
      const isUp = current >= previous;
      const color = isUp ? 'text-green-400' : 'text-red-400';

      const fmt = (v) => new Intl.NumberFormat('vi-VN').format(v);

      return (
        <div className="bg-surface border border-border p-3 rounded-lg shadow-xl shadow-black/50">
          <p className="text-white font-bold mb-2 border-b border-border pb-1">{label}</p>
          <div className="flex flex-col gap-1 text-sm">
            <span className="text-pantone-light flex justify-between gap-4">
              Kỳ này: <strong className="text-white">{fmt(current)}</strong>
            </span>
            <span className="text-textMuted flex justify-between gap-4">
              Cùng kỳ: <strong className="text-gray-300">{fmt(previous)}</strong>
            </span>
            <span className={`mt-1 flex justify-between gap-4 ${color}`}>
              Chênh lệch: <strong>{isUp ? '+' : ''}{pct.toFixed(1)}%</strong>
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  const fmtShort = (val) => `${new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 }).format(val / 1000000)}M`;

  return (
    <div className="bg-surface border border-border rounded-xl p-5 flex flex-col h-[400px]">
      <div className="mb-4">
        <h3 className="text-white font-semibold flex items-center gap-2">Doanh số theo giờ</h3>
        <p className="text-xs text-textMuted mt-1">So sánh dòng tiền trong ngày (24h) với trung bình cùng kỳ</p>
      </div>

      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={true} />
            <XAxis dataKey="hour" stroke="#94A3B8" fontSize={11} tickLine={false} tickMargin={8} minTickGap={15} />
            <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={fmtShort} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#3364B7', strokeWidth: 1, strokeDasharray: '4 4' }} />
            
            {/* Cùng kỳ */}
            <Line 
              type="monotone" 
              dataKey="previous" 
              name="Cùng kỳ"
              stroke="#64748B" 
              strokeWidth={2} 
              strokeDasharray="4 4" 
              dot={false}
              activeDot={{ r: 4 }}
            />
            {/* Kỳ này */}
            <Line 
              type="monotone" 
              dataKey="current" 
              name="Kỳ này"
              stroke="#003DA5" 
              strokeWidth={3} 
              dot={false}
              activeDot={{ r: 6, fill: '#003DA5', stroke: '#fff', strokeWidth: 2 }}
            />

            {/* Thêm điểm Peak Hour */}
            {data.filter(d => d.isPeak).map((peak, i) => (
              <ReferenceDot 
                key={i}
                x={peak.hour} 
                y={peak.current} 
                r={6} 
                fill="#F59E0B" 
                stroke="#fff" 
                strokeWidth={2}
                ifOverflow="visible"
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend Area */}
      <div className="flex items-center justify-between mt-4 text-xs">
        <div className="flex gap-4">
          <div className="flex items-center gap-2 text-white"><div className="w-3 h-1 bg-pantone-293 rounded-full"></div> Kỳ này</div>
          <div className="flex items-center gap-2 text-textMuted"><div className="w-3 h-0 border-t-2 border-dashed border-slate-500"></div> Cùng kỳ</div>
        </div>
        <div className="flex items-center gap-2 text-textMuted">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500 border border-white"></div> Peak Hours (Top 3)
        </div>
      </div>
    </div>
  );
}
