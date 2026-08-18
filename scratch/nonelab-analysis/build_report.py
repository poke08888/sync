import re
from pathlib import Path

def main():
    template_path = Path("/Users/kevin/Downloads/mo-xe-guyu-collagen.html")
    output_dir = Path("/Users/kevin/.gemini/antigravity/scratch/nonelab-analysis")
    output_dir.mkdir(parents=True, exist_ok=True)
    output_path = output_dir / "mo-xe-cimee-nerman.html"

    if not template_path.exists():
        print(f"Error: Template file not found at {template_path}")
        return

    content = template_path.read_text(encoding="utf-8")

    # 1. Update title and subtitle
    content = content.replace(
        "<title>Phiếu mổ xẻ video · Guyu Collagen Spray</title>",
        "<title>Phiếu mổ xẻ video · Ứng dụng Cimee &amp; Nerman</title>"
    )
    content = content.replace(
        '<p class="sub">谷雨 Guyu · Xịt tinh chất collagen sâm núi — chiến dịch “người nổi tiếng đồng dạng” dẫn về livestream</p>',
        '<p class="sub">Guyu (Cổ Vũ) · Xịt collagen sâm núi — Phương án ứng dụng thương hiệu Cimee &amp; Nerman (Nonelab)</p>'
    )

    # 2. Update Section 08 (Lắp khung vào Nonelab)
    old_section_8 = """  <!-- LAP VAO NONELAB -->
  <section class="sec">
    <div class="sec-head"><span class="sec-no">08</span><h2>Lắp khung vào Nonelab</h2></div>
    <div class="cards" style="margin-bottom:22px">
      <div class="card reveal"><h4>Khớp nhất</h4><p class="big">Nerman</p><p>Hook “nam thần U-XX” + “đàn ông 30+ phải chăm da” bê gần như nguyên si cho xịt khoáng/serum nam. Đối chuẩn ⑤ (chéo: bê khung skincare nữ/sang sang ngành nam).</p></div>
      <div class="card reveal"><h4>Khớp tốt</h4><p class="big">Mistory · Muvaris</p><p>Mistory mượn khối “đắt NHƯNG X cực đỉnh” cho son lì lâu trôi + “môi/mặt mộc vẫn đẹp”. Muvaris mượn macro kết cấu + sang trọng + “đắt nhưng đáng”.</p></div>
      <div class="card reveal"><h4>Đối chuẩn</h4><p class="big">② &amp; ③ (· ⑤)</p><p>② công dụng tương tự (chống lão hoá/săn chắc) + ③ cùng nhóm khách 30+ lo lão hoá. Nếu lắp cho Nerman → thêm ⑤ chéo ngành.</p></div>
    </div>
    <h4 style="font-family:var(--ui);font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--amber);margin:0 0 6px">10 góc quay đẻ từ khung này</h4>
    <ul class="klist"><li class='reveal'>“Nam 35+ rửa mặt xong xịt thẳng cái này” — clone hook Hồ Binh, thay bằng KOC nam đời thật.</li><li class='reveal'>“Đắt NHƯNG cải thiện [nỗi đau] cực đỉnh” × 3 nỗi đau (chảy xệ / lỗ chân lông / xỉn màu).</li><li class='reveal'>Macro: xịt ra trên mu bàn tay → “không phải nước, là tinh chất [thành phần sao]”.</li><li class='reveal'>Kết cấu serum/jelly quay cận + ánh sáng ấm → khoe công nghệ/thành phần.</li><li class='reveal'>★ Before/after THẬT của 1 KOC sau 2–4 tuần — ô bản gốc đang THIẾU, ta thêm để tạo “điểm cộng”.</li><li class='reveal'>★ So sánh trực diện: nửa mặt / vệt tay dùng vs không dùng — cũng là ô gốc thiếu.</li><li class='reveal'>“Túi tôi bỏ gì cũng được trừ…” — clone khung Trương Hinh Dư cho thói quen mang theo.</li><li class='reveal'>Routine sáng/tối quay nhanh bắt nhịp.</li><li class='reveal'>“Tưởng là chị/anh của…” — UGC phỏng vấn người lạ đoán tuổi càng tốt.</li><li class='reveal'>CTA hộp quà + mua 1 tặng 1 dẫn về live/giỏ hàng.</li></ul>
    <div class="rule reveal">
      <div class="rl">Nguyên tắc vàng khi tái dùng</div>
      <p>Bản gốc thắng nhờ <b>dàn sao</b> — “điểm cộng” mà ta khó copy. Không có sao thì <b>phải thay bằng bằng chứng hiệu quả thật</b>: before/after, so sánh trực diện, quá trình dùng trên một người — đúng 2 ô mà bản gốc đang yếu. Copy khung + cộng lợi thế riêng = mới thắng. Đừng bê y nguyên “đắt nhưng đỉnh” mà không có sao đỡ → thành chém gió.</p>
    </div>
  </section>"""

    new_section_8 = """  <!-- LAP VAO NONELAB -->
  <section class="sec">
    <div class="sec-head"><span class="sec-no">08</span><h2>Lắp khung vào Nonelab</h2></div>
    <div class="cards" style="margin-bottom:22px">
      <div class="card reveal">
        <h4>Cimee (Nữ)</h4>
        <p class="big">Xịt khoáng sâm Cimee</p>
        <p>Thích hợp cho tệp phụ nữ 30+ bận rộn muốn chăm da nhanh chóng, thích làn da căng bóng glass-skin ngậm nước mà không cần bôi trét nhiều lớp.</p>
      </div>
      <div class="card reveal">
        <h4>Nerman (Nam)</h4>
        <p class="big">Xịt sâm Nerman</p>
        <p>Sử dụng đòn bẩy kịch bản của Hồ Binh để nhắm tới nam giới 30+ muốn chống nhăn, săn chắc cơ mặt tối giản: chỉ cần rửa mặt xong và xịt sâm Nerman.</p>
      </div>
      <div class="card reveal">
        <h4>Đối chuẩn &amp; Điểm cộng</h4>
        <p class="big">Đối chuẩn nhóm ①</p>
        <p>Thuộc cách đối chuẩn ① (Cùng loại/sản phẩm cạnh tranh trực tiếp). Để chiến thắng bản gốc, ta tập trung bù đắp 2 ô bản gốc thiếu: Before/After thật và so sánh trực diện.</p>
      </div>
    </div>
    <h4 style="font-family:var(--ui);font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--amber);margin:0 0 6px">6 góc quay thực chiến đẻ từ khung này cho Nonelab</h4>
    <ul class="klist">
      <li class='reveal'><b>Góc 1 — Test chống thấm &amp; bết dính:</b> Cận cảnh xịt sâm Cimee lên mặt, áp giấy thấm dầu lên má và lấy ra giấy khô nguyên. Thể hiện tính năng tinh chất thấm sâu cực nhanh, khô thoáng không bết dính.</li>
      <li class='reveal'><b>Góc 2 — Soi rãnh cười mờ đi (Timelapse):</b> KOC nữ 35 tuổi cầm camera trước soi sát rãnh cười/khóe mắt mộc, sau đó xịt Cimee. Tua nhanh quá trình phục hồi sau 2-4 tuần thấy rãnh cười đầy đặn rõ rệt.</li>
      <li class='reveal'><b>Góc 3 — Bóng bàn test cơ má săn chắc:</b> KOC nam Nerman dùng quả bóng bàn nhỏ thả nhẹ lên má, bóng nảy ra xa nhờ làn da đàn hồi khỏe mạnh, săn chắc sau khi dùng xịt sâm Nerman một thời gian.</li>
      <li class='reveal'><b>Góc 4 — Mở hộp quà lấp lánh (Lễ hội):</b> Cận cảnh đập hộp set quà Cimee Luxury Box với nắp hít nam châm lót lụa sang trọng, bên trong trưng bày 3 chai xịt khoáng và 1 máy đẩy tinh chất tặng kèm bắt mắt.</li>
      <li class='reveal'><b>Góc 5 — Kính lọc sương siêu mịn:</b> Xịt sương sâm Cimee lên tấm kính trong suốt, tấm kính mờ đi như khói sương mà không hề bị chảy dòng hay đọng giọt nước lớn, chứng minh vòi xịt vi hạt cao cấp.</li>
      <li class='reveal'><b>Góc 6 — Tương phản công sở điều hòa:</b> Hai đồng nghiệp nữ U35 ngồi cạnh nhau trong phòng điều hòa. Một người mốc nền da khô ráp; người kia liên tục dùng xịt sâm Cimee da luôn mướt mát, căng bóng cuốn hút.</li>
    </ul>
    <div class="rule reveal">
      <div class="rl">Nguyên tắc vàng khi tái dùng</div>
      <p>Bản gốc thắng nhờ <b>dàn sao</b> — “điểm cộng” mà ta khó copy. Không có sao thì <b>phải thay bằng bằng chứng hiệu quả thật</b>: before/after, so sánh trực diện, quá trình dùng trên một người — đúng 2 ô mà bản gốc đang yếu. Copy khung + cộng lợi thế riêng = mới thắng. Đừng bê y nguyên “đắt nhưng đỉnh” mà không có sao đỡ → thành chém gió.</p>
    </div>
  </section>"""

    # Check and replace
    if old_section_8 in content:
        content = content.replace(old_section_8, new_section_8)
        print("Successfully replaced Section 08!")
    else:
        # Try soft match or replacement using regex/split
        print("Warning: Exact match for Section 08 not found. Trying regex matching.")
        pattern = r"<!-- LAP VAO NONELAB -->.*?<!-- KHO -->"
        match = re.search(pattern, content, re.DOTALL)
        if match:
            # Replace section 8 up to the KHO comment, keeping the KHO comment
            replaced_section = new_section_8 + "\\n\\n  <!-- KHO -->"
            content = re.sub(pattern, replaced_section, content, flags=re.DOTALL)
            print("Successfully replaced Section 08 via regex!")
        else:
            print("Error: Could not locate Section 08 in template file.")

    output_path.write_text(content, encoding="utf-8")
    print(f"Generated successfully at: {output_path}")

    # Also copy to artifacts directory for user easy view
    artifacts_dir = Path("/Users/kevin/.gemini/antigravity/brain/f7fe03b5-6fd8-4945-9fea-1a43b2105972")
    artifacts_path = artifacts_dir / "mo-xe-cimee-nerman.html"
    artifacts_path.write_text(content, encoding="utf-8")
    print(f"Also saved in artifacts directory: {artifacts_path}")

if __name__ == "__main__":
    main()
