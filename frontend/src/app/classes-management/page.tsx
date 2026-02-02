import { Metadata } from "next";
import { DashboardLayout } from "@/shared/components/layout";
import { ClassesManagement } from "@/features/management/classes";

export const metadata: Metadata = {
  title: "Quản lý lớp học - VietSignSchool",
  description: "Quản lý lớp học VietSignSchool",
};

export default function ClassesPage() {
  return (
    <DashboardLayout>
      <ClassesManagement />
    </DashboardLayout>
  );
}
