import { Metadata } from "next";
import { DashboardLayout } from "@/shared/components/layout";
import { LanguageSettings } from "@/features/settings/components/language";

export const metadata: Metadata = {
  title: "Cài đặt ngôn ngữ - VietSignSchool",
  description: "Cài đặt ngôn ngữ VietSignSchool",
};

export default function LanguageSettingsPage() {
  return (
    <DashboardLayout>
      <LanguageSettings />
    </DashboardLayout>
  );
}
