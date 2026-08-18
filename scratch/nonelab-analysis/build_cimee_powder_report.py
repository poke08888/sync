import cv2
import base64
import os
from pathlib import Path

def extract_frame_as_base64(video_path, timestamp_sec, width=100, height=178):
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print(f"Error: Cannot open video {video_path}")
        return ""
    
    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_no = int(timestamp_sec * fps)
    cap.set(cv2.CAP_PROP_POS_FRAMES, frame_no)
    
    ret, frame = cap.read()
    cap.release()
    
    if not ret:
        print(f"Error: Cannot read frame at {timestamp_sec}s")
        return ""
    
    # Resize frame
    resized_frame = cv2.resize(frame, (width, height))
    
    # Encode as JPEG
    retval, buffer = cv2.imencode('.jpg', resized_frame, [cv2.IMWRITE_JPEG_QUALITY, 80])
    if not retval:
        print(f"Error: JPEG encoding failed at {timestamp_sec}s")
        return ""
        
    base64_str = base64.b64encode(buffer).decode('utf-8')
    return f"data:image/jpeg;base64,{base64_str}"

def main():
    video_path = "/Users/kevin/Desktop/Design lion bartender/snaptik.vn_7560511374888029448.mp4"
    output_dir = Path("/Users/kevin/.gemini/antigravity/scratch/nonelab-analysis")
    output_dir.mkdir(parents=True, exist_ok=True)
    output_path = output_dir / "mo-xe-cimee-powder.html"
    artifacts_path = Path("/Users/kevin/.gemini/antigravity/brain/f7fe03b5-6fd8-4945-9fea-1a43b2105972/mo-xe-cimee-powder.html")

    # Key timestamps to extract frames
    timestamps = {
        1: 1.0,   # Dội nước lần 1
        2: 3.0,   # Ném cushion giật mình
        3: 7.0,   # Giơ hộp phấn Cimee
        4: 11.0,  # Dặm phấn lên mặt
        5: 18.0,  # Cận cảnh mặt sau dặm
        6: 20.0,  # Khoe nắp hộp tráng gương
        7: 22.0,  # Cảnh tắm dội nước lên mặt
        8: 26.0,  # Dội cốc nước lần 2
        9: 29.0,  # Táp má kiểm tra
        10: 31.0, # Lau bằng bông tẩy trang
        11: 32.0, # Bông tẩy trang trắng sạch
        12: 34.0, # Make up hoàn hảo
        13: 45.0  # Bóc seal gương bóng loáng
    }

    # Extract base64 images
    imgs = {}
    for k, t in timestamps.items():
        print(f"Extracting frame at {t}s...")
        imgs[k] = extract_frame_as_base64(video_path, t)
        if not imgs[k]:
            imgs[k] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" # fallback transparent pixel

    # Build HTML content
    html_content = f"""<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Phiếu mổ xẻ video · Phấn phủ nén chống nắng CIMEE</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,900&family=Space+Grotesk:wght@400;500;600;700&family=Be+Vietnam+Pro:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
:root{{
  --bg:#f4eee2; --bg2:#efe7d7; --panel:#fffdf7; --panel2:#f9f3e7;
  --line:rgba(140,96,40,.28); --line-soft:rgba(70,54,32,.14);
  --ink:#2a2016; --ink-dim:#574a3a; --ink-mute:#8a7c67;
  --amber:#9a6314; --amber-hi:#8a5614; --amber-deep:#7a5212;
  --rose:#9e3a3a; --ok:#6f5612;
  --disp:'Fraunces',Georgia,serif; --ui:'Space Grotesk',sans-serif; --body:'Be Vietnam Pro',system-ui,sans-serif;
}}
*{{box-sizing:border-box}}
html{{scroll-behavior:smooth}}
body{{margin:0;color-scheme:light;background-color:#f4eee2;background:
   radial-gradient(1200px 600px at 80% -10%, rgba(154,99,20,.10), transparent 60%),
   radial-gradient(900px 500px at 0% 30%, rgba(122,82,18,.07), transparent 60%),
   var(--bg);
  color:var(--ink);font-family:var(--body);line-height:1.62;-webkit-font-smoothing:antialiased;
  font-size:16px;overflow-x:hidden;}}
.wrap{{max-width:1080px;margin:0 auto;padding:0 22px}}
a{{color:var(--amber-hi)}}

/* eyebrow */
.eyebrow{{font-family:var(--ui);text-transform:uppercase;letter-spacing:.32em;font-size:11px;color:var(--amber);font-weight:600}}

/* HERO */
.hero{{position:relative;padding:84px 0 56px;border-bottom:1px solid var(--line)}}
.hero .kicker{{display:flex;gap:14px;align-items:center;flex-wrap:wrap;margin-bottom:26px}}
.hero h1{{font-family:var(--disp);font-weight:900;font-size:clamp(40px,8vw,86px);line-height:.96;
  letter-spacing:-.02em;margin:0 0 6px}}
.hero h1 .em{{font-style:italic;font-weight:400;color:var(--amber-hi)}}
.hero .sub{{font-family:var(--disp);font-weight:400;font-style:italic;font-size:clamp(18px,3vw,26px);color:var(--ink-dim);margin:0 0 30px}}
.meta{{display:flex;flex-wrap:wrap;gap:0;border:1px solid var(--line);border-radius:14px;overflow:hidden;background:rgba(255,253,247,.7);backdrop-filter:blur(4px)}}
.meta div{{flex:1 1 130px;padding:16px 18px;border-right:1px solid var(--line-soft)}}
.meta div:last-child{{border-right:none}}
.meta dt{{font-family:var(--ui);font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--ink-mute);margin-bottom:5px}}
.meta dd{{margin:0;font-weight:600;font-size:15px}}

/* section frame */
.sec{{padding:64px 0;border-bottom:1px solid var(--line-soft)}}
.sec-head{{display:flex;align-items:baseline;gap:16px;margin-bottom:30px}}
.sec-no{{font-family:var(--ui);font-weight:700;font-size:13px;color:var(--amber-deep);border:1px solid var(--line);border-radius:999px;padding:4px 12px;flex:none}}
.sec h2{{font-family:var(--disp);font-weight:600;font-size:clamp(24px,4vw,36px);letter-spacing:-.015em;margin:0;line-height:1.05}}
.lead{{color:var(--ink-dim);max-width:62ch;margin:0 0 8px}}

/* verdict chips */
.verdict{{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:14px;margin-top:8px}}
.vcard{{background:linear-gradient(160deg,var(--panel2),var(--panel));border:1px solid var(--line);border-radius:16px;padding:20px}}
.vcard .vlabel{{font-family:var(--ui);font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--ink-mute);margin-bottom:10px}}
.vcard .vbig{{font-family:var(--disp);font-size:30px;font-weight:600;color:var(--amber-hi);line-height:1}}
.vcard .vbig small{{font-size:14px;color:var(--ink-dim);font-family:var(--body);font-weight:500}}
.vcard p{{margin:10px 0 0;font-size:13.5px;color:var(--ink-dim)}}

/* STORYBOARD */
.timeline{{position:relative}}
.timeline::before{{content:"";position:absolute;left:19px;top:8px;bottom:8px;width:2px;
  background:linear-gradient(var(--amber),rgba(231,173,91,.12));border-radius:2px}}
.act{{margin-bottom:46px;position:relative}}
.act-head{{display:flex;gap:18px;align-items:flex-start;margin-bottom:22px}}
.act-no{{font-family:var(--disp);font-weight:900;font-size:20px;color:#fff;background:var(--amber);
  width:40px;height:40px;border-radius:50%;display:grid;place-items:center;flex:none;z-index:2;
  box-shadow:0 0 0 6px var(--bg),0 0 0 7px var(--line)}}
.act-range{{font-family:var(--ui);font-size:11px;letter-spacing:.14em;color:var(--amber);text-transform:uppercase}}
.act-title{{font-family:var(--disp);font-size:22px;font-weight:600;margin:2px 0 6px;letter-spacing:-.01em}}
.act-sum{{margin:0;color:var(--ink-dim);font-size:14px;max-width:64ch}}
.beats{{display:grid;grid-template-columns:1fr;gap:12px;margin-left:58px}}
.beat{{display:flex;gap:15px;background:var(--panel);border:1px solid var(--line-soft);border-radius:14px;padding:14px;transition:border-color .3s,transform .3s,box-shadow .3s;align-items:flex-start}}
.beat:hover{{border-color:var(--line);transform:translateY(-2px);box-shadow:0 8px 24px rgba(70,48,20,.08)}}
.beat-frame{{position:relative;flex:none;width:88px;height:156px;border-radius:9px;overflow:hidden;border:1px solid var(--line)}}
.beat-frame img{{width:100%;height:100%;object-fit:cover;display:block}}
.beat-frame .ts{{position:absolute;left:0;bottom:0;font-family:var(--ui);font-size:9.5px;font-weight:600;
  background:var(--amber);color:#fff;padding:1px 5px;border-top-right-radius:6px;letter-spacing:.04em}}
.beat-body{{min-width:0;flex:1}}
.beat .zh{{font-size:13px;color:var(--ink);margin:0 0 4px;font-weight:500;line-height:1.4}}
.beat .vi{{font-size:13.5px;color:var(--amber-hi);margin:0 0 6px;line-height:1.45;font-weight:600}}
.beat .note{{font-size:11.5px;color:var(--ink-mute);margin:0;line-height:1.5}}
.matrix{{margin-top:12px;border-top:1px solid var(--line);padding-top:10px}}
.cam{{display:flex;gap:13px;align-items:flex-start;background:rgba(154,99,20,.07);
  border:1px solid var(--line);border-left:3px solid var(--amber);border-radius:0 10px 10px 0;
  padding:9px 12px;margin-bottom:9px}}
.cam .cam-lbl{{flex:none;width:74px}}
.cam-parts{{display:grid;grid-template-columns:repeat(3,1fr);gap:6px 16px;flex:1}}
.cam-seg{{font-size:12px;color:var(--ink);line-height:1.36}}
.cam-seg i{{font-style:normal;font-family:var(--ui);font-size:8px;letter-spacing:.13em;text-transform:uppercase;color:var(--amber);display:block;margin-bottom:2px}}
.mgrid{{display:grid;grid-template-columns:1fr 1fr;gap:0 26px}}
.mrow{{display:flex;gap:11px;align-items:baseline;padding:5px 0;border-bottom:1px solid var(--line-soft)}}
.mlbl{{flex:none;width:74px;line-height:1.12}}
.mlbl b{{display:block;font-size:12px;color:var(--ink);font-weight:600}}
.mlbl span{{display:block;font-family:var(--ui);font-size:8px;letter-spacing:.14em;color:var(--ink-mute)}}
.mval{{font-size:12px;color:var(--ink-dim);line-height:1.42}}

/* generic cards grid */
.cards{{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px}}
.card{{background:linear-gradient(160deg,var(--panel2),var(--panel));border:1px solid var(--line);border-radius:16px;padding:22px}}
.card h4{{font-family:var(--ui);font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--amber);margin:0 0 12px;font-weight:600}}
.card p{{margin:0;font-size:14.5px;color:var(--ink-dim)}}
.card .big{{font-family:var(--disp);font-size:19px;color:var(--ink);font-weight:600;margin:0 0 8px;line-height:1.25}}

/* table */
.tbl{{width:100%;border-collapse:collapse;font-size:14px}}
.tbl th{{text-align:left;font-family:var(--ui);font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-mute);font-weight:600;padding:0 14px 12px;border-bottom:1px solid var(--line)}}
.tbl td{{padding:15px 14px;border-bottom:1px solid var(--line-soft);vertical-align:top}}
.c-crit{{font-weight:600;color:var(--ink);width:24%}}
.c-note{{color:var(--ink-dim);font-size:13.5px}}
.chip{{display:inline-block;font-family:var(--ui);font-size:11px;font-weight:600;letter-spacing:.04em;padding:4px 11px;border-radius:999px;white-space:nowrap}}
.chip.ok{{background:rgba(111,86,18,.12);color:#5f4a10;border:1px solid rgba(111,86,18,.4)}}
.chip.mid{{background:rgba(154,99,20,.13);color:#8a5614;border:1px solid rgba(154,99,20,.38)}}
.chip.low{{background:rgba(158,58,58,.12);color:#8f3232;border:1px solid rgba(158,58,58,.4)}}

/* formula blocks */
.formula{{background:var(--panel2);border:1px solid var(--line);border-left:3px solid var(--amber);border-radius:0 14px 14px 0;padding:18px 22px;margin-bottom:14px}}
.formula .flabel{{font-family:var(--ui);font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--amber);margin-bottom:8px}}
.formula .fbody{{font-size:15px}}
.formula .fbody b{{color:var(--amber-hi);font-weight:600}}

/* lists */
.klist{{list-style:none;padding:0;margin:0}}
.klist li{{position:relative;padding:10px 0 10px 26px;border-bottom:1px solid var(--line-soft);font-size:14.5px;color:var(--ink-dim)}}
.klist li::before{{content:"";position:absolute;left:4px;top:18px;width:7px;height:7px;border-radius:50%;background:var(--amber)}}
.klist li:last-child{{border-bottom:none}}
.two{{display:grid;grid-template-columns:1fr 1fr;gap:30px}}

/* golden rule */
.rule{{margin-top:26px;background:linear-gradient(135deg,rgba(154,99,20,.10),rgba(122,82,18,.04));border:1px solid var(--line);border-radius:18px;padding:26px}}
.rule .rl{{font-family:var(--ui);font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--amber);margin-bottom:10px}}
.rule p{{margin:0;font-size:15.5px}}
.rule b{{color:var(--amber-hi)}}

footer{{padding:46px 0 70px;color:var(--ink-mute);font-size:12.5px;font-family:var(--ui);letter-spacing:.04em}}

.reveal{{opacity:0;transform:translateY(16px);transition:opacity .6s ease,transform .6s ease}}
.reveal.in{{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){{.reveal{{opacity:1;transform:none;transition:none}}}}
@media(max-width:680px){{
  .two{{grid-template-columns:1fr;gap:18px}}
  .beats{{margin-left:0}}
  .mgrid{{grid-template-columns:1fr}}
  .cam{{flex-direction:column;gap:7px}}
  .cam-parts{{grid-template-columns:1fr;gap:7px}}
  .timeline::before{{display:none}}
  .meta div{{flex:1 1 45%}}
  .c-crit{{width:auto}}
  .tbl,.tbl tbody,.tbl tr,.tbl td{{display:block;width:100%}}
  .tbl thead{{display:none}}
  .tbl td{{border:none;padding:3px 0}}
  .tbl tr{{border-bottom:1px solid var(--line-soft);padding:14px 0}}
}}
</style>
</head>
<body>

<header class="hero">
  <div class="wrap">
    <div class="kicker">
      <span class="eyebrow">Nonelab · Mổ xẻ video</span>
      <span class="eyebrow" style="color:var(--ink-mute)">Khung Năm Lực · 素材库</span>
    </div>
    <h1>Phiếu <span class="em">mổ&nbsp;xẻ</span> video</h1>
    <p class="sub">CIMEE (Castlen) · Phấn phủ nén chống nắng SPF 50+ PA+++ — Thử thách dội nước &amp; lau bông tẩy trang</p>
    <dl class="meta">
      <div><dt>Nền tảng</dt><dd>TikTok / Douyin</dd></div>
      <div><dt>Thời lượng</dt><dd>46 giây · dọc 9:16</dd></div>
      <div><dt>Thể loại</dt><dd>Reviewer độc thoại kịch tính (Vlog + Test)</dd></div>
      <div><dt>Sản phẩm</dt><dd>Phấn phủ nén chống nắng CIMEE</dd></div>
      <div><dt>Gương mặt</dt><dd>Nữ Creator trẻ trung</dd></div>
      <div><dt>CTA</dt><dd>Quất liền một em · Trải nghiệm thực tế</dd></div>
    </dl>
  </div>
</header>

<main class="wrap">

  <!-- VERDICT -->
  <section class="sec">
    <div class="sec-head"><span class="sec-no">Chốt nhanh</span><h2>Vì sao nó chạy — và đâu là chỗ hở để ta vượt</h2></div>
    <p class="lead">Đây là video dạng <b style="color:var(--amber-hi)">Vlog cá nhân kết hợp thử thách trực quan (Visual Test) cực hạn</b>. Bằng cách dội nước trực tiếp 2 lần và lau mặt bằng bông tẩy trang trắng sạch, video tạo niềm tin tuyệt đối về độ kiềm dầu và chống trôi. Điểm mạnh là chân thực, tương tác tự nhiên; điểm yếu là chưa nhấn mạnh chiều sâu khoa học thành phần.</p>
    <div class="verdict">
      <div class="vcard reveal"><div class="vlabel">Mở đầu bùng nổ</div><div class="vbig">Cực mạnh</div><p>Dội nước xối xả vào mặt ngay giây 1 + ném cushion giật gân giây 3.</p></div>
      <div class="vcard reveal"><div class="vlabel">Điểm bán có hình</div><div class="vbig">Xuất sắc</div><p>Thử thách nước và lau bông tẩy trang chứng minh độ bám 100% trực quan.</p></div>
      <div class="vcard reveal"><div class="vlabel">Động cơ ra đơn</div><div class="vbig">Trải nghiệm</div><p>Cam kết "nguyện cả đời seeding" cực kỳ uy tín và chân thực.</p></div>
      <div class="vcard reveal"><div class="vlabel">Đối chuẩn</div><div class="vbig">① &amp; ⑤</div><p>Sản phẩm cạnh tranh trực tiếp + khung dội nước chéo ngành.</p></div>
    </div>
  </section>

  <!-- STORYBOARD + TRANSCRIPT -->
  <section class="sec">
    <div class="sec-head"><span class="sec-no">01 · 02 · 03</span><h2>Storyboard &amp; transcript song ngữ</h2></div>
    <p class="lead">Khung hình thật được trích trực tiếp từ video kèm lời thoại chi tiết. Mỗi phân cảnh được mổ theo <b style="color:var(--amber-hi)">ma trận 6 yếu tố sản xuất</b> để tạo shot list tái hiện chuẩn xác.</p>
    <div class="timeline">
      
      <!-- MAN 1 -->
      <section class="act reveal">
        <div class="act-head">
          <div class="act-no">01</div>
          <div>
            <div class="act-range">0:00–0:08</div>
            <h3 class="act-title">Màn 1 · Hook dội nước gây sốc &amp; Mở đầu</h3>
            <p class="act-sum">Mở bằng hành động dội cốc nước trực tiếp lên mặt để giữ chân người xem, tiếp tục tạo chú ý bằng cushion bay bất ngờ.</p>
          </div>
        </div>
        <div class="beats">
          
          <div class="beat reveal">
            <div class="beat-frame"><img loading="lazy" src="{imgs[1]}"><span class="ts">0:01</span></div>
            <div class="beat-body">
              <p class="zh">Dội nước từ cốc đỏ xối xả lên mặt mộc</p>
              <p class="vi">Creator dội cốc nước màu đỏ trực tiếp lên mặt</p>
              <p class="note">Hook dội nước thu hút tò mò cực lớn về khả năng chống trôi chống nước ngay giây đầu.</p>
              <div class="matrix">
                <div class="cam">
                  <div class="mlbl cam-lbl"><b>Góc máy</b><span>CAMERA</span></div>
                  <div class="cam-parts">
                    <span class="cam-seg"><i>Cỡ cảnh</i>Cận rộng (MCU)</span>
                    <span class="cam-seg"><i>Góc</i>Ngang tầm mắt</span>
                    <span class="cam-seg"><i>Chuyển động</i>Tripod tĩnh (static)</span>
                  </div>
                </div>
                <div class="mgrid">
                  <div class="mrow"><div class="mlbl"><b>Hành động</b><span>ACTION</span></div><div class="mval">Dội cốc nước lên mặt, nhắm mắt đón nước chảy dòng</div></div>
                  <div class="mrow"><div class="mlbl"><b>Bối cảnh</b><span>SETTING</span></div><div class="mval">Góc phòng ngủ/trang điểm, ánh sáng mịn</div></div>
                  <div class="mrow"><div class="mlbl"><b>Âm thanh</b><span>SOUND</span></div><div class="mval">Tiếng dội nước thật ào ào (foley)</div></div>
                  <div class="mrow"><div class="mlbl"><b>Trang phục</b><span>WARDROBE</span></div><div class="mval">Áo thun xám sọc dọc, mặt mộc</div></div>
                  <div class="mrow"><div class="mlbl"><b>Diễn viên</b><span>CAST</span></div><div class="mval">1 Nữ creator da mộc căng khỏe</div></div>
                </div>
              </div>
            </div>
          </div>

          <div class="beat reveal">
            <div class="beat-frame"><img loading="lazy" src="{imgs[2]}"><span class="ts">0:03</span></div>
            <div class="beat-body">
              <p class="zh">Ném cushion trắng bay ngang mặt &amp; hét lớn</p>
              <p class="vi">Cushion bay ngang mặt, Creator giật mình hét lên "Á!"</p>
              <p class="note">Pattern interrupt (ngắt quãng chú ý) để tạo kịch tính, kết thúc màn hook dồn dập.</p>
              <div class="matrix">
                <div class="cam">
                  <div class="mlbl cam-lbl"><b>Góc máy</b><span>CAMERA</span></div>
                  <div class="cam-parts">
                    <span class="cam-seg"><i>Cỡ cảnh</i>Cận rộng (MCU) $\rightarrow$ Cắt nhanh sang Cận (CU)</span>
                    <span class="cam-seg"><i>Góc</i>Ngang tầm mắt</span>
                    <span class="cam-seg"><i>Chuyển động</i>Tĩnh, cắt cảnh nhanh</span>
                  </div>
                </div>
                <div class="mgrid">
                  <div class="mrow"><div class="mlbl"><b>Hành động</b><span>ACTION</span></div><div class="mval">Hét lên bất ngờ, giơ hai tay ôm má tỏ vẻ hoảng hốt</div></div>
                  <div class="mrow"><div class="mlbl"><b>Bối cảnh</b><span>SETTING</span></div><div class="mval">Phòng ngủ, điều hòa bật phía sau</div></div>
                  <div class="mrow"><div class="mlbl"><b>Âm thanh</b><span>SOUND</span></div><div class="mval">Tiếng hét lớn "Á!" kết hợp tiếng gió thổi bay</div></div>
                  <div class="mrow"><div class="mlbl"><b>Trang phục</b><span>WARDROBE</span></div><div class="mval">Áo thun xám sọc, tóc xốc xếch nhẹ</div></div>
                  <div class="mrow"><div class="mlbl"><b>Diễn viên</b><span>CAST</span></div><div class="mval">Nữ creator biểu cảm sinh động</div></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <!-- MAN 2 -->
      <section class="act reveal">
        <div class="act-head">
          <div class="act-no">02</div>
          <div>
            <div class="act-range">0:08–0:21</div>
            <h3 class="act-title">Màn 2 · Giới thiệu &amp; Trực quan hóa hạt phấn</h3>
            <p class="act-sum">Giới thiệu phấn phủ nén chống nắng CIMEE, trực quan hóa khả năng dặm phấn mịn màng không mốc nền như cài filter.</p>
          </div>
        </div>
        <div class="beats">
          
          <div class="beat reveal">
            <div class="beat-frame"><img loading="lazy" src="{imgs[3]}"><span class="ts">0:07</span></div>
            <div class="beat-body">
              <p class="zh">Giơ hộp phấn phủ nén CIMEE (Castlen)</p>
              <p class="vi">"Để có một lớp nền bền đẹp như vậy tôi đã sử dụng phấn phủ của nhà Castlen (CIMEE) nha mấy bà."</p>
              <p class="note">Giơ cận cảnh vỏ hộp phấn nhám mờ thiết kế tối giản, mở nắp khoe khay phấn mịn.</p>
              <div class="matrix">
                <div class="cam">
                  <div class="mlbl cam-lbl"><b>Góc máy</b><span>CAMERA</span></div>
                  <div class="cam-parts">
                    <span class="cam-seg"><i>Cỡ cảnh</i>Cận (CU) sản phẩm trên tay</span>
                    <span class="cam-seg"><i>Góc</i>Ngang hoặc hơi cúi</span>
                    <span class="cam-seg"><i>Chuyển động</i>Tĩnh, xóa phông nhẹ</span>
                  </div>
                </div>
                <div class="mgrid">
                  <div class="mrow"><div class="mlbl"><b>Hành động</b><span>ACTION</span></div><div class="mval">Cầm hộp phấn giơ sát camera, ngón tay chỉ vào nhãn</div></div>
                  <div class="mrow"><div class="mlbl"><b>Bối cảnh</b><span>SETTING</span></div><div class="mval">Góc bàn trang điểm</div></div>
                  <div class="mrow"><div class="mlbl"><b>Âm thanh</b><span>SOUND</span></div><div class="mval">VO hào hứng giới thiệu giải pháp nền đẹp</div></div>
                  <div class="mrow"><div class="mlbl"><b>Trang phục</b><span>WARDROBE</span></div><div class="mval">Áo thun xám, móng tay sơn đỏ sang trọng</div></div>
                  <div class="mrow"><div class="mlbl"><b>Diễn viên</b><span>CAST</span></div><div class="mval">Nữ creator cầm sản phẩm tinh tế</div></div>
                </div>
              </div>
            </div>
          </div>

          <div class="beat reveal">
            <div class="beat-frame"><img loading="lazy" src="{imgs[4]}"><span class="ts">0:11</span></div>
            <div class="beat-body">
              <p class="zh">Dặm phấn nhẹ nhàng lên má và cánh mũi</p>
              <p class="vi">"Đã mỏng nhẹ tự nhiên mà lại còn chống nắng... chỉ có phấn nén nhà Castlen (CIMEE)"</p>
              <p class="note">Cận cảnh thao tác dặm bông phấn nhẹ lên mặt, chỉ số chống nắng SPF 50+ PA+++ hiện lên.</p>
              <div class="matrix">
                <div class="cam">
                  <div class="mlbl cam-lbl"><b>Góc máy</b><span>CAMERA</span></div>
                  <div class="cam-parts">
                    <span class="cam-seg"><i>Cỡ cảnh</i>Cận (CU) mặt nghiêng</span>
                    <span class="cam-seg"><i>Góc</i>Ngang tầm mắt</span>
                    <span class="cam-seg"><i>Chuyển động</i>Tĩnh, bám sát thao tác</span>
                  </div>
                </div>
                <div class="mgrid">
                  <div class="mrow"><div class="mlbl"><b>Hành động</b><span>ACTION</span></div><div class="mval">Dùng bông phấn dặm lên một bên má, vỗ nhẹ</div></div>
                  <div class="mrow"><div class="mlbl"><b>Bối cảnh</b><span>SETTING</span></div><div class="mval">Ánh sáng softbox chiếu nghiêng</div></div>
                  <div class="mrow"><div class="mlbl"><b>Âm thanh</b><span>SOUND</span></div><div class="mval">VO thuyết phục về độ mỏng nhẹ + chống nắng</div></div>
                  <div class="mrow"><div class="mlbl"><b>Trang phục</b><span>WARDROBE</span></div><div class="mval">Đeo nhẫn vàng ở ngón áp út làm điểm nhấn</div></div>
                  <div class="mrow"><div class="mlbl"><b>Diễn viên</b><span>CAST</span></div><div class="mval">Nữ creator da mộc mịn</div></div>
                </div>
              </div>
            </div>
          </div>

          <div class="beat reveal">
            <div class="beat-frame"><img loading="lazy" src="{imgs[5]}"><span class="ts">0:18</span></div>
            <div class="beat-body">
              <p class="zh">Cận cảnh da mặt mịn như lọc filter</p>
              <p class="vi">"Trời ơi phủ phấn xong mà cái mặt như kiểu được cài filter không á."</p>
              <p class="note">Nghiêng mặt sát camera để khoe làn da mịn màng, lỗ chân lông biến mất hoàn toàn.</p>
              <div class="matrix">
                <div class="cam">
                  <div class="mlbl cam-lbl"><b>Góc máy</b><span>CAMERA</span></div>
                  <div class="cam-parts">
                    <span class="cam-seg"><i>Cỡ cảnh</i>Cận (CU) $\rightarrow$ Cực cận (ECU) má</span>
                    <span class="cam-seg"><i>Góc</i>Hơi cao chếch xuống</span>
                    <span class="cam-seg"><i>Chuyển động</i>Tĩnh, bắt nét sâu</span>
                  </div>
                </div>
                <div class="mgrid">
                  <div class="mrow"><div class="mlbl"><b>Hành động</b><span>ACTION</span></div><div class="mval">Mỉm cười nhẹ, xoay má đón sáng khoe hiệu ứng mịn lì</div></div>
                  <div class="mrow"><div class="mlbl"><b>Bối cảnh</b><span>SETTING</span></div><div class="mval">Background phòng mờ dịu</div></div>
                  <div class="mrow"><div class="mlbl"><b>Âm thanh</b><span>SOUND</span></div><div class="mval">VO cảm thán bất ngờ về hiệu ứng mịn da</div></div>
                  <div class="mrow"><div class="mlbl"><b>Trang phục</b><span>WARDROBE</span></div><div class="mval">Tóc buông xõa hai bên vai</div></div>
                  <div class="mrow"><div class="mlbl"><b>Diễn viên</b><span>CAST</span></div><div class="mval">Nữ creator mặt phủ phấn mịn lì</div></div>
                </div>
              </div>
            </div>
          </div>

          <div class="beat reveal">
            <div class="beat-frame"><img loading="lazy" src="{imgs[6]}"><span class="ts">0:20</span></div>
            <div class="beat-body">
              <p class="zh">Khoe nắp hộp phấn bóng loáng tráng gương</p>
              <p class="vi">Giới thiệu thiết kế nắp tráng gương độc đáo của hộp phấn CIMEE</p>
              <p class="note">Chi tiết thiết kế nắp tráng gương sang trọng phản chiếu trực tiếp khuôn mặt xinh đẹp của creator.</p>
              <div class="matrix">
                <div class="cam">
                  <div class="mlbl cam-lbl"><b>Góc máy</b><span>CAMERA</span></div>
                  <div class="cam-parts">
                    <span class="cam-seg"><i>Cỡ cảnh</i>Cận (CU) hộp phấn tráng gương</span>
                    <span class="cam-seg"><i>Góc</i>Ngang tầm mắt</span>
                    <span class="cam-seg"><i>Chuyển động</i>Tĩnh, lấy nét vào gương phản chiếu</span>
                  </div>
                </div>
                <div class="mgrid">
                  <div class="mrow"><div class="mlbl"><b>Hành động</b><span>ACTION</span></div><div class="mval">Cầm hộp phấn soi gương, đưa sát camera để lộ phản chiếu mặt mộc</div></div>
                  <div class="mrow"><div class="mlbl"><b>Bối cảnh</b><span>SETTING</span></div><div class="mval">Ánh đèn vàng ấm áp</div></div>
                  <div class="mrow"><div class="mlbl"><b>Âm thanh</b><span>SOUND</span></div><div class="mval">Nhạc nền chuyển nhịp êm tai</div></div>
                  <div class="mrow"><div class="mlbl"><b>Trang phục</b><span>WARDROBE</span></div><div class="mval">Móng tay đỏ làm nổi bật nắp gương màu bạc/hồng</div></div>
                  <div class="mrow"><div class="mlbl"><b>Diễn viên</b><span>CAST</span></div><div class="mval">Nữ creator tương tác gương phấn</div></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <!-- MAN 3 -->
      <section class="act reveal">
        <div class="act-head">
          <div class="act-no">03</div>
          <div>
            <div class="act-range">0:21–0:33</div>
            <h3 class="act-title">Màn 3 · Thử thách dội nước &amp; Lau bông tẩy trang cực hạn</h3>
            <p class="act-sum">Chứng minh khả năng bám nền chống nước, kiềm dầu cực hạn bằng cách dội nước ào ạt và lau bông tẩy trang không lem trôi.</p>
          </div>
        </div>
        <div class="beats">
          
          <div class="beat reveal">
            <div class="beat-frame"><img loading="lazy" src="{imgs[7]}"><span class="ts">0:22</span></div>
            <div class="beat-body">
              <p class="zh">Đứng dưới vòi hoa sen phun nước xối xả</p>
              <p class="vi">"Tôi đi chơi cỡ 7 tiếng mới về mà lớp nền này không hề xi nhê..."</p>
              <p class="note">Chứng minh thời gian bám bền bằng cảnh tắm dưới vòi hoa sen cực kỳ chân thực và dũng cảm.</p>
              <div class="matrix">
                <div class="cam">
                  <div class="mlbl cam-lbl"><b>Góc máy</b><span>CAMERA</span></div>
                  <div class="cam-parts">
                    <span class="cam-seg"><i>Cỡ cảnh</i>Trung cảnh (MS)</span>
                    <span class="cam-seg"><i>Góc</i>Ngang tầm mắt</span>
                    <span class="cam-seg"><i>Chuyển động</i>Tĩnh, máy quay chống nước</span>
                  </div>
                </div>
                <div class="mgrid">
                  <div class="mrow"><div class="mlbl"><b>Hành động</b><span>ACTION</span></div><div class="mval">Đứng dưới tia nước vòi hoa sen phun trực diện vào mặt, chớp mắt</div></div>
                  <div class="mrow"><div class="mlbl"><b>Bối cảnh</b><span>SETTING</span></div><div class="mval">Phòng tắm lát gạch trắng, ánh sáng dịu</div></div>
                  <div class="mrow"><div class="mlbl"><b>Âm thanh</b><span>SOUND</span></div><div class="mval">Tiếng xối nước của vòi sen ào ạt</div></div>
                  <div class="mrow"><div class="mlbl"><b>Trang phục</b><span>WARDROBE</span></div><div class="mval">Tóc ướt nhẹp bám sát da đầu, không trôi eyeliner</div></div>
                  <div class="mrow"><div class="mlbl"><b>Diễn viên</b><span>CAST</span></div><div class="mval">Nữ creator đứng dưới vòi sen</div></div>
                </div>
              </div>
            </div>
          </div>

          <div class="beat reveal">
            <div class="beat-frame"><img loading="lazy" src="{imgs[8]}"><span class="ts">0:26</span></div>
            <div class="beat-body">
              <p class="zh">Dội nước từ cốc đỏ xối xả lên mặt mộc lần 2</p>
              <p class="vi">"Để xem độ bền tôi sẽ test cùng với nước nhé."</p>
              <p class="note">Quay lại bối cảnh phòng ngủ dội thêm một cốc nước lớn thứ hai để củng cố độ uy tín.</p>
              <div class="matrix">
                <div class="cam">
                  <div class="mlbl cam-lbl"><b>Góc máy</b><span>CAMERA</span></div>
                  <div class="cam-parts">
                    <span class="cam-seg"><i>Cỡ cảnh</i>Cận rộng (MCU)</span>
                    <span class="cam-seg"><i>Góc</i>Ngang tầm mắt</span>
                    <span class="cam-seg"><i>Chuyển động</i>Tĩnh</span>
                  </div>
                </div>
                <div class="mgrid">
                  <div class="mrow"><div class="mlbl"><b>Hành động</b><span>ACTION</span></div><div class="mval">Cầm cốc nước đỏ dội mạnh lần hai từ trán xuống cằm</div></div>
                  <div class="mrow"><div class="mlbl"><b>Bối cảnh</b><span>SETTING</span></div><div class="mval">Góc phòng trang điểm</div></div>
                  <div class="mrow"><div class="mlbl"><b>Âm thanh</b><span>SOUND</span></div><div class="mval">Tiếng nước xối giòn giã</div></div>
                  <div class="mrow"><div class="mlbl"><b>Trang phục</b><span>WARDROBE</span></div><div class="mval">Áo thun xám ướt vệt nước trước ngực</div></div>
                  <div class="mrow"><div class="mlbl"><b>Diễn viên</b><span>CAST</span></div><div class="mval">Nữ creator thực hiện test nước</div></div>
                </div>
              </div>
            </div>
          </div>

          <div class="beat reveal">
            <div class="beat-frame"><img loading="lazy" src="{imgs[9]}"><span class="ts">0:29</span></div>
            <div class="beat-body">
              <p class="zh">Tát/táp hai má ướt nước để kiểm tra độ trượt</p>
              <p class="vi">"Nói chung là có táp như thế này hay như thế nào đi chăng nữa..."</p>
              <p class="note">Creator dùng tay táp mạnh vào má ướt nước, chứng minh hạt phấn bám chặt không bị trượt nền.</p>
              <div class="matrix">
                <div class="cam">
                  <div class="mlbl cam-lbl"><b>Góc máy</b><span>CAMERA</span></div>
                  <div class="cam-parts">
                    <span class="cam-seg"><i>Cỡ cảnh</i>Cận (CU) mặt</span>
                    <span class="cam-seg"><i>Góc</i>Ngang tầm mắt</span>
                    <span class="cam-seg"><i>Chuyển động</i>Tĩnh</span>
                  </div>
                </div>
                <div class="mgrid">
                  <div class="mrow"><div class="mlbl"><b>Hành động</b><span>ACTION</span></div><div class="mval">Dùng lòng bàn tay vỗ/táp nhanh liên tục vào hai má đầy nước</div></div>
                  <div class="mrow"><div class="mlbl"><b>Bối cảnh</b><span>SETTING</span></div><div class="mval">Góc phòng ngủ</div></div>
                  <div class="mrow"><div class="mlbl"><b>Âm thanh</b><span>SOUND</span></div><div class="mval">Tiếng táp má "bộp bộp" cực kỳ thực tế (Foley)</div></div>
                  <div class="mrow"><div class="mlbl"><b>Trang phục</b><span>WARDROBE</span></div><div class="mval">Áo thun xám sọc</div></div>
                  <div class="mrow"><div class="mlbl"><b>Diễn viên</b><span>CAST</span></div><div class="mval">Nữ creator hành động dứt khoát</div></div>
                </div>
              </div>
            </div>
          </div>

          <div class="beat reveal">
            <div class="beat-frame"><img loading="lazy" src="{imgs[10]}"><span class="ts">0:31</span></div>
            <div class="beat-body">
              <p class="zh">Dùng bông tẩy trang lau má đầy nước</p>
              <p class="vi">Lau mạnh bông tẩy trang lên má để kiểm tra độ trôi phấn</p>
              <p class="note">Dùng miếng bông tẩy trang trắng miết mạnh lên vùng da má ẩm ướt để xem phấn có dính ra bông.</p>
              <div class="matrix">
                <div class="cam">
                  <div class="mlbl cam-lbl"><b>Góc máy</b><span>CAMERA</span></div>
                  <div class="cam-parts">
                    <span class="cam-seg"><i>Cỡ cảnh</i>Cận (CU) mặt</span>
                    <span class="cam-seg"><i>Góc</i>Ngang tầm mắt</span>
                    <span class="cam-seg"><i>Chuyển động</i>Tripod tĩnh</span>
                  </div>
                </div>
                <div class="mgrid">
                  <div class="mrow"><div class="mlbl"><b>Hành động</b><span>ACTION</span></div><div class="mval">Cầm bông tẩy trang miết mạnh từ mũi ra má</div></div>
                  <div class="mrow"><div class="mlbl"><b>Bối cảnh</b><span>SETTING</span></div><div class="mval">Phòng ngủ sáng rõ</div></div>
                  <div class="mrow"><div class="mlbl"><b>Âm thanh</b><span>SOUND</span></div><div class="mval">Tiếng miết da nhẹ nhàng</div></div>
                  <div class="mrow"><div class="mlbl"><b>Trang phục</b><span>WARDROBE</span></div><div class="mval">Áo thun xám, móng tay sơn đỏ</div></div>
                  <div class="mrow"><div class="mlbl"><b>Diễn viên</b><span>CAST</span></div><div class="mval">Nữ creator lau mặt</div></div>
                </div>
              </div>
            </div>
          </div>

          <div class="beat reveal">
            <div class="beat-frame"><img loading="lazy" src="{imgs[11]}"><span class="ts">0:32</span></div>
            <div class="beat-body">
              <p class="zh">Khoe miếng bông tẩy trang trắng tinh sạch sẽ</p>
              <p class="vi">"Thì cái lớp nền này nó không hề xi nhê"</p>
              <p class="note">Đưa miếng bông tẩy trang trắng sạch tinh lên sát camera để chứng minh lớp phấn không hề bị trôi rụng ra ngoài.</p>
              <div class="matrix">
                <div class="cam">
                  <div class="mlbl cam-lbl"><b>Góc máy</b><span>CAMERA</span></div>
                  <div class="cam-parts">
                    <span class="cam-seg"><i>Cỡ cảnh</i>Cực cận (ECU) bông tẩy trang</span>
                    <span class="cam-seg"><i>Góc</i>Ngang tầm mắt</span>
                    <span class="cam-seg"><i>Chuyển động</i>Tĩnh, lấy nét tự động vào bông</span>
                  </div>
                </div>
                <div class="mgrid">
                  <div class="mrow"><div class="mlbl"><b>Hành động</b><span>ACTION</span></div><div class="mval">Nâng miếng bông tẩy trang giơ sát ống kính máy quay</div></div>
                  <div class="mrow"><div class="mlbl"><b>Bối cảnh</b><span>SETTING</span></div><div class="mval">Góc phòng trang điểm</div></div>
                  <div class="mrow"><div class="mlbl"><b>Âm thanh</b><span>SOUND</span></div><div class="mval">VO khẳng định độ bám màu xuất sắc của phấn</div></div>
                  <div class="mrow"><div class="mlbl"><b>Trang phục</b><span>WARDROBE</span></div><div class="mval">Khuyên tai ngọc trai/vàng nhỏ lấp lánh</div></div>
                  <div class="mrow"><div class="mlbl"><b>Diễn viên</b><span>CAST</span></div><div class="mval">Bàn tay model giơ bông</div></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <!-- MAN 4 -->
      <section class="act reveal">
        <div class="act-head">
          <div class="act-no">04</div>
          <div>
            <div class="act-range">0:33–0:46</div>
            <h3 class="act-title">Màn 4 · Review da mịn &amp; Lời kêu gọi CTA chốt deal</h3>
            <p class="act-sum">Khoe layout make-up hoàn hảo bóng khỏe, bóc seal hộp phấn bóng bẩy và kêu gọi mua hàng quyết liệt.</p>
          </div>
        </div>
        <div class="beats">
          
          <div class="beat reveal">
            <div class="beat-frame"><img loading="lazy" src="{imgs[12]}"><span class="ts">0:34</span></div>
            <div class="beat-body">
              <p class="zh">Model khoe lớp nền mịn màng, son đỏ quyến rũ</p>
              <p class="vi">"Hạt phấn của nó rất là bé... có dặm đi dặm lại vẫn không bị mốc"</p>
              <p class="note">Creator trang điểm lộng lẫy, diện áo ren đen sang chảnh, khoe lớp nền tơi mịn không mốc dù dặm nhiều lần.</p>
              <div class="matrix">
                <div class="cam">
                  <div class="mlbl cam-lbl"><b>Góc máy</b><span>CAMERA</span></div>
                  <div class="cam-parts">
                    <span class="cam-seg"><i>Cỡ cảnh</i>Cận rộng (MCU) nửa người</span>
                    <span class="cam-seg"><i>Góc</i>Ngang tầm mắt</span>
                    <span class="cam-seg"><i>Chuyển động</i>Tĩnh, xóa phông dịu</span>
                  </div>
                </div>
                <div class="mgrid">
                  <div class="mrow"><div class="mlbl"><b>Hành động</b><span>ACTION</span></div><div class="mval">Nghiêng mặt tương tác ngọt ngào, tay vuốt nhẹ cằm</div></div>
                  <div class="mrow"><div class="mlbl"><b>Bối cảnh</b><span>SETTING</span></div><div class="mval">Góc phòng ngủ sang trọng tông màu be</div></div>
                  <div class="mrow"><div class="mlbl"><b>Âm thanh</b><span>SOUND</span></div><div class="mval">VO khẳng định độ nhỏ mịn của hạt phấn và cam kết không mốc da</div></div>
                  <div class="mrow"><div class="mlbl"><b>Trang phục</b><span>WARDROBE</span></div><div class="mval">Áo ren đen quyến rũ, tóc bới cao thanh lịch, môi son đỏ đậm</div></div>
                  <div class="mrow"><div class="mlbl"><b>Diễn viên</b><span>CAST</span></div><div class="mval">Nữ creator diện đồ trang điểm hoàn chỉnh</div></div>
                </div>
              </div>
            </div>
          </div>

          <div class="beat reveal">
            <div class="beat-frame"><img loading="lazy" src="{imgs[13]}"><span class="ts">0:45</span></div>
            <div class="beat-body">
              <p class="zh">Bóc lớp màng ni-lông bảo vệ trên nắp tráng gương</p>
              <p class="vi">"Video này tôi không hề seeding... quất liền một em đi mấy bà!"</p>
              <p class="note">Hành động bóc lớp seal tráng gương cực kỳ "satisfying" (đã mắt) tạo động lực sở hữu sản phẩm mới toanh.</p>
              <div class="matrix">
                <div class="cam">
                  <div class="mlbl cam-lbl"><b>Góc máy</b><span>CAMERA</span></div>
                  <div class="cam-parts">
                    <span class="cam-seg"><i>Cỡ cảnh</i>Cận (CU) sản phẩm trên tay</span>
                    <span class="cam-seg"><i>Góc</i>Ngang hoặc hơi cúi</span>
                    <span class="cam-seg"><i>Chuyển động</i>Tĩnh, lấy nét cực nét</span>
                  </div>
                </div>
                <div class="mgrid">
                  <div class="mrow"><div class="mlbl"><b>Hành động</b><span>ACTION</span></div><div class="mval">Dùng ngón tay bóc nhẹ lớp màng bọc nắp gương, hé lộ nắp bóng loáng</div></div>
                  <div class="mrow"><div class="mlbl"><b>Bối cảnh</b><span>SETTING</span></div><div class="mval">Bàn trang điểm đèn LED sáng</div></div>
                  <div class="mrow"><div class="mlbl"><b>Âm thanh</b><span>SOUND</span></div><div class="mval">SFX tiếng bóc lớp seal nilon "xoẹt" giòn giã + Lời khuyên quất liền</div></div>
                  <div class="mrow"><div class="mlbl"><b>Trang phục</b><span>WARDROBE</span></div><div class="mval">Móng tay sơn đỏ nổi bật trên nền gương bạc phản chiếu</div></div>
                  <div class="mrow"><div class="mlbl"><b>Diễn viên</b><span>CAST</span></div><div class="mval">Đôi tay người mẫu bóc seal</div></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  </section>

  <!-- DEEP BREAKDOWN -->
  <section class="sec">
    <div class="sec-head"><span class="sec-no">04</span><h2>Bóc tách khung &amp; 3 cảnh then chốt</h2></div>
    <div class="cards">
      <div class="card reveal">
        <h4>Khung tổng</h4>
        <p class="big">Hook Sốc $\rightarrow$ Test cực cực hạn $\rightarrow$ Cam kết đắt giá $\rightarrow$ CTA</p>
        <p>Video bắt đầu bằng cú dội nước trực tiếp gây chú ý tức thì, sau đó tuần tự dặm phấn $\rightarrow$ test nước lần 2 $\rightarrow$ lau bông tẩy trang $\rightarrow$ bóc seal gương sang chảnh để dứt điểm quá trình bán hàng.</p>
      </div>
      <div class="card reveal">
        <h4>3 cảnh then chốt</h4>
        <p><b>1. Cảnh gây tò mò:</b> Giây 0:01 – Dội nước xối xả lên mặt.<br>
           <b>2. Cảnh tạo chuyển đổi:</b> Giây 0:32 – Miếng bông tẩy trang trắng tinh không dính một hạt phấn sau lau mạnh.<br>
           <b>3. Cảnh dẫn mua hàng (CTA):</b> Giây 0:45 – Bóc lớp seal gương bóng loáng cực thích mắt và khuyên quất liền.</p>
      </div>
    </div>
  </section>

  <!-- CHECKLIST -->
  <section class="sec">
    <div class="sec-head"><span class="sec-no">05</span><h2>Checklist hiệu quả 7 điểm</h2></div>
    <table class="tbl">
      <thead>
        <tr><th>Tiêu chí hiệu quả</th><th>Mức độ</th><th>Ghi chú phân tích chi tiết</th></tr>
      </thead>
      <tbody>
        <tr class="reveal">
          <td class="c-crit">① 3s đầu giữ người</td>
          <td><span class="chip ok">Đạt</span></td>
          <td class="c-note">Dội cốc nước lên mặt ngay giây đầu, cushion bay giật mình tạo tò mò lớn.</td>
        </tr>
        <tr class="reveal">
          <td class="c-crit">② Pain point cụ thể</td>
          <td><span class="chip ok">Đạt</span></td>
          <td class="c-note">Giải quyết triệt để nỗi lo mốc nền, trôi nền khi gặp nắng nóng, đổ mồ hôi hay dính nước.</td>
        </tr>
        <tr class="reveal">
          <td class="c-crit">③ Kết quả nhìn thấy</td>
          <td><span class="chip ok">Đạt</span></td>
          <td class="c-note">Chứng minh trực tiếp bằng bông tẩy trang lau mạnh nhưng vẫn trắng sạch hoàn toàn.</td>
        </tr>
        <tr class="reveal">
          <td class="c-crit">④ Có so sánh</td>
          <td><span class="chip mid">Một phần</span></td>
          <td class="c-note">Không so sánh rõ rệt trước/sau trên cùng khung hình, nhưng so sánh ngầm qua hiệu ứng làm mịn da tựa filter.</td>
        </tr>
        <tr class="reveal">
          <td class="c-crit">⑤ Quá trình sử dụng</td>
          <td><span class="chip ok">Đạt</span></td>
          <td class="c-note">Thể hiện từ bước dặm phấn $\rightarrow$ đi chơi $\rightarrow$ dội nước vòi sen $\rightarrow$ dội cốc nước $\rightarrow$ lau bông kiểm chứng.</td>
        </tr>
        <tr class="reveal">
          <td class="c-crit">⑥ Cảnh chuyển đổi mạnh</td>
          <td><span class="chip ok">Đạt</span></td>
          <td class="c-note">Cảnh miếng bông tẩy trang sạch tinh sau lau mặt ướt cực kỳ đắt giá, đánh tan mọi hoài nghi về độ bám.</td>
        </tr>
        <tr class="reveal">
          <td class="c-crit">⑦ CTA rõ ràng</td>
          <td><span class="chip ok">Đạt</span></td>
          <td class="c-note">Hành động bóc seal gương bóng bẩy đi kèm câu nói "Quất liền một em đi, đảm bảo không thất vọng".</td>
        </tr>
      </tbody>
    </table>
  </section>

  <!-- BOOM FORMULA -->
  <section class="sec">
    <div class="sec-head"><span class="sec-no">06</span><h2>Chấm theo công thức bùng nổ</h2></div>
    <div class="formula reveal">
      <div class="flabel">Công thức bùng nổ tổng quát</div>
      <div class="fbody"><b>[Mở đầu dội nước cực sốc]</b> + <b>[Thử nghiệm bông tẩy trang lau sạch tinh trực quan]</b> = <b>[Video viral đỉnh cao &amp; tỷ lệ ra đơn cực lớn]</b></div>
    </div>
    <p class="lead">Video này đạt điểm tối đa về độ **Trực quan hóa Điểm bán** (Waterproof/Kiềm dầu) bằng việc đưa cơ thể vào chịu thử thách khắc nghiệt (dội nước, tắm vòi sen). Cách kể chuyện tự nhiên và câu khẳng định "nguyện cả đời seeding" giúp kéo gần khoảng cách, nâng cao độ tin cậy của sản phẩm.</p>
  </section>

  <!-- FORMULA FOR REUSE -->
  <section class="sec">
    <div class="sec-head"><span class="sec-no">07</span><h2>Công thức tái dùng</h2></div>
    <div class="formula reveal">
      <div class="flabel">Cấu trúc hình ảnh</div>
      <div class="fbody"><b>[Mở đầu]</b> Hành động sốc với nước/đạo cụ bay $\rightarrow$ <b>[Nội dung]</b> Dặm thử sản phẩm + cận cảnh làn da căng mịn $\rightarrow$ <b>[Test cực hạn]</b> Tắm/Dội nước lần 2 + táp má $\rightarrow$ <b>[Chứng minh]</b> Áp bông tẩy trang lau mạnh và giơ miếng bông sạch tinh $\rightarrow$ <b>[Chốt]</b> Khoe layout makeup lung linh + bóc seal gương.</div>
    </div>
    <div class="formula reveal">
      <div class="flabel">Cấu trúc lời thoại</div>
      <div class="fbody"><b>Đặt câu hỏi mâu thuẫn</b> ("Phấn phủ mà chống nắng?") $\rightarrow$ <b>Giới thiệu điểm bán chống nước/mỏng nhẹ</b> $\rightarrow$ <b>Kể câu chuyện bám bền thực tế</b> ("đi chơi 7 tiếng trời nắng nền không xi nhê") $\rightarrow$ <b>Cam kết uy tín cá nhân</b> ("không seeding nhưng nguyện cả đời seeding") $\rightarrow$ <b>CTA quyết liệt</b> ("quất liền một em").</div>
    </div>
  </section>

  <!-- NONELAB IMPLEMENTATION -->
  <section class="sec">
    <div class="sec-head"><span class="sec-no">08</span><h2>Lắp khung vào Nonelab</h2></div>
    <div class="cards" style="margin-bottom:22px">
      <div class="card reveal">
        <h4>Thương hiệu Cimee</h4>
        <p class="big">Phấn phủ chống nắng Cimee</p>
        <p>Lắp dòng phấn phủ kiềm dầu chống nắng của Cimee vào kịch bản này. Tận dụng hình ảnh dội nước và bông tẩy trang để đánh bật các thương hiệu đối thủ.</p>
      </div>
      <div class="card reveal">
        <h4>Thương hiệu Nerman</h4>
        <p class="big">Phấn kiềm dầu nam Nerman</p>
        <p>Bê nguyên khung kịch bản dội nước và lau bông tẩy trang cho tệp nam giới hay vận động thể thao, bóng đá, gym ra mồ hôi nhiều để chứng minh độ bám lì.</p>
      </div>
      <div class="card reveal">
        <h4>Đối chuẩn chiến lược</h4>
        <p class="big">Đối chuẩn nhóm ① &amp; ⑤</p>
        <p>Học tập cách chuyển tải thông điệp bằng hình ảnh thay vì lời nói suông. Sử dụng bông tẩy trang trắng sạch làm bằng chứng đanh thép nhất.</p>
      </div>
    </div>
    
    <h4 style="font-family:var(--ui);font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--amber);margin:0 0 6px">5 ý tưởng góc quay đẻ ra cho sản phẩm Nonelab</h4>
    <ul class="klist">
      <li class='reveal'><b>Góc 1 — Thử thách chạy bộ/đổ mồ hôi:</b> KOC dặm phấn phủ Cimee, chạy bộ trên máy chạy 30 phút mồ hôi đầm đìa, sau đó dùng khăn giấy thấm nhẹ mặt $\rightarrow$ khăn giấy hoàn toàn không bị dính kem phấn màu.</li>
      <li class='reveal'><b>Góc 2 — Test nửa mặt dưới mưa nhân tạo:</b> Dùng bình xịt phun sương đẫm nước lên nửa mặt dùng phấn Cimee và nửa mặt không dùng $\rightarrow$ bên không dùng loang lổ nền chảy dòng, bên dùng phấn hạt nước tự động đọng lại thành giọt lăn đi (hiệu ứng lá sen).</li>
      <li class='reveal'><b>Góc 3 — Cận cảnh hạt phấn mịn thả trên nước:</b> Thả một muỗng phấn phủ Cimee vào cốc nước $\rightarrow$ phấn nổi hoàn toàn trên mặt nước và khô ráo khi múc ra, chứng minh công nghệ kháng nước, kiềm dầu.</li>
      <li class='reveal'><b>Góc 4 — Khảo sát đường phố 8 tiếng:</b> KOC trang điểm dạo phố từ sáng đến tối muộn, liên tục quay selfie đo thời gian $\rightarrow$ cuối ngày dặm bông tẩy trang khoe bông sạch tinh, nền mịn lì.</li>
      <li class='reveal'><b>Góc 5 — Bóc seal gương sành điệu:</b> KOC nữ bóc seal gương tráng bóng bẩy của hộp phấn Cimee trong quán cafe sang chảnh, phản chiếu đôi môi đỏ quyến rũ tạo cảm giác luxury thời thượng.</li>
    </ul>
    
    <div class="rule reveal">
      <div class="rl">Nguyên tắc vàng khi tái dùng</div>
      <p>Video gốc rất thành công ở khâu <b>Visual Test (dội nước + lau bông)</b> tạo niềm tin cực cao. Khi Nonelab áp dụng, cần giữ nguyên 100% các cú bấm dội nước thật và lau bông mộc mạc trước ống kính, tuyệt đối không cắt ghép hay chỉnh sửa ánh sáng ở các đoạn này để đảm bảo tính trung thực tối đa.</p>
    </div>
  </section>

  <!-- KHO -->
  <section class="sec" style="border-bottom:none">
    <div class="sec-head"><span class="sec-no">09</span><h2>Nạp kho</h2></div>
    <div class="two">
      <div>
        <h4 style="font-family:var(--ui);font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--amber);margin:0 0 6px">Kho lời thoại · 文案库</h4>
        <ul class="klist">
          <li class='reveal'>“Đầu tiên để có một cái lớp nền bền đẹp như vậy tôi đã sử dụng phấn phủ của nhà [Tên thương hiệu].”</li>
          <li class='reveal'>“Đã mỏng nhẹ tự nhiên mà lại còn chống nắng... chỉ có ở phấn phủ nhà [Tên thương hiệu] thôi.”</li>
          <li class='reveal'>“Tôi đi chơi cỡ 7 tiếng mới về mà cái lớp nền này nó không hề xi nhê một tí nào luôn á.”</li>
          <li class='reveal'>“Nói chung là có táp như thế này hay như thế nào đi chăng nữa thì lớp nền này nó không hề xi nhê.”</li>
          <li class='reveal'>“Video này tôi không hề seeding nhưng nếu có seeding tôi sẽ nguyện cả đời seeding em nó luôn á.”</li>
          <li class='reveal'>“Bà nào mà đang phân vân không biết nên mua không thì quất liền một em đi.”</li>
        </ul>
      </div>
      <div>
        <h4 style="font-family:var(--ui);font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--amber);margin:0 0 6px">Kho hình ảnh · 画面库</h4>
        <ul class="klist">
          <li class='reveal'>Cảnh dội cốc nước đỏ lên mặt tạo sốc thu hút.</li>
          <li class='reveal'>Cú ném cushion giật mình tạo ngắt quãng chú ý.</li>
          <li class='reveal'>Thao tác dặm phấn mịn màng lên da mặt.</li>
          <li class='reveal'>Cảnh tắm vòi sen nước phun xối xả lên mặt.</li>
          <li class='reveal'>Lau bông tẩy trang miết da má và giơ miếng bông sạch tinh sát camera.</li>
          <li class='reveal'>Hành động bóc màng nilon bảo vệ nắp gương bóng loáng của hộp phấn.</li>
        </ul>
      </div>
    </div>
  </section>

</main>

<footer class="wrap">
  Nonelab · Hệ thống video bùng nổ — Phiếu mổ xẻ theo khung Năm Lực. Tài liệu nội bộ cho team Brand Manager.
</footer>

<script>
const io=new IntersectionObserver((es)=>{{es.forEach(e=>{{if(e.isIntersecting){{e.target.classList.add('in');io.unobserve(e.target)}}}})}},{{threshold:.08,rootMargin:'0px 0px -8% 0px'}});
document.querySelectorAll('.reveal').forEach((el,i)=>{{el.style.transitionDelay=(Math.min(i%6,5)*40)+'ms';io.observe(el)}});
</script>
</body>
</html>
"""

    output_path.write_text(html_content, encoding="utf-8")
    print(f"HTML Report generated successfully at: {output_path}")
    artifacts_path.write_text(html_content, encoding="utf-8")
    print(f"HTML Report also saved in artifacts directory: {artifacts_path}")

if __name__ == "__main__":
    main()
