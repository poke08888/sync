"use client";

import React, { useState, useMemo } from 'react';
import { Search, Calendar, Filter, RotateCcw, User, TrendingUp, Clock, Target, BarChart3, ChevronDown, TrendingDown } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart, BarChart, Bar } from 'recharts';
import { formatKocCurrency, formatNumber, formatDuration } from '@/lib/utils';
import { KocLiveSession, filterSessions, aggregateByPeriod, getTopContributors, aggregateByKoc, calculateComparison } from '@/lib/koc-service';
import KocSessionTable from './KocSessionTable';
import { useFilters } from '@/context/FilterContext';

interface KocHistoryTabProps {
  sessions: KocLiveSession[];
  initialKoc?: string | null;
}

export default function KocHistoryTab({ sessions, initialKoc }: KocHistoryTabProps) {
  const { selectedBrand, customRange } = useFilters();
  const [selectedKoc, setSelectedKoc] = useState<string>(initialKoc || 'all');
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('day');
  const [dateRange, setDateRange] = useState<{from: string, to: string} | null>(null);
  const [isKocDropdownOpen, setIsKocDropdownOpen] = useState(false);
  const [kocSearch, setKocSearch] = useState('');

  // Use local dateRange if set, otherwise use global one
  const activeRange = dateRange || { from: customRange.start, to: customRange.end };

  // 1. Core Data Aggregation
  const kocList = useMemo(() => aggregateByKoc(sessions), [sessions]);

  const filteredSessions = useMemo(() => {
    return filterSessions(sessions, selectedKoc, activeRange, selectedBrand);
  }, [sessions, selectedKoc, activeRange, selectedBrand]);

  const comparison = useMemo(() => {
    return calculateComparison(sessions, filteredSessions, activeRange, selectedBrand);
  }, [sessions, filteredSessions, activeRange, selectedBrand]);

  const timelineData = useMemo(() => {
    return aggregateByPeriod(filteredSessions, period);
  }, [filteredSessions, period]);

  const topContributorsData = useMemo(() => {
    if (selectedKoc !== 'all') return [];
    return getTopContributors(filteredSessions, 5);
  }, [filteredSessions, selectedKoc]);

  const profileStats = useMemo(() => {
    if (selectedKoc === 'all' || filteredSessions.length === 0) return null;
    const totals = filteredSessions.reduce((acc, curr) => ({
      gmv: acc.gmv + curr.gmv,
      hours: acc.hours + curr.durationHours,
      sessions: acc.sessions + 1
    }), { gmv: 0, hours: 0, sessions: 0 });
    
    return {
      ...totals,
      revPerHour: totals.hours > 0 ? totals.gmv / totals.hours : 0
    };
  }, [filteredSessions, selectedKoc]);

  // 2. Dropdown & UI Logic
  const filteredKocList = useMemo(() => {
    return kocList.filter(k => 
      k.name.toLowerCase().includes(kocSearch.toLowerCase()) || 
      k.username.toLowerCase().includes(kocSearch.toLowerCase())
    );
  }, [kocList, kocSearch]);

  const selectedKocDisplay = useMemo(() => {
    if (selectedKoc === 'all') return 'Cá nhân (Toàn bộ KOC)';
    return selectedKoc;
  }, [selectedKoc]);

  const handleReset = () => {
    setSelectedKoc('all');
    setPeriod('day');
    setDateRange(null);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* 1. Filter Bar */}
      <div className="glass-panel p-4 flex flex-wrap items-center gap-6 border-white/5 relative z-[60]">
        <div className="flex flex-col gap-1.5 min-w-[280px] relative">
          <label className="text-[10px] text-gray-500 font-extrabold uppercase tracking-widest px-1">Chọn KOC phân tích</label>
          <div 
            onClick={() => setIsKocDropdownOpen(!isKocDropdownOpen)}
            className="flex items-center justify-between bg-white/[0.03] border border-white/5 rounded-xl py-2.5 px-4 text-sm text-white cursor-pointer hover:bg-white/[0.05] transition-all"
          >
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px] font-black text-indigo-400">
                {selectedKoc === 'all' ? '*' : selectedKoc.substring(0, 1).toUpperCase()}
              </div>
              <span className="font-bold">{selectedKocDisplay}</span>
            </div>
            <ChevronDown size={14} className={`text-gray-500 transition-transform ${isKocDropdownOpen ? 'rotate-180' : ''}`} />
          </div>

          {isKocDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#1A1E29] border border-white/10 rounded-2xl shadow-2xl z-[70] overflow-hidden backdrop-blur-3xl animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-3 border-b border-white/5 bg-white/[0.02]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                  <input 
                    type="text"
                    placeholder="Tìm tên hoặc username..."
                    value={kocSearch}
                    onChange={(e) => setKocSearch(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full bg-[#0B0E14] border border-white/5 rounded-xl py-2 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                <button
                  onClick={() => { setSelectedKoc('all'); setIsKocDropdownOpen(false); }}
                  className={`w-full px-4 py-3 text-left text-sm transition-all flex items-center justify-between
                    ${selectedKoc === 'all' ? 'bg-indigo-500/10 text-indigo-400 font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                  Toàn bộ KOC trong team
                </button>
                {filteredKocList.map(k => (
                  <button
                    key={k.id}
                    onClick={() => { setSelectedKoc(k.name); setIsKocDropdownOpen(false); }}
                    className={`w-full px-4 py-3 text-left text-sm transition-all flex items-center justify-between group
                      ${selectedKoc === k.name ? 'bg-indigo-500/10 text-indigo-400 font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-black text-gray-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-400">
                        {k.name.substring(0, 1).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span>{k.name}</span>
                        <span className="text-[10px] text-gray-600 font-medium">@{k.username}</span>
                      </div>
                    </div>
                    {selectedKoc === k.name && <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-gray-500 font-extrabold uppercase tracking-widest px-1">Chế độ hiển thị</label>
          <div className="flex bg-white/[0.03] p-1 rounded-xl border border-white/5">
            {(['day', 'week', 'month'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${period === p ? 'bg-indigo-500 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
              >
                {p === 'day' ? 'Ngày' : p === 'week' ? 'Tuần' : 'Tháng'}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={handleReset}
          className="mt-auto mb-1 flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-400 rounded-xl text-xs font-bold transition-all"
        >
          <RotateCcw size={14} />
          Reset
        </button>
      </div>

      {/* 2. KOC Profile Card (Conditional) */}
      {profileStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1 glass-panel p-6 flex items-center gap-4 border-indigo-500/20 bg-indigo-500/[0.02]">
            <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 text-2xl font-black border border-indigo-500/20">
              {selectedKoc.substring(0, 1).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-black text-white">{selectedKoc}</h2>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest leading-loose">KOC Profile Active</p>
            </div>
          </div>
          <StatPill label="Tổng Doanh thu" value={formatKocCurrency(profileStats.gmv)} trend={comparison.gmv} icon={<TrendingUp size={16}/>} color="text-teal-400" />
          <StatPill label="Số phiên LIVE" value={`${profileStats.sessions} phiên`} trend={comparison.sessions} icon={<Clock size={16}/>} color="text-blue-400" />
          <StatPill label="Doanh thu / Giờ" value={formatKocCurrency(profileStats.revPerHour)} trend={comparison.revPerHour} icon={<Target size={16}/>} color="text-amber-400" />
        </div>
      )}

      {/* 3. Charts Section */}
      <div className="grid grid-cols-1 gap-8">
        <div className="glass-panel min-h-[400px]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-white">
                {selectedKoc === 'all' ? 'Diễn biến Doanh thu Tổng hợp' : `Xu hướng Hiệu suất: ${selectedKoc}`}
              </h3>
              <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-black">Theo thời gian đã chọn</p>
            </div>
          </div>
          <div className="h-[320px]">
             <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={timelineData}>
                  <defs>
                    <linearGradient id="colorGmv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff03" vertical={false} />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fill: '#4B5563', fontSize: 10}} />
                  <YAxis yAxisId="left" hide />
                  <YAxis yAxisId="right" orientation="right" hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1A1E29', border: '1px solid #ffffff10', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Area yAxisId="left" type="monotone" dataKey="gmv" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#colorGmv)" />
                  <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#F59E0B" strokeWidth={2} dot={{r: 4, fill: '#F59E0B', strokeWidth: 0}} />
                </ComposedChart>
             </ResponsiveContainer>
          </div>
        </div>

        {selectedKoc === 'all' && (
          <div className="glass-panel min-h-[400px]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold text-white">Tỷ trọng đóng góp của Top 5 KOC</h3>
                <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-black">Phân tích thành phần GMV theo ngày</p>
              </div>
            </div>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topContributorsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff03" vertical={false} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#4B5563', fontSize: 10}} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1A1E29', border: '1px solid #ffffff10', borderRadius: '16px' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                  />
                  {Object.keys(topContributorsData[0] || {}).filter(k => k !== 'date').map((name, idx) => (
                    <Bar 
                      key={name} 
                      dataKey={name} 
                      stackId="a" 
                      fill={idx === 5 ? '#374151' : ['#6366F1', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'][idx]} 
                      radius={idx === Object.keys(topContributorsData[0] || {}).length - 2 ? [4,4,0,0] : [0,0,0,0]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* 4. Session History Table */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xl font-black text-white">Chi tiết các phiên livestream</h3>
          <span className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
            {filteredSessions.length} Phiên đã thực hiện
          </span>
        </div>
        <KocSessionTable sessions={[...filteredSessions].sort((a,b) => b.date.localeCompare(a.date))} />
      </div>
    </div>
  );
}

function StatPill({ label, value, trend, icon, color }: any) {
  const isPositive = trend >= 0;
  const trendColor = isPositive ? 'text-emerald-400' : 'text-rose-400';
  const Icon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div className="glass-panel p-4 flex flex-col justify-between border-white/5 group hover:border-white/10 transition-all">
      <div className="flex items-center gap-2 text-[10px] text-gray-500 font-extrabold uppercase tracking-widest mb-1">
        <span className={color}>{icon}</span>
        {label}
      </div>
      <div className="flex items-end justify-between">
        <div className="text-xl font-black text-white">{value}</div>
        <div className={`flex items-center gap-0.5 text-[9px] font-black ${trendColor} bg-white/5 px-1.5 py-0.5 rounded-md mb-1`}>
          <Icon size={10} />
          {Math.abs(trend).toFixed(1)}%
        </div>
      </div>
    </div>
  );
}
