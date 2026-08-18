"use client";

import React, { useState, useMemo } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, ChevronRight, Table as TableIcon } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

type FileType = 'INVENTORY' | 'PO' | 'SKU_MASTER' | 'SUPPLIER';

const FILE_TYPES: { id: FileType; label: string; description: string; endpoint: string; columns: string[] }[] = [
  { 
    id: 'INVENTORY', 
    label: 'Tồn kho hàng ngày', 
    description: 'Báo cáo tồn kho hiện tại và lượng xuất hàng ngày.',
    endpoint: '/api/upload/inventory',
    columns: ['sku_code', 'product_name', 'warehouse_code', 'current_stock', 'daily_outbound', 'date']
  },
  { 
    id: 'PO', 
    label: 'Đơn hàng đang về (PO)', 
    description: 'Thông tin các lô hàng đang trên đường về kho.',
    endpoint: '/api/upload/purchase-orders',
    columns: ['po_number', 'sku_code', 'supplier_code', 'ordered_quantity', 'expected_arrival_date', 'order_date', 'status']
  },
  { 
    id: 'SKU_MASTER', 
    label: 'Danh mục SKU', 
    description: 'Cấu hình lead time, safety stock và MOQ cho từng SKU.',
    endpoint: '/api/upload/sku-master',
    columns: ['sku_code', 'product_name', 'supplier_code', 'lead_time_days', 'safety_stock_days', 'reorder_cycle_days', 'min_order_quantity', 'unit_cost']
  },
  { 
    id: 'SUPPLIER', 
    label: 'Nhà cung cấp', 
    description: 'Thông tin liên hệ và lead time mặc định của nhà cung cấp.',
    endpoint: '/api/upload/suppliers',
    columns: ['supplier_code', 'supplier_name', 'default_lead_time', 'contact_email']
  },
];

export default function InventoryUploadPage() {
  const router = useRouter();
  const { isAdmin } = useAuth();
  const [selectedType, setSelectedType] = useState<FileType>('INVENTORY');
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<any>(null);

  const activeTypeInfo = useMemo(() => FILE_TYPES.find(t => t.id === selectedType)!, [selectedType]);

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-6 text-center">
        <div className="p-6 bg-rose-500/10 rounded-full text-rose-500">
           <AlertCircle size={48} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">Truy cập bị từ chối</h2>
          <p className="text-gray-500 mt-2 max-w-md">Bạn không có quyền truy cập vào trang này. Chỉ Admin Kho mới có thể tải lên hoặc chỉnh sửa dữ liệu kho hàng.</p>
        </div>
        <button 
          onClick={() => router.push('/inventory')}
          className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-gray-400 hover:text-white transition-all"
        >
          Quay lại Dashboard
        </button>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    setError(null);
    setUploadResult(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      setPreviewData(data.slice(0, 5)); // Lưu 5 dòng đầu để preview
      
      // Kiểm tra cột thiếu
      const firstRow = data[0] as any;
      if (firstRow) {
        const missingColumns = activeTypeInfo.columns.filter(col => !(col in firstRow));
        if (missingColumns.length > 0) {
          setError(`File thiếu các cột bắt buộc: ${missingColumns.join(', ')}`);
        }
      }
    };
    reader.readAsBinaryString(selectedFile);
  };

  const handleUpload = async () => {
    if (!file || error) return;
    setIsUploading(true);
    
    try {
      // Đọc toàn bộ dữ liệu
      const reader = new FileReader();
      reader.onload = async (evt) => {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws);

        const response = await fetch(activeTypeInfo.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            rows,
            fileName: file.name,
            uploadedBy: 'Admin', // Placeholder
          }),
        });

        const result = await response.json();
        setIsUploading(false);
        
        if (result.success) {
          setUploadResult(result);
        } else {
          setError(result.error || 'Upload thất bại');
        }
      };
      reader.readAsBinaryString(file);
    } catch (err) {
      setError('Đã xảy ra lỗi khi gửi dữ liệu');
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-20 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Tải lên Dữ liệu Kho</h1>
          <p className="text-gray-400 mt-2">Chọn loại dữ liệu và tải file Excel (.xlsx) lên hệ thống.</p>
        </div>
        <button 
          onClick={() => router.push('/inventory')}
          className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-gray-400 hover:text-white transition-all flex items-center gap-2"
        >
          Quay lại Dashboard <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {FILE_TYPES.map((type) => (
          <button
            key={type.id}
            onClick={() => {
              setSelectedType(type.id);
              setFile(null);
              setPreviewData([]);
              setError(null);
              setUploadResult(null);
            }}
            className={`p-4 rounded-2xl border transition-all text-left flex flex-col gap-2 ${
              selectedType === type.id 
                ? 'bg-indigo-500/10 border-indigo-500 text-white' 
                : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/10'
            }`}
          >
            <div className="font-black text-sm uppercase tracking-wider">{type.label}</div>
            <p className="text-[10px] font-medium leading-relaxed opacity-60">{type.description}</p>
          </button>
        ))}
      </div>

      <div className="glass-panel p-8 flex flex-col items-center justify-center border-dashed border-2 border-white/5 min-h-[300px] relative">
        <input 
          type="file" 
          accept=".xlsx, .xls, .csv" 
          onChange={handleFileChange} 
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        
        {!file ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="p-4 bg-indigo-500/20 rounded-full text-indigo-400">
              <Upload size={32} />
            </div>
            <div>
              <p className="text-lg font-bold text-white">Click hoặc kéo thả file vào đây</p>
              <p className="text-sm text-gray-500 mt-1">Hỗ trợ định dạng .xlsx, .xls</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 w-full">
            <div className="p-4 bg-emerald-500/20 rounded-full text-emerald-400">
              <FileText size={32} />
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-white">{file.name}</p>
              <p className="text-sm text-gray-500 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
            
            {previewData.length > 0 && !error && (
              <div className="w-full mt-6 bg-black/20 rounded-xl overflow-hidden border border-white/5">
                <div className="p-2 bg-white/5 border-b border-white/5 flex items-center gap-2">
                   <TableIcon size={14} className="text-gray-500" />
                   <span className="text-[10px] font-black uppercase text-gray-500">Xem trước dữ liệu (5 dòng đầu)</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-[10px] text-left border-collapse">
                    <thead>
                      <tr className="bg-white/5 text-gray-400">
                        {Object.keys(previewData[0]).map(key => (
                          <th key={key} className="p-2 font-bold">{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.map((row, i) => (
                        <tr key={i} className="border-b border-white/5">
                          {Object.values(row).map((val: any, j) => (
                            <td key={j} className="p-2 text-gray-400">{val?.toString() || '-'}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <button
               onClick={(e) => {
                 e.stopPropagation();
                 setFile(null);
                 setPreviewData([]);
                 setError(null);
               }}
               className="text-xs text-rose-500 font-bold hover:underline"
            >
              Chọn file khác
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl flex items-center gap-3 text-rose-500">
          <AlertCircle size={20} />
          <p className="text-sm font-bold">{error}</p>
        </div>
      )}

      {uploadResult && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl flex flex-col gap-4">
          <div className="flex items-center gap-3 text-emerald-500">
            <CheckCircle2 size={24} />
            <h3 className="text-lg font-bold">Tải lên thành công!</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-black/20 p-4 rounded-xl">
               <div className="text-[10px] font-black text-gray-500 uppercase">Đã xử lý</div>
               <div className="text-2xl font-black text-white">{uploadResult.processed} dòng</div>
            </div>
            <div className="bg-black/20 p-4 rounded-xl">
               <div className="text-[10px] font-black text-gray-500 uppercase">Bị lỗi</div>
               <div className="text-2xl font-black text-rose-500">{uploadResult.errors} dòng</div>
            </div>
          </div>
          <button 
            onClick={() => router.push('/inventory')}
            className="w-full py-3 bg-emerald-600 text-white rounded-xl font-black text-sm uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg"
          >
            Quay lại Dashboard kiểm tra
          </button>
        </div>
      )}

      {!uploadResult && (
        <button
          onClick={handleUpload}
          disabled={!file || !!error || isUploading}
          className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl ${
            !file || !!error || isUploading 
              ? 'bg-white/5 text-gray-600 cursor-not-allowed' 
              : 'bg-indigo-600 text-white hover:bg-indigo-500 hover:-translate-y-1'
          }`}
        >
          {isUploading ? (
            <>
              <Loader2 className="animate-spin" size={20} /> ĐANG XỬ LÝ DỮ LIỆU...
            </>
          ) : (
            <>BẮT ĐẦU TẢI LÊN</>
          )}
        </button>
      )}

      <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-6">
         <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-4">Cấu trúc file mẫu</h4>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            {activeTypeInfo.columns.map((col, idx) => (
              <div key={idx} className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-xs font-bold text-gray-400">{col}</span>
                <span className="text-[10px] text-gray-600 font-medium italic">string | number</span>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}
