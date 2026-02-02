import { Metadata } from "next";
import { DashboardLayout } from "@/shared/components/layout";
import { Dashboard } from "@/features/dashboard";

export const metadata: Metadata = {
  title: "Dashboard - VietSignSchool",
  description: "Dashboard page for VietSignSchool",
  
};

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <Dashboard />
    </DashboardLayout>
  );
}
