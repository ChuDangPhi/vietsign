import { Metadata } from "next";
import { DashboardLayout } from "@/shared/components/layout";
import { ExamTaking } from "@/features/study/components/exam";

export const metadata: Metadata = {
  title: "Làm bài kiểm tra - VietSignSchool",
  description: "Trang làm bài kiểm tra trực tuyến",
};

export default function ExamPage() {
  return (
    <DashboardLayout>
      <ExamTaking />
    </DashboardLayout>
  );
}
