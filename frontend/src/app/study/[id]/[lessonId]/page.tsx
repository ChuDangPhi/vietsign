import { Metadata } from "next";
import { DashboardLayout } from "@/shared/components/layout";
import { LessonDetail } from "@/features/study";

export const metadata: Metadata = {
  title: "Chi tiết bài học - Lớp học của tôi - VietSignSchool",
  description: "Xem nội dung bài học ngôn ngữ ký hiệu",
};

export default function LessonDetailPage() {
  return (
    <DashboardLayout>
      <LessonDetail />
    </DashboardLayout>
  );
}
