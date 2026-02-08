import { createClient } from "@supabase/supabase-js";
import { getEnv } from "@/shared/utils/env";

const defaultUrl = "https://your-project.supabase.co";
const defaultKey = "your-anon-key";

const supabaseUrl = getEnv("NEXT_PUBLIC_SUPABASE_URL") || defaultUrl;
const supabaseAnonKey =
  getEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY") || defaultKey;

const isConfigured =
  supabaseUrl !== defaultUrl &&
  supabaseAnonKey !== defaultKey &&
  supabaseUrl.startsWith("http");

// Mock client builder to prevent crashes when not configured
const createMockClient = () => {
  console.warn(
    "Supabase is not configured. Using mock client to prevent errors.",
  );
  const mockChain = () => ({
    select: () => mockChain(),
    insert: () => mockChain(),
    update: () => mockChain(),
    delete: () => mockChain(),
    eq: () => mockChain(),
    neq: () => mockChain(),
    gt: () => mockChain(),
    lt: () => mockChain(),
    gte: () => mockChain(),
    lte: () => mockChain(),
    in: () => mockChain(),
    is: () => mockChain(),
    order: () => mockChain(),
    limit: () => mockChain(),
    single: () =>
      Promise.resolve({
        data: null,
        error: { message: "Supabase not configured" },
      }),
    maybeSingle: () => Promise.resolve({ data: null, error: null }),
    then: (resolve: any) => resolve({ data: [], error: null }),
  });

  return {
    from: () => mockChain(),
    channel: () => ({
      on: () => ({ subscribe: () => {} }),
      subscribe: () => ({ unsubscribe: () => {} }),
      unsubscribe: () => {},
      send: () => Promise.resolve(),
      track: () => Promise.resolve(),
    }),
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
      getSession: () =>
        Promise.resolve({ data: { session: null }, error: null }),
      signInWithPassword: () =>
        Promise.resolve({
          data: { user: null, session: null },
          error: { message: "Supabase not configured" },
        }),
      signOut: () => Promise.resolve({ error: null }),
    },
    storage: {
      from: () => ({
        upload: () =>
          Promise.resolve({
            data: null,
            error: { message: "Supabase not configured" },
          }),
        getPublicUrl: () => ({ data: { publicUrl: "" } }),
        download: () =>
          Promise.resolve({
            data: null,
            error: { message: "Supabase not configured" },
          }),
      }),
    },
    realtime: {
      setAuth: () => {},
    },
  } as any;
};

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient();

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
