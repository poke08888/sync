# Hệ thống Dự báo Tái cung ứng Kho hàng (Inventory Replenishment)

Tôi đã hoàn thành việc xây dựng toàn bộ hệ thống dự báo và thông báo kho hàng theo yêu cầu. Hệ thống hiện đã sẵn sàng để xử lý dữ liệu thực tế từ các file Excel.

## Các thành phần đã triển khai

### 1. Engine Tính toán Cốt lõi (`lib/replenishment-engine.ts`)
- **ADO (Average Daily Outbound)**: Tự động tính toán lượng bán trung bình dựa trên lịch sử 14 ngày.
- **Net Stock**: Tổng hợp tồn kho hiện tại và hàng đang về (In-transit PO).
- **Phân loại trạng thái**: Tự động đánh nhãn `CRITICAL` (cần nhập ngay), `WARNING` (chuẩn bị nhập), và `INFO`.
- **Đề xuất số lượng (Recommended Qty)**: Tự động tính toán số lượng nhập tối ưu dựa trên chu kỳ nhập hàng và MOQ.

### 2. Dashboard Thông minh (`/inventory`)
- **KPI Cards**: Theo dõi nhanh số lượng SKU khẩn cấp và tổng giá trị hàng đang về.
- **Bảng trạng thái**: Hiển thị chi tiết từng SKU, ngày dự kiến hết hàng, và ngày cần đặt hàng lại.
- **Biểu đồ Forecast**: Xem trước dòng chảy tồn kho trong 30 ngày tới, bao gồm cả các mốc hàng về dự kiến.

### 3. Hệ thống Import Excel (`/inventory/upload`)
- Hỗ trợ 4 loại file: **Tồn kho**, **Đơn hàng PO**, **Danh mục SKU**, và **Nhà cung cấp**.
- Tính năng **Xem trước (Preview)** dữ liệu và kiểm tra lỗi (Validation) trước khi đẩy vào hệ thống.

### 4. Quy trình Xác nhận PO & Thông báo
- **Xác nhận hàng về**: Trang riêng dành cho việc xác nhận PO đã về kho hoặc gia hạn ngày về nếu bị chậm trễ.
- **Thông báo đa kênh**: Tích hợp Telegram Bot và Email để gửi nhắc nhở hàng ngày.
- **Cron Job**: Tự động kiểm tra các lô hàng dự kiến về vào 8:00 AM mỗi ngày.

## Hướng dẫn sử dụng

> [!TIP]
> **Thứ tự tải data lần đầu**:
> 1. Tải file **Nhà cung cấp (Supplier Master)**.
> 2. Tải file **Danh mục SKU (SKU Master)**.
> 3. Tải file **Tồn kho hàng ngày (Inventory Snapshot)**.
> 4. Tải file **Đơn hàng (In-transit PO)**.

### Cấu hình Thông báo
Để kích hoạt thông báo, vui lòng cấu hình các biến môi trường sau trong file `.env`:
- `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`
- `EMAIL_HOST`, `EMAIL_USER`, `EMAIL_PASS`

---

Hệ thống đã được thiết lập với cấu trúc dữ liệu bền vững và giao diện hiện đại. Bạn có thể bắt đầu sử dụng bằng cách truy cập menu **Dự báo Tái cung ứng** trên Dashboard.
