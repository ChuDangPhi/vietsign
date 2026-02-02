import { Metadata } from "next";
import { DashboardLayout } from "@/shared/components/layout";
import { OrganizationsManagement } from "@/features/management/organizations";

export const metadata: Metadata = {
  title: "Quản lý tổ chức - VietSignSchool",
  description: "Quản lý các tổ chức đào tạo VietSignSchool",
};

export default function OrganizationsPage() {
  return (
    <DashboardLayout>
      <OrganizationsManagement />
    </DashboardLayout>
  );
}
