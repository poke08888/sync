import React, { useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { useKocStore } from '../../../store/useKocStore';

const fmtCurrencyShort = (v) => {
  if (v >= 1e9) return (v / 1e9).toFixed(1) + 'B';
  if (v >= 1e6) return (v / 1e6).toFixed(0) + 'M';
  if (v >= 1e3) return (v / 1e3).toFixed(0) + 'K';
  return v;
};

// Simple median calculation
const getMedian = (arr) => {
  if (!arr.length) return 0;
  const s = [...arr].sort((a,b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 !== 0 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
};

export default function KocScatterChart() {
  const { kocList } = useKocStore();

  const { data, medianX, medianY, maxZ } = useMemo(() => {
    // filter out zero duration to avoid clutter at 0,0 if needed, but keeping all here
    const valid = kocList.filter(k => k.totalDurationHours > 0 || k.totalGMV > 0);
    
    // Sort array of hours and gmv for median calculations
    const hours = valid.map(k => k.totalDurationHours);
    const gmvs = valid.map(k => k.totalGMV);
    
    const medX = getMedian(hours);
    const medY = getMedian(gmvs);
    const mZ = Math.max(...valid.map(k => k.totalOrders), 1); // for ZAxis range
    
    return { data: valid, medianX: medX, medianY: medY, maxZ: mZ };
  }, [kocList]);

  if (!data.length) return null;

  return (
    <div className="bg-surface border border-border rounded-xl p-5 h-[400px] flex flex-col relative">
      <div className="mb-4">
        <h3 className="text-white font-semibold flex items-center gap-2">Ma trận Hiệu suất KOC</h3>
        <p className="text-xs text-textMuted mt-1">Phân bổ Effort (Giờ Live) vs Doanh thu (GMV)</p>
      </div>

      <div className="flex-1 w-full min-h-0 relative">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis 
              type="number" 
              dataKey="totalDurationHours" 
              name="Giờ Live" 
              unit="h"
              tick={{ fill: '#a1a1aa', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis 
              type="number" 
              dataKey="totalGMV" 
              name="GMV" 
              tickFormatter={fmtCurrencyShort}
              tick={{ fill: '#a1a1aa', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              dx={-10}
            />
            <ZAxis 
              type="number" 
              dataKey="totalOrders" 
              range={[20, 200]} // min/max dot size visual
              name="Đơn hàng" 
            />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3', stroke: '#a1a1aa' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const p = payload[0].payload;
                  return (
                    <div className="bg-surface border border-border p-3 rounded-lg shadow-xl text-sm">
                      <p className="font-bold text-white mb-2">{p.name || p.username}</p>
                      <p className="text-teal-400 font-medium tracking-tight">GMV: {new Intl.NumberFormat('vi-VN').format(p.totalGMV)} đ</p>
                      <p className="text-amber-400 mt-1">Nỗ lực Live: {p.totalDurationHours.toFixed(1)}h</p>
                      <p className="text-blue-400 mt-1">Số đơn: {new Intl.NumberFormat('en-US').format(p.totalOrders)}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            
            <ReferenceLine x={medianX} stroke="#ffffff40" strokeDasharray="3 3" />
            <ReferenceLine y={medianY} stroke="#ffffff40" strokeDasharray="3 3" />

            <Scatter name="KOCs" data={data} fill="#8884d8">
              {data.map((entry, index) => {
                // Color code roughly by quadrant
                const isHighEffort = entry.totalDurationHours >= medianX;
                const isHighGMV = entry.totalGMV >= medianY;
                
                let fill = "#a1a1aa"; // low effort, low gmv
                if (isHighEffort && isHighGMV) fill = "#10b981"; // Star (green)
                if (!isHighEffort && isHighGMV) fill = "#3b82f6"; // High Return / Low effort (blue)
                if (isHighEffort && !isHighGMV) fill = "#fbbf24"; // High Effort / Low Return (amber)
                
                return <Cell key={`cell-${index}`} fill={fill} fillOpacity={0.7} />;
              })}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
        
        {/* Absolute labels for quadrants if there's data to show */}
        <div className="absolute top-2 right-4 text-[10px] text-emerald-400 font-medium">Ngôi sao (Nhiều effort, Doanh thu cao)</div>
        <div className="absolute top-2 left-16 text-[10px] text-blue-400 font-medium">Hiệu quả (Ít effort, Doanh thu cao)</div>
      </div>
    </div>
  );
}
