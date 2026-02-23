import { Metadata } from "next";
import { DashboardLayout } from "@/shared/components/layout";
import { AccountSettings } from "@/features/settings/components/account";

export const metadata: Metadata = {
  title: "Tài khoản - Cài đặt - VietSignSchool",
  description: "Cài đặt tài khoản VietSignSchool",
};

export default function AccountSettingsPage() {
  return (
    <DashboardLayout>
      <AccountSettings />
    </DashboardLayout>
  );
}
