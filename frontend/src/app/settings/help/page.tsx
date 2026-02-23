import { Metadata } from "next";
import { DashboardLayout } from "@/shared/components/layout";
import { HelpSettings } from "@/features/settings/components/help";

export const metadata: Metadata = {
  title: "Trợ giúp - Cài đặt - VietSignSchool",
  description: "Trợ giúp và hỗ trợ VietSignSchool",
};

export default function HelpSettingsPage() {
  return (
    <DashboardLayout>
      <HelpSettings />
    </DashboardLayout>
  );
}
