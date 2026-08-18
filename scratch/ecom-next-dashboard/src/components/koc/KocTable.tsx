"use client";

import React, { useState, useMemo } from 'react';
import { Search, Download, ChevronUp, ChevronDown, User, ExternalLink, Trophy } from 'lucide-react';
import { formatNumber, formatKocCurrency, formatPercent, formatDuration } from '@/lib/utils';

interface KocTableProps {
  data: any[];
  onRowClick?: (kocName: string) => void;
}

export default function KocTable({ data, onRowClick }: KocTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' }>({ key: 'gmv', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);
  const rowsPerPage = 10;

  // 1. Column Formatting
  const renderCell = (val: any, format: 'number' | 'currency' | 'percent' | 'duration' | 'dt_hour') => {
    if (val === 0 || val === null || val === undefined) return <span className="text-gray-700">—</span>;
    switch (format) {
      case 'currency': return formatKocCurrency(val);
      case 'percent': {
        const color = val < 0.01 ? 'text-rose-500' : (val > 0.03 ? 'text-emerald-500' : 'text-gray-300');
        return <span className={`font-bold ${color}`}>{formatPercent(val)}</span>;
      }
      case 'duration': return formatDuration(val);
      case 'dt_hour': return formatKocCurrency(Math.round(val));
      default: return formatNumber(val);
    }
  };

  // 2. Sorting Logic
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    const sortableItems = [...data];
    if (sortConfig.key !== '') {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  // 3. Filtering Logic
  const filteredData = useMemo(() => {
    return sortedData.filter(item => 
      item.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
      item.username.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [sortedData, debouncedSearch]);

  // 4. Pagination
  const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  // 5. Export to CSV
  const exportToCsv = () => {
    const headers = ['KOC', 'Username', 'Phiên', 'Giờ live', 'Doanh thu', 'Đơn', 'Hiển thị', 'Nhấp', 'CTR', 'CVR', 'DT/Giờ'];
    const rows = filteredData.map(d => [
      d.name, d.username, d.sessions, d.duration, d.gmv, d.orders, d.impressions, d.clicks, d.ctr, d.cvr, d.revPerHour
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `KOC_Performance_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  // 6. Summary Logic
  const totals = useMemo(() => {
    return filteredData.reduce((acc, curr) => ({
      sessions: acc.sessions + curr.sessions,
      duration: acc.duration + curr.duration,
      gmv: acc.gmv + curr.gmv,
      orders: acc.orders + curr.orders,
      impressions: acc.impressions + curr.impressions,
      clicks: acc.clicks + curr.clicks,
    }), { sessions:0, duration:0, gmv:0, orders:0, impressions:0, clicks:0 });
  }, [filteredData]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input 
            type="text" 
            placeholder="Tìm KOC hoặc username..."
            className="w-full bg-[#151821] border border-white/5 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={exportToCsv}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/20 text-sm font-bold transition-all"
        >
          <Download size={16} />
          Xuất CSV
        </button>
      </div>

      <div className="glass-panel overflow-hidden p-0 border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5">
                <th className="p-4 text-[10px] text-gray-500 font-extrabold uppercase tracking-widest">#</th>
                <SortHeader label="KOC" sortKey="name" current={sortConfig} onSort={handleSort} />
                <SortHeader label="Username" sortKey="username" current={sortConfig} onSort={handleSort} />
                <SortHeader label="Phiên" sortKey="sessions" current={sortConfig} onSort={handleSort} />
                <SortHeader label="Giờ live" sortKey="duration" current={sortConfig} onSort={handleSort} />
                <SortHeader label="Doanh thu" sortKey="gmv" current={sortConfig} onSort={handleSort} />
                <SortHeader label="Đơn" sortKey="orders" current={sortConfig} onSort={handleSort} />
                <SortHeader label="Hiển thị" sortKey="impressions" current={sortConfig} onSort={handleSort} />
                <SortHeader label="Nhấp" sortKey="clicks" current={sortConfig} onSort={handleSort} />
                <SortHeader label="CTR" sortKey="ctr" current={sortConfig} onSort={handleSort} />
                <SortHeader label="CVR" sortKey="cvr" current={sortConfig} onSort={handleSort} />
                <SortHeader label="DT/Giờ" sortKey="revPerHour" current={sortConfig} onSort={handleSort} />
                <th className="p-4 text-[10px] text-gray-500 font-extrabold uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginatedData.map((k, idx) => {
                const globalIdx = (currentPage - 1) * rowsPerPage + idx;
                const isTop3 = globalIdx < 3 && sortConfig.key === 'gmv' && sortConfig.direction === 'desc';
                return (
                  <tr 
                    key={k.id} 
                    onClick={() => onRowClick?.(k.name)}
                    className={`group hover:bg-white/[0.04] transition-colors cursor-pointer ${k.gmv > 0 ? 'bg-teal-500/[0.02]' : ''}`}
                  >
                    <td className="p-4 text-xs font-bold text-gray-600">{globalIdx + 1}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:scale-110 transition-transform">
                          <User size={14} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors flex items-center gap-2">
                            {k.name}
                            {isTop3 && <Trophy size={12} className="text-amber-400 shrink-0" />}
                          </span>
                          {isTop3 && <span className="text-[10px] text-amber-500 font-extrabold uppercase tracking-tighter leading-none mt-0.5">TOP {globalIdx+1} GMV</span>}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-xs font-bold text-gray-400">@{k.username}</td>
                    <td className="p-4 text-sm font-bold text-gray-300">{renderCell(k.sessions, 'number')}</td>
                    <td className="p-4 text-sm font-bold text-gray-300">{renderCell(k.duration, 'duration')}</td>
                    <td className="p-4 text-sm font-black text-white">{renderCell(k.gmv, 'currency')}</td>
                    <td className="p-4 text-sm font-bold text-indigo-400">{renderCell(k.orders, 'number')}</td>
                    <td className="p-4 text-xs font-bold text-gray-400">{renderCell(k.impressions, 'number')}</td>
                    <td className="p-4 text-xs font-bold text-gray-400">{renderCell(k.clicks, 'number')}</td>
                    <td className="p-4 text-sm">{renderCell(k.ctr, 'percent')}</td>
                    <td className="p-4 text-sm">{renderCell(k.cvr, 'percent')}</td>
                    <td className="p-4 text-sm font-black text-gray-200">{renderCell(k.revPerHour, 'dt_hour')}</td>
                    <td className="p-4">
                      <button className="p-2 bg-white/5 rounded-lg text-gray-500 hover:text-white hover:bg-indigo-500/20 transition-all">
                        <ExternalLink size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-white/[0.02] border-t border-white/5 font-bold">
              <tr>
                <td colSpan={3} className="p-4 text-xs text-indigo-400 uppercase tracking-widest font-black">Tổng cộng</td>
                <td className="p-4 text-xs text-white">{totals.sessions}</td>
                <td className="p-4 text-xs text-white">{totals.duration.toFixed(1)}h</td>
                <td className="p-4 text-xs text-teal-400">{formatKocCurrency(totals.gmv)}</td>
                <td className="p-4 text-xs text-indigo-400">{formatNumber(totals.orders)}</td>
                <td className="p-4 text-xs text-gray-400">{formatNumber(totals.impressions)}</td>
                <td className="p-4 text-xs text-gray-400">{formatNumber(totals.clicks)}</td>
                <td className="p-4 text-xs text-white">—</td>
                <td className="p-4 text-xs text-white">—</td>
                <td className="p-4 text-xs text-white">{formatKocCurrency(Math.round(totals.duration > 0 ? totals.gmv/totals.duration : 0))}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 px-2">
        <p className="text-xs text-gray-500 font-bold">
          Hiển thị {paginatedData.length} / {filteredData.length} KOC
        </p>
        <div className="flex items-center gap-2">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-xs font-bold text-gray-400 disabled:opacity-30 hover:bg-white/10 transition-all"
          >
            Trước
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button 
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${currentPage === page ? 'bg-indigo-500 text-white' : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}
              >
                {page}
              </button>
            ))}
          </div>
          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-xs font-bold text-gray-400 disabled:opacity-30 hover:bg-white/10 transition-all"
          >
            Tiếp
          </button>
        </div>
      </div>
    </div>
  );
}

function SortHeader({ label, sortKey, current, onSort }: any) {
  const isActive = current.key === sortKey;
  return (
    <th 
      className="p-4 text-[10px] text-gray-500 font-extrabold uppercase tracking-widest cursor-pointer hover:text-white transition-colors"
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center gap-2">
        {label}
        <div className="flex flex-col">
          <ChevronUp size={10} className={`${isActive && current.direction === 'asc' ? 'text-indigo-400' : 'text-gray-700'}`} />
          <ChevronDown size={10} className={`${isActive && current.direction === 'desc' ? 'text-indigo-400' : 'text-gray-700'}`} />
        </div>
      </div>
    </th>
  )
}
