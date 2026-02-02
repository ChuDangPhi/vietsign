
# ASL REDEFINED - SIÊU TÀI LIỆU THIẾT KẾ & CẤU TRÚC (CONTEXT PROMPT)

Sử dụng tài liệu này làm context để đảm bảo mọi mã nguồn mới tạo ra đều nhất quán về giao diện (UI), hành vi (UX), cấu trúc thư mục (Architecture) và ngôn ngữ.

---

## 1. CẤU TRÚC THƯ MỤC (PROJECT STRUCTURE)
Dự án tuân theo cấu trúc Next.js App Router (giả lập qua React Router):

- `/app`: Chứa các route/trang chính.
    - `/(auth)`: Các trang đăng nhập, đăng ký.
    - `/dashboard`: Giao diện quản lý.
    - `/learn`: Giao diện học tập.
- `/components`: Các thành phần tái sử dụng.
    - `/layout`: Header, Footer, Sidebar, Shell layouts.
    - `/module`: Các thành phần lớn cho trang (Hero, Features).
    - `/ui`: Các nguyên tử UI (Button, Input, LoadingScreen, Modal).
- `/providers`: Quản lý trạng thái toàn cục (AuthContext, RouterContext).
- `/services`: Logic xử lý API (Gemini API, Fetch data).
- `/lib`: Các file shim (giả lập Next.js Link/Navigation).
- `/config`: Dữ liệu tĩnh, tài khoản demo.

---

## 2. QUY CHUẨN NGÔN NGỮ (LANGUAGE STRATEGY)
- **Giao diện Người dùng (UI):** Sử dụng **Tiếng Việt** là ngôn ngữ chính cho các thẻ Label, Placeholder, Thông báo (Alert/Toast).
- **Mô tả Ký hiệu (ASL Content):** Phải được tạo ra hoặc dịch sang **Tiếng Việt** (do Gemini API đảm nhận).
- **Mã nguồn (Code):** Tên biến, hàm, comments và logs sử dụng **Tiếng Anh** theo chuẩn lập trình quốc tế.

---

## 3. CẤU HÌNH TAILWIND (TAILWIND CONFIGURATION)
```javascript
tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#ecfdf5', 100: '#d1fae5', 200: '#a7f3d0', 300: '#6ee7b7', 400: '#34d399',
          500: '#10b981', 600: '#059669', 700: '#047857', 800: '#065f46', 900: '#064e3b', 950: '#022c22',
        },
        gray: {
          50: '#f9fafb', 100: '#f3f4f6', 200: '#e5e7eb', 300: '#d1d5db', 400: '#9ca3af',
          500: '#6b7280', 600: '#4b5563', 700: '#374151', 800: '#1f2937', 900: '#111827', 950: '#030712',
        },
        stone: { 900: '#1c1917', 950: '#0c0a09' }, // Cho Dark Mode (Learn Portal)
      }
    }
  }
}
```

---

## 4. GLOBAL CSS & ANIMATIONS
Sử dụng các class này để tạo hiệu ứng chuyển động mượt mà:
- `.animate-in .fade-in`: Xuất hiện mờ dần.
- `.slide-in-from-bottom-2`: Trượt nhẹ từ dưới lên (10px).
- `.slide-in-from-top-2`: Trượt nhẹ từ trên xuống (10px).

---

## 5. UI COMPONENTS LIBRARY (CHI TIẾT CODE)

### A. Nút bấm (Buttons)
- **Primary:** `<button className="bg-primary-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5">`
- **Secondary/Outline:** `<button className="bg-white text-gray-700 border border-gray-300 font-bold py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors">`
- **Header Pill:** `<button className="text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 px-5 py-2.5 rounded-full shadow-lg shadow-primary-600/20 transition-all hover:scale-105">`

### B. Ô nhập liệu (Inputs)
- **Standard Field:** `<input className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder-gray-400">`

### C. Thẻ nội dung (Cards)
- **Light Card:** `<div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">`
- **Dark Card (Learn):** `<div className="bg-[#1a1a1a] p-8 border border-gray-800 rounded-lg hover:border-gray-600 transition-all duration-300">`
- **Feature Card:** `<div className="group p-8 bg-white border border-gray-200 hover:border-primary-200 rounded-2xl transition-all duration-300 hover:-translate-y-1">`

---

## 6. MẪU PROMPT ĐỂ TẠO TRANG MỚI
*Dán đoạn này vào đầu yêu cầu của bạn:*

> "Dựa trên tài liệu ASL REDEFINED - SIÊU TÀI LIỆU THIẾT KẾ & CẤU TRÚC:
> 1. Tạo trang [Tên Trang] tại đường dẫn [Đường dẫn file].
> 2. Sử dụng Next.js Link và Navigation từ thư mục /lib.
> 3. Toàn bộ Label/Nội dung hiển thị bằng TIẾNG VIỆT.
> 4. Tên biến và logic bằng TIẾNG ANH.
> 5. Sử dụng các component UI (Button, Card, Input) và Animation đã định nghĩa.
> 6. Sử dụng thư viện Lucide-React cho Icons."

---

## 7. QUY TẮC ĐẶT TÊN (NAMING CONVENTIONS)
- **Thư mục (Folders):** Sử dụng `kebab-case` (ví dụ: `auth-provider`, `dashboard-header`).
- **Components:** Sử dụng `PascalCase` (ví dụ: `LoadingScreen.tsx`, `HeroSection.tsx`).
- **Hooks & Utils:** Sử dụng `camelCase` (ví dụ: `useAuth.ts`, `geminiService.ts`).
- **Styles:** Sử dụng `globals.css` cho các style toàn cục và Tailwind classes trực tiếp trong component.

---

## 8. CẤU HÌNH NGÔN NGỮ CHI TIẾT (LANGUAGE CONFIG)
- **Locale:** `vi-VN` (Vietnam).
- **Font-family:** Ưu tiên 'Inter' hỗ trợ Unicode Tiếng Việt tốt nhất.
- **Tiêu chuẩn dịch thuật:**
    - "Sign In" -> "Đăng nhập"
    - "Sign Up" -> "Đăng ký"
    - "Dashboard" -> "Tổng quan" hoặc "Bảng điều khiển"
    - "Curriculum" -> "Chương trình học"
    - "Learning Path" -> "Lộ trình học tập"
- **Xử lý số liệu:** Sử dụng định dạng VN (ví dụ: 1.000,00 thay vì 1,000.00 nếu có liên quan đến tiền tệ, nhưng giữ chuẩn lập trình quốc tế trong code logic).
