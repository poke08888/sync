import React, { useState, useMemo } from 'react';
import { useKocStore } from '../../store/useKocStore';
import { Search, ArrowUpDown, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

export default function KocPerformanceTable() {
  const { kocList } = useKocStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'totalGMV', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 50;

  const handleSort = (key) => {
    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedList = useMemo(() => {
    let result = [...kocList];
    
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(k => 
        k.name.toLowerCase().includes(lowerSearch) || 
        k.username.toLowerCase().includes(lowerSearch)
      );
    }

    result.sort((a, b) => {
      let valA = a[sortConfig.key];
      let valB = b[sortConfig.key];
      // Handled defaults
      if (valA === undefined) valA = 0;
      if (valB === undefined) valB = 0;
      
      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [kocList, searchTerm, sortConfig]);

  // Compute top 3 IDs for badges based on GMV natively
  const top3KocIds = useMemo(() => {
    return [...kocList]
      .sort((a, b) => b.totalGMV - a.totalGMV)
      .slice(0, 3)
      .map(k => k.creatorId || k.username);
  }, [kocList]);

  const totalPages = Math.ceil(filteredAndSortedList.length / rowsPerPage);
  const currentData = filteredAndSortedList.slice(
    (currentPage - 1) * rowsPerPage, 
    currentPage * rowsPerPage
  );

  // Formatting utils
  const fmtMoney = (v) => {
    if (!v || v === 0) return '—';
    if (v >= 1e9) return (v / 1e9).toFixed(1) + 'B₫';
    if (v >= 1e6) return (v / 1e6).toFixed(1) + 'M₫';
    if (v >= 1e3) return Math.floor(v / 1e3) + 'K₫';
    return new Intl.NumberFormat('en-US').format(Math.round(v)) + '₫';
  };
  const fmtNum = (v) => (!v || v === 0) ? '—' : new Intl.NumberFormat('en-US').format(Math.round(v));
  const fmtHour = (v) => (!v || v === 0) ? '—' : v.toFixed(1) + 'h';
  
  const PctCell = ({ v }) => {
    if (!v || v === 0) return <span>—</span>;
    let colorClass = "text-textMuted";
    if (v < 1) colorClass = "text-red-400";
    if (v > 3) colorClass = "text-emerald-400";
    return <span className={`font-semibold ${colorClass}`}>{v.toFixed(2)}%</span>;
  };

  // Summary Row Calculations
  const summary = useMemo(() => {
    const totalSessions = filteredAndSortedList.reduce((acc, k) => acc + k.totalSessions, 0);
    const totalDurationHours = filteredAndSortedList.reduce((acc, k) => acc + k.totalDurationHours, 0);
    const totalGMV = filteredAndSortedList.reduce((acc, k) => acc + k.totalGMV, 0);
    const totalOrders = filteredAndSortedList.reduce((acc, k) => acc + k.totalOrders, 0);
    const totalImpressions = filteredAndSortedList.reduce((acc, k) => acc + k.totalImpressions, 0);
    const totalClicks = filteredAndSortedList.reduce((acc, k) => acc + k.totalClicks, 0);
    
    const blendedCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
    const blendedCVR = totalClicks > 0 ? (totalOrders / totalClicks) * 100 : 0;
    const avgRevPerHour = totalDurationHours > 0 ? (totalGMV / totalDurationHours) : 0;

    return {
      totalSessions, totalDurationHours, totalGMV, totalOrders, 
      totalImpressions, totalClicks, blendedCTR, blendedCVR, avgRevPerHour
    };
  }, [filteredAndSortedList]);

  const columns = [
    { k: 'name', label: 'KOC' },
    { k: 'username', label: 'Username' },
    { k: 'totalSessions', label: 'Phiên' },
    { k: 'totalDurationHours', label: 'Giờ live' },
    { k: 'totalGMV', label: 'Doanh thu' },
    { k: 'totalOrders', label: 'Đơn' },
    { k: 'totalImpressions', label: 'Lượt hiển thị' },
    { k: 'totalClicks', label: 'Lượt nhấp' },
    { k: 'ctr', label: 'CTR' },
    { k: 'cvr', label: 'CVR' },
    { k: 'revPerHour', label: 'DT/Giờ' }
  ];

  const Thead = () => (
    <thead className="bg-background/80 sticky top-0 z-10 backdrop-blur text-xs uppercase tracking-wider text-textMuted">
      <tr>
        <th className="p-3 border-b border-border w-12 text-center">#</th>
        {columns.map(col => (
          <th 
            key={col.k} 
            className="p-3 border-b border-border cursor-pointer hover:text-white transition-colors" 
            onClick={() => handleSort(col.k)}
            title={`Sort by ${col.label}`}
          >
            <div className="flex items-center gap-1">
              {col.label}
              <ArrowUpDown className={`w-3 h-3 ${sortConfig.key === col.k ? 'text-pantone-light' : 'opacity-30'}`} />
            </div>
          </th>
        ))}
        <th className="p-3 border-b border-border text-center">Action</th>
      </tr>
    </thead>
  );

  return (
    <div className="bg-surface border border-border rounded-xl flex flex-col shadow-sm max-h-[800px]">
      {/* Header Controls */}
      <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h3 className="text-white font-bold text-lg">Bảng Danh sách KOC</h3>
          <span className="text-xs bg-white/5 border border-border px-2 py-1 rounded text-textMuted">
            {filteredAndSortedList.length} results
          </span>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" />
          <input 
            type="text" 
            placeholder="Tìm theo Username hoặc Tên..." 
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-background border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:border-pantone-light outline-none w-full sm:w-72 transition-colors"
          />
        </div>
      </div>

      {/* Table Area */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full text-left border-collapse text-sm whitespace-nowrap">
          <Thead />
          <tbody>
            {currentData.map((koc, i) => {
              const rIndex = (currentPage - 1) * rowsPerPage + i + 1;
              const hasRevenue = koc.totalGMV > 0;
              const isTop3 = top3KocIds.includes(koc.creatorId || koc.username);
              
              return (
                <tr 
                  key={koc.username || i} 
                  className={`border-b border-border/50 hover:bg-white/5 transition-colors ${hasRevenue ? 'bg-teal-900/5' : ''}`}
                >
                  <td className="p-3 text-center text-textMuted font-mono text-xs">{rIndex}</td>
                  
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                       <span className="font-medium text-white truncate max-w-[120px]" title={koc.name}>{koc.name}</span>
                       {isTop3 && <span className="bg-amber-500/20 text-amber-400 text-[10px] px-1.5 py-0.5 rounded font-bold">TOP</span>}
                    </div>
                  </td>
                  
                  <td className="p-3 text-textMuted">@{koc.username}</td>
                  <td className="p-3">{fmtNum(koc.totalSessions)}</td>
                  <td className="p-3">{fmtHour(koc.totalDurationHours)}</td>
                  <td className="p-3 font-bold text-pantone-light">{fmtMoney(koc.totalGMV)}</td>
                  <td className="p-3">{fmtNum(koc.totalOrders)}</td>
                  <td className="p-3 text-textMuted">{fmtNum(koc.totalImpressions)}</td>
                  <td className="p-3 text-textMuted">{fmtNum(koc.totalClicks)}</td>
                  <td className="p-3"><PctCell v={koc.ctr} /></td>
                  <td className="p-3"><PctCell v={koc.cvr} /></td>
                  <td className="p-3">{fmtMoney(koc.revPerHour)}/h</td>
                  
                  <td className="p-3 text-center">
                    <button 
                      className="p-1.5 hover:bg-white/10 rounded-md text-textMuted hover:text-white transition-colors"
                      title="Xem lịch sử"
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        useKocStore.getState().setSelectedKoc(koc.creatorId || koc.username);
                        useKocStore.getState().setViewMode('history');
                      }}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
            
            {currentData.length === 0 && (
              <tr>
                <td colSpan="13" className="p-8 text-center text-textMuted">Không tìm thấy dữ liệu.</td>
              </tr>
            )}
          </tbody>
          
          {/* Summary Row */}
          {currentData.length > 0 && (
            <tfoot className="bg-background/80 sticky bottom-0 z-10 backdrop-blur font-bold border-t border-border shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
              <tr>
                <td className="p-3 text-center">Σ</td>
                <td colSpan="2" className="p-3 text-textMuted">TỔNG / TRUNG BÌNH</td>
                <td className="p-3 text-white">{fmtNum(summary.totalSessions)}</td>
                <td className="p-3 text-white">{fmtHour(summary.totalDurationHours)}</td>
                <td className="p-3 text-pantone-light">{fmtMoney(summary.totalGMV)}</td>
                <td className="p-3 text-white">{fmtNum(summary.totalOrders)}</td>
                <td className="p-3 text-white">{fmtNum(summary.totalImpressions)}</td>
                <td className="p-3 text-white">{fmtNum(summary.totalClicks)}</td>
                <td className="p-3"><PctCell v={summary.blendedCTR} /></td>
                <td className="p-3"><PctCell v={summary.blendedCVR} /></td>
                <td className="p-3 text-white">{fmtMoney(summary.avgRevPerHour)}/h</td>
                <td className="p-3"></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-3 border-t border-border flex items-center justify-between bg-surface/50">
          <span className="text-xs text-textMuted">
            Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, filteredAndSortedList.length)} of {filteredAndSortedList.length}
          </span>
          <div className="flex items-center gap-1 text-sm">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="p-1 rounded hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <span className="px-3 text-white font-medium">
              {currentPage} / {totalPages}
            </span>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="p-1 rounded hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
