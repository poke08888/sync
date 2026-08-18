"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { TrendingUp, MousePointer2, Megaphone, Zap, BarChart3 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

const adsData = [
  { platform: 'TikTok Ads', spend: 85000, revenue: 310000, roas: 3.65 },
  { platform: 'Shopee Ads', spend: 45000, revenue: 180000, roas: 4.00 },
  { platform: 'KOC & Social', spend: 20000, revenue: 85000, roas: 4.25 },
];

const creativePerformance = [
  { id: 1, name: 'Hero Video: Silk Mask', ctr: 2.1, roas: 4.2, thumb: '🎥' },
  { id: 2, name: 'Product Demo: Gown', ctr: 1.8, roas: 3.8, thumb: '🎥' },
  { id: 3, name: 'Customer Review: Serum', ctr: 2.5, roas: 4.5, thumb: '🎥' },
  { id: 4, name: 'Unboxing: Home Luxe', ctr: 1.2, roas: 2.9, thumb: '🎥' },
];

export default function MarketingPage() {
  const totalSpend = adsData.reduce((s, a) => s + a.spend, 0);
  const totalRev = adsData.reduce((s, a) => s + a.revenue, 0);
  const blendedRoas = totalRev / totalSpend;

  return (
    <div className="flex flex-col gap-8 pb-20">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Hiệu quả Marketing & Nguồn thu</h1>
        <p className="text-gray-400 mt-2">Theo dõi hiệu suất tổng hợp, chỉ số MER và hiệu quả nội dung trên tất cả các nền tảng.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <SummaryCard title="ROAS Tổng hợp" value={`${blendedRoas.toFixed(2)}x`} sub="Tổng doanh thu / Chi quảng cáo" icon={<TrendingUp size={20} className="text-emerald-400" />} />
        <SummaryCard title="Chỉ số MER" value="21%" sub="Chi quảng cáo / Tổng doanh thu" icon={<Zap size={20} className="text-amber-400" />} />
        <SummaryCard title="Avg. CPM" value="₫12.400" sub="Tất cả nền tảng" icon={<MousePointer2 size={20} className="text-indigo-400" />} />
        <SummaryCard title="Tổng chi QC" value={`₫${(totalSpend/1000).toFixed(0)}k`} sub="Lũy kế tháng" icon={<Megaphone size={20} className="text-pink-400" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Spend vs Revenue per Platform */}
        <div className="lg:col-span-2 glass-panel min-h-[450px]">
           <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">Chi phí vs Doanh thu theo Nền tảng</h3>
           <div className="h-[350px]">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={adsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                 <XAxis dataKey="platform" axisLine={false} tickLine={false} tick={{fill: '#4b5563', fontSize: 12}} />
                 <YAxis hide />
                 <Tooltip 
                   cursor={{ fill: '#ffffff05' }}
                   content={({ active, payload }) => {
                     if (active && payload && payload.length) {
                       return (
                         <div className="bg-[#1A1E29] border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-md">
                            <p className="text-xs font-black text-white mb-2">{payload[0].payload.platform}</p>
                            <p className="text-xs text-indigo-400 font-bold">Doanh thu: {formatCurrency(payload[1].value)}</p>
                            <p className="text-xs text-gray-500 font-bold">Chi phí: {formatCurrency(payload[0].value)}</p>
                            <div className="h-px bg-white/5 my-2"></div>
                            <p className="text-sm font-black text-emerald-500">ROAS: {payload[0].payload.roas}x</p>
                         </div>
                       )
                     }
                     return null;
                   }}
                 />
                 <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold' }} />
                 <Bar dataKey="spend" name="Ad Spend" fill="#6366f140" radius={[4, 4, 0, 0]} barSize={40} />
                 <Bar dataKey="revenue" name="Revenue" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Top Creatives */}
        <div className="lg:col-span-1 glass-panel">
           <div className="flex items-center justify-between mb-8">
             <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Nội dung hiệu quả nhất</h3>
             <BarChart3 size={16} className="text-gray-600" />
           </div>
           
           <div className="flex flex-col gap-6">
              {creativePerformance.map(creative => (
                <div key={creative.id} className="group cursor-pointer">
                   <div className="flex items-center justify-between gap-4 mb-2">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-xl group-hover:bg-white/10 transition-all">
                            {creative.thumb}
                         </div>
                         <div className="flex flex-col">
                            <span className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors">{creative.name}</span>
                            <span className="text-[10px] text-gray-500 uppercase font-black">CTR: {creative.ctr}%</span>
                         </div>
                      </div>
                      <div className="text-sm font-black text-white">{creative.roas}x</div>
                   </div>
                   <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 transition-all duration-1000" 
                        style={{ width: `${(creative.roas / 5) * 100}%` }}
                      ></div>
                   </div>
                </div>
              ))}
           </div>

           <button className="w-full mt-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-gray-400 hover:text-white transition-all transition-all">
              Xem chi tiết hiệu suất tất cả nội dung
           </button>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, sub, icon }: any) {
  return (
    <div className="glass-panel flex flex-col gap-2 relative overflow-hidden group">
      <div className="flex justify-between items-start">
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{title}</p>
        <div className="p-2 transition-transform group-hover:scale-110 duration-500">{icon}</div>
      </div>
      <h4 className="text-2xl font-black text-white">{value}</h4>
      <p className="text-[10px] text-gray-400 font-bold">{sub}</p>
    </div>
  );
}
