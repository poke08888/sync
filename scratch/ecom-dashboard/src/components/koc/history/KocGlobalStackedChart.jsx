import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { useKocStore } from '../../../store/useKocStore';
import { aggregateByDate, aggregateByWeek, aggregateByMonth } from '../../../utils/kocExcelParser';

const fmtCurrencyShort = (v) => {
  if (v >= 1e9) return (v / 1e9).toFixed(1) + 'B';
  if (v >= 1e6) return (v / 1e6).toFixed(0) + 'M';
  if (v >= 1e3) return (v / 1e3).toFixed(0) + 'K';
  return v;
};

// Top 5 vibrant preset colors for the KOC layers
const STACK_COLORS = ['#2dd4bf', '#3b82f6', '#fbbf24', '#f43f5e', '#a855f7', '#64748b'];

export default function KocGlobalStackedChart({ period }) {
  const { rawLives, kocList } = useKocStore();

  const data = useMemo(() => {
    let filtered = [...rawLives];
    
    // Identify top 5 KOCs dynamically in this filtered frame
    const kocSums = {};
    filtered.forEach(r => {
      const name = r.name || r.username || 'Unknown';
      if (!kocSums[name]) kocSums[name] = 0;
      kocSums[name] += r.gmv;
    });

    // Array of strictly top 5 koc names
    const top5Names = Object.entries(kocSums)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(entry => entry[0]);

    // Apply time aggregation
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

    // Shape the data for recharts Stacked Bar
    const finalData = aggregated.map(agg => {
      const dayRecord = { label: agg.label };
      // Distribute GMV per KOC
      agg.rows.forEach(r => {
        const name = r.name || r.username || 'Unknown';
        // If it's a top 5 KOC
        if (top5Names.includes(name)) {
          if (!dayRecord[name]) dayRecord[name] = 0;
          dayRecord[name] += r.gmv;
        } else {
          // Others
          if (!dayRecord['Khác']) dayRecord['Khác'] = 0;
          dayRecord['Khác'] += r.gmv;
        }
      });
      return dayRecord;
    });

    return { chartData: finalData, keys: top5Names };
  }, [rawLives, period]);

  if (!data.chartData.length) {
    return (
      <div className="bg-surface border border-border rounded-xl p-5 h-[400px] flex items-center justify-center">
        <p className="text-textMuted text-sm">Không đủ dữ liệu cho phạm vi và cách thức xem đã cho.</p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-xl p-6 h-[500px] flex flex-col shadow-sm">
      <div className="mb-6">
        <h3 className="text-white font-bold text-lg">Top 5 KOC Cống hiến GMV Theo Thời Gian</h3>
        <p className="text-sm text-textMuted mt-1">Phần còn lại lược giản vào danh mục "Khác"</p>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
            <XAxis 
              dataKey="label" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#a1a1aa', fontSize: 11 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#a1a1aa', fontSize: 11 }}
              tickFormatter={fmtCurrencyShort}
            />
            <Tooltip
               cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
               content={({ active, payload, label }) => {
                 if (active && payload && payload.length) {
                   // Calculate Total
                   const total = payload.reduce((sum, p) => sum + p.value, 0);

                   return (
                     <div className="bg-surface border border-border p-3 rounded-lg shadow-xl text-sm min-w-[200px]">
                       <p className="font-bold text-white mb-2 pb-2 border-b border-white/10 uppercase tracking-widest text-[10px]">{label}</p>
                       <div className="space-y-1.5 mb-2">
                         {[...payload].reverse().map((entry, index) => (
                           <div key={`item-${index}`} className="flex items-center justify-between gap-4">
                             <div className="flex items-center gap-2">
                               <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }}></div>
                               <span className="text-textMuted max-w-[120px] truncate" title={entry.name}>{entry.name}</span>
                             </div>
                             <span className="text-white font-medium">{new Intl.NumberFormat('vi-VN').format(entry.value)}đ</span>
                           </div>
                         ))}
                       </div>
                       <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                         <span className="text-pantone-light font-bold">Tổng:</span>
                         <span className="text-pantone-light font-bold">{new Intl.NumberFormat('vi-VN').format(total)}đ</span>
                       </div>
                     </div>
                   );
                 }
                 return null;
               }}
            />
            <Legend 
              wrapperStyle={{ fontSize: '11px', color: '#a1a1aa', marginTop: '10px' }}
            />
            
            {/* Render bars dynamically mapped to the top 5 keys */}
            {data.keys.map((keyName, i) => (
              <Bar 
                key={`bar-${i}`} 
                dataKey={keyName} 
                stackId="stack" 
                fill={STACK_COLORS[i % STACK_COLORS.length]} 
                radius={i === data.keys.length - 1 ? [4,4,0,0] : [0,0,0,0]} // Add radius to the top assuming it's the last if 'Khác' is empty
              />
            ))}
            
            {/* Fallback "Khác" category that combines lower rank KOCs */}
            <Bar 
              key="bar-other" 
              dataKey="Khác" 
              stackId="stack" 
              name="Khác (Còn lại)"
              fill={STACK_COLORS[5]} 
              radius={[4,4,0,0]} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
