# LiveScope Tasks

## Backend
- [x] aggregate.js — thêm date filter (from/to) vào tất cả queries
- [x] server.js — thêm ?from&to params vào /api/dashboard (keyed cache)
- [x] server.js — thêm 4 routes CRUD /api/brands

## Frontend
- [x] api.js — fetchDashboard(from,to) + brand CRUD funcs
- [x] App.jsx — date picker logic + calendar popup + reactive display + brands nav
- [x] Brands.jsx — màn hình quản lý brand mới (CRUD đầy đủ)

## Build & Verify
- [x] Build frontend (48 modules, 270KB)
- [x] Restart server
- [x] Test date filter: full=4420 sessions, Apr 1-7 → 1935 sessions ✅
- [x] Test brand CRUD: create/update/delete ✅
- [x] Health check: {"ok":true,"sessions":4420,"db":"sqlite"} ✅
