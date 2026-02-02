import { Metadata } from "next";
import { DashboardLayout } from "@/shared/components/layout";
import { ToolsManagement } from "@/features/management/tools";

export const metadata: Metadata = {
  title: "Quản lý công cụ - VietSignSchool",
  description: "Quản lý công cụ VietSignSchool",
  
};

export default function ToolsPage() {
  return (
    <DashboardLayout>
      <ToolsManagement />
    </DashboardLayout>
  );
}
