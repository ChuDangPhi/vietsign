import { Metadata } from "next";
import { DashboardLayout } from "@/shared/components/layout";
import { DictionaryManagementDetail } from "@/features/management/dictionary";
export const metadata: Metadata = {
  title: "Chi tiết từ vựng - Quản lý từ điển - VietSignSchool",
  description: "Chi tiết và chỉnh sửa từ vựng",
};

export default function DictionaryManagementDetailPage() {
  return (
    <DashboardLayout>
      <DictionaryManagementDetail />
    </DashboardLayout>
  );
}
