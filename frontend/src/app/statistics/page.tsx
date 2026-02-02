import { Metadata } from "next";
import { DashboardLayout } from "@/shared/components/layout";
import { StatisticsManagement } from "@/features/management/statistics";

export const metadata: Metadata = {
  title: "Thống kê - VietSignSchool",
  description: "Thống kê VietSignSchool",
  
};

export default function StatisticsPage() {
  return (
    <DashboardLayout>
      <StatisticsManagement />
    </DashboardLayout>
  );
}
