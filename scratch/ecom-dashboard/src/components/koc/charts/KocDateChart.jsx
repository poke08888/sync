import React, { useMemo } from 'react';
import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useKocStore } from '../../../store/useKocStore';
import { aggregateByDate } from '../../../utils/kocExcelParser';

const fmtCurrencyShort = (v) => {
  if (v >= 1e9) return (v / 1e9).toFixed(1) + 'B';
  if (v >= 1e6) return (v / 1e6).toFixed(0) + 'M';
  return (v / 1e3).toFixed(0) + 'K';
};

const getHourData = (rawLives) => {
  const hourMap = {};
  rawLives.forEach(r => {
    let hourLabel = '00h';
    if (r.startTime) {
      // 2026/04/06/ 22:55
      const parts = r.startTime.split(' ');
      if (parts.length > 1) {
        hourLabel = parts[1].split(':')[0] + 'h';
      }
    }
    if (!hourMap[hourLabel]) {
      hourMap[hourLabel] = {
        date: hourLabel, // override date key for x-axis reuse
        totalGMV: 0,
        totalOrders: 0,
        totalSessions: 0
      };
    }
    hourMap[hourLabel].totalGMV += r.gmv;
    hourMap[hourLabel].totalOrders += r.orders;
    hourMap[hourLabel].totalSessions += 1;
  });
  
  return Object.values(hourMap).sort((a,b) => parseInt(a.date) - parseInt(b.date));
};

export default function KocDateChart() {
  const { rawLives } = useKocStore();

  const data = useMemo(() => {
    const dailyData = aggregateByDate(rawLives);
    
    // Fallback to hourly if there is only 1 day of data
    if (dailyData.length <= 1) {
      return getHourData(rawLives).map(d => ({
        ...d,
        displayDate: d.date // "22h"
      }));
    }

    // Default daily
    return dailyData.map(d => {
      // "2026-04-06" -> "06/04"
      let displayDate = d.date;
      if (d.date.includes('-')) {
        const p = d.date.split('-');
        displayDate = `${p[2]}/${p[1]}`;
      }
      return {
        ...d,
        displayDate
      };
    });
  }, [rawLives]);

  if (!data.length) return null;

  const isHourly = data.length > 0 && data[0].displayDate.includes('h');

  return (
    <div className="bg-surface border border-border rounded-xl p-5 h-[400px] flex flex-col">
      <div className="mb-4">
        <h3 className="text-white font-semibold flex items-center gap-2">
          Doanh thu theo {isHourly ? 'Giờ trong ngày' : 'Ngày'}
        </h3>
        <p className="text-xs text-textMuted mt-1">Xu hướng GMV và số lượng đơn hàng</p>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="colorGmv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
            <XAxis 
              dataKey="displayDate" 
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
              dx={-10}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#fbbf24', fontSize: 11 }}
              dx={10}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-surface border border-border p-3 rounded-lg shadow-xl text-sm">
                      <p className="font-bold text-white mb-2">{label}</p>
                      <p className="text-teal-400 font-medium tracking-tight">GMV: {new Intl.NumberFormat('vi-VN').format(payload[0].payload.totalGMV)} đ</p>
                      <p className="text-amber-400 font-medium">Đơn hàng: {new Intl.NumberFormat('en-US').format(payload[0].payload.totalOrders)}</p>
                      <p className="text-textMuted mt-1 text-xs">Tổng số phiên live: {payload[0].payload.totalSessions || payload[0].payload.rows?.length || 0}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area 
              yAxisId="left"
              type="monotone" 
              dataKey="totalGMV" 
              stroke="#2dd4bf" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorGmv)" 
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="totalOrders" 
              stroke="#fbbf24" 
              strokeWidth={2}
              dot={{ r: 3, fill: '#fbbf24', strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
