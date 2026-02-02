import { Metadata } from "next";
import { DashboardLayout } from "@/shared/components/layout";
import { GradingManagement } from "@/features/management/grading";

export const metadata: Metadata = {
  title: "Chấm điểm - VietSignSchool",
  description: "Chấm điểm VietSignSchool",
  
};

export default function GradingPage() {
  return (
    <DashboardLayout>
      <GradingManagement />
    </DashboardLayout>
  );
}
