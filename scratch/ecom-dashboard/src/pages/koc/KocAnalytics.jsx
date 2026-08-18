import React from 'react';
import { Calendar, X } from 'lucide-react';
import { useKocStore } from '../../store/useKocStore';
import KocUploadZone from '../../components/koc/KocUploadZone';
import KocDashboard from '../../components/koc/KocDashboard';
import { Tag } from 'lucide-react';

export default function KocAnalytics() {
  const { isParsed, globalFilterDate, setGlobalFilterDate, brands, selectedBrand, setSelectedBrand } = useKocStore();

  const handleQuickFilter = (type) => {
    const today = new Date();
    const fmt = (d) => {
      const offset = d.getTimezoneOffset();
      const localDay = new Date(d.getTime() - (offset*60*1000));
      return localDay.toISOString().split('T')[0];
    };

    if (type === 'today') {
      const str = fmt(today);
      setGlobalFilterDate({ start: str, end: str });
    } else if (type === 'week') {
      const day = today.getDay() || 7; 
      const start = new Date(today);
      start.setDate(today.getDate() - day + 1);
      setGlobalFilterDate({ start: fmt(start), end: fmt(today) });
    } else if (type === 'month') {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      setGlobalFilterDate({ start: fmt(start), end: fmt(today) });
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between sticky top-0 bg-background/95 backdrop-blur z-20 pb-4 pt-2 border-b border-border/50 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">KOC Live Analytics</h1>
          <p className="text-textMuted text-sm">Phân tích hiệu suất Livestream nhà sáng tạo từ file TikTok Shop</p>
        </div>

        {/* Global Date & Brand Filter */}
        {isParsed && (
          <div className="flex flex-col md:flex-row items-end md:items-center gap-3">
            {/* Brand Filter */}
            <div className="flex items-center gap-2 text-sm text-textMuted bg-surface border border-border rounded-lg px-3 py-1.5 focus-within:border-pantone-light transition-colors shadow-sm min-w-[140px]">
              <Tag className="w-4 h-4 text-pantone-light" />
              <select 
                value={selectedBrand}
                onChange={e => setSelectedBrand(e.target.value)}
                className="bg-transparent text-white outline-none w-full cursor-pointer appearance-none"
              >
                <option value="all" className="bg-surface">Tất cả Brand</option>
                {brands.map(b => (
                  <option key={b} value={b} className="bg-surface">{b}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 bg-surface border border-border p-1 rounded-lg">
              <button onClick={() => handleQuickFilter('today')} className="px-3 py-1 text-xs font-medium text-textMuted hover:text-white rounded-md hover:bg-white/5 transition-colors">Hôm nay</button>
              <button onClick={() => handleQuickFilter('week')} className="px-3 py-1 text-xs font-medium text-textMuted hover:text-white rounded-md hover:bg-white/5 transition-colors">Tuần này</button>
              <button onClick={() => handleQuickFilter('month')} className="px-3 py-1 text-xs font-medium text-textMuted hover:text-white rounded-md hover:bg-white/5 transition-colors">Tháng này</button>
            </div>
            <div className="flex items-center gap-2 text-sm text-textMuted bg-surface border border-border rounded-lg px-3 py-1.5 focus-within:border-pantone-light transition-colors shadow-sm">
              <Calendar className="w-4 h-4" />
              <input 
                type="date" 
                value={globalFilterDate.start}
                onChange={e => setGlobalFilterDate({...globalFilterDate, start: e.target.value})}
                className="bg-transparent text-white outline-none w-[110px] sm:w-28 custom-date-picker"
              />
              <span className="opacity-50">-</span>
              <input 
                type="date" 
                value={globalFilterDate.end}
                onChange={e => setGlobalFilterDate({...globalFilterDate, end: e.target.value})}
                className="bg-transparent text-white outline-none w-[110px] sm:w-28 custom-date-picker"
              />
            </div>
            
            {(globalFilterDate.start || globalFilterDate.end) && (
              <button 
                onClick={() => setGlobalFilterDate({start: '', end: ''})}
                className="flex items-center gap-1.5 px-3 py-2 bg-red-500/10 text-red-400 hover:text-white hover:bg-red-500/80 border border-red-500/20 rounded-lg text-sm font-medium transition-colors"
                title="Xóa bộ lọc thời gian"
              >
                <X className="w-4 h-4" /> <span className="hidden sm:inline">Bỏ lọc</span>
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 space-y-6">
        {!isParsed ? (
          <KocUploadZone />
        ) : (
          <KocDashboard />
        )}
      </div>
    </div>
  );
}
