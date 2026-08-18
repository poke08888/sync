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
    video_path = "/Users/kevin/Desktop/Design lion bartender/snaptik.vn_7638612514955185428.mp4"
    output_dir = Path("/Users/kevin/.gemini/antigravity/scratch/nonelab-analysis")
    output_dir.mkdir(parents=True, exist_ok=True)
    output_path = output_dir / "mo-xe-carslan-powder.html"
    artifacts_path = Path("/Users/kevin/.gemini/antigravity/brain/f7fe03b5-6fd8-4945-9fea-1a43b2105972/mo-xe-carslan-powder.html")

    # Key timestamps to extract frames
    timestamps = {
        1: 1.0,    # Bẹo má mở đầu
        2: 3.0,    # Thử độ nảy cơ má
        3: 9.0,    # Đánh kem nền bằng cọ
        4: 14.0,   # Ấn ngón tay in dấu vân tay
        5: 21.0,   # Phủ phấn vùng mắt
        6: 23.0,   # Kẻ chân mày
        7: 30.0,   # Phủ phấn vùng mũi
        8: 34.0,   # Ấn ngón tay lần 2 kiểm tra khô ráo
        9: 40.0,   # Giơ hộp phấn Carslan xanh
        10: 42.0,  # Xoáy cọ lấy phấn
        11: 44.0,  # Dặm cọ lên má
        12: 56.0,  # Cọ nhỏ đi chi tiết rãnh cười
        13: 66.0,  # Bẹo má kiểm chứng cuối
        14: 68.0   # Mồ hôi ở phòng gym
    }

    # Extract base64 images
    imgs = {}
    for k, t in timestamps.items():
        print(f"Extracting frame at {t}s...")
        imgs[k] = extract_frame_as_base64(video_path, t)
        if not imgs[k]:
            imgs[k] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" # fallback

    # Build HTML content
    html_content = f"""<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Phiếu mổ xẻ video · Phấn phủ Carslan 2.0 Bản mát lạnh</title>
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
    <p class="sub">Carslan · Phấn phủ Carslan 2.0 Bản mát lạnh (Màu xanh) — Chiến dịch kiến thức "Tips nền siêu nền" chống trôi chống mốc</p>
    <dl class="meta">
      <div><dt>Nền tảng</dt><dd>TikTok / Douyin</dd></div>
      <div><dt>Thời lượng</dt><dd>1 phút 13 giây · dọc 9:16</dd></div>
      <div><dt>Thể loại</dt><dd>Hướng dẫn kỹ thuật trang điểm (Tutorial/Vlog)</dd></div>
      <div><dt>Sản phẩm</dt><dd>Phấn phủ Carslan 2.0 (Bản mát lạnh)</dd></div>
      <div><dt>Gương mặt</dt><dd>Nữ Creator xinh đẹp</dd></div>
      <div><dt>CTA</dt><dd>Quất liền một em · Trải nghiệm thực tế</dd></div>
    </dl>
  </div>
</header>

<main class="wrap">

  <!-- VERDICT -->
  <section class="sec">
    <div class="sec-head"><span class="sec-no">Chốt nhanh</span><h2>Vì sao nó chạy — và đâu là chỗ hở để ta vượt</h2></div>
    <p class="lead">Đây là video dạng <b style="color:var(--amber-hi)">Hướng dẫn kỹ thuật trang điểm (Tutorial) kết hợp Thử thách trực quan thực tế</b>. Creator khéo léo dùng kiến thức chuyên sâu về da để dạy người xem cách chờ kem nền set khô trước khi dặm phấn, tạo độ tin cậy tuyệt đối, sau đó bán sản phẩm cực kỳ tự nhiên.</p>
    <div class="verdict">
      <div class="vcard reveal"><div class="vlabel">Mở đầu bùng nổ</div><div class="vbig">Mạnh</div><p>Đánh thẳng nỗi đau "sợ bồ bẹo má trôi nền" kèm hình ảnh trực quan.</p></div>
      <div class="vcard reveal"><div class="vlabel">Điểm bán có hình</div><div class="vbig">Xuất sắc</div><p>Test ngón tay in dấu vân tay và cảnh đi tập gym đổ mồ hôi nền vẫn bám chặt.</p></div>
      <div class="vcard reveal"><div class="vlabel">Động cơ ra đơn</div><div class="vbig">Chuyên môn</div><p>Chia sẻ mẹo set nền hữu ích cho da khô, thuyết phục bằng kiến thức.</p></div>
      <div class="vcard reveal"><div class="vlabel">Đối chuẩn</div><div class="vbig">② &amp; ③</div><p>Giải pháp cho da khô sợ mốc nền + cùng nhóm khách chăm da.</p></div>
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
            <div class="act-range">0:00–0:15</div>
            <h3 class="act-title">Màn 1 · Hook Bẹo má &amp; Nêu nỗi sợ trôi nền</h3>
            <p class="act-sum">Mở đầu bằng nỗi sợ bẹo má của các cặp đôi để dẫn dắt đến giải pháp lớp nền bền bỉ, mỏng nhẹ cho da khô.</p>
          </div>
        </div>
        <div class="beats">
          
          <div class="beat reveal">
            <div class="beat-frame"><img loading="lazy" src="{imgs[1]}"><span class="ts">0:01</span></div>
            <div class="beat-body">
              <p class="zh">Creator tự bẹo má mạnh trước ống kính</p>
              <p class="vi">"Make up cho xinh nhưng mà không cho bồ bẹo má..."</p>
              <p class="note">Hook đánh trúng tâm lý sợ hỏng lớp trang điểm khi người yêu bẹo má.</p>
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
                  <div class="mrow"><div class="mlbl"><b>Hành động</b><span>ACTION</span></div><div class="mval">Dùng ngón tay bấu nhẹ má kéo sang bên, mỉm cười</div></div>
                  <div class="mrow"><div class="mlbl"><b>Bối cảnh</b><span>SETTING</span></div><div class="mval">Góc phòng ngủ, có bình hoa ly trắng phía sau</div></div>
                  <div class="mrow"><div class="mlbl"><b>Âm thanh</b><span>SOUND</span></div><div class="mval">Giọng nói tự nhiên, nhạc nền nhẹ nhàng</div></div>
                  <div class="mrow"><div class="mlbl"><b>Trang phục</b><span>WARDROBE</span></div><div class="mval">Áo hai dây màu be sữa, tóc đen dài</div></div>
                  <div class="mrow"><div class="mlbl"><b>Diễn viên</b><span>CAST</span></div><div class="mval">1 Nữ creator xinh xắn, da căng bóng</div></div>
                </div>
              </div>
            </div>
          </div>

          <div class="beat reveal">
            <div class="beat-frame"><img loading="lazy" src="{imgs[2]}"><span class="ts">0:03</span></div>
            <div class="beat-body">
              <p class="zh">Ấn ngón tay lên má ẩm để chỉ ra dấu vết</p>
              <p class="vi">"...là vì mọi người sợ bị trôi nền đúng không?"</p>
              <p class="note">Nêu lý do cốt lõi của nỗi sợ: kem nền dễ bị dịch chuyển hoặc để lại vết hằn nếu chưa set phấn.</p>
              <div class="matrix">
                <div class="cam">
                  <div class="mlbl cam-lbl"><b>Góc máy</b><span>CAMERA</span></div>
                  <div class="cam-parts">
                    <span class="cam-seg"><i>Cỡ cảnh</i>Cận (CU) $\rightarrow$ Cực cận (ECU) má</span>
                    <span class="cam-seg"><i>Góc</i>Hơi chếch bên má</span>
                    <span class="cam-seg"><i>Chuyển động</i>Tĩnh</span>
                  </div>
                </div>
                <div class="mgrid">
                  <div class="mrow"><div class="mlbl"><b>Hành động</b><span>ACTION</span></div><div class="mval">Ấn ngón trỏ lên gò má, chỉ tay vào nốt khuyết điểm rãnh cười</div></div>
                  <div class="mrow"><div class="mlbl"><b>Bối cảnh</b><span>SETTING</span></div><div class="mval">Phòng ngủ sáng sủa</div></div>
                  <div class="mrow"><div class="mlbl"><b>Âm thanh</b><span>SOUND</span></div><div class="mval">VO chia sẻ sự đồng cảm với người xem</div></div>
                  <div class="mrow"><div class="mlbl"><b>Trang phục</b><span>WARDROBE</span></div><div class="mval">Áo hai dây be sữa, sơn móng tay họa tiết dễ thương</div></div>
                  <div class="mrow"><div class="mlbl"><b>Diễn viên</b><span>CAST</span></div><div class="mval">Nữ creator tương tác sát màn hình</div></div>
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
            <div class="act-range">0:15–0:33</div>
            <h3 class="act-title">Màn 2 · Kỹ thuật đánh nền &amp; Chờ nền khô</h3>
            <p class="act-sum">Creator hướng dẫn đánh nền lỏng từ đầu và chỉ ra lỗi sai phổ biến: phủ phấn ngay khi nền còn ướt.</p>
          </div>
        </div>
        <div class="beats">
          
          <div class="beat reveal">
            <div class="beat-frame"><img loading="lazy" src="{imgs[3]}"><span class="ts">0:09</span></div>
            <div class="beat-body">
              <p class="zh">Creator dùng cọ tán kem nền lỏng lên da</p>
              <p class="vi">Bắt đầu đánh nền bằng kem nền giàu ẩm cho da khô</p>
              <p class="note">Creator dùng cọ dẹt quét một đường kem nền lỏng lên má. Hướng dẫn da khô nên chọn nền ẩm mượt.</p>
              <div class="matrix">
                <div class="cam">
                  <div class="mlbl cam-lbl"><b>Góc máy</b><span>CAMERA</span></div>
                  <div class="cam-parts">
                    <span class="cam-seg"><i>Cỡ cảnh</i>Cận (CU) mặt</span>
                    <span class="cam-seg"><i>Góc</i>Ngang tầm mắt</span>
                    <span class="cam-seg"><i>Chuyển động</i>Tĩnh, nét sâu trung bình</span>
                  </div>
                </div>
                <div class="mgrid">
                  <div class="mrow"><div class="mlbl"><b>Hành động</b><span>ACTION</span></div><div class="mval">Cầm cọ dẹt tán kem nền từ trong ra ngoài má, da mộc chưa trang điểm mắt</div></div>
                  <div class="mrow"><div class="mlbl"><b>Bối cảnh</b><span>SETTING</span></div><div class="mval">Bàn trang điểm sáng rõ</div></div>
                  <div class="mrow"><div class="mlbl"><b>Âm thanh</b><span>SOUND</span></div><div class="mval">VO giải thích thói quen dùng nền ẩm của da khô</div></div>
                  <div class="mrow"><div class="mlbl"><b>Trang phục</b><span>WARDROBE</span></div><div class="mval">Mặt mộc hoàn toàn, tóc kẹp gọn phía sau</div></div>
                  <div class="mrow"><div class="mlbl"><b>Diễn viên</b><span>CAST</span></div><div class="mval">Nữ creator mặt mộc, da khỏe</div></div>
                </div>
              </div>
            </div>
          </div>

          <div class="beat reveal">
            <div class="beat-frame"><img loading="lazy" src="{imgs[4]}"><span class="ts">0:14</span></div>
            <div class="beat-body">
              <p class="zh">Ấn ngón tay để lộ dấu vân tay lõm sâu trên nền ướt</p>
              <p class="vi">"Nên là sau khi đánh nền xong mà ấn vào nó vẫn bị lộ vết như thế này..."</p>
              <p class="note">Cận cảnh trực quan dấu vân tay hằn sâu trên da má ẩm kem nền, chứng minh nền chưa khô.</p>
              <div class="matrix">
                <div class="cam">
                  <div class="mlbl cam-lbl"><b>Góc máy</b><span>CAMERA</span></div>
                  <div class="cam-parts">
                    <span class="cam-seg"><i>Cỡ cảnh</i>Cực cận (ECU) má</span>
                    <span class="cam-seg"><i>Góc</i>Ngang hoặc chếch 45°</span>
                    <span class="cam-seg"><i>Chuyển động</i>Tĩnh, phóng đại tiêu cự</span>
                  </div>
                </div>
                <div class="mgrid">
                  <div class="mrow"><div class="mlbl"><b>Hành động</b><span>ACTION</span></div><div class="mval">Ấn ngón tay trỏ lên má và nhấc ra, để lại một vết lõm mờ kem nền rõ rệt</div></div>
                  <div class="mrow"><div class="mlbl"><b>Bối cảnh</b><span>SETTING</span></div><div class="mval">Ánh sáng hắt xiên làm nổi bật vết lõm</div></div>
                  <div class="mrow"><div class="mlbl"><b>Âm thanh</b><span>SOUND</span></div><div class="mval">VO cảnh báo: Phủ phấn ngay lúc này sẽ gây trượt và vỡ nền</div></div>
                  <div class="mrow"><div class="mlbl"><b>Trang phục</b><span>WARDROBE</span></div><div class="mval">Nhẫn vàng trơn ở ngón áp út</div></div>
                  <div class="mrow"><div class="mlbl"><b>Diễn viên</b><span>CAST</span></div><div class="mval">Khuôn mặt mộc phủ nền ẩm</div></div>
                </div>
              </div>
            </div>
          </div>

          <div class="beat reveal">
            <div class="beat-frame"><img loading="lazy" src="{imgs[5]}"><span class="ts">0:21</span></div>
            <div class="beat-body">
              <p class="zh">Dặm phấn phủ riêng cho vùng mắt trước</p>
              <p class="vi">"Cho nên trong lúc đợi nền khô, mình sẽ phủ trước phấn mắt, lông mày..."</p>
              <p class="note">Mẹo trang điểm: tranh thủ thời gian chờ nền tự khô để trang điểm mắt và vẽ lông mày trước.</p>
              <div class="matrix">
                <div class="cam">
                  <div class="mlbl cam-lbl"><b>Góc máy</b><span>CAMERA</span></div>
                  <div class="cam-parts">
                    <span class="cam-seg"><i>Cỡ cảnh</i>Cận (CU) vùng mắt</span>
                    <span class="cam-seg"><i>Góc</i>Ngang tầm mắt</span>
                    <span class="cam-seg"><i>Chuyển động</i>Tĩnh</span>
                  </div>
                </div>
                <div class="mgrid">
                  <div class="mrow"><div class="mlbl"><b>Hành động</b><span>ACTION</span></div><div class="mval">Dùng mút dặm phấn phủ lên mí mắt và vùng dưới mắt nhẹ nhàng</div></div>
                  <div class="mrow"><div class="mlbl"><b>Bối cảnh</b><span>SETTING</span></div><div class="mval">Phòng ngủ sáng đều</div></div>
                  <div class="mrow"><div class="mlbl"><b>Âm thanh</b><span>SOUND</span></div><div class="mval">VO chia sẻ mẹo tận dụng thời gian</div></div>
                  <div class="mrow"><div class="mlbl"><b>Trang phục</b><span>WARDROBE</span></div><div class="mval">Không có trang sức phức tạp</div></div>
                  <div class="mrow"><div class="mlbl"><b>Diễn viên</b><span>CAST</span></div><div class="mval">Khuôn mặt creator đang trang điểm dở</div></div>
                </div>
              </div>
            </div>
          </div>

          <div class="beat reveal">
            <div class="beat-frame"><img loading="lazy" src="{imgs[6]}"><span class="ts">0:23</span></div>
            <div class="beat-body">
              <p class="zh">Dùng cọ vẽ chân mày chi tiết</p>
              <p class="vi">Kẻ lông mày và trang điểm vùng mắt để chờ nền má khô</p>
              <p class="note">Quay cận cảnh thao tác chuốt lông mày bằng mascara chuyên dụng.</p>
              <div class="matrix">
                <div class="cam">
                  <div class="mlbl cam-lbl"><b>Góc máy</b><span>CAMERA</span></div>
                  <div class="cam-parts">
                    <span class="cam-seg"><i>Cỡ cảnh</i>Cận (CU) vùng lông mày</span>
                    <span class="cam-seg"><i>Góc</i>Ngang tầm mắt</span>
                    <span class="cam-seg"><i>Chuyển động</i>Tĩnh</span>
                  </div>
                </div>
                <div class="mgrid">
                  <div class="mrow"><div class="mlbl"><b>Hành động</b><span>ACTION</span></div><div class="mval">Tay cầm cọ mascara lông mày chải vuốt ngược theo chiều lông mọc</div></div>
                  <div class="mrow"><div class="mlbl"><b>Bối cảnh</b><span>SETTING</span></div><div class="mval">Góc phòng trang điểm</div></div>
                  <div class="mrow"><div class="mlbl"><b>Âm thanh</b><span>SOUND</span></div><div class="mval">VO tiếp tục thuyết minh quy trình</div></div>
                  <div class="mrow"><div class="mlbl"><b>Trang phục</b><span>WARDROBE</span></div><div class="mval">Khuyên tai ngọc trai nhỏ sáng</div></div>
                  <div class="mrow"><div class="mlbl"><b>Diễn viên</b><span>CAST</span></div><div class="mval">Đôi tay và khuôn mặt nghiêng của creator</div></div>
                </div>
              </div>
            </div>
          </div>

          <div class="beat reveal">
            <div class="beat-frame"><img loading="lazy" src="{imgs[7]}"><span class="ts">0:30</span></div>
            <div class="beat-body">
              <p class="zh">Phủ phấn nén lên cánh mũi để chuẩn bị tạo khối</p>
              <p class="vi">"Rồi thì mình sẽ đi phủ phấn ở phần mũi để tạo khối mũi."</p>
              <p class="note">Dùng mút dặm phấn phủ lên sóng mũi và cánh mũi để kiềm dầu trước khi đánh phấn tạo khối.</p>
              <div class="matrix">
                <div class="cam">
                  <div class="mlbl cam-lbl"><b>Góc máy</b><span>CAMERA</span></div>
                  <div class="cam-parts">
                    <span class="cam-seg"><i>Cỡ cảnh</i>Cận (CU) trực diện mũi</span>
                    <span class="cam-seg"><i>Góc</i>Ngang tầm mắt</span>
                    <span class="cam-seg"><i>Chuyển động</i>Tĩnh</span>
                  </div>
                </div>
                <div class="mgrid">
                  <div class="mrow"><div class="mlbl"><b>Hành động</b><span>ACTION</span></div><div class="mval">Dặm nhẹ mút phấn quanh đầu mũi và cánh mũi</div></div>
                  <div class="mrow"><div class="mlbl"><b>Bối cảnh</b><span>SETTING</span></div><div class="mval">Phòng ngủ sáng rõ</div></div>
                  <div class="mrow"><div class="mlbl"><b>Âm thanh</b><span>SOUND</span></div><div class="mval">VO giải thích việc tạo khối mũi sau khi phủ phấn</div></div>
                  <div class="mrow"><div class="mlbl"><b>Trang phục</b><span>WARDROBE</span></div><div class="mval">Áo hai dây màu be</div></div>
                  <div class="mrow"><div class="mlbl"><b>Diễn viên</b><span>CAST</span></div><div class="mval">Khuôn mặt trực diện của creator</div></div>
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
            <div class="act-range">0:33–0:46</div>
            <h3 class="act-title">Màn 3 · Kiểm tra nền khô &amp; Giới thiệu phấn Carslan xanh</h3>
            <p class="act-sum">Ấn ngón tay kiểm tra da đã khô ráo, giới thiệu hộp phấn Carslan xanh bản mát lạnh cho da khô.</p>
          </div>
        </div>
        <div class="beats">
          
          <div class="beat reveal">
            <div class="beat-frame"><img loading="lazy" src="{imgs[8]}"><span class="ts">0:34</span></div>
            <div class="beat-body">
              <p class="zh">Ấn thử ngón tay lần 2 lên má ẩm</p>
              <p class="vi">"Đến lúc này mình sẽ test lại xem nền đã thực sự khô chưa..."</p>
              <p class="note">Dùng ngón tay ấn mạnh vào má và rút ra $\rightarrow$ da má mịn ráo, không còn bị in hằn dấu vân tay.</p>
              <div class="matrix">
                <div class="cam">
                  <div class="mlbl cam-lbl"><b>Góc máy</b><span>CAMERA</span></div>
                  <div class="cam-parts">
                    <span class="cam-seg"><i>Cỡ cảnh</i>Cực cận (ECU) má</span>
                    <span class="cam-seg"><i>Góc</i>Ngang tầm mắt</span>
                    <span class="cam-seg"><i>Chuyển động</i>Tĩnh</span>
                  </div>
                </div>
                <div class="mgrid">
                  <div class="mrow"><div class="mlbl"><b>Hành động</b><span>ACTION</span></div><div class="mval">Ấn ngón trỏ lên má, nhấc ra khoe bề mặt da phẳng mịn không tì vết</div></div>
                  <div class="mrow"><div class="mlbl"><b>Bối cảnh</b><span>SETTING</span></div><div class="mval">Ánh sáng softbox chiếu nghiêng tôn bề mặt mịn</div></div>
                  <div class="mrow"><div class="mlbl"><b>Âm thanh</b><span>SOUND</span></div><div class="mval">VO khẳng định nền đã khô và tệp vào da hoàn toàn</div></div>
                  <div class="mrow"><div class="mlbl"><b>Trang phục</b><span>WARDROBE</span></div><div class="mval">Khuyên tai vàng nhỏ</div></div>
                  <div class="mrow"><div class="mlbl"><b>Diễn viên</b><span>CAST</span></div><div class="mval">Da má mịn của model</div></div>
                </div>
              </div>
            </div>
          </div>

          <div class="beat reveal">
            <div class="beat-frame"><img loading="lazy" src="{imgs[9]}"><span class="ts">0:40</span></div>
            <div class="beat-body">
              <p class="zh">Giơ hộp phấn phủ bột Carslan 2.0 màu xanh mát lạnh</p>
              <p class="vi">"Vì da khô nên mình sẽ dùng phấn phủ của Carslan bản màu xanh này..."</p>
              <p class="note">Giơ chai/hộp bột phấn Carslan 2.0 (Black Magnet Soft Focusing Powder - bản màu xanh dương cấp ẩm).</p>
              <div class="matrix">
                <div class="cam">
                  <div class="mlbl cam-lbl"><b>Góc máy</b><span>CAMERA</span></div>
                  <div class="cam-parts">
                    <span class="cam-seg"><i>Cỡ cảnh</i>Cận (CU) sản phẩm trên tay</span>
                    <span class="cam-seg"><i>Góc</i>Ngang tầm mắt</span>
                    <span class="cam-seg"><i>Chuyển động</i>Tĩnh, xóa phông nền sâu</span>
                  </div>
                </div>
                <div class="mgrid">
                  <div class="mrow"><div class="mlbl"><b>Hành động</b><span>ACTION</span></div><div class="mval">Hai tay giơ hộp phấn màu xanh nhạt lấp lánh sát camera</div></div>
                  <div class="mrow"><div class="mlbl"><b>Bối cảnh</b><span>SETTING</span></div><div class="mval">Bàn trang điểm ngập ánh sáng</div></div>
                  <div class="mrow"><div class="mlbl"><b>Âm thanh</b><span>SOUND</span></div><div class="mval">VO giải thích lý do lựa chọn hạt phấn siêu mịn của Carslan cho da khô</div></div>
                  <div class="mrow"><div class="mlbl"><b>Trang phục</b><span>WARDROBE</span></div><div class="mval">Móng tay sơn vẽ họa tiết xinh xắn</div></div>
                  <div class="mrow"><div class="mlbl"><b>Diễn viên</b><span>CAST</span></div><div class="mval">Creator giơ sản phẩm giới thiệu</div></div>
                </div>
              </div>
            </div>
          </div>

          <div class="beat reveal">
            <div class="beat-frame"><img loading="lazy" src="{imgs[10]}"><span class="ts">0:42</span></div>
            <div class="beat-body">
              <p class="zh">Xoáy cọ trang điểm lấy hạt bột phấn mịn</p>
              <p class="vi">Dùng cọ bản to xoáy nhẹ lấy lượng phấn phủ vừa đủ</p>
              <p class="note">Cận cảnh cọ trang điểm lông đen mịn màng xoáy tròn trong lõi hộp phấn.</p>
              <div class="matrix">
                <div class="cam">
                  <div class="mlbl cam-lbl"><b>Góc máy</b><span>CAMERA</span></div>
                  <div class="cam-parts">
                    <span class="cam-seg"><i>Cỡ cảnh</i>Cận (CU) khay phấn</span>
                    <span class="cam-seg"><i>Góc</i>Góc cao 45° nhìn xuống</span>
                    <span class="cam-seg"><i>Chuyển động</i>Tĩnh, lấy nét sâu khay phấn</span>
                  </div>
                </div>
                <div class="mgrid">
                  <div class="mrow"><div class="mlbl"><b>Hành động</b><span>ACTION</span></div><div class="mval">Tay cầm cọ xoáy nhẹ, gõ nhẹ cán cọ để rũ bớt hạt phấn thừa</div></div>
                  <div class="mrow"><div class="mlbl"><b>Bối cảnh</b><span>SETTING</span></div><div class="mval">Góc phẳng của bàn trang điểm</div></div>
                  <div class="mrow"><div class="mlbl"><b>Âm thanh</b><span>SOUND</span></div><div class="mval">Tiếng gõ nhẹ cán cọ thật (SFX Foley)</div></div>
                  <div class="mrow"><div class="mlbl"><b>Trang phục</b><span>WARDROBE</span></div><div class="mval">Không có</div></div>
                  <div class="mrow"><div class="mlbl"><b>Diễn viên</b><span>CAST</span></div><div class="mval">Bàn tay model thao tác cọ</div></div>
                </div>
              </div>
            </div>
          </div>

          <div class="beat reveal">
            <div class="beat-frame"><img loading="lazy" src="{imgs[11]}"><span class="ts">0:44</span></div>
            <div class="beat-body">
              <p class="zh">Dùng cọ dặm nhẹ phấn phủ lên vùng má</p>
              <p class="vi">"Hạt phấn siêu nhỏ nên lên da rất tự nhiên..."</p>
              <p class="note">Creator dùng cọ dặm đều phấn phủ lên má, hạt phấn siêu mịn tiệp vào da không mốc.</p>
              <div class="matrix">
                <div class="cam">
                  <div class="mlbl cam-lbl"><b>Góc máy</b><span>CAMERA</span></div>
                  <div class="cam-parts">
                    <span class="cam-seg"><i>Cỡ cảnh</i>Cận (CU) mặt nghiêng</span>
                    <span class="cam-seg"><i>Góc</i>Ngang tầm mắt</span>
                    <span class="cam-seg"><i>Chuyển động</i>Tĩnh, xóa phông nhẹ</span>
                  </div>
                </div>
                <div class="mgrid">
                  <div class="mrow"><div class="mlbl"><b>Hành động</b><span>ACTION</span></div><div class="mval">Dặm cọ nhẹ nhàng lên má và trán, tán đều phấn</div></div>
                  <div class="mrow"><div class="mlbl"><b>Bối cảnh</b><span>SETTING</span></div><div class="mval">Phòng ngủ ánh sáng tự nhiên từ cửa sổ</div></div>
                  <div class="mrow"><div class="mlbl"><b>Âm thanh</b><span>SOUND</span></div><div class="mval">VO chia sẻ trải nghiệm nhẹ mặt, không mốc của Carslan</div></div>
                  <div class="mrow"><div class="mlbl"><b>Trang phục</b><span>WARDROBE</span></div><div class="mval">Áo hai dây be sữa</div></div>
                  <div class="mrow"><div class="mlbl"><b>Diễn viên</b><span>CAST</span></div><div class="mval">Nữ creator biểu cảm thư thái</div></div>
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
            <div class="act-range">0:47–1:13</div>
            <h3 class="act-title">Màn 4 · Đi chi tiết, Khoe thành quả &amp; Test tập gym đổ mồ hôi</h3>
            <p class="act-sum">Đi cọ nhỏ các vùng khe kẽ, khoe lớp nền mịn lì và chứng thực độ bám bằng cảnh tập gym đổ mồ hôi đầm đìa.</p>
          </div>
        </div>
        <div class="beats">
          
          <div class="beat reveal">
            <div class="beat-frame"><img loading="lazy" src="{imgs[12]}"><span class="ts">0:56</span></div>
            <div class="beat-body">
              <p class="zh">Dùng cọ nhỏ phủ phấn chi tiết vùng khe kẽ</p>
              <p class="vi">"Dùng cọ nhỏ đi kỹ vào các phần kẽ, khóe mũi, bầu mắt..."</p>
              <p class="note">Mẹo kỹ thuật: dùng cọ nhỏ đi phấn chi tiết để khóa chặt các vùng hay đổ dầu/dễ mốc nền.</p>
              <div class="matrix">
                <div class="cam">
                  <div class="mlbl cam-lbl"><b>Góc máy</b><span>CAMERA</span></div>
                  <div class="cam-parts">
                    <span class="cam-seg"><i>Cỡ cảnh</i>Cận (CU) mặt</span>
                    <span class="cam-seg"><i>Góc</i>Ngang tầm mắt</span>
                    <span class="cam-seg"><i>Chuyển động</i>Tĩnh, lấy nét mắt mũi</span>
                  </div>
                </div>
                <div class="mgrid">
                  <div class="mrow"><div class="mlbl"><b>Hành động</b><span>ACTION</span></div><div class="mval">Dùng cọ nhỏ dặm phấn kỹ quanh khóe mũi, bọng mắt, khóe miệng</div></div>
                  <div class="mrow"><div class="mlbl"><b>Bối cảnh</b><span>SETTING</span></div><div class="mval">Phòng ngủ sáng đều</div></div>
                  <div class="mrow"><div class="mlbl"><b>Âm thanh</b><span>SOUND</span></div><div class="mval">VO chia sẻ kỹ thuật dặm hai lớp (double setting)</div></div>
                  <div class="mrow"><div class="mlbl"><b>Trang phục</b><span>WARDROBE</span></div><div class="mval">Khuyên tai vàng sáng</div></div>
                  <div class="mrow"><div class="mlval">Nữ creator tập trung trang điểm</div></div>
                </div>
              </div>
            </div>
          </div>

          <div class="beat reveal">
            <div class="beat-frame"><img loading="lazy" src="{imgs[13]}"><span class="ts">1:06</span></div>
            <div class="beat-body">
              <p class="zh">Creator bấu/bẹo má khoe độ đàn hồi nền</p>
              <p class="vi">"Thậm chí đi tập thể dục, đổ mồ hôi mà nền vẫn không hề bị chảy"</p>
              <p class="note">Bấu má kiểm chứng độ bền dai và mềm mại của da sau trang điểm hoàn chỉnh.</p>
              <div class="matrix">
                <div class="cam">
                  <div class="mlbl cam-lbl"><b>Góc máy</b><span>CAMERA</span></div>
                  <div class="cam-parts">
                    <span class="cam-seg"><i>Cỡ cảnh</i>Cận (CU) mặt nghiêng</span>
                    <span class="cam-seg"><i>Góc</i>Ngang tầm mắt</span>
                    <span class="cam-seg"><i>Chuyển động</i>Tĩnh</span>
                  </div>
                </div>
                <div class="mgrid">
                  <div class="mrow"><div class="mlbl"><b>Hành động</b><span>ACTION</span></div><div class="mval">Bấu má kéo nhẹ, mỉm cười tự hào trước camera</div></div>
                  <div class="mrow"><div class="mlbl"><b>Bối cảnh</b><span>SETTING</span></div><div class="mval">Phòng khách sang trọng sáng sủa</div></div>
                  <div class="mrow"><div class="mlbl"><b>Âm thanh</b><span>SOUND</span></div><div class="mval">Nhạc nền tăng cao trào</div></div>
                  <div class="mrow"><div class="mlbl"><b>Trang phục</b><span>WARDROBE</span></div><div class="mval">Tóc tạo kiểu thời trang, mặc áo hai dây</div></div>
                  <div class="mrow"><div class="mlbl"><b>Diễn viên</b><span>CAST</span></div><div class="mval">Nữ creator xinh đẹp rạng rỡ</div></div>
                </div>
              </div>
            </div>
          </div>

          <div class="beat reveal">
            <div class="beat-frame"><img loading="lazy" src="{imgs[14]}"><span class="ts">1:08</span></div>
            <div class="beat-body">
              <p class="zh">Mặt đẫm mồ hôi tại công viên/phòng tập</p>
              <p class="vi">Cận cảnh khuôn mặt lấm tấm mồ hôi nhưng không trôi nền</p>
              <p class="note">Cực kỳ trực quan: mồ hôi đọng thành hạt trên trán và thái dương nhưng nền vẫn mịn lì, không hề bị chảy vệt.</p>
              <div class="matrix">
                <div class="cam">
                  <div class="mlbl cam-lbl"><b>Góc máy</b><span>CAMERA</span></div>
                  <div class="cam-parts">
                    <span class="cam-seg"><i>Cỡ cảnh</i>Cận (CU) $\rightarrow$ Cực cận (ECU) trán</span>
                    <span class="cam-seg"><i>Góc</i>Hơi cao nhìn xuống</span>
                    <span class="cam-seg"><i>Chuyển động</i>Cầm tay (handheld) rung nhẹ</span>
                  </div>
                </div>
                <div class="mgrid">
                  <div class="mrow"><div class="mlbl"><b>Hành động</b><span>ACTION</span></div><div class="mval">Creator thở dốc nhẹ, lau nhẹ mồ hôi bằng khăn giấy, cười chào tạm biệt</div></div>
                  <div class="mrow"><div class="mlbl"><b>Bối cảnh</b><span>SETTING</span></div><div class="mval">Ngoài trời công viên/phòng tập gym, ánh sáng mặt trời tự nhiên</div></div>
                  <div class="mrow"><div class="mlbl"><b>Âm thanh</b><span>SOUND</span></div><div class="mval">VO kết thúc cam kết chất lượng + Lời chào tạm biệt</div></div>
                  <div class="mrow"><div class="mlbl"><b>Trang phục</b><span>WARDROBE</span></div><div class="mval">Áo thun thể thao màu trắng, tóc buộc cao gọn gàng</div></div>
                  <div class="mrow"><div class="mlbl"><b>Diễn viên</b><span>CAST</span></div><div class="mval">Nữ creator mặt đẫm mồ hôi khỏe khoắn</div></div>
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
        <p class="big">Hook bẹo má $\rightarrow$ Kiến thức dặm nền (kem nền set) $\rightarrow$ Review bột phấn siêu mịn $\rightarrow$ Test mồ hôi gym</p>
        <p>Bố cục video đi từ nỗi đau đời thường (sợ bẹo má trôi nền) dẫn dắt khéo léo qua kiến thức chuyên môn (chờ nền khô) rồi bán sản phẩm phấn phủ Carslan xanh dưỡng ẩm cho da khô và test mồ hôi gym để khóa niềm tin.</p>
      </div>
      <div class="card reveal">
        <h4>3 cảnh then chốt</h4>
        <p><b>1. Cảnh gây tò mò:</b> Giây 0:01 – Hành động bẹo má tự bấu má cực mạnh.<br>
           <b>2. Cảnh tạo chuyển đổi:</b> Giây 0:14 – Vết lõm in hằn dấu vân tay trên nền ướt so sánh với giây 0:34 khi nền đã khô phẳng lì.<br>
           <b>3. Cảnh dẫn mua hàng (CTA):</b> Giây 1:08 – Cận cảnh mồ hôi đọng hạt trên trán khi đi tập thể dục nhưng nền không bị chảy vệt.</p>
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
          <td class="c-note">Hành động bẹo má kéo căng má tự nhiên và lời mở đầu "make up xinh nhưng không cho bồ bẹo má" gây tò mò tốt.</td>
        </tr>
        <tr class="reveal">
          <td class="c-crit">② Pain point cụ thể</td>
          <td><span class="chip ok">Đạt</span></td>
          <td class="c-note">Giải quyết sâu sắc vấn đề mốc da khi dùng phấn phủ hạt to cho da khô và trôi nền khi vận động ra mồ hôi.</td>
        </tr>
        <tr class="reveal">
          <td class="c-crit">③ Kết quả nhìn thấy</td>
          <td><span class="chip ok">Đạt</span></td>
          <td class="c-note">Minh họa cực kỳ rõ nét bằng vết hằn ngón tay (trước) và lớp da phẳng lì khi khô (sau), cùng mồ hôi đọng hạt ở phòng gym.</td>
        </tr>
        <tr class="reveal">
          <td class="c-crit">④ Có so sánh</td>
          <td><span class="chip ok">Đạt</span></td>
          <td class="c-note">So sánh trực diện giữa việc ấn tay lên nền chưa set (lộ vết hằn) và nền đã khô set (không hề bị in dấu).</td>
        </tr>
        <tr class="reveal">
          <td class="c-crit">⑤ Quá trình sử dụng</td>
          <td><span class="chip ok">Đạt</span></td>
          <td class="c-note">Quá trình chi tiết từ lúc bôi kem nền ẩm $\rightarrow$ chờ set khô $\rightarrow$ dặm phấn Carslan bằng cọ $\rightarrow$ đi tập gym đổ mồ hôi.</td>
        </tr>
        <tr class="reveal">
          <td class="c-crit">⑥ Cảnh chuyển đổi mạnh</td>
          <td><span class="chip ok">Đạt</span></td>
          <td class="c-note">Cảnh mồ hôi đọng hạt trên trán nhưng không bị loang lổ hay chảy dòng kem nền vô cùng đắt giá.</td>
        </tr>
        <tr class="reveal">
          <td class="c-crit">⑦ CTA rõ ràng</td>
          <td><span class="chip mid">Một phần</span></td>
          <td class="c-note">Kêu gọi hành động chọn sản phẩm phù hợp qua lời chúc tạm biệt, chưa đẩy mạnh ưu đãi mua sắm.</td>
        </tr>
      </tbody>
    </table>
  </section>

  <!-- BOOM FORMULA -->
  <section class="sec">
    <div class="sec-head"><span class="sec-no">06</span><h2>Chấm theo công thức bùng nổ</h2></div>
    <div class="formula reveal">
      <div class="flabel">Công thức bùng nổ tổng quát</div>
      <div class="fbody"><b>[Mở đầu bẹo má thú vị]</b> + <b>[Kinh nghiệm set nền chuyên nghiệp]</b> + <b>[Thử thách đổ mồ hôi gym]</b> = <b>[Video triệu view bền vững &amp; uy tín chuyên gia]</b></div>
    </div>
    <p class="lead">Video này thuyết phục người xem bằng **giá trị kiến thức** (Value-driven content) hơn là dùng chiêu trò sốc. Việc phân tích cấu trúc da khô và chỉ ra lỗi sai khi set nền giúp người xem nâng cao nhận thức, từ đó tin tưởng tuyệt đối vào sản phẩm phấn phủ Carslan được giới thiệu.</p>
  </section>

  <!-- FORMULA FOR REUSE -->
  <section class="sec">
    <div class="sec-head"><span class="sec-no">07</span><h2>Công thức tái dùng</h2></div>
    <div class="formula reveal">
      <div class="flabel">Cấu trúc hình ảnh</div>
      <div class="fbody"><b>[Mở đầu]</b> Hành động bẹo má/tương tác da mặt $\rightarrow$ <b>[Nội dung kỹ thuật]</b> Quét kem nền lỏng + test ngón tay in dấu vân tay $\rightarrow$ <b>[Mẹo trung gian]</b> Vẽ chân mày/mắt trong lúc đợi nền khô $\rightarrow$ <b>[Dặm phấn]</b> Cận cảnh xoáy cọ dặm phấn phủ hạt siêu mịn lên má và đi chi tiết rãnh cười $\rightarrow$ <b>[Test thực tế]</b> Đi gym/vận động đổ mồ hôi đầm đìa nhưng nền giữ nguyên.</div>
    </div>
    <div class="formula reveal">
      <div class="flabel">Cấu trúc lời thoại</div>
      <div class="fbody"><b>Nêu nỗi sợ trôi nền thường ngày</b> $\rightarrow$ <b>Đặt câu hỏi kỹ thuật</b> ("Tại sao phủ phấn lại bị mốc/trượt?") $\rightarrow$ <b>Hướng dẫn nguyên lý chờ nền set</b> $\rightarrow$ <b>Giới thiệu sản phẩm phấn phủ hạt siêu nhỏ cho da khô</b> $\rightarrow$ <b>Chứng minh độ bền sau vận động đổ mồ hôi</b> $\rightarrow$ <b>Lời khuyên chọn sản phẩm phù hợp</b>.</div>
    </div>
  </section>

  <!-- NONELAB IMPLEMENTATION -->
  <section class="sec">
    <div class="sec-head"><span class="sec-no">08</span><h2>Lắp khung vào Nonelab</h2></div>
    <div class="cards" style="margin-bottom:22px">
      <div class="card reveal">
        <h4>Thương hiệu Cimee</h4>
        <p class="big">Bột phấn kiềm dầu Cimee</p>
        <p>Áp dụng cho dòng phấn phủ bột tơi siêu mịn của Cimee. Nhấn mạnh kỹ thuật "double setting" dùng cọ nhỏ đi chi tiết bầu mắt/khóe mũi chống mốc nền.</p>
      </div>
      <div class="card reveal">
        <h4>Thương hiệu Nerman</h4>
        <p class="big">Phấn chống trôi nam Nerman</p>
        <p>Rất phù hợp cho Nerman: làm kịch bản hướng dẫn nam giới dặm phấn kiềm dầu cực nhanh để đi đá bóng, tập gym ra mồ hôi không bị bết rít hay chảy vệt trắng loang lổ.</p>
      </div>
      <div class="card reveal">
        <h4>Đối chuẩn chiến lược</h4>
        <p class="big">Đối chuẩn nhóm ② &amp; ⑤</p>
        <p>Bên cạnh dội nước trực tiếp (video trước), video này cung cấp thêm hướng đi **đổ mồ hôi thể thao thực tế** để chứng minh độ bền bám lì, tăng độ đa dạng cho kho nội dung.</p>
      </div>
    </div>
    
    <h4 style="font-family:var(--ui);font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--amber);margin:0 0 6px">5 ý tưởng góc quay đẻ ra cho sản phẩm Nonelab</h4>
    <ul class="klist">
      <li class='reveal'><b>Góc 1 — Thử thách "Bẹo má" người yêu:</b> KOC quay vlog đi chơi với người yêu, người yêu liên tục bẹo má trêu đùa nhưng cuối ngày về nền má vẫn tơi mịn, không để lại vết hằn đỏ hay trợt phấn nhờ set phấn Cimee.</li>
      <li class='reveal'><b>Góc 2 — Đeo khẩu trang test độ bám:</b> Dặm phấn phủ Cimee và đeo khẩu trang y tế liên tục trong 4 tiếng đi xe máy ngoài đường nắng $\rightarrow$ tháo khẩu trang ra mặt trong hoàn toàn sạch trắng, không dính kem nền.</li>
      <li class='reveal'><b>Góc 3 — So sánh vân tay trực diện trên điện thoại:</b> Áp sát màn hình điện thoại tối màu lên má chưa set phấn (để lại vệt dầu/kem loang lổ) và má đã phủ phấn Cimee (màn hình điện thoại hoàn toàn sạch bóng).</li>
      <li class='reveal'><b>Góc 4 — Mồ hôi phòng xông hơi:</b> KOC dặm phấn Cimee và bước vào phòng xông hơi nóng ẩm 15 phút. Khi bước ra, lau nhẹ mồ hôi bằng khăn giấy $\rightarrow$ khăn giấy sạch tinh, lớp nền vẫn lì mịn.</li>
      <li class='reveal'><b>Góc 5 — Cọ nhỏ thần kỳ:</b> Cận cảnh dùng cọ chi tiết siêu nhỏ dặm bột phấn Cimee quanh khóe mắt, khóe miệng rãnh cười để chứng minh hạt phấn lấp đầy nếp nhăn mảnh, không gây đọng phấn.</li>
    </ul>
    
    <div class="rule reveal">
      <div class="rl">Nguyên tắc vàng khi tái dùng</div>
      <p>Bản gốc thắng nhờ **kiến thức chia sẻ hữu ích** kết hợp **visual đổ mồ hôi chân thực**. Khi Nonelab thực hiện, hãy tập trung vào việc **giải thích cơ chế khoa học dễ hiểu** và tạo ra các cảnh test đời thường (đeo khẩu trang, áp điện thoại) để tạo sự gần gũi và nâng tầm uy tín thương hiệu.</p>
    </div>
  </section>

  <!-- KHO -->
  <section class="sec" style="border-bottom:none">
    <div class="sec-head"><span class="sec-no">09</span><h2>Nạp kho</h2></div>
    <div class="two">
      <div>
        <h4 style="font-family:var(--ui);font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--amber);margin:0 0 6px">Kho lời thoại · 文案库</h4>
        <ul class="klist">
          <li class='reveal'>“Make up cho xinh nhưng mà không cho bồ bẹo má là vì mọi người sợ bị trôi nền đúng không?”</li>
          <li class='reveal'>“Nên là sau khi đánh nền xong mà ấn vào nó vẫn bị lộ vết như thế này thì chưa được phủ phấn đâu nha.”</li>
          <li class='reveal'>“Thường mình sẽ không chọn những cái loại phấn hạt to vì da khô dùng không cẩn thận sẽ rất dễ bị mốc.”</li>
          <li class='reveal'>“Hạt phấn siêu nhỏ nên là lên da rất tự nhiên.”</li>
          <li class='reveal'>“Dùng một cái cây cọ nhỏ để đi kỹ vào những cái phần kẽ, khóe mũi, bầu mắt.”</li>
          <li class='reveal'>“Thậm chí đi tập thể dục, đổ mồ hôi mà nền vẫn không hề bị chảy.”</li>
        </ul>
      </div>
      <div>
        <h4 style="font-family:var(--ui);font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--amber);margin:0 0 6px">Kho hình ảnh · 画面库</h4>
        <ul class="klist">
          <li class='reveal'>Hành động bẹo má kéo căng má tự nhiên ở giây đầu.</li>
          <li class='reveal'>Quét kem nền ẩm bằng cọ dẹt lên má mộc.</li>
          <li class='reveal'>Ấn ngón tay để lại vết lõm hằn trên nền ẩm ướt.</li>
          <li class='reveal'>Tranh thủ vẽ lông mày trong lúc chờ nền set khô.</li>
          <li class='reveal'>Cận cảnh cọ trang điểm lớn phủ phấn bột tơi mịn lên má.</li>
          <li class='reveal'>Khuôn mặt đẫm mồ hôi ròng ròng sau tập gym nhưng nền không bị chảy loang lổ.</li>
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
