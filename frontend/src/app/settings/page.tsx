import { Metadata } from "next";
import { DashboardLayout } from "@/shared/components/layout";
import { Settings } from "@/features/settings";

export const metadata: Metadata = {
  title: "Cài đặt - VietSignSchool",
  description: "Cài đặt VietSignSchool",
  
};

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <Settings />
    </DashboardLayout>
  );
}
