import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useKocStore } from '../store/useKocStore';
import { 
  BarChart3, 
  ShoppingCart, 
  Package, 
  Megaphone, 
  Settings,
  LogOut,
  Menu,
  Video,
  Store
} from 'lucide-react';

export default function DashboardLayout({ children, activeTab, setActiveTab }) {
  const { user, setRole } = useAuthStore();
  const { kocList } = useKocStore();

  const navigation = [
    { name: 'KOC Live', icon: Video, badge: kocList.length > 0 ? kocList.length : null },
    { name: 'Orders', icon: ShoppingCart },
    { name: 'Inventory', icon: Package },
    { name: 'Ads Performance', icon: Megaphone },
    { name: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-border hidden md:flex flex-col">
        <div className="p-4 border-b border-border">
          <h1 className="text-xl font-bold text-pantone-293 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-pantone-light" />
            EcomDash
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigation.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors duration-200 ${
                activeTab === item.name 
                  ? 'bg-pantone-293 text-white' 
                  : 'text-textMuted hover:bg-pantone-293/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5" />
                {item.name}
              </div>
              {item.badge && (
                <span className="bg-pantone-light text-pantone-293 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-pantone-293 flex items-center justify-center text-white font-bold">
              {user.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium text-white">{user.name}</p>
              <p className="text-xs text-pantone-light capitalize">{user.role}</p>
            </div>
          </div>
          
          <select 
            value={user.role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full bg-background border border-border rounded px-2 py-1 text-xs text-textMuted mb-2 outline-none"
          >
            <option value="ceo">View as: CEO</option>
            <option value="brand_manager">View as: Brand Manager</option>
            <option value="media_buyer">View as: Media Buyer</option>
          </select>

          <button className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-textMuted hover:bg-red-500/10 hover:text-red-400 transition-colors duration-200">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header (Mobile) */}
        <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-4 md:hidden">
          <h1 className="text-xl font-bold text-pantone-light">EcomDash</h1>
          <button className="text-textMuted">
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
