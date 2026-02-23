import { Metadata } from "next";
import { DashboardLayout } from "@/shared/components/layout";
import { ExamManagementDetail } from "@/features/management/exams";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id: idParam } = await params;

  return {
    title: "Chi tiết bài kiểm tra - Quản lý kiểm tra - VietSignSchool",
    description: `Chi tiết và chỉnh sửa bài kiểm tra`,
  };
}

export default function ExamManagementDetailPage() {
  return (
    <DashboardLayout>
      <ExamManagementDetail />
    </DashboardLayout>
  );
}
