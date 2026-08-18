import React, { useState, useEffect, useMemo } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Loader2, AlertCircle } from 'lucide-react';
import KPICard from '../components/KPICard';
import KPITracker from '../components/KPITracker';
import HourlySalesChart from '../components/charts/HourlySalesChart';
import DailySalesChart from '../components/charts/DailySalesChart';
import ChannelDonutChart from '../components/charts/ChannelDonutChart';
import TopProductsChart from '../components/charts/TopProductsChart';
import { dashboardService } from '../services/dashboardService';
import { TIME_RANGES } from '../utils/mockData';

export default function Dashboard() {
  const { user, globalBrand, setGlobalBrand } = useAuthStore();
  const [timeRange, setTimeRange] = useState('7 ngày');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, [globalBrand]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await dashboardService.getDashboardData(globalBrand);
      setData(res);
      setBrands(res.brands || []);
    } catch (err) {
      console.error('Lỗi tải dữ liệu Dashboard:', err);
      setError(err.message || 'Không thể kết nối tới server.');
    } finally {
      setLoading(false);
    }
  };

  const isMediaBuyer = user.role === 'media_buyer';
  const isBM = user.role === 'brand_manager';

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-textMuted py-40">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-pantone-293" />
        <p className="font-semibold text-white">Đang chuẩn bị báo cáo doanh thu...</p>
        <p className="text-sm opacity-60 mt-2">Hệ thống đang tổng hợp dữ liệu từ TikTok API</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-40">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2 italic">Oops! Không thể tải dữ liệu</h2>
        <p className="text-textMuted max-w-sm mb-8">{error || 'Đã xảy ra lỗi không xác định ở phía Server.'}</p>
        <button 
          onClick={fetchDashboardData}
          className="px-6 py-2 bg-white text-background font-bold rounded-xl hover:bg-pantone-light transition-all"
        >
          Thử lại ngay
        </button>
      </div>
    );
  }

  const { metrics } = data;

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header & Filter */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 sticky top-0 bg-background/95 backdrop-blur z-20 pb-4 pt-2 border-b border-border/50">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            KPI Overview {isBM && <span className="text-xs font-normal px-2 py-1 bg-pantone-293/20 text-pantone-light rounded-md">Quyền Brand Manager</span>}
          </h1>
          <p className="text-textMuted text-sm">Hệ thống đang mô phỏng dữ liệu "Cùng kỳ" dựa trên filter</p>
        </div>
        
        {/* Fitlers */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Global Brand Selector */}
          <select 
            value={globalBrand}
            onChange={(e) => setGlobalBrand(e.target.value)}
            disabled={isBM}
            className={`bg-surface border border-border text-white text-sm rounded-xl px-4 py-2 outline-none focus:border-pantone-light transition-colors shadow-sm ${isBM ? 'opacity-70 cursor-not-allowed bg-background' : ''}`}
          >
            <option value="">Tất cả thương hiệu</option>
            {brands.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>

          {/* Time Filters */}
          <div className="flex flex-wrap items-center gap-1 bg-surface p-1 rounded-xl border border-border shrink-0">
            {TIME_RANGES.map(range => (
              <button 
                key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range 
                ? 'bg-pantone-293 text-white shadow-sm' 
                : 'text-textMuted hover:text-white hover:bg-white/5'
              }`}
            >
              {range}
            </button>
          ))}
          </div>
        </div>
      </div>

      {/* KPI Cards Grid (8 Core Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-6">
        <KPICard 
          title="Doanh số Gross" 
          data={{ 
            value: metrics.revenue.value, 
            trend: metrics.revenue.trend, 
            isPositive: metrics.revenue.is_positive 
          }} 
          isCurrency={false} 
        />
        
        <KPICard 
          title="Doanh số Net (sau hủy)" 
          data={{ 
            value: metrics.net_revenue.value, 
            trend: metrics.net_revenue.trend, 
            isPositive: metrics.net_revenue.is_positive 
          }} 
          isCurrency={false} 
        />

        <KPICard 
          title="Tỷ lệ hủy đơn" 
          data={{ 
            value: metrics.cancellation_rate.value, 
            trend: metrics.cancellation_rate.trend, 
            isPositive: metrics.cancellation_rate.is_positive,
            alertThreshold: 10 
          }}
        />

        <KPICard 
          title="Chi phí Ads" 
          data={{ 
            value: metrics.actual_cost.value, 
            trend: metrics.actual_cost.trend, 
            isPositive: metrics.actual_cost.is_positive 
          }} 
          isCurrency={false} 
        />

        <KPICard 
          title="ROAS Blended" 
          data={{ 
            value: metrics.roas.value, 
            trend: metrics.roas.trend, 
            isPositive: metrics.roas.is_positive 
          }} 
        />

        <KPICard 
          title="AOV (Trung bình / đơn)" 
          data={{ 
            value: metrics.aov.value, 
            trend: metrics.aov.trend, 
            isPositive: metrics.aov.is_positive 
          }} 
          isCurrency={false} 
        />

        <KPICard 
          title="Số lượng Đơn hàng" 
          data={{ 
            value: metrics.orders.value, 
            trend: metrics.orders.trend, 
            isPositive: metrics.orders.is_positive 
          }} 
          isCurrency={false} 
        />

        <KPICard 
          title="Biên lợi nhuận gộp (Margin)" 
          data={{ value: 'N/A', trend: 0, isPositive: true }} 
        />
      </div>

      {/* KPI Tracker Module */}
      <KPITracker data={data.kpiData} />

      {/* 4 Core Charts Module */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
        <HourlySalesChart data={data.chartData.hourly_revenue} />
        <DailySalesChart data={data.chartData.daily_revenue} />
        <ChannelDonutChart data={data.chartData.channel_share} />
        <TopProductsChart products={data.topProducts} />
      </div>
    </div>
  );
}
