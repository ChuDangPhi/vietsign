import { Metadata } from "next";
import { DashboardLayout } from "@/shared/components/layout";
import { StepDetail } from "@/features/study";

export const metadata: Metadata = {
  title: "Chi tiết bước học - Lớp học của tôi - VietSignSchool",
  description: "Thực hành ngôn ngữ ký hiệu",
};

export default function StepDetailPage() {
  return (
    <DashboardLayout>
      <StepDetail />
    </DashboardLayout>
  );
}
