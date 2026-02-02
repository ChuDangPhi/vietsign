import { Metadata } from "next";
import { DashboardLayout } from "@/shared/components/layout";
import { QuestionsManagement } from "@/features/management/questions";

export const metadata: Metadata = {
  title: "Quản lý câu hỏi - VietSignSchool",
  description: "Quản lý câu hỏi và bộ câu hỏi VietSignSchool",
};

export default function QuestionsManagementPage() {
  return (
    <DashboardLayout>
      <QuestionsManagement />
    </DashboardLayout>
  );
}
