import React, { useState, useEffect } from 'react';
import { 
  Store, 
  Tag, 
  ShieldCheck, 
  RefreshCw, 
  Plus, 
  Trash2, 
  Unlink, 
  ShoppingBag,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Bell
} from 'lucide-react';
import { tiktokService } from '../../services/tiktokService';

export default function TikTokSettingsView() {
  const [activeTab, setActiveTab] = useState('shops');
  const [data, setData] = useState({ shops: [], apps: [], brands: [] });
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [status, setStatus] = useState(null);
  const [showAppForm, setShowAppForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await tiktokService.getSettings();
      setData(res);
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: 'Không thể kết nối tới Backend Laravel (127.0.0.1:8000). Vui lòng kiểm tra Server.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    try {
      setSyncing(true);
      const res = await tiktokService.syncAll();
      setStatus({ type: 'success', message: res.status || 'Đã đồng bộ xong!' });
      fetchData();
    } catch (err) {
      setStatus({ type: 'error', message: 'Lỗi đồng bộ dữ liệu.' });
    } finally {
      setSyncing(false);
    }
  };

  const handleRegisterWebhooks = async () => {
    try {
      setRegistering(true);
      const res = await tiktokService.registerWebhooks();
      setStatus({ type: 'success', message: res.status || 'Đã kích hoạt Webhook thành công!' });
    } catch (err) {
      setStatus({ type: 'error', message: 'Lỗi kích hoạt Webhook. Đảm bảo server có URL công khai (Ngrok).' });
    } finally {
      setRegistering(false);
    }
  };

  const handleUpdateBrand = async (shopId, brandId) => {
    try {
      await tiktokService.updateShopBrand(shopId, brandId);
      setStatus({ type: 'success', message: 'Đã cập nhật thương hiệu.' });
      fetchData();
    } catch (err) {
      setStatus({ type: 'error', message: 'Lỗi cập nhật thương hiệu.' });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-textMuted">
        <Loader2 className="w-8 h-8 animate-spin mb-2" />
        <p>Đang tải dữ liệu từ Laravel...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sub-Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pantone-293/10 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-pantone-293" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white uppercase tracking-tight">TikTok API Configuration</h2>
            <p className="text-xs text-textMuted uppercase font-semibold">Active Layer Access</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleRegisterWebhooks}
            disabled={registering}
            className="flex items-center gap-2 px-6 py-2 bg-surface border border-border text-white font-bold rounded-xl hover:bg-white/5 transition-all shadow-lg active:scale-95 disabled:opacity-50"
          >
            {registering ? <Loader2 className="w-5 h-5 animate-spin" /> : <Bell className="w-5 h-5" />}
            {registering ? 'Đang kích hoạt...' : 'Kích hoạt Webhook Realtime'}
          </button>
          <button 
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-2 px-6 py-2 bg-white text-background font-bold rounded-xl hover:bg-pantone-light transition-all shadow-lg active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Đang đồng bộ...' : 'Đồng bộ dữ liệu'}
          </button>
        </div>
      </div>

      {status && (
        <div className={`p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 ${
          status.type === 'success' ? 'bg-positive/10 text-positive border border-positive/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
        }`}>
          {status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="font-medium">{status.message}</span>
          <button onClick={() => setStatus(null)} className="ml-auto text-sm opacity-50 hover:opacity-100">Đóng</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-8 border-b border-border">
        {[
          { id: 'shops', label: 'Danh sách Shop', icon: Store },
          { id: 'brands', label: 'Quản lý Thương hiệu', icon: Tag },
          { id: 'apps', label: 'Partner Apps', icon: ShieldCheck },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 py-4 px-1 border-b-2 transition-all font-semibold ${
              activeTab === tab.id ? 'border-pantone-293 text-pantone-293' : 'border-transparent text-textMuted hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Panes */}
      <div className="mt-6">
        {activeTab === 'shops' && (
          <ShopsPane 
            shops={data.shops} 
            apps={data.apps} 
            brands={data.brands} 
            onUpdateBrand={handleUpdateBrand}
            onConnect={(appId) => window.location.href = tiktokService.getConnectUrl(appId)}
          />
        )}
        {activeTab === 'brands' && (
          <BrandsPane 
            brands={data.brands} 
            onRefresh={fetchData}
            onStatus={setStatus}
          />
        )}
        {activeTab === 'apps' && (
          <AppsPane 
            apps={data.apps} 
            onRefresh={fetchData}
            onStatus={setStatus}
          />
        )}
      </div>
    </div>
  );
}

function ShopsPane({ shops, apps, brands, onUpdateBrand, onConnect }) {
  const [selectedApp, setSelectedApp] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Shops hiện có</h2>
        <div className="flex gap-2">
          <select 
            value={selectedApp}
            onChange={(e) => setSelectedApp(e.target.value)}
            className="bg-background border border-border text-white text-sm rounded-lg px-4 py-2 outline-none focus:border-pantone-293"
          >
            <option value="">-- Chọn Partner App --</option>
            {apps.map(app => <option key={app.id} value={app.id}>{app.name}</option>)}
          </select>
          <button 
            disabled={!selectedApp}
            onClick={() => onConnect(selectedApp)}
            className="flex items-center gap-2 px-4 py-2 bg-pantone-293 text-white font-bold rounded-lg hover:bg-pantone-light transition-colors disabled:opacity-50"
          >
            <Plus className="w-4 h-4" /> Kết nối Shop mới
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shops.map(shop => (
          <div key={shop.id} className="bg-surface border border-border p-5 rounded-2xl hover:border-pantone-293/50 transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-3">
                <div className="w-12 h-12 bg-pantone-293/10 rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-pantone-293" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">{shop.shop_name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      new Date(shop.expires_at) > new Date() ? 'bg-positive/10 text-positive' : 'bg-red-500/10 text-red-500'
                    }`}>
                      {new Date(shop.expires_at) > new Date() ? 'ACTIVE' : 'EXPIRED'}
                    </span>
                    <span className="text-[10px] text-textMuted">ID: {shop.shop_id}</span>
                  </div>
                </div>
              </div>
              <button className="p-2 text-textMuted hover:text-red-500 transition-colors">
                <Unlink className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 pt-4 border-t border-border">
              <div className="flex items-center justify-between text-sm">
                <span className="text-textMuted">Thương hiệu:</span>
                <select 
                  value={shop.brand_id || ''}
                  onChange={(e) => onUpdateBrand(shop.shop_id, e.target.value)}
                  className="bg-background border border-border text-white text-xs rounded-md px-2 py-1 outline-none focus:border-pantone-293"
                >
                  <option value="">-- Chưa gán --</option>
                  {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-textMuted">Hết hạn:</span>
                <span className="text-white font-medium">{new Date(shop.expires_at).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>
          </div>
        ))}
        {shops.length === 0 && (
          <div className="col-span-full py-12 border-2 border-dashed border-border rounded-3xl flex flex-col items-center text-textMuted">
            <Store className="w-12 h-12 opacity-20 mb-4" />
            <p>Chưa có shop nào được liên kết.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function BrandsPane({ brands, onRefresh, onStatus }) {
  const [newName, setNewName] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await tiktokService.saveBrand(newName);
      setNewName('');
      onRefresh();
      onStatus({ type: 'success', message: 'Đã thêm thương hiệu.' });
    } catch (err) {
      onStatus({ type: 'error', message: 'Lỗi thêm thương hiệu.' });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Xóa thương hiệu này?')) return;
    try {
      await tiktokService.deleteBrand(id);
      onRefresh();
      onStatus({ type: 'success', message: 'Đã xóa thương hiệu.' });
    } catch (err) {
      onStatus({ type: 'error', message: 'Lỗi xóa thương hiệu.' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Thương hiệu của tôi</h2>
        <form onSubmit={handleAdd} className="flex gap-2">
          <input 
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Tên thương hiệu..."
            className="bg-background border border-border text-white text-sm rounded-lg px-4 py-2 outline-none focus:border-pantone-293 w-64"
          />
          <button className="px-4 py-2 bg-pantone-293 text-white font-bold rounded-lg hover:bg-pantone-light transition-colors">
            Thêm
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {brands.map(brand => (
          <div key={brand.id} className="bg-surface border border-border p-4 rounded-xl flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <Tag className="w-5 h-5 text-pantone-293" />
              <span className="font-semibold text-white">{brand.name}</span>
            </div>
            <button 
              onClick={() => handleDelete(brand.id)}
              className="p-1.5 text-textMuted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AppsPane({ apps, onRefresh, onStatus }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', app_key: '', app_secret: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await tiktokService.saveApp(formData);
      setShowForm(false);
      setFormData({ name: '', app_key: '', app_secret: '' });
      onRefresh();
      onStatus({ type: 'success', message: 'Đã lưu Partner App.' });
    } catch (err) {
      onStatus({ type: 'error', message: 'Lỗi lưu dữ liệu.' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Partner Apps</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-pantone-293 text-white font-bold rounded-lg hover:bg-pantone-light transition-colors"
        >
          <Plus className="w-4 h-4" /> Thêm App mới
        </button>
      </div>

      {showForm && (
        <div className="p-6 bg-surface border-2 border-pantone-293/30 rounded-2xl animate-in zoom-in-95 duration-200">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-textMuted mb-2 block uppercase tracking-wider">Tên App</label>
                <input 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-background border border-border text-white text-sm rounded-lg px-4 py-2 outline-none focus:border-pantone-293"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-textMuted mb-2 block uppercase tracking-wider">App Key</label>
                <input 
                  required
                  value={formData.app_key}
                  onChange={(e) => setFormData({...formData, app_key: e.target.value})}
                  className="w-full bg-background border border-border text-white text-sm rounded-lg px-4 py-2 outline-none focus:border-pantone-293"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-textMuted mb-2 block uppercase tracking-wider">App Secret</label>
                <input 
                  required
                  type="password"
                  value={formData.app_secret}
                  onChange={(e) => setFormData({...formData, app_secret: e.target.value})}
                  className="w-full bg-background border border-border text-white text-sm rounded-lg px-4 py-2 outline-none focus:border-pantone-293"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button 
                type="button" 
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-textMuted font-bold hover:text-white"
              >
                Hủy
              </button>
              <button type="submit" className="px-6 py-2 bg-pantone-293 text-white font-bold rounded-lg hover:bg-pantone-light">
                Lưu cấu hình
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {apps.map(app => (
          <div key={app.id} className="bg-surface border border-border p-4 rounded-xl flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center text-pantone-293">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white">{app.name}</h4>
                <p className="text-xs text-textMuted font-mono">KEY: {app.app_key}</p>
              </div>
            </div>
            <button className="p-2 text-textMuted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
