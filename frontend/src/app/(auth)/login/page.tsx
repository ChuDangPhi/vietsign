import { Metadata } from "next";
import { DefaultLayout } from "@/shared/components/layout";
import { Login } from "@/features/auth";

export const metadata: Metadata = {
  title: "Đăng nhập - VietSignSchool",
  description: "Login page for VietSignSchool",
};

export default function LoginPage() {
  return (
    <DefaultLayout>
      <Login />
    </DefaultLayout>
  );
}
