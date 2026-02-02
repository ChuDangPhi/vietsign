# Hướng dẫn tích hợp Supabase Chat & Email

## 1. Kiến trúc Hệ thống

- **Authentication**: Backend riêng của bạn (không dùng Supabase Auth để đăng ký).
- **Chat System**: Sử dụng **Supabase Database & Realtime**.
- **Email System**: Sử dụng **Nodemailer** cho email xác nhận/quên mật khẩu.

## 2. Schema Database (Đã có sẵn trong Supabase)

Bạn đã có các bảng sau:

| Bảng                 | Mô tả                                |
| -------------------- | ------------------------------------ |
| `rooms`              | Phòng chat (1-1 hoặc nhóm)           |
| `room_participants`  | Thành viên trong phòng               |
| `messages`           | Tin nhắn                             |
| `message_statuses`   | Trạng thái đọc (sent/delivered/read) |
| `blocks`             | Danh sách chặn                       |
| `user_device_tokens` | Token FCM cho push notification      |

### Cấu trúc chi tiết:

**rooms**

- `id` (uuid) - Primary key
- `name` (text) - Tên phòng (null nếu chat 1-1)
- `is_group` (bool) - True nếu là nhóm
- `created_at` (timestamptz)
- `pinned_message_id` (uuid) - Tin nhắn được ghim

**messages**

- `id` (uuid) - Primary key
- `room_id` (uuid) - FK đến rooms
- `user_id` (text) - ID người gửi từ hệ thống của bạn
- `content` (text) - Nội dung
- `created_at` (timestamptz)
- `reply_to` (uuid) - Tin nhắn đang reply
- `is_edited` (bool)
- `is_deleted` (bool)
- `type` (text) - "text", "image", "file"...

## 3. Bật Realtime trong Supabase

Vào **Supabase Dashboard > Database > Replication**, bật Realtime cho bảng `messages`:

```sql
alter publication supabase_realtime add table messages;
```

## 4. Cách sử dụng Chat Service

### Lấy danh sách phòng chat của user:

```typescript
import { chatService } from "@/services/chatService";

const rooms = await chatService.getRoomsForUser("user_123");
```

### Tạo phòng chat 1-1:

```typescript
const room = await chatService.getOrCreateDirectRoom("user_123", "user_456");
```

### Gửi tin nhắn:

```typescript
await chatService.sendMessage(
  roomId,
  "user_123", // sender ID
  "Xin chào!",
  "text",
);
```

### Nhận tin nhắn Realtime:

```typescript
const channel = chatService.subscribeToMessages(roomId, (newMessage) => {
  console.log("Tin nhắn mới:", newMessage);
  // Cập nhật UI
});

// Khi rời trang, hủy subscription
chatService.unsubscribe(channel);
```

### Đánh dấu đã đọc:

```typescript
await chatService.markAllAsRead(roomId, "user_123");
```

## 5. Cấu hình Email (Nodemailer)

Cập nhật `.env.local`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 6. Types đã định nghĩa

File `src/core/lib/supabaseClient.ts` đã export các types:

- `Room`, `RoomParticipant`, `Message`, `MessageStatus`, `Block`, `UserDeviceToken`
