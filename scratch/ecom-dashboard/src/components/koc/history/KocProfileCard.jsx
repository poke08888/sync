import React, { useMemo } from 'react';
import { BadgeDollarSign, Video, Clock, Target, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function KocProfileCard({ koc, previousKoc }) {
  if (!koc) return null;

  const data = useMemo(() => {
    const calc = (lives) => {
      const filtered = lives || [];
      const tGmv = filtered.reduce((sum, r) => sum + r.gmv, 0);
      const tDur = filtered.reduce((sum, r) => sum + r.durationHours, 0);
      const tSess = filtered.length;
      return {
        totalGMV: tGmv,
        totalSessions: tSess,
        totalDurationHours: tDur,
        revPerHour: tDur > 0 ? tGmv / tDur : 0
      };
    };

    const current = calc(koc.lives);
    const prev = calc(previousKoc?.lives);

    const getDelta = (curr, old) => {
      if (old === 0) return curr > 0 ? 100 : 0;
      return ((curr - old) / old) * 100;
    };

    return {
      ...current,
      deltaGMV: getDelta(current.totalGMV, prev.totalGMV),
      deltaSessions: getDelta(current.totalSessions, prev.totalSessions),
      deltaDuration: getDelta(current.totalDurationHours, prev.totalDurationHours),
      deltaRevPerHour: getDelta(current.revPerHour, prev.revPerHour)
    };
  }, [koc, previousKoc]);

  const renderDelta = (delta) => {
    if (delta === null || isNaN(delta)) return null;
    const isUp = delta > 0;
    const isDown = delta < 0;
    const abs = Math.abs(delta).toFixed(1);

    if (delta === 0) return (
      <span className="flex items-center gap-0.5 text-[10px] text-textMuted bg-white/5 px-1 rounded ml-1.5 opacity-60">
        <Minus className="w-3 h-3" /> 0%
      </span>
    );

    return (
      <span className={`flex items-center gap-0.5 text-[10px] px-1 rounded ml-1.5 font-bold ${isUp ? 'text-emerald-400 bg-emerald-400/10' : 'text-rose-400 bg-rose-400/10'}`}>
        {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {abs}%
      </span>
    );
  };

  const fmtM = (v) => new Intl.NumberFormat('en-US').format(Math.round(v)) + '₫';

  return (
    <div className="bg-surface border border-border p-6 rounded-xl flex flex-col md:flex-row items-center gap-8 shadow-sm">
      {/* Profile Header */}
      <div className="flex items-center gap-4 border-r border-border/0 md:border-border pr-8 w-full md:w-auto">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pantone-293 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shrink-0">
          {koc.name?.charAt(0) || '?'}
        </div>
        <div>
          <h2 className="text-xl font-bold text-white mb-1 truncate max-w-[200px]">{koc.name}</h2>
          <p className="text-pantone-light text-sm bg-pantone-light/10 inline-block px-2 py-0.5 rounded-full">@{koc.username}</p>
        </div>
      </div>

      {/* 4 Stat Pills */}
      <div className="flex-1 w-full grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="flex flex-col gap-1 p-3 bg-white/5 rounded-lg border border-white/5">
          <div className="flex items-center gap-2 text-textMuted text-[10px] font-bold uppercase tracking-tight">
            <BadgeDollarSign className="w-3.5 h-3.5 text-teal-400" /> Tổng GMV
          </div>
          <div className="flex items-end">
            <p className="text-xl font-bold text-teal-400 truncate">{fmtM(data.totalGMV)}</p>
            {renderDelta(data.deltaGMV)}
          </div>
        </div>
        
        <div className="flex flex-col gap-1 p-3 bg-white/5 rounded-lg border border-white/5">
          <div className="flex items-center gap-2 text-textMuted text-[10px] font-bold uppercase tracking-tight">
            <Video className="w-3.5 h-3.5 text-blue-400" /> Tổng Phiên
          </div>
          <div className="flex items-end">
            <p className="text-xl font-bold text-white">{data.totalSessions}</p>
            {renderDelta(data.deltaSessions)}
          </div>
        </div>
        
        <div className="flex flex-col gap-1 p-3 bg-white/5 rounded-lg border border-white/5">
          <div className="flex items-center gap-2 text-textMuted text-[10px] font-bold uppercase tracking-tight">
            <Clock className="w-3.5 h-3.5 text-amber-400" /> Tổng Giờ Live
          </div>
          <div className="flex items-end">
            <p className="text-xl font-bold text-white">{data.totalDurationHours.toFixed(1)}h</p>
            {renderDelta(data.deltaDuration)}
          </div>
        </div>
        
        <div className="flex flex-col gap-1 p-3 bg-white/5 rounded-lg border border-white/5">
          <div className="flex items-center gap-2 text-textMuted text-[10px] font-bold uppercase tracking-tight">
            <Target className="w-3.5 h-3.5 text-rose-400" /> DT / Giờ TB
          </div>
          <div className="flex items-end">
            <p className="text-xl font-bold text-rose-400 truncate">{fmtM(data.revPerHour)}/h</p>
            {renderDelta(data.deltaRevPerHour)}
          </div>
        </div>

      </div>
    </div>
  );
}
