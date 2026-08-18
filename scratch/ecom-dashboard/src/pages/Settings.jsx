import React, { useState } from 'react';
import { Settings as SettingsIcon, ShieldCheck, User, Bell, Layout } from 'lucide-react';
import TikTokSettingsView from '../components/tiktok/TikTokSettingsView';

export default function Settings() {
  const [activeSubTab, setActiveSubTab] = useState('tiktok');

  const menuItems = [
    { id: 'tiktok', label: 'Kết nối TikTok API', icon: ShieldCheck, description: 'Quản lý Shop, App Key và Brand mapping' },
    { id: 'profile', label: 'Tài khoản', icon: User, description: 'Thông tin cá nhân và phân quyền' },
    { id: 'notifications', label: 'Thông báo', icon: Bell, description: 'Cài đặt cảnh báo doanh số & đơn hàng' },
    { id: 'appearance', label: 'Giao diện', icon: Layout, description: 'Tùy chỉnh Dark/Light mode và màu sắc' },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-full">
      {/* Settings Navigation */}
      <aside className="w-full lg:w-80 shrink-0">
        <div className="sticky top-6 space-y-2">
          <div className="mb-6 px-4">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <SettingsIcon className="w-6 h-6 text-pantone-light" />
              Cài đặt hệ thống
            </h1>
            <p className="text-sm text-textMuted mt-1">Quản lý cấu hình toàn diện cho Dashboard</p>
          </div>
          
          <nav className="space-y-1">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveSubTab(item.id)}
                className={`w-full text-left p-4 rounded-xl transition-all duration-200 border ${
                  activeSubTab === item.id 
                    ? 'bg-pantone-293/10 border-pantone-293/50 text-white shadow-lg' 
                    : 'border-transparent text-textMuted hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 mb-1">
                  <item.icon className={`w-5 h-5 ${activeSubTab === item.id ? 'text-pantone-light' : ''}`} />
                  <span className="font-bold">{item.label}</span>
                </div>
                <p className="text-xs opacity-60 leading-relaxed pl-8">
                  {item.description}
                </p>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Settings Content Area */}
      <main className="flex-1 bg-surface border border-border rounded-3xl p-6 lg:p-8 min-h-[600px] shadow-2xl">
        {activeSubTab === 'tiktok' && <TikTokSettingsView />}
        
        {activeSubTab !== 'tiktok' && (
          <div className="flex flex-col items-center justify-center h-full text-center py-20">
            <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mb-6">
              {menuItems.find(m => m.id === activeSubTab)?.icon({ className: "w-10 h-10 text-pantone-light opacity-20" })}
            </div>
            <h2 className="text-xl font-bold text-white mb-2 italic">Module "{menuItems.find(m => m.id === activeSubTab)?.label}" đang được nâng cấp</h2>
            <p className="text-textMuted max-w-sm">Tính năng này sẽ sớm có mặt trong các cập nhật tiếp theo của hệ thống Ecommerce Analytics.</p>
          </div>
        )}
      </main>
    </div>
  );
}
