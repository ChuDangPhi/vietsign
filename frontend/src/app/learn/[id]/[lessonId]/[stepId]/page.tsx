import { Metadata } from "next";
import { DashboardLayout } from "@/shared/components/layout";
import { StepDetail } from "@/features/learn";

export const metadata: Metadata = {
  title: "Chi tiết bước học - Học tập - VietSignSchool",
  description: "Learn Vietnamese Sign Language Step Detail",
};

export default function LearnStepPage() {
  return (
    <DashboardLayout>
      <StepDetail />
    </DashboardLayout>
  );
}
