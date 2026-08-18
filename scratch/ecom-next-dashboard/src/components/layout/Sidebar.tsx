"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, BarChart3, Users, Settings, LogOut, Box, Radio } from "lucide-react";
import { useAuth } from '@/context/AuthContext';

const NAV_ITEMS = [
  { href: '/', label: 'Tổng quan', icon: LayoutDashboard },
  { href: '/koc-live', label: 'KOC Live', icon: Radio },
  { href: '/brands', label: 'Thương hiệu', icon: ShoppingBag },
  { href: '/marketing', label: 'Marketing & Ads', icon: BarChart3 },
  { href: '/inventory', label: 'Kho hàng', icon: Box },
  { href: '/customers', label: 'Khách hàng', icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { role, setRole } = useAuth();
  const [activeKocCount, setActiveKocCount] = React.useState<number>(0);

  React.useEffect(() => {
    // Read from localStorage to show badge
    const saved = localStorage.getItem('koc_sessions');
    if (saved) {
      try {
        const sessions = JSON.parse(saved);
        const uniqueKocs = new Set(sessions.map((s: any) => s.creatorId));
        setActiveKocCount(uniqueKocs.size);
      } catch(e) {}
    }
  }, [pathname]); // Refresh on navigation

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="flex flex-row items-center gap-3">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
            <ShoppingBag size={18} color="white" />
          </div>
          <div className="logo-text text-white font-bold text-lg tracking-tight">Ecom OS</div>
        </div>
      </div>
      
      <nav className="nav-links flex-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          const isKocLive = item.href === '/koc-live';
          
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              className={`nav-item flex items-center justify-between ${isActive ? 'active' : ''}`}
            >
              <div className="flex items-center gap-3">
                <Icon size={20} />
                <span>{item.label}</span>
              </div>
              {isKocLive && activeKocCount > 0 && (
                <span className="bg-indigo-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-lg shadow-indigo-500/20">
                  {activeKocCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto p-4 flex flex-col gap-2 border-t border-white/5">
        {/* Role Switcher (Mock Auth) */}
        <div className="mb-4 p-3 bg-white/[0.03] rounded-xl border border-white/5">
          <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2 px-1">Quyền truy cập</div>
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value as any)}
            className="w-full bg-[#151821] text-xs font-bold text-white p-2 rounded-lg border border-white/10 outline-none focus:border-indigo-500"
          >
            <option value="CEO">👑 CEO (Full Access)</option>
            <option value="WAREHOUSE_ADMIN">📦 Warehouse Admin</option>
            <option value="BRAND_MANAGER">📊 Brand Manager</option>
          </select>
        </div>

        <Link 
          href="/settings" 
          className={`nav-item ${pathname === '/settings' ? 'active' : ''}`}
        >
          <Settings size={20} />
          <span>Cài đặt</span>
        </Link>
        <button className="nav-item text-rose-500 hover:bg-rose-500/10 transition-colors text-left w-full">
          <LogOut size={20} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}
