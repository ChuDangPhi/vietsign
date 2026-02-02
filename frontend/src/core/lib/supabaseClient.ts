import { createClient } from "@supabase/supabase-js";
import { getEnv } from "@/shared/utils/env";

const supabaseUrl =
  getEnv("NEXT_PUBLIC_SUPABASE_URL") || "https://your-project.supabase.co";
const supabaseAnonKey =
  getEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY") || "your-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Types cho Database (theo schema Supabase của bạn)
 */

// Bảng rooms - Phòng chat
export type Room = {
  id: string; // uuid
  name: string | null;
  is_group: boolean;
  created_at: string;
  pinned_message_id: string | null; // uuid
};

// Bảng room_participants - Thành viên trong phòng
export type RoomParticipant = {
  room_id: string; // uuid
  user_id: string; // text (ID từ hệ thống của bạn)
  joined_at: string;
};

// Bảng messages - Tin nhắn
export type Message = {
  id: string; // uuid
  room_id: string; // uuid
  user_id: string; // text (ID người gửi)
  content: string;
  created_at: string;
  reply_to: string | null; // uuid (tin nhắn đang reply)
  is_edited: boolean;
  is_deleted: boolean;
  type: string; // "text", "image", "file", etc.
};

// Bảng message_statuses - Trạng thái đọc tin nhắn
export type MessageStatus = {
  message_id: string; // uuid
  user_id: string; // text
  status: string; // "sent", "delivered", "read"
  updated_at: string;
};

// Bảng blocks - Chặn người dùng
export type Block = {
  blocker_id: string; // text
  blocked_id: string; // text
  created_at: string;
};

// Bảng user_device_tokens - Token thiết bị cho Push Notification
export type UserDeviceToken = {
  user_id: string; // text
  fcm_token: string; // text
  device_type: string; // "ios", "android", "web"
  created_at: string;
  updated_at: string;
};
