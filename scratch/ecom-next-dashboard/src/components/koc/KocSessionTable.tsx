"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, ShoppingBag, Eye, MousePointerClick, MessageSquare, Share2, ThumbsUp, UserPlus } from 'lucide-react';
import { formatNumber, formatKocCurrency, formatPercent } from '@/lib/utils';
import { KocLiveSession } from '@/lib/koc-service';

interface KocSessionTableProps {
  sessions: KocLiveSession[];
}

export default function KocSessionTable({ sessions }: KocSessionTableProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="glass-panel overflow-hidden p-0 border-white/5">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/[0.02] border-b border-white/5">
              <th className="p-4 w-10"></th>
              <th className="p-4 text-[10px] text-gray-500 font-extrabold uppercase tracking-widest">Ngày</th>
              <th className="p-4 text-[10px] text-gray-500 font-extrabold uppercase tracking-widest">Bắt đầu</th>
              <th className="p-4 text-[10px] text-gray-500 font-extrabold uppercase tracking-widest">Thời lượng</th>
              <th className="p-4 text-[10px] text-gray-500 font-extrabold uppercase tracking-widest">GMV</th>
              <th className="p-4 text-[10px] text-gray-500 font-extrabold uppercase tracking-widest">Đơn</th>
              <th className="p-4 text-[10px] text-gray-500 font-extrabold uppercase tracking-widest">Người xem</th>
              <th className="p-4 text-[10px] text-gray-500 font-extrabold uppercase tracking-widest">Hiển thị</th>
              <th className="p-4 text-[10px] text-gray-500 font-extrabold uppercase tracking-widest">Nhấp</th>
              <th className="p-4 text-[10px] text-gray-500 font-extrabold uppercase tracking-widest">CTR</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sessions.map((s, idx) => {
              const rowId = `${s.creatorId}-${s.startTime}`;
              const isExpanded = expandedRow === rowId;
              const hasRevenue = s.gmv > 0;

              return (
                <React.Fragment key={rowId}>
                  <tr 
                    onClick={() => toggleRow(rowId)}
                    className={`group hover:bg-white/[0.04] transition-colors cursor-pointer ${hasRevenue ? 'text-teal-400 font-bold' : 'text-gray-400'}`}
                  >
                    <td className="p-4">
                      {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </td>
                    <td className="p-4 text-xs">{s.date}</td>
                    <td className="p-4 text-xs">{s.startTime.split(' ')[1]}</td>
                    <td className="p-4 text-xs">{s.durationHours.toFixed(1)}h</td>
                    <td className="p-4 text-sm font-black">{formatKocCurrency(s.gmv)}</td>
                    <td className="p-4 text-sm">{formatNumber(s.skuOrdersCreated)}</td>
                    <td className="p-4 text-xs font-bold">{formatNumber(s.viewers)}</td>
                    <td className="p-4 text-xs font-bold">{formatNumber(s.impressions)}</td>
                    <td className="p-4 text-xs font-bold">{formatNumber(s.clicks)}</td>
                    <td className="p-4 text-xs font-bold">{formatPercent(s.ctr)}</td>
                  </tr>
                  
                  {isExpanded && (
                    <tr className="bg-indigo-500/[0.02]">
                      <td colSpan={10} className="p-6">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                          <DetailCard icon={<Eye size={14}/>} label="Lượt xem" value={formatNumber(s.views)} color="text-blue-400" />
                          <DetailCard icon={<MessageSquare size={14}/>} label="Bình luận" value={formatNumber(s.comments)} color="text-purple-400" />
                          <DetailCard icon={<Share2 size={14}/>} label="Chia sẻ" value={formatNumber(s.shares)} color="text-teal-400" />
                          <DetailCard icon={<ThumbsUp size={14}/>} label="Thích" value={formatNumber(s.likes)} color="text-rose-400" />
                          <DetailCard icon={<UserPlus size={14}/>} label="Followers mới" value={formatNumber(s.newFollowers)} color="text-amber-400" />
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

function DetailCard({ icon, label, value, color }: any) {
  return (
    <div className="flex flex-col gap-2 p-3 bg-white/5 rounded-xl border border-white/5">
      <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-tight">
        <span className={color}>{icon}</span>
        {label}
      </div>
      <div className="text-lg font-black text-white">{value}</div>
    </div>
  );
}
