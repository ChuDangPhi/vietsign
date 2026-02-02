import { supabase } from "@/core/lib/supabaseClient";

/**
 * Service xác thực bằng Supabase Auth (Email & Password Reset)
 */
export const authServiceSupabase = {
  /**
   * Đăng ký người dùng mới với Email confirmation
   * Supabase mặc định sẽ gửi email xác nhận nếu được bật trong Dashboard
   */
  signUp: async (email: string, password: string, metaData?: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metaData, // Lưu thêm tên, role, avatar...
        emailRedirectTo: `${window.location.origin}/auth/callback`, // Trang xử lý sau khi click link email
      },
    });

    if (error) throw error;
    return data;
  },

  /**
   * Gửi email quên mật khẩu
   */
  resetPasswordForEmail: async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`, // Trang nhập mật khẩu mới
    });

    if (error) throw error;
    return data;
  },

  /**
   * Cập nhật mật khẩu mới (sau khi click link reset)
   */
  updatePassword: async (newPassword: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
    return data;
  },

  /**
   * Đăng nhập (nếu muốn dùng Supabase Auth thay vì API hiện tại)
   */
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  /**
   * Đăng xuất
   */
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Lấy user hiện tại
   */
  getCurrentUser: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  },

  /**
   * Lắng nghe sự kiện thay đổi trạng thái Auth (Login, Logout, Token Refreshed)
   */
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  },
};
