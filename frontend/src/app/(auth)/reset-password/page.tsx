import { Metadata } from "next";
import { DefaultLayout } from "@/shared/components/layout";
import { ResetPassword } from "@/features/auth";
import { Suspense } from "react";
import Loading from "@/app/loading";

export const metadata: Metadata = {
  title: "Đặt lại mật khẩu - VietSignSchool",
  description: "Đặt lại mật khẩu mới cho tài khoản VietSignSchool",
};

export default function ResetPasswordPage() {
  return (
    <DefaultLayout>
      <Suspense fallback={<Loading />}>
        <ResetPassword />
      </Suspense>
    </DefaultLayout>
  );
}
