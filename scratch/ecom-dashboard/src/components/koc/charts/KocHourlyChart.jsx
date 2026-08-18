import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useKocStore } from '../../../store/useKocStore';

const getHourlyDistribution = (rawLives) => {
  const hours = Array.from({ length: 24 }, (_, i) => ({
    hour: `${String(i).padStart(2, '0')}h`,
    withOrders: 0,
    withoutOrders: 0,
    totalSessions: 0
  }));

  rawLives.forEach(r => {
    if (r.startTime) {
      // "2026/04/06/ 22:55"
      const parts = r.startTime.split(' ');
      if (parts.length > 1) {
        const hhStr = parts[1].split(':')[0];
        const hh = parseInt(hhStr, 10);
        if (!isNaN(hh) && hh >= 0 && hh < 24) {
          hours[hh].totalSessions += 1;
          if (r.orders > 0) hours[hh].withOrders += 1;
          else hours[hh].withoutOrders += 1;
        }
      }
    }
  });

  return hours;
};

export default function KocHourlyChart() {
  const { rawLives } = useKocStore();

  const data = useMemo(() => {
    return getHourlyDistribution(rawLives);
  }, [rawLives]);

  if (!data.length || rawLives.length === 0) return null;

  return (
    <div className="bg-surface border border-border rounded-xl p-5 h-[400px] flex flex-col">
      <div className="mb-4">
        <h3 className="text-white font-semibold flex items-center gap-2">Phân bổ Phiên Live theo Giờ</h3>
        <p className="text-xs text-textMuted mt-1">Lưu lượng Live và Tỷ lệ ra đơn trong ngày (Peak hours)</p>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 0, left: -20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
            <XAxis 
              dataKey="hour" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#a1a1aa', fontSize: 11 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#a1a1aa', fontSize: 11 }}
              dx={-10}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const p = payload[0].payload;
                  return (
                    <div className="bg-surface border border-border p-3 rounded-lg shadow-xl text-sm">
                      <p className="font-bold text-white mb-2">Khung giờ: {label}</p>
                      <p className="text-white font-medium">Tổng số phiên: {p.totalSessions}</p>
                      <p className="text-emerald-400 mt-1">Phiên ra đơn: {p.withOrders}</p>
                      <p className="text-slate-400 mt-1">Phiên rỗng: {p.withoutOrders}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend 
              verticalAlign="top" 
              height={36} 
              iconType="circle"
              wrapperStyle={{ fontSize: '12px', color: '#a1a1aa' }} 
            />
            <Bar name="Ra đơn" dataKey="withOrders" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
            <Bar name="Không đơn" dataKey="withoutOrders" stackId="a" fill="#475569" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
