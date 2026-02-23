import { Metadata } from "next";
import { DashboardLayout } from "@/shared/components/layout";
import { ExamTaking } from "@/features/study/components/exam";

export const metadata: Metadata = {
  title: "Làm bài kiểm tra - Lớp học của tôi - VietSignSchool",
  description: "Trang làm bài kiểm tra trực tuyến",
};

export default function ExamPage() {
  return (
    <DashboardLayout>
      <ExamTaking />
    </DashboardLayout>
  );
}
