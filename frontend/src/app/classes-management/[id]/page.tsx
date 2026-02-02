import { Metadata } from "next";
import { DashboardLayout } from "@/shared/components/layout";
import { ClassManagementDetail } from "@/features/management/classes";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id: idParam } = await params;

  return {
    title: `Chi tiết lớp học - Quản lý lớp học - VietSignSchool`,
    description: `Chi tiết và chỉnh sửa lớp học ID: ${idParam}`,
  };
}

export default function ClassManagementDetailPage() {
  return (
    <DashboardLayout>
      <ClassManagementDetail />
    </DashboardLayout>
  );
}
