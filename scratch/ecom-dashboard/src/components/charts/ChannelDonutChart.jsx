import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Sector } from 'recharts';
import { channelDonutBase, channelDonutDrilldown } from '../../utils/mockChartData';
import { ArrowLeft } from 'lucide-react';

export default function ChannelDonutChart({ data: apiData }) {
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  const data = useMemo(() => {
    if (!apiData) return [];
    const colors = ['#003DA5', '#69b3e7', '#8b5cf6', '#f97316'];
    return apiData.labels.map((label, idx) => ({
      name: label,
      value: apiData.data[idx],
      color: colors[idx % colors.length]
    }));
  }, [apiData]);

  const totalValue = useMemo(() => {
    return data.reduce((sum, item) => sum + item.value, 0);
  }, [data]);

  const fmtShort = (val) => `${new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 }).format(val / 1000000000)} Tỷ`;
  const fmtFull = (v) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(v);

  const handleClick = (entry) => {
    // If we click a root channel that has drilldown
    if (!selectedChannel && channelDonutDrilldown[entry.name]) {
      setSelectedChannel(entry.name);
      setActiveIndex(-1);
    }
  };

  const handleBack = () => {
    setSelectedChannel(null);
    setActiveIndex(-1);
  };

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };
  const onPieLeave = () => {
    setActiveIndex(-1);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border border-border p-3 rounded-lg shadow-xl text-sm">
          <p className="font-bold text-white mb-1" style={{ color: payload[0].payload.color }}>
            {payload[0].name}
          </p>
          <p className="text-white font-medium">{fmtFull(payload[0].value)}</p>
          <p className="text-textMuted text-xs mt-1">{((payload[0].value / totalValue) * 100).toFixed(1)}% tỷ trọng</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-5 flex flex-col h-[480px] relative">
      <div className="mb-2 flex items-start justify-between">
        <div>
          <h3 className="text-white font-semibold flex items-center gap-2">Tỷ trọng Kênh / Brand</h3>
          <p className="text-xs text-textMuted mt-1">Cơ cấu doanh thu (Click vào vòng cung để Drill-down)</p>
        </div>
        {selectedChannel && (
          <button 
            onClick={handleBack}
            className="flex items-center gap-1 bg-pantone-293/20 text-pantone-light px-3 py-1 rounded-full text-xs font-medium hover:bg-pantone-293 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3 h-3" /> Quay lại
          </button>
        )}
      </div>

      <div className="flex-1 w-full relative">
        {/* Center Text manually overlaid */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
          <span className="text-xs text-textMuted">{selectedChannel ? selectedChannel : 'Tổng Doanh Thu'}</span>
          <span className="text-2xl font-bold text-white tracking-tight">{fmtShort(totalValue)}</span>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={4}
              dataKey="value"
              onClick={handleClick}
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              stroke="none"
              cursor={!selectedChannel ? "pointer" : "default"}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  opacity={activeIndex === index || activeIndex === -1 ? 1 : 0.4}
                  className="transition-opacity duration-300 outline-none"
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Detailed Data List */}
      <div className="flex flex-col gap-1.5 mt-2 z-10 relative">
        {data.map((entry, i) => {
          const diff = entry.value - (entry.prevValue || 0);
          const yoy = entry.prevValue ? (diff / entry.prevValue) * 100 : 0;
          const isUp = diff >= 0;
          
          return (
            <div 
              key={i} 
              className="flex items-center justify-between text-xs cursor-pointer p-1.5 rounded-lg border border-transparent hover:border-border hover:bg-background/50 transition-colors" 
              onMouseEnter={() => setActiveIndex(i)} 
              onMouseLeave={onPieLeave}
            >
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }}></div>
                <span className="text-textMuted font-medium">{entry.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-white font-bold">{new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 }).format(entry.value / 1000000)}M đ</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 ${isUp ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                  {isUp ? '↗' : '↘'} {Math.abs(yoy).toFixed(1)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
