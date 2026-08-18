import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, MessageCircle, Heart, Share2, UserPlus } from 'lucide-react';

export default function KocSessionTable({ koc }) {
  const [expandedRows, setExpandedRows] = useState({});

  const toggleRow = (idx) => {
    setExpandedRows(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const data = useMemo(() => {
    if (!koc || !koc.lives) return [];
    
    let filtered = [...koc.lives];

    // Sort by startTime / date newest first
    filtered.sort((a, b) => {
      if (!a.startTime && !b.startTime) return 0;
      if (!a.startTime) return 1;
      if (!b.startTime) return -1;
      // "2026/04/06/ 22:55" - parseable or standard sorting
      return b.startTime.localeCompare(a.startTime);
    });

    return filtered;
  }, [koc]);

  const fmtCurrency = (v) => new Intl.NumberFormat('en-US').format(Math.round(v)) + '₫';
  const fmtNum = (v) => new Intl.NumberFormat('en-US').format(v || 0);

  if (!data.length) return null;

  return (
    <div className="bg-surface border border-border rounded-xl flex flex-col shadow-sm">
      <div className="p-4 border-b border-border">
        <h3 className="text-white font-bold text-lg">Chi tiết từng Phiên Live ({data.length})</h3>
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm whitespace-nowrap">
          <thead className="bg-background/80 text-xs uppercase tracking-wider text-textMuted">
            <tr>
              <th className="p-3 border-b border-border w-10"></th>
              <th className="p-3 border-b border-border">Ngày</th>
              <th className="p-3 border-b border-border">Giờ BĐ</th>
              <th className="p-3 border-b border-border">Thời lượng</th>
              <th className="p-3 border-b border-border text-right">GMV</th>
              <th className="p-3 border-b border-border text-center">Đơn</th>
              <th className="p-3 border-b border-border text-right">Viewers</th>
              <th className="p-3 border-b border-border text-right">Impressions</th>
              <th className="p-3 border-b border-border text-right">Clicks</th>
              <th className="p-3 border-b border-border text-right">CTR</th>
            </tr>
          </thead>
          <tbody>
            {data.map((live, idx) => {
              const isExpanded = !!expandedRows[idx];
              const hasGmv = live.gmv > 0;
              
              // Tách ngày giờ
              const startTimeStr = live.startTime || '';
              let dateStr = live.date || '—';
              let hourStr = '—';
              if (startTimeStr.includes(' ')) {
                hourStr = startTimeStr.split(' ')[1];
              }

              return (
                <React.Fragment key={`live-${idx}`}>
                  <tr 
                    className={`border-b border-border/20 hover:bg-white/5 transition-colors cursor-pointer group ${hasGmv ? 'font-bold' : ''}`}
                    onClick={() => toggleRow(idx)}
                  >
                    <td className="p-3 text-center text-textMuted group-hover:text-white transition-colors">
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </td>
                    <td className="p-3 text-white">{dateStr}</td>
                    <td className="p-3 text-textMuted">{hourStr}</td>
                    <td className="p-3 text-textMuted">{live.durationHours.toFixed(1)}h</td>
                    <td className={`p-3 text-right ${hasGmv ? 'text-teal-400' : 'text-textMuted'}`}>{fmtCurrency(live.gmv)}</td>
                    <td className="p-3 text-center text-white">{fmtNum(live.orders)}</td>
                    <td className="p-3 text-right text-textMuted">{fmtNum(live.viewers)}</td>
                    <td className="p-3 text-right text-textMuted">{fmtNum(live.impressions)}</td>
                    <td className="p-3 text-right text-textMuted">{fmtNum(live.clicks)}</td>
                    <td className="p-3 text-right text-amber-400 font-medium">{live.ctr.toFixed(2)}%</td>
                  </tr>
                  
                  {isExpanded && (
                    <tr className="bg-background/50 border-b border-border/80">
                      <td colSpan="10" className="p-4">
                        <div className="flex flex-wrap items-center gap-6 ml-10">
                          <div className="flex items-center gap-2 text-textMuted bg-surface border border-border px-3 py-1.5 rounded-lg text-xs">
                            <MessageCircle className="w-3.5 h-3.5 text-blue-400" />
                            <span>Bình luận:</span>
                            <span className="text-white font-bold">{fmtNum(live.comments)}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-textMuted bg-surface border border-border px-3 py-1.5 rounded-lg text-xs">
                            <Heart className="w-3.5 h-3.5 text-pink-400" />
                            <span>Lượt Thích:</span>
                            <span className="text-white font-bold">{fmtNum(live.likes)}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-textMuted bg-surface border border-border px-3 py-1.5 rounded-lg text-xs">
                            <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Chia sẻ:</span>
                            <span className="text-white font-bold">{fmtNum(live.shares)}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-textMuted bg-surface border border-border px-3 py-1.5 rounded-lg text-xs">
                            <UserPlus className="w-3.5 h-3.5 text-purple-400" />
                            <span>Followers mới:</span>
                            <span className="text-white font-bold">{fmtNum(live.newFollowers)}</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
