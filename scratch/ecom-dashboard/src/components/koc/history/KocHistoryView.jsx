import React, { useState, useMemo } from 'react';
import { useKocStore } from '../../../store/useKocStore';
import { Filter, X, ChevronDown, Calendar } from 'lucide-react';
import KocProfileCard from './KocProfileCard';
import KocTimelineChart from './KocTimelineChart';
import KocSessionTable from './KocSessionTable';
import KocGlobalStackedChart from './KocGlobalStackedChart';

export default function KocHistoryView() {
  const { kocList, previousKocList, selectedKoc, setSelectedKoc } = useKocStore();
  
  // Filter States
  const [periodToggle, setPeriodToggle] = useState('day'); // 'day' | 'week' | 'month' | 'year'

  // Dropdown UI logic
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchKocText, setSearchKocText] = useState('');

  const displayedKocs = useMemo(() => {
    if (!searchKocText) return kocList;
    const lower = searchKocText.toLowerCase();
    return kocList.filter(k => 
      (k.name && k.name.toLowerCase().includes(lower)) || 
      (k.username && k.username.toLowerCase().includes(lower))
    );
  }, [kocList, searchKocText]);

  const activeKocData = selectedKoc ? kocList.find(k => (k.creatorId || k.username) === selectedKoc) : null;
  const activePrevKocData = selectedKoc ? previousKocList?.find(k => (k.creatorId || k.username) === selectedKoc) : null;

  return (
    <div className="space-y-6 mt-4">
      {/* FILTER BAR */}
      <div className="bg-surface border border-border rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="flex items-center gap-4 w-full md:w-auto z-20">
          
          {/* Custom KOC Dropdown */}
          <div className="relative w-full md:w-64">
            <div 
              className="bg-background border border-border rounded-lg px-4 py-2 flex items-center justify-between cursor-pointer hover:border-pantone-light transition-colors"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="flex items-center gap-2 truncate">
                {!activeKocData ? (
                  <span className="text-textMuted text-sm">Tất cả KOC (Global)</span>
                ) : (
                  <>
                    <div className="w-6 h-6 rounded-full bg-pantone-293/30 flex justify-center items-center text-pantone-light text-xs font-bold shrink-0">
                      {activeKocData.name?.charAt(0) || '?'}
                    </div>
                    <span className="text-white text-sm font-medium truncate">{activeKocData.name}</span>
                  </>
                )}
              </div>
              <ChevronDown className="w-4 h-4 text-textMuted shrink-0 ml-2" />
            </div>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 w-full mt-2 bg-surface border border-border rounded-lg shadow-xl overflow-hidden max-h-80 flex flex-col z-50">
                <input 
                  type="text"
                  placeholder="Tìm kiếm KOC..."
                  value={searchKocText}
                  onChange={e => setSearchKocText(e.target.value)}
                  className="bg-background border-b border-border p-3 text-sm text-white focus:outline-none w-full"
                />
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  <div 
                    className="p-3 hover:bg-white/5 cursor-pointer flex items-center gap-3 border-b border-border/50 text-textMuted hover:text-white"
                    onClick={() => { setSelectedKoc(null); setIsDropdownOpen(false); }}
                  >
                    Tất cả KOC (Global)
                  </div>
                  {displayedKocs.map(koc => (
                    <div 
                      key={koc.username}
                      className="p-3 hover:bg-white/5 cursor-pointer flex items-center gap-3 border-b border-border/50"
                      onClick={() => { setSelectedKoc(koc.creatorId || koc.username); setIsDropdownOpen(false); }}
                    >
                      <div className="w-8 h-8 rounded-full bg-pantone-293/30 flex justify-center items-center text-pantone-light text-xs font-bold shrink-0">
                        {koc.name?.charAt(0) || '?'}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-medium text-white truncate">{koc.name}</p>
                        <p className="text-xs text-textMuted truncate">@{koc.username}</p>
                      </div>
                    </div>
                  ))}
                  {displayedKocs.length === 0 && <p className="p-4 text-center text-xs text-textMuted">Không ráp</p>}
                </div>
              </div>
            )}
          </div>
          
          {/* Period Toggle */}
          <div className="flex items-center bg-background border border-border p-1 rounded-lg">
            {['day', 'week', 'month', 'year'].map(p => (
              <button
                key={p}
                onClick={() => setPeriodToggle(p)}
                className={`px-3 py-1 text-xs font-medium rounded-md capitalize transition-colors ${periodToggle === p ? 'bg-surface text-pantone-light shadow-sm' : 'text-textMuted hover:text-white'}`}
              >
                {p === 'day' ? 'Ngày' : p === 'week' ? 'Tuần' : p === 'month' ? 'Tháng' : 'Năm'}
              </button>
            ))}
          </div>
        </div>

        {/* Reset Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {(selectedKoc || periodToggle !== 'day') && (
            <button 
              onClick={() => {
                setSelectedKoc(null);
                setPeriodToggle('day');
              }}
              className="flex items-center gap-1.5 px-3 py-2 bg-red-500/10 text-red-400 hover:text-white hover:bg-red-500/80 border border-red-500/20 rounded-lg text-sm font-medium transition-colors"
            >
              <X className="w-4 h-4" /> Reset Lọc Lịch Sử
            </button>
          )}
        </div>
      </div>

      {/* RENDER DYNAMIC SECTIONS */}
      {!selectedKoc ? (
        // GLOBAL VIEW
        <KocGlobalStackedChart period={periodToggle} />
      ) : (
        // SINGLE KOC VIEW
        <div className="space-y-6">
          <KocProfileCard koc={activeKocData} previousKoc={activePrevKocData} />
          <KocTimelineChart kocId={selectedKoc} period={periodToggle} />
          <KocSessionTable koc={activeKocData} />
        </div>
      )}
    </div>
  );
}
