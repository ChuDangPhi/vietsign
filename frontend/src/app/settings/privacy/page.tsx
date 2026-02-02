import { Metadata } from "next";
import { DashboardLayout } from "@/shared/components/layout";
import { PrivacySettings } from "@/features/settings/components/privacy";

export const metadata: Metadata = {
  title: "Cài đặt quyền riêng tư - VietSignSchool",
  description: "Cài đặt quyền riêng tư VietSignSchool",
};

export default function PrivacySettingsPage() {
  return (
    <DashboardLayout>
      <PrivacySettings />
    </DashboardLayout>
  );
}
