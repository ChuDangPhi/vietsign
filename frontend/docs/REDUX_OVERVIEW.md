# Redux trong Dự án VietSign

Tài liệu này mô tả cách Redux hiện đang được sử dụng trong dự án và các đề xuất ứng dụng trong tương lai để tận dụng tốt hơn khả năng quản lý state mạnh mẽ của nó.

## 1. Hiện trạng triển khai (Current Implementation)

Dự án đã được tích hợp đầy đủ **Redux Toolkit** và **React-Redux**.

### Cấu trúc hạ tầng

- **Store Configuration**: `src/core/store/store.ts` - Đã cấu hình store trung tâm.
- **Provider**: `src/core/store/StoreProvider.tsx` - Đã bọc toàn bộ ứng dụng trong `layout.tsx`, cho phép truy cập Redux từ bất kỳ component nào.
- **Type Safety**: Đã định nghĩa `RootState` và `AppDispatch` để hỗ trợ TypeScript đầy đủ.

### Slices hiện có

Hiện tại chỉ có một slice duy nhất là **`adminSlice`** (thực chất đang đóng vai trò là **Auth Slice**).

- **Mục đích**: Quản lý trạng thái đăng nhập của người dùng.
- **State**:
  - `isAuthenticated`: Boolean - Xác định user đã login chưa.
  - `user`: Object - Thông tin user hiện tại (lấy từ localStorage hoặc sau khi login).
- **Hành động (Actions)**:
  - `login`: Lưu thông tin user và set `isAuthenticated = true`, lưu vào localStorage.
  - `logout`: Xóa thông tin user, set `isAuthenticated = false`, xóa localStorage (token, user data).
  - `restoreAuth`: Khôi phục trạng thái login từ localStorage khi reload trang.

---

## 2. Tiềm năng ứng dụng (Future Applications)

Redux rất mạnh mẽ để quản lý các state toàn cục (global state) phức tạp mà React Context có thể gặp vấn đề về hiệu năng (re-render) hoặc khó debug. Dưới đây là các đề xuất ứng dụng:

### A. Quản lý UI Toàn cục (Global UI State)

Thay vì truyền props hoặc dùng nhiều Context nhỏ lẻ:

1.  **Sidebar/Navigation**: Quản lý trạng thái mở/đóng của Sidebar (đặc biệt trên mobile) hoặc trạng thái collapse của menu.
2.  **Modals & Dialogs**: Tạo một `uiSlice` để quản lý việc mở các modal xác nhận, popup thông báo từ bất kỳ đâu.
3.  **Loading Overlay**: Quản lý spinner loading toàn màn hình cho các tác vụ async quan trọng.

### B. Quy trình Học tập (Study Session State)

Đây là phần có thể áp dụng Redux hiệu quả nhất cho VietSign:

1.  **Tiến độ bài học**: Lưu trạng thái các step đã hoàn thành trong phiên học hiện tại (trước khi sync lên server).
2.  **Dữ liệu bài tập**: Khi làm bài kiểm tra hoặc quiz:
    - Lưu danh sách câu trả lời của user.
    - Tính điểm tạm thời.
    - Điều hướng giữa các câu hỏi mà không mất dữ liệu đã chọn.
3.  **Streak/Gameification**: Cập nhật realtime điểm số hoặc streak session trước khi commit vào database.

### C. Hệ thống Thông báo (Notification System)

- Tạo `notificationSlice` để quản lý hàng đợi (queue) các thông báo (Toasts/Snackbars).
- Cho phép dispatch một action như `showNotification({ type: 'success', message: 'Lưu thành công' })` từ bất kỳ component hoặc thunk nào.

### D. Form Phức tạp (Complex Forms)

- **Tạo khóa học/Bài thi**: Nếu chức năng tạo Course/Exam chia làm nhiều bước (Step 1: Info, Step 2: Add Lessons, Step 3: Settings), Redux có thể lưu giữ toàn bộ dữ liệu form giữa các bước chuyển đổi (multi-step form wizard).

### E. Cài đặt Người dùng (User Settings)

- Quản lý các preferences như:
  - Chế độ hiển thị (Grid/List).
  - Ngôn ngữ (Vi/En).
  - Cỡ chữ hoặc giao diện accessibility.

## 3. Ví dụ triển khai (Code Snippet)

Để thêm một tính năng mới, ví dụ quản lý **Sidebar**, bạn chỉ cần:

**1. Tạo Slice (`src/core/store/slices/uiSlice.ts`):**

```typescript
import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: { sidebarOpen: true },
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
  },
});
export const { toggleSidebar, setSidebarOpen } = uiSlice.actions;
export default uiSlice.reducer;
```

**2. Đăng ký vào Store (`src/core/store/store.ts`):**

```typescript
import uiReducer from "./slices/uiSlice";
export const store = configureStore({
  reducer: {
    admin: adminReducer,
    ui: uiReducer, // Thêm vào đây
  },
});
```

**3. Sử dụng:**

```typescript
const dispatch = useAppDispatch();
const isSidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);
```
