import { Metadata } from "next";
import { DashboardLayout } from "@/shared/components/layout";
import { UsersManagement } from "@/features/management/users";

export const metadata: Metadata = {
  title: "Quản lý người dùng - VietSignSchool",
  description: "Quản lý người dùng trong hệ thống VietSignSchool",
  
};

export default function UsersPage() {
  return (
    <DashboardLayout>
      <UsersManagement />
    </DashboardLayout>
  );
}
