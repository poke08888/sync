"use client";

import React from 'react';
import { AlertCircle, TrendingDown, TrendingUp, Clock, ArrowRight, User, ShieldAlert, Sparkles, AlertTriangle } from 'lucide-react';
import { KocAnomaly } from '@/lib/koc-service';
import { formatKocCurrency, formatNumber } from '@/lib/utils';

interface KocAlertsTabProps {
  alerts: KocAnomaly[];
  onAction: (kocName: string) => void;
}

export default function KocAlertsTab({ alerts, onAction }: KocAlertsTabProps) {
  if (alerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-emerald-500/[0.02] border border-dashed border-emerald-500/20 rounded-[32px]">
        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mb-4">
          <Sparkles size={32} />
        </div>
        <h2 className="text-xl font-bold text-white">Chưa phát hiện bất thường</h2>
        <p className="text-gray-500 text-sm mt-2 max-w-sm text-center px-6">
          Hệ thống đang theo dõi sát sao. Hiện tại hiệu suất của tất cả KOC đều nằm trong ngưỡng ổn định.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between px-2">
        <div>
          <h3 className="text-xl font-black text-white">Trung tâm Cảnh báo</h3>
          <p className="text-gray-500 text-xs mt-1 uppercase tracking-widest font-bold">Phát hiện {alerts.length} thay đổi cần lưu ý</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {alerts.map((alert, idx) => (
          <div 
            key={`${alert.kocId}-${alert.type}-${idx}`}
            className={`glass-panel p-6 border-white/5 relative overflow-hidden group transition-all hover:border-white/10
              ${alert.severity === 'high' ? 'bg-rose-500/[0.03] border-rose-500/20' : ''}
              ${alert.severity === 'medium' ? 'bg-amber-500/[0.03] border-amber-500/20' : ''}
              ${alert.severity === 'info' ? 'bg-indigo-500/[0.03] border-indigo-500/20' : ''}
            `}
          >
            {/* Severity Pulse Indicator */}
            {alert.severity === 'high' && (
              <div className="absolute top-4 right-4 flex h-3 w-3">
                <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></div>
                <div className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></div>
              </div>
            )}

            <div className="flex items-start gap-5">
              <div className={`p-3 rounded-2xl shrink-0
                ${alert.severity === 'high' ? 'bg-rose-500/20 text-rose-500' : ''}
                ${alert.severity === 'medium' ? 'bg-amber-500/20 text-amber-500' : ''}
                ${alert.severity === 'info' ? 'bg-indigo-500/20 text-indigo-500' : ''}
              `}>
                {getAlertIcon(alert.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white font-black text-lg">{alert.kocName}</span>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">@{alert.username}</span>
                </div>
                
                <h4 className={`text-sm font-bold mb-3 ${getTextColor(alert.severity)}`}>
                  {alert.message}
                </h4>

                <div className="grid grid-cols-2 gap-4 py-3 border-y border-white/5 mb-4">
                  <div>
                    <div className="text-[9px] text-gray-600 font-black uppercase tracking-widest mb-1">Tuần trước</div>
                    <div className="text-sm font-bold text-gray-400">
                      {alert.type.includes('gmv') ? formatKocCurrency(alert.previousValue) : `${alert.previousValue.toFixed(1)}h`}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] text-gray-600 font-black uppercase tracking-widest mb-1">Hiện tại</div>
                    <div className="text-sm font-black text-white">
                      {alert.type.includes('gmv') ? formatKocCurrency(alert.currentValue) : `${alert.currentValue.toFixed(1)}h`}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest border
                    ${alert.severity === 'high' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : ''}
                    ${alert.severity === 'medium' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : ''}
                    ${alert.severity === 'info' ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' : ''}
                  `}>
                    {getSeverityLabel(alert.severity)}
                  </div>
                  
                  <button 
                    onClick={() => onAction(alert.kocName)}
                    className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors group/btn"
                  >
                    Xem lịch sử KOC
                    <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-panel p-6 border-indigo-500/10 bg-indigo-500/[0.02]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400">
            <ShieldAlert size={18} />
          </div>
          <div>
            <h5 className="text-sm font-bold text-white">Lời khuyên Quản trị</h5>
            <p className="text-xs text-gray-500 mt-0.5">Ưu tiên follow các KOC bị tag "Sụt giảm nghiêm trọng" để kịp thời hỗ trợ kỹ thuật hoặc nội dung.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function getAlertIcon(type: string) {
  switch (type) {
    case 'gmv_drop': return <TrendingDown size={24} />;
    case 'gmv_surge': return <TrendingUp size={24} />;
    case 'hours_drop': return <Clock size={24} />;
    case 'missing_live': return <AlertCircle size={24} />;
    default: return <ShieldAlert size={24} />;
  }
}

function getTextColor(severity: string) {
  switch (severity) {
    case 'high': return 'text-rose-400';
    case 'medium': return 'text-amber-400';
    case 'info': return 'text-emerald-400';
    default: return 'text-gray-400';
  }
}

function getSeverityLabel(severity: string) {
  switch (severity) {
    case 'high': return 'Cảnh báo Đỏ';
    case 'medium': return 'Cần Chú ý';
    case 'info': return 'Tăng trưởng';
    default: return 'Theo dõi';
  }
}
