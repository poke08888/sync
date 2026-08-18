import React, { useState } from 'react';
import { UploadCloud, FileSpreadsheet, AlertCircle, Trash2, Plus, CheckCircle2, XCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import { parseRows } from '../../utils/kocExcelParser';
import { useKocStore } from '../../store/useKocStore';

export default function KocUploadZone() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadBrand, setUploadBrand] = useState('');
  const { filesUploaded, appendData, brands, dateRange } = useKocStore();

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setError(null);
    setIsLoading(true);

    try {
      if (!uploadBrand.trim()) {
        throw new Error('Vui lòng nhập hoặc chọn Thương hiệu trước khi upload.');
      }

      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        throw new Error('Vui lòng chọn file định dạng .xlsx hoặc .xls từ TikTok Shop.');
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = event.target.result;
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          // Row 0 carries "Phạm vi ngày: YYYY-MM-DD ~ YYYY-MM-DD"
          let fileDateRange = 'Unknown';
          if (jsonData.length > 0 && typeof jsonData[0][0] === 'string') {
            const match = jsonData[0][0].match(/(\d{4}-\d{2}-\d{2})\s*~\s*(\d{4}-\d{2}-\d{2})/);
            if (match) {
              fileDateRange = `${match[1]} ~ ${match[2]}`;
            }
          }

          const rowsToStore = parseRows(jsonData);
          if (rowsToStore.length === 0) {
             throw new Error('File không chứa dòng dữ liệu nào hợp lệ ở mẫu TikTok Shop.');
          }

          appendData(rowsToStore, file.name, fileDateRange, uploadBrand.trim());
          setIsLoading(false);
          // reset input value so same file can be clicked again if needed
          e.target.value = '';
        } catch (err) {
          setError(err.message || 'Lỗi parse file.');
          setIsLoading(false);
        }
      };
      
      reader.onerror = () => {
        setError('Lỗi khi đọc file.');
        setIsLoading(false);
      };
      
      reader.readAsArrayBuffer(file);

    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const hasFiles = filesUploaded.length > 0;

  return (
    <div className="bg-surface border border-border rounded-xl p-6 shadow-sm space-y-6">
      <div className="flex flex-col md:flex-row items-end gap-4 bg-background/30 p-4 rounded-xl border border-border/50">
        <div className="flex-1 w-full">
          <label className="block text-[10px] uppercase font-bold text-textMuted mb-2 tracking-widest px-1">Gán dữ liệu cho Thương hiệu</label>
          <div className="relative group">
            <input 
              type="text" 
              list="brand-list"
              value={uploadBrand}
              onChange={e => setUploadBrand(e.target.value)}
              placeholder="Nhập tên thương hiệu (VD: Brand A, Brand B...)"
              className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-pantone-light transition-all shadow-inner"
            />
            <datalist id="brand-list">
              {brands.map(b => <option key={b} value={b} />)}
            </datalist>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-stretch">
        
        {/* Upload Button Area */}
        <label 
          htmlFor="koc-upload"
          className="group flex-1 w-full border-2 border-dashed border-border rounded-xl p-8 hover:border-pantone-293 transition-colors cursor-pointer bg-background/50 hover:bg-white/5 flex flex-col items-center justify-center text-center relative min-h-[220px]"
        >
          {isLoading && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-xl z-20">
               <span className="flex items-center gap-2 text-pantone-light font-bold"><span className="animate-spin rounded-full h-5 w-5 border-b-2 border-pantone-293"></span> Đang xử lý...</span>
            </div>
          )}
          {!hasFiles ? (
            <>
              {/* Illustration when no files */}
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-pantone-293/20 blur-xl rounded-full"></div>
                <img 
                  src="https://cdn3d.iconscout.com/3d/premium/thumb/folder-4990928-4159560.png" 
                  alt="Folder Empty"
                  className="w-20 h-20 object-contain relative z-10 opacity-80 group-hover:scale-110 transition-transform"
                />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Chưa có Dữ Liệu</h3>
              <p className="text-sm text-textMuted mb-5 max-w-sm">
                Đăng nhập <b>TikTok Shop Seller Center</b> → Chọn La bàn Dữ liệu → Phân tích Trực tiếp → <b>Tải xuống Excel</b>.
              </p>
            </>
          ) : (
            <>
              <div className="p-4 bg-pantone-293/10 rounded-full group-hover:scale-110 transition-transform mb-3">
                <UploadCloud className="w-8 h-8 text-pantone-light" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">Cộng dồn thêm Data (Upload)</h3>
              <p className="text-xs text-textMuted mb-4">Định dạng .xlsx rớt ra từ hệ thống TikTok Shop.</p>
            </>
          )}

          <div className="flex items-center justify-center gap-2 text-white font-medium bg-pantone-293 px-4 py-2 rounded-lg text-sm shadow-md">
            {hasFiles ? <Plus className="w-4 h-4" /> : <FileSpreadsheet className="w-4 h-4" />}
            Chọn file {hasFiles ? 'kế tiếp' : 'từ máy'}
          </div>
          <input 
            id="koc-upload" 
            type="file" 
            accept=".xlsx, .xls" 
            className="hidden" 
            onChange={handleFileUpload}
            disabled={isLoading}
          />
        </label>

        {/* State Area (File History) */}
        {hasFiles && (
          <div className="flex-1 w-full flex flex-col bg-background/50 rounded-xl border border-border p-5">
            <div className="mb-4">
              <h3 className="text-white font-bold text-sm">Quản lý Dữ liệu</h3>
              <p className="text-xs text-emerald-400 mt-1">Phạm vi gộp: {dateRange}</p>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2 max-h-[150px]">
              {filesUploaded.map((f, i) => (
                <div key={i} className="flex items-center justify-between bg-surface border border-border p-3 rounded-lg group">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <div className="truncate">
                      <p className="text-sm font-medium text-white truncate max-w-[120px] md:max-w-none" title={f.name}>{f.name}</p>
                      <p className="text-[10px] text-pantone-light font-bold uppercase tracking-wider mb-0.5">{f.brand}</p>
                      <p className="text-[10px] text-textMuted uppercase tracking-wider">{f.dateRange} • {f.sessions} Phiên</p>
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center">
                    <button 
                      onClick={() => useKocStore.getState().removeFile(f.name)}
                      title="Xóa file này"
                      className="p-1.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-md transition-all shadow-sm"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
