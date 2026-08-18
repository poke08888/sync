"use client";

import React, { useState, useEffect } from 'react';
import { CheckCircle2, Calendar, Package, ArrowRight, Loader2, AlertTriangle, ChevronLeft } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { formatNumber } from '@/lib/utils';

export default function PoConfirmPage() {
  const router = useRouter();
  const params = useParams();
  const poNumber = params.po_number as string;

  const [po, setPo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [reason, setReason] = useState('');
  const [view, setView] = useState<'selection' | 'extend'>('selection');

  useEffect(() => {
    // Trong thực tế sẽ fetch PO từ API, ở đây demo ta sẽ giả định data hoặc làm API fetch
    async function fetchPo() {
      // Giả lập fetch
      setLoading(false);
      // setPo(data);
    }
    fetchPo();
  }, [poNumber]);

  const handleConfirmArrived = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/po/${poNumber}/confirm`, { method: 'PATCH' });
      if (res.ok) {
        router.push('/inventory?message=confirmed');
      }
    } catch (error) {
       console.error(error);
    } finally {
       setActionLoading(false);
    }
  };

  const handleExtend = async () => {
    if (!newDate) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/po/${poNumber}/extend`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newDate, reason }),
      });
      if (res.ok) {
        router.push('/inventory?message=extended');
      }
    } catch (error) {
       console.error(error);
    } finally {
       setActionLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-40">
      <Loader2 className="animate-spin text-indigo-500" />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <button 
        onClick={() => router.push('/inventory')}
        className="flex items-center gap-2 text-gray-500 text-sm font-bold hover:text-white transition-all mb-8"
      >
        <ChevronLeft size={16} /> Quay lại Dashboard
      </button>

      <div className="glass-panel p-8 flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-indigo-500/20 rounded-2xl text-indigo-400">
            <Package size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Xác nhận Đơn hàng #{poNumber}</h1>
            <p className="text-sm text-gray-500 font-medium">Hàng dự kiến về kho vào hôm nay.</p>
          </div>
        </div>

        {view === 'selection' ? (
          <div className="grid grid-cols-1 gap-4">
            <button
               onClick={handleConfirmArrived}
               disabled={actionLoading}
               className="group p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between hover:bg-emerald-500/20 transition-all text-left"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400 group-hover:scale-110 transition-transform">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <div className="text-lg font-black text-white">Hàng đã về kho</div>
                  <div className="text-xs text-gray-500 font-bold">Cập nhật trạng thái thành 'Đã nhận' và tính lại tồn kho.</div>
                </div>
              </div>
              <ArrowRight size={20} className="text-emerald-500" />
            </button>

            <button
               onClick={() => setView('extend')}
               disabled={actionLoading}
               className="group p-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-between hover:bg-amber-500/20 transition-all text-left"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-500/20 rounded-xl text-amber-400 group-hover:scale-110 transition-transform">
                  <Calendar size={24} />
                </div>
                <div>
                  <div className="text-lg font-black text-white">Gia hạn / Bị chậm trễ</div>
                  <div className="text-xs text-gray-500 font-bold">Hàng chưa về, cần lùi ngày dự kiến.</div>
                </div>
              </div>
              <ArrowRight size={20} className="text-amber-500" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6 animate-in slide-in-from-right duration-300">
             <div>
               <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2 px-1">Ngày dự kiến mới</label>
               <input 
                 type="date"
                 value={newDate}
                 onChange={(e) => setNewDate(e.target.value)}
                 className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none" 
               />
             </div>
             <div>
               <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2 px-1">Lý do chậm trễ (tùy chọn)</label>
               <textarea 
                 value={reason}
                 onChange={(e) => setReason(e.target.value)}
                 placeholder="Ví dụ: Tắc biên, đơn vị vận chuyển chậm..."
                 className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none h-24" 
               />
             </div>
             <div className="flex gap-4">
                <button 
                  onClick={() => setView('selection')}
                  className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400"
                >
                  Quay lại
                </button>
                <button 
                  onClick={handleExtend}
                  disabled={actionLoading || !newDate}
                  className="flex-[2] py-3 bg-amber-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-amber-600/20 disabled:opacity-50"
                >
                  {actionLoading ? <Loader2 className="animate-spin inline mr-2" size={14}/> : null}
                  Xác nhận gia hạn
                </button>
             </div>
          </div>
        )}

      </div>

      <div className="mt-8 bg-indigo-500/[0.03] border border-indigo-500/10 rounded-2xl p-6 flex items-start gap-4">
         <AlertTriangle size={20} className="text-indigo-400 shrink-0" />
         <div className="text-xs text-gray-500 leading-relaxed font-medium">
            Lưu ý: Việc xác nhận hàng về sẽ cập nhật "Net Stock" của sản phẩm, ảnh hưởng đến các cảnh báo tái cung ứng trên hệ thống. 
            Lịch sử chậm trễ sẽ được ghi lại để đánh giá độ tin cậy của nhà cung cấp.
         </div>
      </div>
    </div>
  );
}
