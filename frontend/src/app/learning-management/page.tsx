import { Metadata } from "next";
import { DashboardLayout } from "@/shared/components/layout";
import { LearningManagement } from "@/features/management/learning";

export const metadata: Metadata = {
  title: "Quản lý học tập - VietSignSchool",
  description: "Quản lý khóa học VietSignSchool",
};

export default function LearningManagementPage() {
  return (
    <DashboardLayout>
      <LearningManagement />
    </DashboardLayout>
  );
}
