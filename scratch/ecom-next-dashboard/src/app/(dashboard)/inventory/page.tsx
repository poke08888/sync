"use client";

import React, { useEffect, useState } from 'react';
import { Box, AlertTriangle, CheckCircle2, ShoppingCart, TrendingDown, Upload, Package, RefreshCw, ChevronDown, ChevronRight, AlertCircle, Clock, MapPin, ArrowLeftRight } from 'lucide-react';
import { formatNumber, formatCurrency } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import StockForecastChart from '@/components/inventory/StockForecastChart';
import { useAuth } from '@/context/AuthContext';

export default function InventoryPage() {
  const router = useRouter();
  const { isAdmin } = useAuth();
  const [summary, setSummary] = useState<any>(null);
  const [replenishmentData, setReplenishmentData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState('TOTAL');
  const [availableWarehouses, setAvailableWarehouses] = useState<string[]>(['TOTAL']);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sumRes, repRes, whRes] = await Promise.all([
        fetch(`/api/dashboard/summary?warehouseCode=${selectedWarehouse}`),
        fetch(`/api/dashboard/replenishment?warehouseCode=${selectedWarehouse}`),
        fetch('/api/inventory/warehouses')
      ]);
      setSummary(await sumRes.json());
      setReplenishmentData(await repRes.json());
      const whData = await whRes.json();
      if (whData.codes) setAvailableWarehouses(whData.codes);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedWarehouse]);

  if (loading && !summary) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4 text-gray-500 font-bold uppercase tracking-widest animate-pulse">
        <RefreshCw className="animate-spin" />
        Đang tải dữ liệu kho hàng...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Dự báo Tái cung ứng</h1>
          <p className="text-gray-400 mt-2 flex items-center gap-2">
            <MapPin size={14} className="text-indigo-400" />
            Đang xem: <span className="text-white font-bold">{selectedWarehouse === 'TOTAL' ? 'Tất cả các kho (Gộp)' : `Kho ${selectedWarehouse}`}</span>
          </p>
        </div>
        <div className="flex gap-3">
          <select 
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm font-bold text-white outline-none focus:border-indigo-500 transition-all hover:bg-white/10"
          >
            {availableWarehouses.map(code => (
              <option key={code} value={code}>{code === 'TOTAL' ? '🌐 Tất cả các kho' : `🏠 Kho ${code}`}</option>
            ))}
          </select>
          
          {isAdmin && (
            <button 
              onClick={() => router.push('/inventory/upload')}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-indigo-500 transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              <Upload size={18} /> Tải dữ liệu Excel
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatusCard 
          title="SKU Khẩn cấp (Today)" 
          value={summary?.criticalCount || 0} 
          icon={<AlertCircle size={24} className="text-rose-400" />} 
          color="rose" 
          sub="Phát hiện reorder date <= hôm nay"
        />
        <StatusCard 
          title="SKU Cảnh báo (3-7 ngày)" 
          value={summary?.warningCount || 0} 
          icon={<AlertTriangle size={24} className="text-amber-400" />} 
          color="amber" 
          sub="Cần chuẩn bị kế hoạch nhập hàng"
        />
        <StatusCard 
          title="PO Xác nhận (Hôm nay)" 
          value={summary?.pendingConfirmationCount || 0} 
          icon={<Clock size={24} className="text-emerald-400" />} 
          color="emerald" 
          sub="Đơn hàng dự kiến về trong ngày"
        />
        <StatusCard 
          title="Giá trị hàng đang về" 
          value={formatCurrency(summary?.totalInTransitValue || 0)} 
          icon={<Package size={24} className="text-indigo-400" />} 
          color="indigo" 
          sub={`Từ ${summary?.totalSkus || 0} SKU đang theo dõi`}
        />
      </div>

      {/* Main Replenishment Table */}
      <div className="glass-panel overflow-hidden border-white/5">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
           <div>
             <h3 className="text-sm font-black text-white uppercase tracking-widest">Trạng thái Tái cung ứng SKU</h3>
             <p className="text-[10px] text-gray-500 font-bold mt-1">Sắp xếp theo mức độ ưu tiên và ngày nhập hàng</p>
           </div>
           <button onClick={fetchData} className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all text-gray-400">
             <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
           </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-white/5">
                <th className="p-4 w-10"></th>
                <th className="p-4">SKU / Nhà cung cấp</th>
                <th className="p-4">Tồn kho / ADO</th>
                <th className="p-4">Net Stock / In-Transit</th>
                <th className="p-4">Số ngày còn lại</th>
                <th className="p-4">Ngày nhập hàng</th>
                <th className="p-4">SL đề xuất (MOQ)</th>
                <th className="p-4">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {replenishmentData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-500">
                      <Package size={40} className="opacity-20" />
                      <p className="text-sm font-bold uppercase tracking-widest">Chưa có dữ liệu dự báo</p>
                      <button onClick={() => router.push('/inventory/upload')} className="text-xs text-indigo-400 font-bold hover:underline">Tải lên file kho đầu tiên của bạn</button>
                    </div>
                  </td>
                </tr>
              ) : (
                replenishmentData.map((item) => {
                  const isExpanded = expandedRow === item.id;
                  
                  // Status Styles
                  const statusColors: any = {
                    CRITICAL: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
                    WARNING: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
                    INFO: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20',
                    OK: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
                  };

                  return (
                    <React.Fragment key={item.id}>
                      <tr 
                        className={`border-b border-white/5 hover:bg-white/[0.03] transition-colors cursor-pointer ${isExpanded ? 'bg-white/[0.03]' : ''}`}
                        onClick={() => setExpandedRow(isExpanded ? null : item.id)}
                      >
                        <td className="p-4 text-center">
                          {isExpanded ? <ChevronDown size={16} className="text-indigo-400" /> : <ChevronRight size={16} className="text-gray-600" />}
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="text-xs font-black text-white uppercase tracking-tighter">{item.skuCode}</span>
                            <span className="text-[10px] text-gray-500 font-bold">{item.productName}</span>
                            <span className="text-[9px] text-indigo-400 font-black uppercase mt-1 opacity-60">{item.supplierName}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="text-xs font-black text-gray-300">{formatNumber(item.currentStock)}</span>
                            <span className="text-[10px] text-gray-600 font-bold">ADO: {item.ado.toFixed(1)}/d</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="text-xs font-black text-emerald-400">{formatNumber(item.netStock)}</span>
                            <span className="text-[10px] text-gray-600 font-bold">In-Transit: {formatNumber(item.netStock - item.currentStock)}</span>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className={`text-sm font-black ${item.daysRemaining < 3 ? 'text-rose-400' : 'text-white'}`}>
                            {item.daysRemaining} <span className="text-[10px] font-bold text-gray-600">ngày</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-xs font-bold text-gray-400">
                            {new Date(item.reorderDate).toLocaleDateString('vi-VN')}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="text-xs font-black text-white">{formatNumber(item.recommendedQty)}</span>
                            <span className="text-[9px] text-gray-600 font-bold italic">{formatCurrency(item.estimatedCost)}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-lg text-[9px] font-black border tracking-widest ${statusColors[item.priority]}`}>
                            {item.priority}
                          </span>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-black/40 border-b border-white/5">
                          <td colSpan={8} className="p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                              <div className="lg:col-span-2">
                                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                  <TrendingDown size={14} className="text-indigo-400" /> Dự báo tồn kho (30 ngày)
                                </h4>
                                <StockForecastChart skuCode={item.skuCode} warehouseCode={item.warehouseCode} />
                              </div>
                              <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5 h-fit">
                                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6">Chi tiết tính toán</h4>
                                <div className="space-y-4">
                                  <CalculationRow label="Tồn kho thực" value={item.currentStock} />
                                  <CalculationRow label="Hàng đang về" value={item.netStock - item.currentStock} color="text-emerald-400" />
                                  <CalculationRow label="ADO (Trung bình ngày)" value={item.ado.toFixed(2)} />
                                  <div className="h-px bg-white/5 my-2"></div>
                                  <CalculationRow label="Số ngày còn lại" value={`${item.daysRemaining} ngày`} emphasis />
                                  <CalculationRow label="SL khuyên nhập" value={item.recommendedQty} emphasis color="text-indigo-400" />
                                </div>
                                
                                {/* Gợi ý Luân chuyển */}
                                {item.priority !== 'OK' && selectedWarehouse !== 'TOTAL' && item.otherStocks?.length > 0 && (
                                  <div className="mt-8 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                                    <div className="flex items-center gap-2 text-indigo-400 mb-2">
                                      <ArrowLeftRight size={14} />
                                      <span className="text-[10px] font-black uppercase">Gợi ý Luân chuyển</span>
                                    </div>
                                    <p className="text-[10px] text-gray-400 leading-relaxed italic mb-4">
                                      Các kho sau đây đang có sẵn hàng, bạn có thể điều chuyển thay vì đặt mới:
                                    </p>
                                    <div className="space-y-2">
                                      {item.otherStocks.map((stock: any) => (
                                        <div key={stock.warehouse} className="flex items-center justify-between p-2 bg-black/20 rounded-lg border border-white/5">
                                          <div className="flex items-center gap-2">
                                            <MapPin size={10} className="text-gray-500" />
                                            <span className="text-[10px] font-bold text-gray-300">Kho {stock.warehouse}</span>
                                          </div>
                                          <div className="flex items-center gap-4">
                                            <span className="text-[10px] font-black text-emerald-400">{formatNumber(stock.stock)}sp</span>
                                            <button className="text-[9px] font-black text-indigo-400 hover:underline">ĐIỀU CHUYỂN</button>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                <button className="w-full mt-4 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all">
                                  Xem lịch sử PO
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatusCard({ title, value, icon, color, sub }: any) {
  const bgColors: any = { rose: 'bg-rose-500/10', amber: 'bg-amber-500/10', emerald: 'bg-emerald-500/10', indigo: 'bg-indigo-500/10' };
  return (
    <div className="glass-panel group hover:border-white/10 transition-all flex items-center justify-between p-6">
      <div className="flex flex-col h-full justify-between">
        <div>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{title}</p>
          <h4 className="text-3xl font-black text-white mt-2 tracking-tight">{value}</h4>
        </div>
        <p className="text-[9px] font-bold text-gray-600 mt-4 group-hover:text-gray-400 transition-colors uppercase italic">{sub}</p>
      </div>
      <div className={`p-4 ${bgColors[color]} rounded-2xl shadow-xl self-start group-hover:scale-110 transition-transform`}>{icon}</div>
    </div>
  );
}

function CalculationRow({ label, value, emphasis = false, color = "text-gray-300" }: any) {
  return (
    <div className="flex justify-between items-center text-[11px]">
      <span className="text-gray-500 font-bold">{label}</span>
      <span className={`${emphasis ? 'text-sm font-black' : 'font-bold'} ${color}`}>{value}</span>
    </div>
  )
}
