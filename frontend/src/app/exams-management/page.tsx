import { Metadata } from "next";
import { DashboardLayout } from "@/shared/components/layout";
import { ExamsManagement } from "@/features/management/exams";

export const metadata: Metadata = {
  title: "Quản lý kiểm tra - VietSignSchool",
  description: "Quản lý kiểm tra VietSignSchool",
};

export default function ExamsPage() {
  return (
    <DashboardLayout>
      <ExamsManagement />
    </DashboardLayout>
  );
}
