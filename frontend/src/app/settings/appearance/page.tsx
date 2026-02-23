import { Metadata } from "next";
import { DashboardLayout } from "@/shared/components/layout";
import { AppearanceSettings } from "@/features/settings/components/appearance";

export const metadata: Metadata = {
  title: "Giao diện - Cài đặt - VietSignSchool",
  description: "Cài đặt giao diện VietSignSchool",
};

export default function AppearanceSettingsPage() {
  return (
    <DashboardLayout>
      <AppearanceSettings />
    </DashboardLayout>
  );
}
