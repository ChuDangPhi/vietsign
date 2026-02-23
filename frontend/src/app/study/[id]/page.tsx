import { Metadata } from "next";
import { DashboardLayout } from "@/shared/components/layout";
import { StudyDetail } from "@/features/study";

export const metadata: Metadata = {
  title: "Chi tiết lớp học - Lớp học của tôi - VietSignSchool",
  description: "Thông tin chi tiết lớp học, lịch học và tài liệu",
};

export default function StudyDetailPage() {
  return (
    <DashboardLayout>
      <StudyDetail />
    </DashboardLayout>
  );
}
