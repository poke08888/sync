"use client";

import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { Upload, X, FileText, CheckCircle2, RotateCcw, BarChart3, Tag } from 'lucide-react';
import { parseRows, KocLiveSession } from '@/lib/koc-service';
import { FileMetadata } from '@/hooks/useKocData';
import { BRANDS } from '@/lib/constants';

interface KocLiveUploadProps {
  onData: (sessions: KocLiveSession[], fileName: string, brand: string) => void;
  onDeleteFile: (fileName: string) => void;
  sessions: KocLiveSession[];
  files: FileMetadata[];
}

export default function KocLiveUpload({ onData, onDeleteFile, sessions, files }: KocLiveUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedUploadBrand, setSelectedUploadBrand] = useState(BRANDS[1]); // Default to first actual brand
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!selectedUploadBrand || selectedUploadBrand === BRANDS[0]) {
      alert("Vui lòng chọn Brand trước khi tải file lên!");
      return;
    }

    // Check if filename already exists to avoid confusion
    if (files.some(f => f.name === file.name)) {
      alert("File này đã tồn tại trong hệ thống!");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
        
        const parsed = parseRows(json, selectedUploadBrand);
        if (parsed.length === 0) {
          alert("Không tìm thấy dữ liệu hợp lệ trong file này (Cần bắt đầu từ dòng 3).");
          return;
        }
        onData(parsed, file.name, selectedUploadBrand);
      } catch (err) {
        console.error("Parse error", err);
        alert("Lỗi khi đọc file Excel. Vui lòng kiểm tra lại định dạng.");
      }
    };
    reader.readAsBinaryString(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Brand Selection for Upload */}
      <div className="flex flex-col gap-3 max-w-sm">
        <label className="text-[10px] text-gray-500 font-extrabold uppercase tracking-widest px-1">Gán dữ liệu cho Brand</label>
        <div className="relative">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" size={14} />
          <select 
            value={selectedUploadBrand}
            onChange={(e) => setSelectedUploadBrand(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-2.5 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer hover:bg-white/[0.05] transition-all"
          >
            {BRANDS.slice(1).map(brand => (
              <option key={brand} value={brand} className="bg-[#0B0E14]">{brand}</option>
            ))}
          </select>
        </div>
        <p className="text-[10px] text-gray-600 italic px-1">* Một file upload chỉ phục vụ dữ liệu cho 1 brand duy nhất</p>
      </div>

      <div 
        className={`relative border-2 border-dashed rounded-[32px] p-10 transition-all flex flex-col items-center justify-center text-center cursor-pointer group
          ${isDragging ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 bg-[#151821]/40 hover:bg-[#151821]/60 hover:border-white/20'}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden" 
          accept=".xlsx,.xls" 
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
            <Upload size={32} />
          </div>
          <div>
            <p className="text-white font-bold text-lg">Tải lên file cho <span className="text-indigo-400">{selectedUploadBrand}</span></p>
            <p className="text-gray-500 text-sm mt-1">Kéo thả file .xlsx từ TikTok Shop vào đây hoặc click để chọn</p>
          </div>
          <div className="flex items-center gap-2 mt-2 px-4 py-1.5 bg-white/5 rounded-full border border-white/5">
            <FileText size={12} className="text-indigo-400" />
            <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Excel format (Row 3 headers)</span>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center justify-between px-2">
            <h4 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">Quản lý dữ liệu ({files.length} file)</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {files.map((file) => (
              <div key={file.name} className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex items-center justify-between group hover:bg-white/[0.04] transition-all">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500">
                    <CheckCircle2 size={18} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white truncate max-w-[150px]">{file.name}</span>
                      <span className="bg-indigo-500/10 text-indigo-400 text-[8px] px-1.5 py-0.5 rounded-md font-black uppercase">{file.brand}</span>
                    </div>
                    <span className="text-[10px] text-gray-500 font-medium leading-loose">
                      {file.count} phiên | {file.dateRange.start} M-^T {file.dateRange.end}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); onDeleteFile(file.name); }}
                  className="p-2 text-gray-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-2 flex items-center gap-4 px-6 py-4 bg-indigo-500/[0.03] rounded-2xl border border-indigo-500/10">
            <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
              <BarChart3 size={20} />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-bold uppercase tracking-widest leading-none">Tổng cộng trong hệ thống</div>
              <div className="text-xl font-black text-white mt-1.5">{sessions.length} phiên LIVE đã sẵn sàng</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
