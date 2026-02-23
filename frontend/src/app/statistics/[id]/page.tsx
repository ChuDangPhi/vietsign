import { Metadata } from "next";
import { DashboardLayout } from "@/shared/components/layout";
import { DetailedStatistics } from "@/features/management/statistics/components/DetailedStatistics";

export const metadata: Metadata = {
  title: "Chi tiết thống kê - Thống kê - VietSignSchool",
  description: "Chi tiết Thống kê Học viên VietSignSchool",
};

export default function DetailedStatisticsPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <DashboardLayout>
      <DetailedStatistics userId={params.id} />
    </DashboardLayout>
  );
}
