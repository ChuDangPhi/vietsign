import { Metadata } from "next";
import { DashboardLayout } from "@/shared/components/layout";
import { NotificationsSettings } from "@/features/settings/components/notifications";

export const metadata: Metadata = {
  title: "Cài đặt thông báo - VietSignSchool",
  description: "Cài đặt thông báo VietSignSchool",
};

export default function NotificationsSettingsPage() {
  return (
    <DashboardLayout>
      <NotificationsSettings />
    </DashboardLayout>
  );
}
