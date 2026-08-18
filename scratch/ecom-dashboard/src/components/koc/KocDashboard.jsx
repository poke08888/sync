import React from 'react';
import { useKocStore } from '../../store/useKocStore';
import KocOverview from './KocOverview';
import KocPerformanceTable from './KocPerformanceTable';
import KocTopChart from './charts/KocTopChart';
import KocDateChart from './charts/KocDateChart';
import KocScatterChart from './charts/KocScatterChart';
import KocHourlyChart from './charts/KocHourlyChart';
import KocHistoryView from './history/KocHistoryView';
import KocAlertsView from './alerts/KocAlertsView';
import KocUploadZone from './KocUploadZone';
import { LayoutDashboard, History, AlertTriangle, Database } from 'lucide-react';

export default function KocDashboard() {
  const { viewMode, setViewMode } = useKocStore();

  return (
    <div className="space-y-6">
      {/* Sub-tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-border pb-px">
        <button
          onClick={() => setViewMode('overview')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${viewMode === 'overview' ? 'border-pantone-light text-pantone-light' : 'border-transparent text-textMuted hover:text-white hover:border-white/20'}`}
        >
          <LayoutDashboard className="w-4 h-4" /> Tổng quan KOC
        </button>
        <button
          onClick={() => setViewMode('history')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${viewMode === 'history' ? 'border-pantone-light text-pantone-light' : 'border-transparent text-textMuted hover:text-white hover:border-white/20'}`}
        >
          <History className="w-4 h-4" /> Lịch sử KOC
        </button>
        <button
          onClick={() => setViewMode('alerts')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${viewMode === 'alerts' ? 'border-pantone-light text-pantone-light' : 'border-transparent text-textMuted hover:text-white hover:border-white/20'}`}
        >
          <AlertTriangle className="w-4 h-4" /> Cảnh báo Khác thường
        </button>
        <button
          onClick={() => setViewMode('data')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${viewMode === 'data' ? 'border-pantone-light text-pantone-light' : 'border-transparent text-textMuted hover:text-white hover:border-white/20'}`}
        >
          <Database className="w-4 h-4" /> Quản lý Dữ liệu
        </button>
      </div>

      {viewMode === 'overview' ? (
        <>
          <KocOverview />
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
            <KocDateChart />
            <KocTopChart />
            <KocScatterChart />
            <KocHourlyChart />
          </div>
          <KocPerformanceTable />
        </>
      ) : viewMode === 'history' ? (
        <KocHistoryView />
      ) : viewMode === 'alerts' ? (
        <KocAlertsView />
      ) : (
        <KocUploadZone />
      )}
    </div>
  );
}
