import { Metadata } from "next";
import { DashboardLayout } from "@/shared/components/layout";
import { PermissionsManagement } from "@/features/management/permissions";

export const metadata: Metadata = {
  title: "Quản lý phân quyền - VietSignSchool",
  description: "Quản lý vai trò và quyền hạn trong hệ thống",
};

export default function PermissionsPage() {
  return (
    <DashboardLayout>
      <PermissionsManagement />
    </DashboardLayout>
  );
}
