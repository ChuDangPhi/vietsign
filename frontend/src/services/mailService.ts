"use server";

import { sendEmail } from "@/core/lib/mail";

/**
 * Service gửi email thông qua Nodemailer (Server Actions)
 * Dùng thay thế cho Supabase Auth Email vì User không lưu trong Supabase
 */
export const mailService = {
  /**
   * Gửi email xác nhận đăng ký
   */
  sendAhthConfirmation: async (email: string, token: string) => {
    const confirmLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/verify?token=${token}&email=${email}`;

    const html = `
      <h1>Chào mừng đến với VietSign!</h1>
      <p>Cảm ơn bạn đã đăng ký tài khoản.</p>
      <p>Vui lòng click vào link dưới đây để xác nhận tài khoản:</p>
      <a href="${confirmLink}" style="padding: 10px 20px; background-color: #059669; color: white; text-decoration: none; border-radius: 5px;">Xác nhận tài khoản</a>
      <p>Link này sẽ hết hạn sau 24 giờ.</p>
    `;

    return await sendEmail(email, "VietSign - Xác nhận đăng ký", html);
  },

  /**
   * Gửi email reset mật khẩu
   */
  sendPasswordReset: async (email: string, token: string) => {
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/reset-password?token=${token}&email=${email}`;

    const html = `
      <h1>Yêu cầu đặt lại mật khẩu</h1>
      <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản ${email}.</p>
      <p>Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>
      <p>Click vào link dưới đây để đặt lại mật khẩu:</p>
      <a href="${resetLink}" style="padding: 10px 20px; background-color: #EAB308; color: white; text-decoration: none; border-radius: 5px;">Đặt lại mật khẩu</a>
    `;

    return await sendEmail(email, "VietSign - Đặt lại mật khẩu", html);
  },
};
