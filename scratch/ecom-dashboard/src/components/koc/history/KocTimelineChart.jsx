import React, { useMemo } from 'react';
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useKocStore } from '../../../store/useKocStore';
import { aggregateByDate, aggregateByWeek, aggregateByMonth } from '../../../utils/kocExcelParser';

const fmtCurrencyShort = (v) => {
  if (v >= 1e9) return (v / 1e9).toFixed(1) + 'B';
  if (v >= 1e6) return (v / 1e6).toFixed(0) + 'M';
  return (v / 1e3).toFixed(0) + 'K';
};

export default function KocTimelineChart({ kocId, period }) {
  const { rawLives } = useKocStore();

  const data = useMemo(() => {
    if (!kocId) return [];

    let filtered = rawLives.filter(r => (r.creatorId || r.username) === kocId);

    // Apply aggregation Based on period ('day', 'week', 'month', 'year')
    // Fallback 'year' to 'month' for now as 'year' agg was not heavily requested
    let aggregated = [];
    if (period === 'month' || period === 'year') {
      aggregated = aggregateByMonth(filtered).map(d => ({ ...d, label: d.month }));
    } else if (period === 'week') {
      aggregated = aggregateByWeek(filtered).map(d => ({ ...d, label: d.week }));
    } else {
      aggregated = aggregateByDate(filtered).map(d => {
        let label = d.date;
        if (d.date.includes('-')) {
          const p = d.date.split('-');
          label = `${p[2]}/${p[1]}`;
        }
        return { ...d, label };
      });
    }

    return aggregated;
  }, [rawLives, kocId, period]);

  if (!data.length) return (
    <div className="bg-surface border border-border rounded-xl p-5 h-[300px] flex items-center justify-center">
      <p className="text-textMuted">Không đủ dữ liệu lịch sử trong khoảng thời gian này.</p>
    </div>
  );

  return (
    <div className="bg-surface border border-border rounded-xl p-5 h-[350px] flex flex-col">
      <div className="mb-4">
        <h3 className="text-white font-semibold flex items-center gap-2">Biểu đồ Lịch sử Hoạt động</h3>
        <p className="text-xs text-textMuted mt-1">Xu hướng tăng trưởng GMV và số lượng chốt đơn</p>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 0, left: -10, bottom: 0 }}>
             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
             <XAxis 
              dataKey="label" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#a1a1aa', fontSize: 11 }}
              dy={10}
            />
            <YAxis 
              yAxisId="left"
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#a1a1aa', fontSize: 11 }}
              tickFormatter={fmtCurrencyShort}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#fbbf24', fontSize: 11 }}
            />
             <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-surface border border-border p-3 rounded-lg shadow-xl text-sm">
                      <p className="font-bold text-white mb-2">{label}</p>
                      <p className="text-teal-400 font-medium tracking-tight">GMV: {new Intl.NumberFormat('vi-VN').format(payload[0].payload.totalGMV)} đ</p>
                      <p className="text-amber-400 font-medium">Đơn hàng: {new Intl.NumberFormat('en-US').format(payload[0].payload.totalOrders)}</p>
                      <p className="text-textMuted mt-1 text-xs">Tổng số phiên: {payload[0].payload.rows?.length || payload[0].payload.totalSessions || 0}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="totalGMV" 
              stroke="#2dd4bf" 
              strokeWidth={3}
              dot={{ r: 4, fill: '#2dd4bf', strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="totalOrders" 
              stroke="#fbbf24" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 3, fill: '#fbbf24', strokeWidth: 0 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
