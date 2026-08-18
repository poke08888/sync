import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useKocStore } from '../../../store/useKocStore';

const fmtCurrency = (v) => {
  if (!v) return '0₫';
  if (v >= 1e9) return (v / 1e9).toFixed(1) + 'B₫';
  if (v >= 1e6) return (v / 1e6).toFixed(1) + 'M₫';
  if (v >= 1e3) return Math.floor(v / 1e3) + 'K₫';
  return new Intl.NumberFormat('en-US').format(Math.round(v));
};

export default function KocTopChart() {
  const { kocList } = useKocStore();

  const data = useMemo(() => {
    return [...kocList]
      .sort((a, b) => b.totalGMV - a.totalGMV)
      .slice(0, 10)
      .map(k => ({
        ...k,
        displayName: k.name.length > 15 ? k.name.substring(0, 15) + '...' : k.name,
      }));
  }, [kocList]);

  if (!data.length) return null;

  return (
    <div className="bg-surface border border-border rounded-xl p-5 h-[400px] flex flex-col">
      <div className="mb-4">
        <h3 className="text-white font-semibold flex items-center gap-2">Top 10 KOC theo Doanh Thu</h3>
        <p className="text-xs text-textMuted mt-1">Danh sách nhà sáng tạo mang lại GMV cao nhất</p>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#ffffff10" />
            <XAxis type="number" hide />
            <YAxis 
              dataKey="displayName" 
              type="category" 
              width={100}
              axisLine={false} 
              tickLine={false}
              tick={{ fill: '#a1a1aa', fontSize: 11 }}
            />
            <Tooltip
              cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const p = payload[0].payload;
                  return (
                    <div className="bg-surface border border-border p-3 rounded-lg shadow-xl text-sm">
                      <p className="font-bold text-white mb-2">{p.name}</p>
                      <p className="text-teal-400 font-medium">GMV: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.totalGMV)}</p>
                      <p className="text-textMuted mt-1">Đơn hàng: {p.totalOrders}</p>
                      <p className="text-textMuted mt-1">Doanh thu/Giờ: {fmtCurrency(p.revPerHour)}/h</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="totalGMV" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={`url(#colorTealToBlue-${index})`} />
              ))}
            </Bar>
            <defs>
              {data.map((entry, index) => (
                <linearGradient key={`gradient-${index}`} id={`colorTealToBlue-${index}`} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#2dd4bf" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.8} />
                </linearGradient>
              ))}
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
