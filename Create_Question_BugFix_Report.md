# 📋 Báo Cáo Sửa Lỗi - Chức Năng Tạo Câu Hỏi (Create Question)

> **Ngày:** 2026-03-20  
> **Dự án:** VietSignSchool  
> **Tính năng:** Quản lý câu hỏi của giáo viên

---

## Tổng Quan

Chức năng tạo câu hỏi của giáo viên gặp nhiều lỗi liên tiếp. Sau khi debug, phát hiện **3 lỗi chính** được sửa theo thứ tự.

---

## 🔴 Lỗi 1: Dropdown "Lớp học" trống - Không fetch được danh sách lớp

### Triệu chứng
- Khi mở modal "Tạo câu hỏi mới", dropdown chọn lớp học **không có lớp nào**.
- Console hiển thị: `Failed to load resource: net::ERR_CONNECTION_REFUSED :5000/...`

### Nguyên nhân gốc
File `frontend/public/config.js` cấu hình **sai port** cho API:

```js
// ❌ SAI - Port 5000 là port NỘI BỘ Docker container
window.ENV = {
  NEXT_PUBLIC_API_URL: "http://localhost:5000",
  NEXT_PUBLIC_API_ROOT: "http://localhost:5000",
  NEXT_PUBLIC_API_ROOT_NODE: "http://localhost:5000",
};
```

**Giải thích:**
- Backend chạy bên trong Docker container trên port `5000` (nội bộ).
- Docker map port `8080` (máy host) → `5000` (container), cấu hình trong `docker-compose.yml`: `"8080:5000"`.
- Browser chạy **bên ngoài Docker** → phải kết nối qua port `8080`, không phải `5000`.
- Khi gọi `localhost:5000` từ browser → `ERR_CONNECTION_REFUSED`.

### Luồng lỗi
```
config.js set window.ENV.NEXT_PUBLIC_API_ROOT = "localhost:5000"
    ↓
api.ts → getEnv() → window.ENV → "localhost:5000" (override default 8080)
    ↓
GET http://localhost:5000/teaching-management/classrooms
    ↓
ERR_CONNECTION_REFUSED (port 5000 không mở trên máy host)
    ↓
fetchAllClasses() catch error → return [] (nuốt lỗi im lặng)
    ↓
classes state = [] → dropdown "Lớp học" trống!
```

### Cách sửa
**File:** `frontend/public/config.js`

```diff
 window.ENV = {
-  NEXT_PUBLIC_API_URL: "http://localhost:5000",
-  NEXT_PUBLIC_API_ROOT: "http://localhost:5000",
-  NEXT_PUBLIC_API_ROOT_NODE: "http://localhost:5000",
+  NEXT_PUBLIC_API_URL: "http://localhost:8080",
+  NEXT_PUBLIC_API_ROOT: "http://localhost:8080",
+  NEXT_PUBLIC_API_ROOT_NODE: "http://localhost:8080",
 };
```

### Cải tiến thêm: Debug Logging

Thêm logging vào 2 file để dễ debug sau này:

**File:** `frontend/src/services/classService.ts` - Thêm `console.log` cho raw response, parsed data, items count.

**File:** `frontend/src/features/management/questions/components/index.tsx` - Thêm `console.log` cho classesData, user role, uniqueClasses. Đổi `.catch(() => [])` thành `.catch((err) => { console.error(...); return []; })`.

---

## 🔴 Lỗi 2: Đăng nhập thất bại - 500 Internal Server Error

### Triệu chứng
- POST `http://localhost:8080/auth/login` trả **500 Internal Server Error**.
- Backend log: `Error: secretOrPrivateKey must have a value`

### Nguyên nhân gốc
Backend sử dụng `process.env.JWT_SECRET` để ký JWT token, nhưng biến môi trường `JWT_SECRET` **không được cấu hình** trong `docker-compose.yml`.

```js
// backend/src/controllers/auth.controller.js
function signToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {  // ← undefined!
        expiresIn: process.env.JWT_EXPIRES_IN || '1d'
    });
}
```

### Cách sửa
**File:** `docker-compose.yml` - Thêm biến môi trường cho backend:

```diff
   backend:
     environment:
       PORT: 5000
+      JWT_SECRET: vietsign-dev-secret-change-me
+      JWT_EXPIRES_IN: 1d
       DB_HOST: db
```

> **Lưu ý:** Sau khi thay đổi environment trong docker-compose, cần **recreate container**:
> ```bash
> docker compose up -d --force-recreate backend
> ```

---

## 🔴 Lỗi 3: Tạo câu hỏi thất bại - 400 Bad Request

### Triệu chứng
- Điền đầy đủ thông tin câu hỏi, nhấn submit → lỗi **400 Bad Request**.
- POST `http://localhost:8080/teaching-management/questions` trả 400.

### Nguyên nhân gốc
Route `POST /questions` yêu cầu middleware `checkOrgRole(['TEACHER', 'SUPER_ADMIN', ...])`. Middleware này kiểm tra bảng `organization_manager` để xem user có role phù hợp không.

**User `testwesign2@yopmail.com` (user_id: 16) không có record nào trong bảng `organization_manager`:**

```
user_id | email                        | role_in_org | organization_id
16      | testwesign2@yopmail.com      | NULL        | NULL
```

→ Middleware không tìm được role → trả 400: `"Organization ID is required"`.

### Luồng lỗi
```
POST /questions → authRequired (OK) → checkOrgRole middleware
    ↓
Query organization_manager WHERE user_id = 16 → KẾT QUẢ RỖNG
    ↓
isSuperAdmin? → KHÔNG
    ↓
Tìm orgId từ request body? → Không có organization_id
    ↓
Tìm orgId từ classroomId (class_room_id: 23)? → Lớp 23 có organization_id = NULL
    ↓
Fallback: tìm ownRole → RỖNG (user không có role nào)
    ↓
400: "Organization ID is required"
```

### Cách sửa
**Database:** Gán role TEACHER cho user trong `organization_manager`:

```sql
INSERT INTO organization_manager (user_id, organization_id, role_in_org) 
VALUES (16, 3, 'TEACHER');
```

### Cải tiến thêm: Debug Logging
**File:** `backend/src/middleware/orgRole.middleware.js` - Thêm `console.log` cho userId, userRoles, orgId, classroomId để trace vấn đề quyền.

---

## 🔴 Lỗi 4: Giáo viên không thấy câu hỏi đã tạo

### Triệu chứng
- Tạo câu hỏi thành công (201).
- View **giáo viên**: "Không tìm thấy câu hỏi" (trống).
- View **admin**: Thấy câu hỏi bình thường.

### Nguyên nhân gốc
Frontend lọc câu hỏi theo lớp mà giáo viên phụ trách. Lớp 23 (lớp mà câu hỏi thuộc về) có:

```
class_room_id | content          | teacher_id | organization_id
23            | Lớp 1_Tiếng Việt | NULL       | NULL
```

- `teacher_id = NULL` → API trả `teacherId: null`.
- `organization_id = NULL` → không thuộc tổ chức nào.

Frontend filter logic trong `loadData()`:

```js
// Bước 1: Lọc classes theo teacherId
allowedClassIds = classesData
    .filter(c => Number(c.teacherId) === Number(userId))  // teacherId = null ≠ 16
    .map(c => c.id);
// → allowedClassIds = [] (rỗng)

// Bước 2: Fallback theo orgId
if (allowedClassIds.length === 0 && userOrgId) {
    allowedClassIds = classesData
        .filter(c => Number(c.organizationId) === Number(userOrgId))  // organizationId = null ≠ 3
        .map(c => c.id);
}
// → allowedClassIds vẫn = [] (rỗng)

// Bước 3: Early return
if (allowedClassIds.length > 0) {
    questionsQuery.class_room_ids = allowedClassIds.join(",");
} else {
    setQuestions([]);  // ← Hiển thị trống!
    return;
}
```

### Cách sửa
**Database:** Cập nhật lớp 23 và thêm record class_teacher:

```sql
-- Gán teacher và organization cho lớp
UPDATE class_room SET teacher_id = 16, organization_id = 3 WHERE class_room_id = 23;

-- Thêm quan hệ teacher-class  
INSERT INTO class_teacher (class_room_id, user_id, created_date) VALUES (23, 16, NOW());
```

---

## 📁 Tổng Hợp Các File Đã Thay Đổi

| File | Thay đổi | Loại |
|------|----------|------|
| `frontend/public/config.js` | Sửa port 5000 → 8080 | **Fix chính** |
| `docker-compose.yml` | Thêm JWT_SECRET, JWT_EXPIRES_IN | **Fix chính** |
| `frontend/src/services/classService.ts` | Thêm debug logging | Debug |
| `frontend/src/features/management/questions/components/index.tsx` | Thêm debug logging, cải thiện error handling | Debug |
| `backend/src/middleware/orgRole.middleware.js` | Thêm debug logging | Debug |

## 🗄️ Tổng Hợp Thay Đổi Database

| Bảng | Thay đổi | Mục đích |
|------|----------|----------|
| `organization_manager` | INSERT (user_id=16, org_id=3, role=TEACHER) | Gán quyền Teacher |
| `class_room` (id=23) | UPDATE teacher_id=16, organization_id=3 | Gán giáo viên & tổ chức cho lớp |
| `class_teacher` | INSERT (class_room_id=23, user_id=16) | Liên kết teacher-class |

---

## ⚠️ Lưu Ý Quan Trọng

1. **Silent Error Swallowing**: Code frontend có nhiều chỗ `catch(() => [])` nuốt lỗi im lặng. Nên cải thiện error handling để hiển thị thông báo lỗi cho user.

2. **Data Seeding**: Khi khởi tạo DB mới, cần đảm bảo:
   - Users được gán role trong `organization_manager`.
   - Classes có `teacher_id` và `organization_id` đúng.
   - Quan hệ teacher-class được tạo trong `class_teacher`.

3. **Port Configuration**: Khi chạy local với Docker, browser phải dùng port **expose ra ngoài** (8080), không phải port nội bộ container (5000).

4. **JWT_SECRET**: Biến môi trường này **bắt buộc** cho backend. Nên thêm validation khi startup để thông báo rõ nếu thiếu.
