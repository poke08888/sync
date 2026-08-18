import React from 'react';
import { useKocStore } from '../../store/useKocStore';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function KocOverview() {
  const { globalMetrics, previousGlobalMetrics } = useKocStore();

  const fmtCurrency = (v) => {
    if (!v) return '0₫';
    if (v >= 1e9) return (v / 1e9).toFixed(1) + 'b';
    if (v >= 1e6) return (v / 1e6).toFixed(1) + 'm';
    if (v >= 1e3) return Math.floor(v / 1e3) + 'k₫';
    return new Intl.NumberFormat('en-US').format(Math.round(v));
  };
  
  const fmtNumber = (v) => new Intl.NumberFormat('en-US').format(Math.round(v));

  // Calculations for display
  const m = globalMetrics;
  const pm = previousGlobalMetrics || {};

  const getDelta = (curr, prev) => {
    if (typeof curr !== 'number' || typeof prev !== 'number') return null;
    if (prev === 0) return curr > 0 ? 100 : 0;
    return ((curr - prev) / prev) * 100;
  };

  const getAOV = (metrics) => (metrics.totalOrders > 0 ? (metrics.totalGMV / metrics.totalOrders) : 0);
  const getRevPerHour = (metrics) => (metrics.totalDurationHours > 0 ? (metrics.totalGMV / metrics.totalDurationHours) : 0);
  const getCVR = (metrics) => (metrics.totalClicks > 0 ? (metrics.totalOrders / metrics.totalClicks * 100) : 0);
  const getCTR = (metrics) => (metrics.totalImpressions > 0 ? (metrics.totalClicks / metrics.totalImpressions * 100) : 0);
  const getAvgDur = (metrics) => (metrics.totalSessions > 0 ? (metrics.totalDurationHours / metrics.totalSessions) : 0);

  const row1 = [
    { label: 'DOANH THU (GMV)', value: fmtCurrency(m.totalGMV), delta: getDelta(m.totalGMV, pm.totalGMV), sub: 'Gross revenue', accent: 'text-teal-400' },
    { label: 'SỐ PHIÊN LIVE', value: fmtNumber(m.totalSessions), delta: getDelta(m.totalSessions, pm.totalSessions), sub: 'Total sessions', accent: 'text-blue-400' },
    { label: 'SỐ PHIÊN RA ĐƠN', value: fmtNumber(m.sessionsWithOrders), delta: getDelta(m.sessionsWithOrders, pm.sessionsWithOrders), sub: `${m.sessionsWithOrders}/${m.totalSessions || 0} phiên có doanh thu`, accent: 'text-emerald-400' },
    { label: 'ĐƠN HÀNG', value: fmtNumber(m.totalOrders), delta: getDelta(m.totalOrders, pm.totalOrders), sub: 'SKU orders created', accent: 'text-blue-400' },
    { label: 'AOV', value: fmtCurrency(getAOV(m)), delta: getDelta(getAOV(m), getAOV(pm)), sub: 'Doanh thu / đơn hàng', accent: 'text-amber-400' },
    { label: 'DOANH THU / GIỜ', value: fmtCurrency(getRevPerHour(m)), delta: getDelta(getRevPerHour(m), getRevPerHour(pm)), sub: 'GMV / total hours', accent: 'text-rose-400' },
  ];

  const row2 = [
    { label: 'SỐ KOC ACTIVE', value: fmtNumber(m.kocCount), delta: getDelta(m.kocCount, pm.kocCount), sub: 'Unique creators', accent: 'text-purple-400' },
    { label: 'GIỜ LIVE TB / PHIÊN', value: getAvgDur(m).toFixed(1) + 'h', delta: getDelta(getAvgDur(m), getAvgDur(pm)), sub: 'Avg duration per session', accent: 'text-slate-400' },
    { label: 'LƯỢT HIỂN THỊ', value: fmtNumber(m.totalImpressions), delta: getDelta(m.totalImpressions, pm.totalImpressions), sub: 'Product impressions', accent: 'text-blue-400' },
    { label: 'LƯỢT NHẤP', value: fmtNumber(m.totalClicks), delta: getDelta(m.totalClicks, pm.totalClicks), sub: 'Product clicks', accent: 'text-teal-400' },
    { label: 'CTR', value: getCTR(m).toFixed(2) + '%', delta: getDelta(getCTR(m), getCTR(pm)), sub: 'Clicks / impressions', accent: 'text-amber-400' },
    { label: 'CVR', value: getCVR(m).toFixed(2) + '%', delta: getDelta(getCVR(m), getCVR(pm)), sub: 'Orders / clicks', accent: 'text-emerald-400' },
  ];

  const renderDelta = (delta) => {
    if (delta === null || delta === undefined || isNaN(delta)) return null;
    const isNeutral = delta === 0;
    const isUp = delta > 0;
    const abs = Math.abs(delta).toFixed(1);
    
    if (isNeutral) {
      return <span className="flex items-center gap-0.5 text-[10px] text-textMuted bg-white/5 px-1.5 py-0.5 rounded ml-2"><Minus className="w-3 h-3"/> 0%</span>;
    }
    
    return (
      <span className={`flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded ml-2 font-medium ${isUp ? 'text-emerald-400 bg-emerald-400/10' : 'text-rose-400 bg-rose-400/10'}`}>
        {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {abs}%
      </span>
    );
  };

  const Card = ({ item }) => (
    <div className="bg-surface border border-border p-4 rounded-xl flex flex-col justify-between hover:border-pantone-light/30 transition-colors">
      <div className="text-[11px] font-bold text-textMuted uppercase tracking-wider mb-2 flex items-center justify-between">
        {item.label}
      </div>
      <div className="flex items-end mb-1">
        <div className={`text-2xl font-bold ${item.accent}`}>{item.value}</div>
        {renderDelta(item.delta)}
      </div>
      <div className="text-xs text-textMuted/70 truncate">{item.sub}</div>
    </div>
  );

  return (
    <div className="space-y-6 mt-4">
      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Business Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4">
          {row1.map((item, i) => <Card key={`r1-${i}`} item={item} />)}
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Reach & Efficiency Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4">
          {row2.map((item, i) => <Card key={`r2-${i}`} item={item} />)}
        </div>
      </div>
    </div>
  );
}
