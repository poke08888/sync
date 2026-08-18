"use client";

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Users, UserPlus, Repeat, Target, ArrowUpRight } from 'lucide-react';
import { formatNumber } from '@/lib/utils';

const COLORS = ['#6366F1', '#10B981'];

const buyerData = [
  { name: 'New Buyers', value: 65 },
  { name: 'Returning', value: 35 },
];

const trendData = [
  { month: 'Jan', new: 400, returning: 120 },
  { month: 'Feb', new: 300, returning: 150 },
  { month: 'Mar', new: 500, returning: 180 },
  { month: 'Apr', new: 450, returning: 220 },
  { month: 'May', new: 600, returning: 280 },
];

const cohortData = [
  { month: 'Jan 2024', size: 1200, m1: '100%', m2: '12%', m3: '8%', m4: '5%' },
  { month: 'Feb 2024', size: 950, m1: '100%', m2: '10%', m3: '7%', m4: '' },
  { month: 'Mar 2024', size: 1100, m1: '100%', m2: '14%', m3: '', m4: '' },
  { month: 'Apr 2024', size: 800, m1: '100%', m2: '', m3: '', m4: '' },
];

export default function CustomersPage() {
  return (
    <div className="flex flex-col gap-8 pb-20">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Trí tuệ Khách hàng</h1>
        <p className="text-gray-400 mt-2">Phân tích sâu về hành vi mua hàng, tỷ lệ giữ chân và giá trị vòng đời khách hàng.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <MetricCard title="Ước tính LTV" value="₫1.450k" sub="Vòng đời TB: 14 tháng" icon={<Target size={20} className="text-indigo-400" />} color="indigo" />
        <MetricCard title="CAC Blended" value="₫125k" sub="Mục tiêu: ₫150k" icon={<UserPlus size={20} className="text-emerald-400" />} color="emerald" />
        <MetricCard title="Tỷ lệ quay lại" value="34.2%" sub="+2.1% so với tháng trước" icon={<Repeat size={20} className="text-pink-400" />} color="pink" />
        <MetricCard title="Tổng số khách" value="12.450" sub="Cả 5 Brand" icon={<Users size={20} className="text-amber-400" />} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-panel lg:col-span-1 min-h-[400px]">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Khách mới vs Khách quay lại</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={buyerData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {buyerData.map((_, index) => <Cell key={index} fill={COLORS[index]} stroke="none" />)}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-8 mt-4">
             <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-indigo-500"></div><span className="text-xs text-gray-300">Mới (65%)</span></div>
             <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div><span className="text-xs text-gray-300">Quay lại (35%)</span></div>
          </div>
        </div>

        <div className="glass-panel lg:col-span-2 min-h-[400px]">
           <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Xu hướng Khách hàng</h3>
           <div className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={trendData}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                 <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                 <YAxis hide />
                 <RechartsTooltip />
                 <Line type="monotone" dataKey="new" stroke="#6366f1" strokeWidth={3} dot={false} />
                 <Line type="monotone" dataKey="returning" stroke="#10b981" strokeWidth={3} dot={false} />
               </LineChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>

      {/* Cohort Retention Table */}
      <div className="glass-panel overflow-hidden">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 px-2">Phân tích Cohort Retention (%)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 uppercase text-[10px] font-black text-gray-500 tracking-tighter">
                <th className="p-4 rounded-tl-xl">Tháng gia nhập (Cohort)</th>
                <th className="p-4">Quy mô nhóm</th>
                <th className="p-4">Tháng 1</th>
                <th className="p-4">Tháng 2</th>
                <th className="p-4">Tháng 3</th>
                <th className="p-4 rounded-tr-xl">Tháng 4</th>
              </tr>
            </thead>
            <tbody>
              {cohortData.map((row) => (
                <tr key={row.month} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 text-sm font-bold text-white">{row.month}</td>
                  <td className="p-4 text-sm text-gray-400">{formatNumber(row.size)} khách</td>
                  <td className="p-4"><Badge percent={row.m1} /></td>
                  <td className="p-4"><Badge percent={row.m2} /></td>
                  <td className="p-4"><Badge percent={row.m3} /></td>
                  <td className="p-4"><Badge percent={row.m4} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, sub, icon, color }: any) {
  const bgColors: any = { indigo: 'bg-indigo-500/10', emerald: 'bg-emerald-500/10', pink: 'bg-pink-500/10', amber: 'bg-amber-500/10' };
  return (
    <div className="glass-panel flex items-start justify-between">
      <div>
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{title}</p>
        <h4 className="text-2xl font-black text-white mt-1">{value}</h4>
        <p className="text-xs text-gray-500 mt-1">{sub}</p>
      </div>
      <div className={`p-3 ${bgColors[color]} rounded-xl`}>{icon}</div>
    </div>
  );
}

function Badge({ percent }: { percent: string }) {
  if (!percent) return null;
  const val = parseInt(percent);
  let opacity = 'opacity-20';
  if (val >= 100) opacity = 'opacity-100';
  else if (val >= 15) opacity = 'opacity-80';
  else if (val >= 10) opacity = 'opacity-50';
  else if (val >= 5) opacity = 'opacity-30';

  return (
    <div className={`px-2 py-1 rounded text-[10px] font-bold text-center bg-indigo-500 text-white ${opacity}`}>
      {percent}
    </div>
  );
}
