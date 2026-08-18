import React, { useMemo } from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea } from 'recharts';

export default function DailySalesChart({ data: apiData }) {
  const data = useMemo(() => {
    if (!apiData) return [];
    
    let raw = apiData.labels.map((label, idx) => ({
      day: label,
      sales: apiData.current[idx],
      previous: apiData.previous[idx]
    }));

    // Calculate MA7
    return raw.map((d, i) => {
      let window = raw.slice(Math.max(0, i - 6), i + 1);
      let avg = window.reduce((sum, curr) => sum + curr.sales, 0) / window.length;
      return { ...d, ma7: avg };
    });
  }, [apiData]);

  const kpiTarget = 300000000; // Keep mock target for now or pass from props

  const fmtShort = (val) => `${new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(val / 1000000)}M`;
  const fmt = (v) => new Intl.NumberFormat('vi-VN').format(v);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border border-border p-3 rounded-lg shadow-xl shadow-black/50 text-sm">
          <p className="text-white font-bold mb-2 border-b border-border pb-1">{label}</p>
          {payload.map(entry => (
            <div key={entry.dataKey} className="flex items-center justify-between gap-4 py-0.5">
              <span style={{ color: entry.color }}>{entry.name}:</span>
              <strong className="text-white">{entry.name === 'Biến động' ? entry.value : fmt(entry.value)}</strong>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-5 flex flex-col h-[400px]">
      <div className="mb-4">
        <h3 className="text-white font-semibold flex items-center gap-2">Doanh số theo ngày (30 Ngày)</h3>
        <p className="text-xs text-textMuted mt-1">Xu hướng (MA7) và so sánh chéo các chương trình khuyến mãi</p>
      </div>

      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={1} />
                <stop offset="100%" stopColor="#003DA5" stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} tickLine={false} tickMargin={8} minTickGap={20} />
            <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={fmtShort} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#334155', opacity: 0.4 }} />

            {/* Campaign Annotation Area */}
            <ReferenceArea x1="Ng 15" x2="Ng 16" fill="#10B981" fillOpacity={0.15} />
            <ReferenceLine x="Ng 15" stroke="#10B981" strokeDasharray="3 3" label={{ position: 'top', value: 'Payday', fill: '#10B981', fontSize: 10 }} />

            {/* KPI Target Line */}
            <ReferenceLine y={kpiTarget} stroke="#F59E0B" strokeDasharray="4 4" label={{ position: 'insideTopLeft', value: 'KPI Target', fill: '#F59E0B', fontSize: 10 }} />

            {/* Bars for Actual Revenue */}
            <Bar dataKey="sales" name="Doanh số" fill="url(#barGradient)" radius={[4, 4, 0, 0]} maxBarSize={30} />

            {/* Cùng kỳ Line */}
            <Line type="monotone" dataKey="previous" name="Cùng kỳ" stroke="#64748B" strokeWidth={2} strokeDasharray="4 4" dot={false} activeDot={false} />

            {/* MA7 Line */}
            <Line type="monotone" dataKey="ma7" name="MA7 (Trung bình 7 ngày)" stroke="#A855F7" strokeWidth={3} dot={false} activeDot={{ r: 5 }} />
            
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mt-4 text-xs">
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-blue-500 rounded-sm"></div> Kỳ này</div>
          <div className="flex items-center gap-1.5"><div className="w-4 h-1 bg-purple-500 rounded-full"></div> MA7</div>
          <div className="flex items-center gap-1.5"><div className="w-4 h-0 border-t-2 border-dashed border-slate-500"></div> Cùng kỳ</div>
        </div>
      </div>
    </div>
  );
}
