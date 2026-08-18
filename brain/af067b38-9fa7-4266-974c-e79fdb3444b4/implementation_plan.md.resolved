# Integration & Data Management Plan

## 1. Sidebar Nâng Cấp (Navigation)
- Sửa đổi `src/layouts/DashboardLayout.jsx` để truy cập vào `useKocStore`.
- Bổ sung cục **Badge xanh (KOC Active)** vào thẻ Navigation "KOC Live" hiển thị `kocList.length` hiện hành.

## 2. Quản Lý File Nâng Cao (Delete Per File)
- **Store Refactor**: Ở hàm `appendData(newRows, fileName, dateRange)`, ta sẽ gắn thêm property `sourceFile: fileName` vào từng object trong `newRows`.
- Việc này giúp ta viết hàm mới `removeFile(fileName)`: filter loại bỏ tất cả `rawLives` mà có `sourceFile === fileName`, sau đó gọi lại chuỗi Aggregate để tái tính toán KPI.
- **UI Update**: Trên `KocUploadZone.jsx`, danh sách Lịch sử File sẽ hiện thêm nút thùng rác 🗑️ cho TỪNG FILE.

## 3. Global Date Filter
- Rút tính năng Chọn Ngày Tháng (DateRange) từ `KocHistoryView.jsx` đẩy lên mức global `useKocStore` hoặc Header của Dashboard layout.
- Tất cả các view trong Dashboard và KOC Page sẽ tự động map theo Global Date Filter này. Nếu người dùng chọn "Tất cả" thì bỏ filter.

## 4. Xử Lý Trải Nghiệm (UX & Edge Cases)
- **Debounced Search**: Viết custom hook hoặc config `useLayoutEffect`/`setTimeout` với độ trễ 300ms trong Ô Tìm Kiếm bảng xếp hạng KOC.
- **Empty States**: Thêm Illustration mờ ở `KocUploadZone` nếu chưa có file nào tải lên thay vì màn hình trống trơn. Bổ sung nhãn hiệu "Không có kết quả" khi search rỗng.
- **Zero Div/Not Null Checks**: Rà soát lại `kocExcelParser.js`, kiểm tra bắt triệt để biến kiểu `NaN` (nếu có chia 0 thì `|| 0`).

Anh vui lòng xác nhận để tôi bắt đầu đợt review mã (Refactor) cuối cùng này!
