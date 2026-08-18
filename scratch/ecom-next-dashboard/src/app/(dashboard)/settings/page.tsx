"use client";

import React, { useState, useEffect } from 'react';
import { Settings, MessageSquare, Shield, CheckCircle2, AlertCircle, Loader2, Send, ExternalLink, Info } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'bot' | 'security'>('bot');
  const [botToken, setBotToken] = useState('');
  const [chatId, setChatId] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    // Load saved config
    const savedToken = localStorage.getItem('tg_bot_token');
    const savedChatId = localStorage.getItem('tg_chat_id');
    if (savedToken) setBotToken(savedToken);
    if (savedChatId) setChatId(savedChatId);
  }, []);

  const handleSave = () => {
    localStorage.setItem('tg_bot_token', botToken);
    localStorage.setItem('tg_chat_id', chatId);
    alert('Đã lưu cấu hình!');
  };

  const handleTest = async () => {
    if (!botToken || !chatId) {
      setTestResult({ success: false, message: 'Vui lòng nhập đầy đủ Token và Chat ID' });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/notifications/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: botToken, chatId }),
      });
      const data = await res.json();
      
      if (data.success) {
        setTestResult({ success: true, message: 'Gửi tin nhắn thử nghiệm thành công! Kiểm tra điện thoại của bạn.' });
      } else {
        setTestResult({ success: false, message: data.error || 'Gửi thất bại. Vui lòng kiểm tra lại Token/Chat ID.' });
      }
    } catch (error) {
      setTestResult({ success: false, message: 'Lỗi kết nối server.' });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white tracking-tight">Cài đặt Hệ thống</h1>
        <p className="text-gray-400 mt-2">Cấu hình các kênh thông báo và quản lý quyền truy cập.</p>
      </div>

      <div className="flex gap-4 mb-8 p-1 bg-white/5 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab('bot')}
          className={`px-6 py-2 rounded-xl text-sm font-black transition-all flex items-center gap-2 ${activeTab === 'bot' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
        >
          <MessageSquare size={18} /> Cấu hình Bot
        </button>
        <button 
          onClick={() => setActiveTab('security')}
          className={`px-6 py-2 rounded-xl text-sm font-black transition-all flex items-center gap-2 ${activeTab === 'security' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
        >
          <Shield size={18} /> Bảo mật & Vai trò
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'bot' ? (
            <div className="glass-panel p-8 space-y-8">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2 px-1">Telegram Bot Token</label>
                  <input 
                    type="password"
                    value={botToken}
                    onChange={(e) => setBotToken(e.target.value)}
                    placeholder="123456789:ABCDEF..."
                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2 px-1">Chat ID (Người nhận)</label>
                  <input 
                    type="text"
                    value={chatId}
                    onChange={(e) => setChatId(e.target.value)}
                    placeholder="987654321"
                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={handleSave}
                  className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all"
                >
                  Lưu cấu hình
                </button>
                <button 
                  onClick={handleTest}
                  disabled={isTesting}
                  className="flex-1 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all flex items-center justify-center gap-2"
                >
                  {isTesting ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />}
                  Thử nghiệm Bot
                </button>
              </div>

              {testResult && (
                <div className={`p-4 rounded-xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${testResult.success ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                  {testResult.success ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                  <span className="text-xs font-bold">{testResult.message}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-panel p-8 space-y-6">
               <div className="flex items-center gap-4 p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                  <Info size={24} className="text-indigo-400" />
                  <p className="text-xs text-gray-400 font-medium leading-relaxed">
                    Bạn đang sử dụng hệ thống với vai trò <strong>Mock Auth</strong>. Để thay đổi quyền hạn truy cập (CEO / Admin Kho), vui lòng sử dụng bộ chọn tại thanh Sidebar bên trái.
                  </p>
               </div>
               
               <div className="space-y-4">
                  <RoleDescription 
                    title="Warehouse Admin" 
                    desc="Toàn quyền quản lý kho, tải lên dữ liệu Excel, xác nhận đơn hàng PO và nhận thông báo cảnh báo." 
                  />
                  <RoleDescription 
                    title="CEO / Manager" 
                    desc="Xem tổng quan báo cáo toàn hệ thống, gộp dữ liệu các kho, nhưng không có quyền can thiệp vào dữ liệu gốc." 
                  />
               </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-6 border-indigo-500/10">
            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Hướng dẫn thiết lập Bot</h4>
            <div className="space-y-4">
               <Step number="1" text="Tìm @BotFather trên Telegram và gửi /newbot để tạo bot mới." />
               <Step number="2" text="Copy đoạn API Token nhận được dán vào ô Token bên trái." />
               <Step number="3" text="Gửi /start cho bot của bạn, sau đó dùng @userinfobot để lấy Chat ID của bạn." />
               <a href="https://t.me/BotFather" target="_blank" className="flex items-center gap-2 text-[10px] font-black text-white hover:text-indigo-400 transition-all mt-6">
                 Đến BotFather <ExternalLink size={12} />
               </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step({ number, text }: { number: string; text: string }) {
  return (
    <div className="flex gap-3">
      <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black text-gray-400 shrink-0">{number}</div>
      <p className="text-[11px] text-gray-500 leading-relaxed font-medium">{text}</p>
    </div>
  );
}

function RoleDescription({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
      <div className="text-sm font-black text-white mb-2">{title}</div>
      <p className="text-[11px] text-gray-500 leading-relaxed">{desc}</p>
    </div>
  );
}
