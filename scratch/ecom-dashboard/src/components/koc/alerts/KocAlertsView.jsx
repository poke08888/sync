import React, { useMemo } from 'react';
import { useKocStore } from '../../../store/useKocStore';
import { AlertCircle, TrendingDown, TrendingUp, Clock, AlertTriangle, ChevronRight } from 'lucide-react';

export default function KocAlertsView() {
  const { kocList, previousKocList, globalFilterDate, setSelectedKoc, setViewMode } = useKocStore();

  const alerts = useMemo(() => {
    if (!previousKocList || previousKocList.length === 0) return [];

    const generatedAlerts = [];

    kocList.forEach(curr => {
      const prev = previousKocList.find(p => (p.creatorId || p.username) === (curr.creatorId || curr.username));
      if (!prev) return; // Skip if they didn't exist in previous period

      // 1. GMV Drop > 20%
      if (prev.totalGMV > 0) {
        const gmvDiff = (curr.totalGMV - prev.totalGMV) / prev.totalGMV;
        if (gmvDiff <= -0.2) {
          generatedAlerts.push({
            id: `${curr.username}-gmv-drop`,
            type: 'danger',
            kocId: curr.creatorId || curr.username,
            kocName: curr.name,
            username: curr.username,
            title: 'Sụt giảm Doanh thu (GMV) nghiêm trọng',
            description: `Doanh thu giảm ${Math.abs(gmvDiff * 100).toFixed(1)}% so với thời gian trước.`,
            currVal: `${new Intl.NumberFormat('en-US').format(curr.totalGMV)}₫`,
            prevVal: `${new Intl.NumberFormat('en-US').format(prev.totalGMV)}₫`,
            icon: TrendingDown,
            score: Math.abs(gmvDiff) * 100 // for sorting
          });
        }
        
        // 3. GMV Surge > 50%
        if (gmvDiff >= 0.5) {
          generatedAlerts.push({
            id: `${curr.username}-gmv-surge`,
            type: 'success',
            kocId: curr.creatorId || curr.username,
            kocName: curr.name,
            username: curr.username,
            title: 'Tăng trưởng Doanh thu (GMV) đột biến',
            description: `Doanh thu tăng vọt ${Math.abs(gmvDiff * 100).toFixed(1)}% nhờ hiệu suất tốt.`,
            currVal: `${new Intl.NumberFormat('en-US').format(curr.totalGMV)}₫`,
            prevVal: `${new Intl.NumberFormat('en-US').format(prev.totalGMV)}₫`,
            icon: TrendingUp,
            score: Math.abs(gmvDiff) * 50 // weight it differently maybe
          });
        }
      }

      // 2. Effort Drop (Live Duration) > 30%
      if (prev.totalDurationHours > 0) {
        const durDiff = (curr.totalDurationHours - prev.totalDurationHours) / prev.totalDurationHours;
        if (durDiff <= -0.3) {
          generatedAlerts.push({
            id: `${curr.username}-dur-drop`,
            type: 'warning',
            kocId: curr.creatorId || curr.username,
            kocName: curr.name,
            username: curr.username,
            title: 'Giảm sút thời lượng Livestream',
            description: `Thời gian đầu tư vào phiên live sụt giảm ${Math.abs(durDiff * 100).toFixed(1)}%.`,
            currVal: `${curr.totalDurationHours.toFixed(1)}h`,
            prevVal: `${prev.totalDurationHours.toFixed(1)}h`,
            icon: Clock,
            score: Math.abs(durDiff) * 80
          });
        }
      }
    });

    // Sort descending by calculated severity score
    return generatedAlerts.sort((a, b) => b.score - a.score);
  }, [kocList, previousKocList]);

  if (!globalFilterDate.start && !globalFilterDate.end) {
    return (
      <div className="bg-surface border border-border rounded-xl p-10 flex flex-col items-center justify-center text-center mt-4">
        <AlertTriangle className="w-12 h-12 text-textMuted mb-3" />
        <h3 className="text-white font-bold text-lg mb-1">Cần chọn Khung Thời Gian</h3>
        <p className="text-textMuted text-sm max-w-md">Vui lòng sử dụng bộ lọc thời gian ở góc trên cùng để so sánh hiệu suất KOC với khoảng thời gian cùng kỳ trước đó.</p>
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-xl p-10 flex border-dashed flex-col items-center justify-center text-center mt-4">
        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-3">
          <AlertCircle className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="text-white font-bold text-lg mb-1">Không phát hiện bất thường</h3>
        <p className="text-textMuted text-sm max-w-md">Hiệu suất của các KOC đang ở mức ổn định so với kỳ trước. Chưa phát hiện sự sụt giảm hay tăng đột biến đáng kể nào.</p>
      </div>
    );
  }

  const renderAlertCard = (alert) => {
    const Icon = alert.icon;
          
    let styling = "";
    let iconStyling = "";
    let badgeStyling = "";
    
    if (alert.type === 'danger') {
      styling = "border-red-500/20 bg-red-500/5 hover:border-red-500/40";
      iconStyling = "text-red-400 bg-red-400/20";
      badgeStyling = "text-red-400 bg-red-400/10 border-red-500/20";
    } else if (alert.type === 'warning') {
      styling = "border-amber-500/20 bg-amber-500/5 hover:border-amber-500/40";
      iconStyling = "text-amber-400 bg-amber-400/20";
      badgeStyling = "text-amber-400 bg-amber-400/10 border-amber-500/20";
    } else {
      styling = "border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/40";
      iconStyling = "text-emerald-400 bg-emerald-400/20";
      badgeStyling = "text-emerald-400 bg-emerald-400/10 border-emerald-500/20";
    }

    return (
      <div key={alert.id} className={`border p-5 rounded-xl transition-colors flex flex-col h-full ${styling}`}>
        <div className="flex items-start gap-3 mb-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${iconStyling}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <h4 className="text-white font-bold truncate text-base" title={alert.kocName}>{alert.kocName}</h4>
            <p className="text-pantone-light/70 text-xs truncate">@{alert.username}</p>
          </div>
          <button 
            onClick={() => {
              setSelectedKoc(alert.kocId);
              setViewMode('history');
            }}
            className="flex items-center gap-1 text-[10px] uppercase font-bold text-textMuted hover:text-white px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors shrink-0"
            title="Đến trang chi tiết lịch sử KOC"
          >
            <span>Chi tiết</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        
        <div className="flex-1 flex flex-col">
          <div className="mb-3">
            <span className={`inline-block px-2 py-0.5 rounded text-[10px] uppercase font-bold border mb-2 ${badgeStyling}`}>
              {alert.title}
            </span>
            <p className="text-sm text-textMuted leading-relaxed">{alert.description}</p>
          </div>
          
          <div className="mt-auto grid grid-cols-2 gap-2 text-center pt-2">
            <div className="bg-background/50 border border-border/40 p-2 rounded-lg">
              <p className="text-[10px] text-textMuted uppercase tracking-wider mb-1">Kỳ này</p>
              <p className="text-sm font-bold text-white truncate">{alert.currVal}</p>
            </div>
            <div className="bg-background/50 border border-border/40 p-2 rounded-lg opacity-70">
              <p className="text-[10px] text-textMuted uppercase tracking-wider mb-1">Kỳ trước</p>
              <p className="text-sm font-bold text-white truncate">{alert.prevVal}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const dangerAlerts = alerts.filter(a => a.type === 'danger');
  const warningAlerts = alerts.filter(a => a.type === 'warning');
  const successAlerts = alerts.filter(a => a.type === 'success');

  return (
    <div className="space-y-8 mt-4">
      <div className="mb-2">
        <h3 className="text-lg font-semibold text-white">Khám phá & Cảnh báo KOC</h3>
        <p className="text-sm text-textMuted mt-1">Hệ thống tự động phát hiện các bất thường về mặt dữ liệu để giúp bạn tối ưu hóa rủi ro và tìm ra KOC tiềm năng mới.</p>
      </div>

      {dangerAlerts.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4 border-b border-border pb-2">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <h4 className="font-bold text-white text-base">Báo động Sụt giảm</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {dangerAlerts.map(renderAlertCard)}
          </div>
        </section>
      )}

      {warningAlerts.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4 border-b border-border pb-2">
            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
            <h4 className="font-bold text-white text-base">Cảnh báo Hoạt động</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {warningAlerts.map(renderAlertCard)}
          </div>
        </section>
      )}

      {successAlerts.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4 border-b border-border pb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <h4 className="font-bold text-white text-base">Ngôi sao Mới nổi</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {successAlerts.map(renderAlertCard)}
          </div>
        </section>
      )}
    </div>
  );
}
