"use client";

import React, { useState } from 'react';
import { ChevronDown, Calendar, Filter } from 'lucide-react';
import { BRANDS, TIME_RANGES, TimeRangeId } from '@/lib/constants';

interface DashboardFiltersProps {
  selectedBrand: string;
  onBrandChange: (brand: string) => void;
  timeRange: TimeRangeId;
  onTimeRangeChange: (range: TimeRangeId) => void;
  customRange: { start: string; end: string };
  onCustomRangeChange: (range: { start: string; end: string }) => void;
}

export default function DashboardFilters({
  selectedBrand,
  onBrandChange,
  timeRange,
  onTimeRangeChange,
  customRange,
  onCustomRangeChange,
}: DashboardFiltersProps) {
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);

  return (
    <div className="flex flex-col gap-4 mb-8 relative z-50">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#151821]/40 p-4 rounded-3xl border border-white/5 backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400">
                <Filter size={18} />
             </div>
             <div>
               <h2 className="text-sm font-bold text-white uppercase tracking-widest">Bộ lọc Dashboard</h2>
               <p className="text-[10px] text-gray-500 font-medium">Cấu hình hiển thị dữ liệu toàn cục</p>
             </div>
          </div>

          <div className="h-8 w-px bg-white/10 hidden md:block"></div>

          <div className="flex items-center gap-4">
            {/* Brand Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowBrandDropdown(!showBrandDropdown)}
                className="px-4 py-2.5 bg-[#1A1E29] border border-white/10 rounded-xl text-gray-300 text-sm font-bold flex items-center gap-2 hover:bg-white/5 transition-all"
              >
                {selectedBrand}
                <ChevronDown size={14} className={`transition-transform ${showBrandDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showBrandDropdown && (
                <div className="absolute top-full mt-2 left-0 w-56 bg-[#1A1E29] border border-white/10 rounded-2xl shadow-2xl z-[100] overflow-hidden backdrop-blur-3xl animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-2 text-[10px] font-black text-gray-600 uppercase tracking-widest border-b border-white/5 bg-white/[0.02]">Chọn thương hiệu</div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {BRANDS.map(brand => (
                      <button
                        key={brand}
                        onClick={() => {
                          onBrandChange(brand);
                          setShowBrandDropdown(false);
                        }}
                        className={`w-full px-4 py-3 text-left text-sm transition-all flex items-center justify-between group
                          ${selectedBrand === brand ? 'bg-indigo-500/10 text-indigo-400 font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                      >
                        {brand}
                        {selectedBrand === brand && <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Time Filter Chips */}
            <div className="flex p-1 bg-[#0B0E14] rounded-2xl border border-white/5 shadow-inner">
              {TIME_RANGES.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onTimeRangeChange(item.id as TimeRangeId)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                    timeRange === item.id 
                      ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]' 
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Custom Range Popout/Inline */}
        {timeRange === 'custom' && (
          <div className="flex items-center gap-3 bg-indigo-500/5 border border-indigo-500/20 px-4 py-2 rounded-2xl animate-in zoom-in-95 duration-200">
            <Calendar size={14} className="text-indigo-400" />
            <div className="flex items-center gap-2">
              <input 
                type="date" 
                value={customRange.start}
                onChange={(e) => onCustomRangeChange({ ...customRange, start: e.target.value })}
                className="bg-transparent border-none text-xs font-bold text-white focus:ring-0 cursor-pointer" 
              />
              <span className="text-gray-600 text-[10px] font-black">TỚI</span>
              <input 
                type="date" 
                value={customRange.end}
                onChange={(e) => onCustomRangeChange({ ...customRange, end: e.target.value })}
                className="bg-transparent border-none text-xs font-bold text-white focus:ring-0 cursor-pointer" 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
