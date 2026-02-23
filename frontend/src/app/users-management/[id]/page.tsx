import { Metadata } from "next";
import { DashboardLayout } from "@/shared/components/layout";
import { UserManagementDetail } from "@/features/management/users";

export const metadata: Metadata = {
  title: "Chi tiết người dùng - Quản lý người dùng - VietSignSchool",
  description: "Chi tiết và chỉnh sửa thông tin người dùng",
};

export default function UserManagementDetailPage() {
  return (
    <DashboardLayout>
      <UserManagementDetail />
    </DashboardLayout>
  );
}
