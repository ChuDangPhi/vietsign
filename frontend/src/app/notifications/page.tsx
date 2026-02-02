import { Metadata } from "next";
import { DashboardLayout } from "@/shared/components/layout";
import { NotificationsManagement } from "@/features/notifications";

export const metadata: Metadata = {
  title: "Thông báo - VietSignSchool",
  description: "Quản lý thông báo VietSignSchool",
  
};

export default function NotificationsPage() {
  return (
    <DashboardLayout>
      <NotificationsManagement />
    </DashboardLayout>
  );
}
