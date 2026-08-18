# Walkthrough - Kết quả thử nghiệm Phương án 2 (WeChat Backup)

Chúng tôi đã thiết lập thành công phương án di chuyển và tạo liên kết Symbolic Link riêng cho thư mục sao lưu điện thoại (`Backup`) của WeChat sang ổ cứng **BINGNET**.

## Kết quả đạt được hôm nay

* **Dung lượng trống trên máy Mac trước khi xử lý**: 13 GB (do WeChat tự động sao lưu lại 30 GB dữ liệu điện thoại trong 2 ngày qua).
* **Dung lượng trống trên máy Mac hiện tại**: **57 GB khả dụng** (tăng thêm **~44 GB** sau khi dọn dẹp và tháo gỡ local snapshots).

---

## Chi tiết các thay đổi đã thực hiện

### 1. Đồng bộ dữ liệu sao lưu mới nhất
* Đã chạy đồng bộ `rsync` toàn bộ dữ liệu của thư mục `Backup` mới nhất (30 GB) sang ổ cứng ngoài:
  `/Volumes/BINGNET/Kevin_Data/xwechat_files/Backup/` (Đảm bảo bản sao lưu trên BINGNET là mới nhất của bạn).

### 2. Thiết lập liên kết tượng trưng (Symbolic Link)
* Xóa thư mục `Backup` 30 GB trên máy Mac.
* Tạo liên kết tượng trưng tại:
  `/Users/kevin/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/Backup` trỏ tới `/Volumes/BINGNET/Kevin_Data/xwechat_files/Backup`.

### 3. Nghiệm thu dung lượng ổ đĩa
Sau khi tháo gỡ các bản sao lưu cục bộ (APFS local snapshots), dung lượng thực tế trên máy Mac đã được giải phóng ngay lập tức:
```bash
$ df -h /System/Volumes/Data
Filesystem      Size    Used   Avail Capacity   Mounted on
/dev/disk3s5   228Gi   132Gi    57Gi    70%       /System/Volumes/Data
```

---

## Yêu cầu kiểm tra từ bạn (Nghiệm thu)

Vui lòng cắm ổ cứng **BINGNET** và mở ứng dụng WeChat trên máy Mac để kiểm tra hai phần:
1. **Lịch sử chat trên máy Mac**: Kiểm tra xem các tin nhắn cũ có hiển thị bình thường không (chắc chắn sẽ bình thường vì thư mục gốc `xwechat_files` vẫn nằm trên máy Mac).
2. **Thử nghiệm sao lưu điện thoại (Backup)**:
   * Trên máy Mac: Mở WeChat, click biểu tượng menu (3 gạch ở góc dưới bên trái) -> **Migration & Backup** -> **Backup & Restore** -> Chọn **Backup to Mac**.
   * Trên điện thoại: Kết nối cùng Wi-Fi với Mac và xác nhận sao lưu.
   * **Mục tiêu**: Xem hệ điều hành có cho phép điện thoại sao lưu trực tiếp qua liên kết tượng trưng sang ổ BINGNET hay không.
   * *Nếu thành công*: Từ nay, mọi dữ liệu sao lưu điện thoại sẽ tự động chạy thẳng vào ổ BINGNET của bạn mà không tốn 1 Byte nào của máy Mac!
   * *Nếu báo lỗi trên điện thoại (do lỗi bảo mật Sandbox của macOS)*: Chúng ta sẽ phải hủy Symbolic Link này và quay lại Phương án 1 (sao lưu trên Mac rồi copy thủ công sang BINGNET khi cần).

Vui lòng thử nghiệm và phản hồi lại kết quả cho tôi nhé!
