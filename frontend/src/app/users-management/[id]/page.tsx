import { Metadata } from "next";
import { DashboardLayout } from "@/shared/components/layout";
import { UserManagementDetail } from "@/features/management/users";
import { mockUsers } from "@/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id: idParam } = await params;
  const id = Number(idParam);
  const user = mockUsers.find((u) => u.id === id);

  return {
    title: `Chi tiết: ${user?.name || "Người dùng"} - Quản lý người dùng - VietSignSchool`,
    description: `Chi tiết và chỉnh sửa người dùng: ${user?.name}`,
  };
}

export default function UserManagementDetailPage() {
  return (
    <DashboardLayout>
      <UserManagementDetail />
    </DashboardLayout>
  );
}
