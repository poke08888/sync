"use client";

import React, { useState, useMemo } from 'react';
import { ShoppingBag, TrendingUp, Users, Clock, Target, Info, Calendar, TrendingDown } from 'lucide-react';
import KocLiveUpload from '@/components/koc/KocLiveUpload';
import KocRankingChart from '@/components/koc/KocRankingChart';
import KocTrendChart from '@/components/koc/KocTrendChart';
import KocEfficiencyScatter from '@/components/koc/KocEfficiencyScatter';
import PeakHoursChart from '@/components/koc/PeakHoursChart';
import KocTable from '@/components/koc/KocTable';
import KocHistoryTab from '@/components/koc/KocHistoryTab';
import KocAlertsTab from '@/components/koc/KocAlertsTab';
import { KocLiveSession, computeKpis, aggregateByKoc, aggregateByDate, aggregateByHour, getScatterData, filterSessions, detectKocAnomalies, calculateComparison } from '@/lib/koc-service';
import { formatNumber, formatKocCurrency, formatPercent, formatDuration, formatCompactNumber } from '@/lib/utils';
import { useFilters } from '@/context/FilterContext';
import { useKocData } from '@/hooks/useKocData';

export default function KocLivePage() {
  const { selectedBrand, timeRange, customRange } = useFilters();
  const { sessions, files, addData, deleteFile, isLoaded } = useKocData();
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'alerts' | 'data'>('overview');
  const [selectedKoc, setSelectedKoc] = useState<string | null>(null);

  // Auto-switch to data tab if no sessions
  React.useEffect(() => {
    if (isLoaded && sessions.length === 0) {
      setActiveTab('data');
    }
  }, [sessions.length, isLoaded]);

  const handleRowClick = (kocName: string) => {
    setSelectedKoc(kocName);
    setActiveTab('history');
  };

  const handleAlertAction = (kocName: string) => {
    setSelectedKoc(kocName);
    setActiveTab('history');
  };

  // 1. Filter sessions based on Global Filters (Date/Brand)
  const filteredSessions = useMemo(() => {
    return filterSessions(sessions, 'all', { from: customRange.start, to: customRange.end }, selectedBrand);
  }, [sessions, customRange, selectedBrand]);

  const stats = useMemo(() => computeKpis(filteredSessions), [filteredSessions]);
  const comparison = useMemo(() => {
    return calculateComparison(sessions, filteredSessions, { from: customRange.start, to: customRange.end }, selectedBrand);
  }, [sessions, filteredSessions, customRange, selectedBrand]);

  const kocRanking = useMemo(() => aggregateByKoc(filteredSessions), [filteredSessions]);
  const dailyTrends = useMemo(() => aggregateByDate(filteredSessions), [filteredSessions]);
  const hourlyData = useMemo(() => aggregateByHour(filteredSessions), [filteredSessions]);
  const scatterData = useMemo(() => getScatterData(filteredSessions), [filteredSessions]);
  const anomalies = useMemo(() => detectKocAnomalies(sessions, filteredSessions), [sessions, filteredSessions]);

  if (!isLoaded) {
    return <div className="flex items-center justify-center py-40 text-gray-500 font-bold uppercase tracking-widest animate-pulse">Đang tải...</div>;
  }

  return (
    <div className="flex flex-col gap-8 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">KOC Live Analytics</h1>
          <p className="text-gray-500 text-sm mt-1">Phân tích hiệu suất livestream tích hợp theo bộ lọc toàn cầu.</p>
        </div>
        
        <div className="flex bg-[#151821] p-1 rounded-xl border border-white/5">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'overview' ? 'bg-indigo-500 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
          >
            Tổng quan
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'history' ? 'bg-indigo-500 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
          >
            Lịch sử chi tiết
          </button>
          <button 
            onClick={() => setActiveTab('alerts')}
            className={`relative px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'alerts' ? 'bg-indigo-500 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
          >
            Cảnh báo
            {anomalies.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 items-center justify-center bg-rose-500 text-[8px] font-black text-white border border-[#0B0E14]">
                  {anomalies.length}
                </span>
              </span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('data')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'data' ? 'bg-indigo-500 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
          >
            Dữ liệu
          </button>
        </div>
      </div>

      {activeTab === 'data' && (
        <section className="glass-panel animate-in fade-in slide-in-from-bottom-4 duration-500">
          <KocLiveUpload 
            onData={addData} 
            onDeleteFile={deleteFile}
            sessions={sessions}
            files={files} 
          />
        </section>
      )}

      {sessions.length > 0 ? (
        filteredSessions.length > 0 ? (
          <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {activeTab === 'overview' && (
              <>
                {/* KPI Summary */}
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                  <StatCard label="Doanh thu (GMV)" value={formatKocCurrency(stats.totalGmv)} trend={comparison.gmv} sub="Tổng doanh thu thực tế" accent="text-teal-400" />
                  <StatCard label="Số phiên LIVE" value={formatNumber(stats.sessionCount)} trend={comparison.sessions} sub="Đã tính theo lọc" accent="text-blue-400" />
                  <StatCard label="Phiên ra đơn" value={formatNumber(stats.orderedSessions)} trend={comparison.orderedSessions} sub={`${stats.orderedSessions}/${stats.sessionCount} có đơn`} accent="text-emerald-400" />
                  <StatCard label="Đơn hàng" value={formatNumber(stats.totalOrders)} trend={comparison.orders} sub="Tổng đơn SKU" accent="text-blue-400" />
                  <StatCard label="AOV" value={formatKocCurrency(Math.round(stats.aov))} trend={comparison.aov} sub="Doanh thu / Đơn" accent="text-amber-400" />
                  <StatCard label="Doanh thu/Giờ" value={formatKocCurrency(Math.round(stats.revPerHour))} trend={comparison.revPerHour} sub="GMV / Tổng giờ" accent="text-rose-400" />

                  <StatCard label="Số KOC Active" value={formatNumber(stats.uniqueKocs)} trend={comparison.activeKocs} sub="Creators hoạt động" accent="text-purple-400" />
                  <StatCard label="Giờ live TB/phiên" value={formatDuration(stats.avgDurationPerSession)} trend={comparison.avgDuration} sub="Thời lượng trung bình" accent="text-gray-400" />
                  <StatCard label="Lượt hiển thị" value={formatCompactNumber(stats.totalImpressions)} trend={comparison.impressions} sub="Product impressions" accent="text-blue-400" />
                  <StatCard label="Lượt nhấp" value={formatCompactNumber(stats.totalClicks)} trend={comparison.clicks} sub="Product clicks" accent="text-teal-400" />
                  <StatCard label="CTR (Blended)" value={formatPercent(stats.blendedCtr)} trend={comparison.ctr} sub="Clicks/Impressions" accent="text-amber-400" />
                  <StatCard label="CVR (Blended)" value={formatPercent(stats.avgCvr)} trend={comparison.cvr} sub="Orders/Clicks" accent="text-emerald-400" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-center sm:text-left">
                  <div className="glass-panel min-h-[480px]">
                    <KocTrendChart dailyData={dailyTrends} sessions={filteredSessions} />
                  </div>
                  <div className="glass-panel min-h-[480px]">
                    <PeakHoursChart hourlyData={hourlyData} />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="glass-panel min-h-[480px]">
                    <KocRankingChart data={kocRanking} />
                  </div>
                  <div className="glass-panel min-h-[480px]">
                    <KocEfficiencyScatter scatterData={scatterData} />
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-white px-2">Danh sách hiệu suất KOC</h3>
                  </div>
                  <KocTable data={kocRanking} onRowClick={handleRowClick} />
                </div>
              </>
            )}

            {activeTab === 'history' && (
              <KocHistoryTab 
                sessions={filteredSessions} 
                initialKoc={selectedKoc} 
              />
            )}

            {activeTab === 'alerts' && (
              <KocAlertsTab 
                alerts={anomalies}
                onAction={handleAlertAction}
              />
            )}
          </div>
        ) : activeTab !== 'data' && (
          <div className="flex flex-col items-center justify-center py-20 bg-amber-500/[0.02] border border-dashed border-amber-500/20 rounded-[32px]">
            <div className="p-4 bg-amber-500/10 rounded-full text-amber-500 mb-4">
              <Calendar size={40} />
            </div>
            <h2 className="text-xl font-bold text-white">Không có dữ liệu trong khoảng thời gian này</h2>
            <p className="text-gray-500 text-sm mt-2 max-w-sm text-center px-6 font-medium">
              Vui lòng thay đổi "Bộ lọc Dashboard" ở phía trên hoặc kiểm tra lại khoảng ngày của các file đã upload.
            </p>
          </div>
        )
      ) : activeTab !== 'data' && (
        <div className="flex flex-col items-center justify-center py-20 bg-white/[0.02] border border-dashed border-white/10 rounded-[40px]">
          <div className="p-4 bg-white/5 rounded-full text-gray-600 mb-6">
            <ShoppingBag size={48} />
          </div>
          <h2 className="text-2xl font-black text-white px-10 text-center">Chưa có dữ liệu phân tích</h2>
          <p className="text-gray-500 text-sm mt-3 max-w-md text-center px-10 leading-relaxed font-medium">
            Vui lòng chuyển sang tab <strong>Dữ liệu</strong> để tải file Excel lên hệ thống.
          </p>
          <button 
            onClick={() => setActiveTab('data')}
            className="mt-6 px-6 py-3 bg-indigo-500 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-500/20 hover:bg-indigo-600 transition-all"
          >
            Đi tới Tab Dữ liệu
          </button>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, trend, sub, accent }: { label: string; value: string; trend: number; sub: string; accent: string }) {
  const isPositive = trend >= 0;
  const trendColor = isPositive ? 'text-emerald-400' : 'text-rose-400';
  const Icon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div className="glass-panel p-4 border-white/5 hover:border-white/10 transition-all group flex flex-col justify-between min-h-[130px]">
      <div>
        <div className="text-[11px] text-gray-500 font-extrabold uppercase tracking-widest mb-1.5">{label}</div>
        <div className={`text-[24px] font-black tracking-tight ${accent} leading-tight`}>{value}</div>
        
        <div className={`flex items-center gap-1 mt-1 text-[10px] font-black ${trendColor}`}>
          <Icon size={12} />
          <span>{Math.abs(trend).toFixed(1)}%</span>
          <span className="text-gray-600 font-bold ml-1 italic group-hover:text-gray-500 transition-colors">vs kỳ trước</span>
        </div>
      </div>
      <div className="mt-2 text-[10px] font-bold text-gray-600 line-clamp-1 group-hover:text-gray-400 transition-colors">{sub}</div>
    </div>
  );
}
