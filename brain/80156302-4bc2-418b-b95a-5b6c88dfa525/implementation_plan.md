# Kế hoạch xử lý WeChat Backup tự động tạo lại làm đầy ổ đĩa

Qua kiểm tra sự thay đổi dung lượng trong 2 ngày qua, chúng tôi đã tìm ra nguyên nhân chính xác:
Thư mục `/Users/kevin/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/Backup` đã **tự động tạo lại và chiếm 30 GB** bộ nhớ trong. 

*Nguyên nhân*: Bạn đã thực hiện sao lưu (backup) lịch sử chat từ điện thoại sang máy tính Mac trong 2 ngày gần đây (hoặc ứng dụng tự động sao lưu qua Wi-Fi). Mỗi lần sao lưu, WeChat sẽ ghi đè hoặc tạo mới dữ liệu này trực tiếp lên bộ nhớ máy Mac.

## Phương án giải quyết đề xuất

Chúng tôi đề xuất các bước xử lý sau:

### Phương án 1 (Thủ công - An toàn tuyệt đối)
1. Tiếp tục sao chép thư mục `Backup` mới này đè lên bản cũ trên ổ **BINGNET** (để giữ bản sao lưu điện thoại mới nhất của bạn).
2. Xóa thư mục `Backup` 30 GB này trên máy Mac.
3. Khi nào bạn cần sao lưu điện thoại tiếp, WeChat sẽ tự tạo lại thư mục này trên máy Mac, và bạn sẽ cần nhờ tôi dọn dẹp định kỳ sau mỗi lần sao lưu.
*Ưu điểm*: Đảm bảo WeChat hoạt động 100% không bị lỗi bảo mật Sandbox.

### Phương án 2 (Tự động - Thử nghiệm liên kết Symbolic Link cho riêng thư mục Backup)
1. Chúng ta sẽ tạo Symbolic Link *chỉ riêng* cho thư mục `Backup` (thay vì toàn bộ thư mục WeChat như lần trước).
2. Kiểm tra xem WeChat có cho phép ghi đè bản sao lưu điện thoại trực tiếp vào ổ cứng ngoài BINGNET hay không.
*Lưu ý*: Do cơ chế Sandbox của macOS, việc này có thể khiến tính năng sao lưu điện thoại báo lỗi "không thể ghi tệp" trên điện thoại. Nếu báo lỗi, chúng ta sẽ quay lại Phương án 1.

---

## Open Questions

> [!NOTE]
> Bạn muốn chọn phương án nào?
> - **Phương án 1 (Thủ công - Khuyên dùng)**: Di chuyển bản backup 30 GB mới sang BINGNET và xóa bản gốc trên máy để lấy lại 30 GB trống ngay lập tức.
> - **Phương án 2 (Tự động)**: Thử nghiệm tạo liên kết Symbolic Link riêng cho thư mục `Backup` để xem WeChat có thể sao lưu trực tiếp sang BINGNET được không.

---

## Verification Plan

### Automated Verification
- Kiểm tra kích thước của thư mục Backup trên BINGNET để đảm bảo đã lưu bản mới nhất.
- Kiểm tra dung lượng máy Mac sau khi dọn dẹp (sẽ tăng lại lên ~58-60 GB trống).
