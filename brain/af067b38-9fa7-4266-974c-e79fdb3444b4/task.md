# KOC Module Final Polish

## Cốt lõi Dữ Liệu
- `[ ]` Thêm property `sourceFile` khi append rows vào `useKocStore`.
- `[ ]` Code hàm `removeFile(fileName)` loại bỏ data theo file và aggregate lại.
- `[ ]` Đẩy state `filterDateRange` lên Store dùng chung.

## Giao diện & Layout
- `[ ]` Update `DashboardLayout.jsx` - Gắn badge số lượng KOC active ở tab "KOC Live".
- `[ ]` Update `KocUploadZone.jsx` - Thêm nút xóa Từng File, cập nhật Empty state (Illustration text đẹp).
- `[ ]` Thêm Thanh Lọc Thời Gian chung ở màn hình `KocAnalytics` hoạc Layout.

## Tối Ưu UX
- `[ ]` Viết hook `useDebounce` hoặc setup debounce cho input Search KOC trong Table.
- `[ ]` Handle Missing Fields (0 Div) trong `kocExcelParser`. (Đã done đa số, double check).
- `[ ]` Add "Tip: Chưa ra đơn" highlight ở Table nếu KOC nào nỗ lực cao mà GMV=0.
