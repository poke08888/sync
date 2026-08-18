# Nhiệm vụ thử nghiệm Symlink WeChat Backup (Phương án 2)

- [x] Chuẩn bị và đồng bộ dữ liệu:
  - [x] Đảm bảo ứng dụng WeChat đã được tắt hoàn toàn
  - [x] Đồng bộ dữ liệu `Backup` mới nhất (30 GB) sang ổ BINGNET
- [x] Thiết lập liên kết tượng trưng (Symlink):
  - [x] Xóa thư mục `Backup` gốc trên máy Mac
  - [x] Tạo liên kết tượng trưng từ `xwechat_files/Backup` sang ổ BINGNET
- [/] Kiểm tra và nghiệm thu:
  - [/] Nhờ người dùng kiểm tra lịch sử chat trên WeChat Mac (phải hoạt động bình thường)
  - [/] Nhờ người dùng thử chạy sao lưu (Backup) điện thoại trên WeChat để xem có bị Sandbox chặn không
