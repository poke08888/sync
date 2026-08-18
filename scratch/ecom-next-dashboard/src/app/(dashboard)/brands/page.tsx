"use client";

import React from 'react';
import { 
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  ReferenceLine, Label
} from 'recharts';
import { TrendingUp, DollarSign, PieChart, Activity, Info } from 'lucide-react';

const brandsPnL = [
  { name: 'Macaron Cos', revenue: 450000, netRev: 380000, adSpend: 120000, cogs: 150000, profit: 110000, margin: 24.4, roas: 3.75, growth: 25 },
  { name: 'Tech Haven', revenue: 320000, netRev: 280000, adSpend: 80000, cogs: 120000, profit: 80000, margin: 25.0, roas: 4.00, growth: 12 },
  { name: 'Aura Beauty', revenue: 240000, netRev: 210000, adSpend: 90000, cogs: 60000, profit: 60000, margin: 25.0, roas: 2.67, growth: 45 },
  { name: 'Daily Fits', revenue: 150000, netRev: 130000, adSpend: 40000, cogs: 50000, profit: 40000, margin: 26.6, roas: 3.75, growth: -5 },
  { name: 'Home Luxe', revenue: 70000, netRev: 62000, adSpend: 15000, cogs: 30000, profit: 17000, margin: 24.2, roas: 4.67, growth: 8 },
];

const COLORS = ['#6366F1', '#EC4899', '#F59E0B', '#10B981', '#8B5CF6'];

export default function BrandsPage() {
  const totalRevenue = brandsPnL.reduce((s, b) => s + b.revenue, 0);

  return (
    <div className="flex flex-col gap-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Danh mục Tài chính Thương hiệu (P&L)</h1>
          <p className="text-gray-400 mt-2">Tổng quan hiệu quả tài chính và phân loại chiến lược cho cả 5 thương hiệu.</p>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-[#1A1E29] border border-white/10 rounded-xl text-xs font-bold text-gray-400 hover:text-white transition-all">Tải báo cáo</button>
           <button className="px-4 py-2 bg-indigo-500 text-white rounded-xl text-xs font-bold hover:bg-indigo-400 transition-all shadow-lg shadow-indigo-500/20">Họp chiến lược</button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 text-center sm:text-left">
        {/* P&L Table */}
        <div className="xl:col-span-2 glass-panel overflow-hidden">
           <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Tổng hợp Đa thương hiệu</h3>
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-white/5 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                   <th className="p-4">Thương hiệu</th>
                   <th className="p-4">Doanh thu</th>
                   <th className="p-4">Chi quảng cáo</th>
                   <th className="p-4">Lợi nhuận gộp</th>
                   <th className="p-4">Biên gộp %</th>
                   <th className="p-4">ROAS</th>
                   <th className="p-4">% Tổng</th>
                 </tr>
               </thead>
               <tbody>
                 {brandsPnL.map((brand, idx) => (
                   <tr key={brand.name} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                     <td className="p-4">
                        <div className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
                           <span className="text-sm font-bold text-white">{brand.name}</span>
                        </div>
                     </td>
                     <td className="p-4 text-sm font-bold text-gray-300">₫{(brand.revenue/1000).toFixed(0)}k</td>
                     <td className="p-4 text-sm text-gray-500">₫{(brand.adSpend/1000).toFixed(0)}k</td>
                     <td className="p-4 text-sm font-bold text-emerald-400">₫{(brand.profit/1000).toFixed(0)}k</td>
                     <td className="p-4 text-sm text-white font-medium">{brand.margin}%</td>
                     <td className="p-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${brand.roas >= 4 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                          {brand.roas.toFixed(2)}x
                        </span>
                     </td>
                     <td className="p-4">
                        <span className="text-[10px] font-black text-gray-600">
                          {((brand.revenue / totalRevenue) * 100).toFixed(0)}%
                        </span>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>

        {/* Quadrant Chart */}
        <div className="xl:col-span-1 glass-panel flex flex-col min-h-[500px]">
           <div className="flex items-center justify-between mb-6">
             <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Tăng trưởng vs Biên lợi nhuận</h3>
             <Info size={16} className="text-gray-600" />
           </div>
           
           <div className="flex-1 w-full min-h-[350px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff03" />
                  <XAxis 
                    type="number" 
                    dataKey="margin" 
                    name="Margin" 
                    unit="%" 
                    domain={[20, 30]} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#4b5563', fontSize: 10}}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="growth" 
                    name="Growth" 
                    unit="%" 
                    domain={[-10, 60]} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#4b5563', fontSize: 10}}
                  />
                  <ZAxis type="number" dataKey="revenue" range={[100, 1000]} />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }} 
                    content={({ payload }) => {
                       if (payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                             <div className="bg-[#1A1E29] border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-md">
                                <p className="text-xs font-black text-white">{data.name}</p>
                                <p className="text-[10px] text-gray-500 mt-1 uppercase">Growth: {data.growth}%</p>
                                <p className="text-[10px] text-emerald-400 font-bold">Margin: {data.margin}%</p>
                             </div>
                          )
                       }
                       return null;
                    }}
                  />
                  <ReferenceLine x={25} stroke="#ffffff10" />
                  <ReferenceLine y={15} stroke="#ffffff10" />
                  <Scatter name="Brands" data={brandsPnL}>
                    {brandsPnL.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
              
              {/* Labels for Quadrants */}
              <div className="absolute top-2 right-2 text-[8px] font-black text-indigo-400 uppercase tracking-widest opacity-40">Ngôi sao</div>
              <div className="absolute top-2 left-2 text-[8px] font-black text-amber-400 uppercase tracking-widest opacity-40">Thách thức</div>
              <div className="absolute bottom-10 right-2 text-[8px] font-black text-emerald-400 uppercase tracking-widest opacity-40">Bò sữa</div>
              <div className="absolute bottom-10 left-2 text-[8px] font-black text-rose-400 uppercase tracking-widest opacity-40">Nguy cơ</div>
           </div>

           <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
              <div className="flex justify-between items-center text-[10px]">
                 <span className="text-gray-500 font-medium italic">Kích thước bóng = Doanh thu Thương hiệu</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
