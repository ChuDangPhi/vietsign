import { Metadata } from "next";
import { DefaultLayout } from "@/shared/components/layout";
import { Register } from "@/features/auth";

export const metadata: Metadata = {
  title: "Register - VietSignSchool",
  description: "Register page for VietSignSchool",
};

export default function RegisterPage() {
  return (
    <DefaultLayout>
      <Register />
    </DefaultLayout>
  );
}
