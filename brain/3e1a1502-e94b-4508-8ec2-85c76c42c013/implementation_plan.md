# LiveScope — Fix Date Picker + Brand Management

## Tóm tắt

Hai tính năng cần triển khai:
1. **Date picker hoạt động** — hiện tại nút "Tùy chỉnh" và date range display `01/04 — 15/04/2026` là UI tĩnh, không lọc dữ liệu.
2. **Brand management (admin only)** — CRUD đầy đủ cho brands: xem danh sách, thêm, sửa tên/plan, xóa brand.

---

## 1. Fix Date Picker

### Vấn đề
- `App.jsx` line 168: hardcode `01/04 — 15/04/2026` — không reactive với state.
- Chips "Hôm nay / Hôm qua / 7 Ngày / 30 Ngày / Tùy chỉnh" chỉ cập nhật `S.range` nhưng **không truyền filter xuống API hay component nào**.
- Backend API `/api/dashboard` trả toàn bộ data không có tham số ngày.

### Giải pháp

**Backend** — Thêm query params `?from=YYYY-MM-DD&to=YYYY-MM-DD` vào `/api/dashboard`:
- Mọi query trong `aggregate.js` cần thêm `WHERE day BETWEEN ? AND ?` khi có filter.
- Trả thêm `meta.dateFrom` / `meta.dateTo` đúng theo filter.

**Frontend**:
- Tính `dateFrom`/`dateTo` từ `S.range` (relative ranges) hoặc `S.customFrom`/`S.customTo` (khi Tùy chỉnh).
- `fetchDashboard(from, to)` nhận params và append vào URL.
- Khi click "Tùy chỉnh" → hiện **date range picker** inline (calendar 2 tháng).
- Date display reactive: hiển thị ngày đã chọn thay vì hardcode.
- Khi thay đổi range/brand → refetch dashboard.

---

## 2. Brand Management (Admin only)

### Backend — New API routes `/api/brands`

| Method | Path | Auth | Mô tả |
|--------|------|------|-------|
| GET | `/api/brands` | requireAuth | Danh sách brands |
| POST | `/api/brands` | requireAdmin | Tạo brand mới |
| PUT | `/api/brands/:id` | requireAdmin | Sửa brand |
| DELETE | `/api/brands/:id` | requireAdmin | Xóa brand (chặn nếu có sessions) |

**Lưu ý xóa**: Không cho xóa brand nếu có sessions/datasets liên kết → trả lỗi rõ ràng.

### Frontend — Màn hình `Brands.jsx`

- Hiển thị bảng brands: Name, Plan, số Sessions, số KOC, ngày tạo sớm nhất.
- **Admin**: nút "Thêm brand" → modal form (name, plan dropdown).
- **Admin**: nút Edit (✏️) trên mỗi hàng → inline edit hoặc modal.
- **Admin**: nút Delete (🗑️) → confirm dialog → gọi DELETE API.
- Non-admin: chỉ xem, không thấy nút action.
- Thêm vào sidebar NAV2 với icon và `adminOnly = 'admin'`.

---

## Proposed Changes

### Backend

#### [MODIFY] [server.js](file:///Users/kevin/Downloads/kocchecksource/server/src/server.js)
- Thêm query param `from`/`to` vào `/api/dashboard`.
- Thêm 4 routes CRUD `/api/brands`.

#### [MODIFY] [aggregate.js](file:///Users/kevin/Downloads/kocchecksource/server/src/aggregate.js)
- Các hàm `totals`, `dailySeries`, `hourSeries`, `kocList`, `gradeCounts`, `sessionsSample` nhận thêm optional `{from, to}` filter.
- `buildDashboard(db, {from, to})` truyền filter xuống tất cả sub-queries.

---

### Frontend

#### [MODIFY] [api.js](file:///Users/kevin/Downloads/kocchecksource/web/src/api.js)
- `fetchDashboard(from, to)` — thêm params.
- Thêm brand CRUD: `listBrands`, `createBrand`, `updateBrand`, `deleteBrand`.

#### [MODIFY] [App.jsx](file:///Users/kevin/Downloads/kocchecksource/web/src/App.jsx)
- Tính `dateFrom`/`dateTo` từ `S.range`.
- Date picker component (calendar popup) cho "Tùy chỉnh".
- Reactive date display.
- Refetch khi range/brand đổi.
- Thêm `brands` vào NAV2 với `adminOnly = 'admin'`.

#### [NEW] [Brands.jsx](file:///Users/kevin/Downloads/kocchecksource/web/src/screens/Brands.jsx)
- Brand management screen với CRUD UI.

---

## Verification Plan

1. Date picker:
   - Chọn "7 Ngày" → KPIs thay đổi (hoặc hiện 0 nếu không có data trong range).
   - Chọn "Tùy chỉnh" → calendar popup → chọn range → data load.
   - Date display phản ánh đúng range đang xem.

2. Brand management:
   - Login admin → thấy menu "Brands" trong sidebar.
   - Tạo brand mới → xuất hiện trong danh sách và dropdown filter.
   - Sửa tên/plan → cập nhật.
   - Xóa brand có sessions → báo lỗi.
   - Login non-admin → không thấy nút Add/Edit/Delete.
