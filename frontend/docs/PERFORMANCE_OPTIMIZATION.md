# Báo cáo Phân tích và Tối ưu Hiệu năng Website

Tài liệu này phân tích chi tiết các điểm nghẽn (bottleneck) về hiệu năng trong dự án VietSign và đề xuất các giải pháp khắc phục cụ thể để giảm thời gian load trang.

## 1. Tối ưu Code Splitting & Lazy Loading (Quan trọng nhất)

Hiện tại, trang chủ (`src/app/page.tsx`) đang tải **toàn bộ** mã nguồn của cả trang Landing Page (cho khách) và trang Home (cho user đã đăng nhập) ngay lập tức, bất kể user có đăng nhập hay chưa.

### Vấn đề:

Trong `src/app/page.tsx`:

```typescript
import { LandingPage } from "@/features/landing";
import { Home } from "@/features/home";

// Cả hai component này đều được import và bundle vào main.js
// dù user chỉ nhìn thấy 1 trong 2.
```

Trong `SmartLayout`:

```typescript
// React vẫn khởi tạo (mount) logic của các component được truyền vào props
// ngay từ component cha, làm tăng Time to Interactive (TTI).
```

### Giải pháp:

Sử dụng `next/dynamic` để lazy load các component lớn.

**Sửa đổi trong `src/app/page.tsx`:**

```typescript
import dynamic from 'next/dynamic';
import { SmartLayout } from "@/shared/components/layout";

// Chỉ tải component khi cần thiết
const LandingPage = dynamic(() => import("@/features/landing").then(mod => mod.LandingPage), {
  loading: () => <p>Loading...</p>
});
const Home = dynamic(() => import("@/features/home").then(mod => mod.Home), {
  loading: () => <p>Loaidng...</p>
});

export default function HomePage() {
  return (
    <SmartLayout
      authContent={<Home />}
      guestContent={<LandingPage />}
    />
  );
}
```

---

## 2. Tối ưu CSS & Render Performance

### Vấn đề "Universal Transition" (Nghiêm trọng):

Tại **dòng 172-174** trong `src/app/globals.css`:

```css
* {
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}
```

Việc áp dụng transition cho **tất cả** các thẻ HTML (`*`) khiến trình duyệt phải tính toán lại hiệu ứng mỗi khi bất kỳ thuộc tính nào thay đổi (kể cả khi resize, hover, mount). Điều này gây giật lag (jank) rõ rệt trên máy yếu và mobile.

### Giải pháp:

Xóa selector global này. Chỉ áp dụng transition cho các class cụ thể hoặc component cần thiết (ví dụ: các button, input, card).

```css
/* NÊN XÓA hoặc thay bằng: */
body,
.card,
.input,
.btn {
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}
```

---

## 3. Tối ưu Hình ảnh (Image Optimization)

Dự án hiện đang rất ít sử dụng `next/image` (chỉ tìm thấy ở 2 file). Việc sử dụng thẻ `<img>` thường khiến:

- Tải ảnh kích thước gốc (quá lớn so với khung hiển thị).
- Không có lazy loading (ảnh ở footer vẫn tải ngay khi vào trang).
- Không tự chuyển đổi sang định dạng nhẹ hơn (WebP/AVIF).

### Giải pháp:

Thay thế tất cả thẻ `<img>` bằng component `<Image />` từ Next.js.

```typescript
import Image from "next/image";

// Thay vì: <img src="/banner.jpg" className="w-full" />
// Hãy dùng:
<Image
  src="/banner.jpg"
  alt="Banner"
  width={800}
  height={400}
  className="w-full"
  priority={false} // Lazy load
/>
```

---

## 4. Tối ưu Render Component (Sidebar)

File `src/shared/components/layout/Sidebar/index.tsx` đang định nghĩa mảng `MENU_ITEMS` **bên trong** component function.
Mỗi lần user click hay nhập liệu làm render lại Sidebar, biến `MENU_ITEMS` khổng lồ này lại được khởi tạo lại trong bộ nhớ.

### Giải pháp:

Di chuyển `MENU_ITEMS` ra bên ngoài component hoặc bọc trong `useMemo` (hoặc định nghĩa ở file config riêng).

```typescript
// Di chuyển ra ngoài component
const MENU_ITEMS: MenuItem[] = [...];

export const Sidebar = (...) => { ... }
```

---

## 5. Cấu hình Next.js

File `next.config.ts` hiện đang trống. Cần bật các tính năng tối ưu.

### Giải pháp:

Cập nhật `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  // Bật nén Gzip/Brotli mạnh hơn
  compress: true,
  // Cache response
  httpAgentOptions: {
    keepAlive: true,
  },
  // Tối ưu ảnh từ domain ngoài (nếu có dùng ảnh từ URL)
  images: {
    domains: ["ui-avatars.com", "firebasestorage.googleapis.com"],
  },
};
```

## Tổng kết độ ưu tiên:

1.  🔴 **Cao**: Xóa `* { transition... }` trong `globals.css` (Fix giật lag ngay lập tức).
2.  🔴 **Cao**: Áp dụng `dynamic import` cho `Page Home/Landing` (Giảm dung lượng tải lần đầu).
3.  🟡 **Trung bình**: Refactor `Sidebar` MENU_ITEMS (Giảm bộ nhớ).
4.  🟡 **Trung bình**: Thay thế `img` bằng `next/image` (Tăng tốc độ tải trang).
