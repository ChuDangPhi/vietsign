import { Metadata } from "next";
import { DashboardLayout } from "@/shared/components/layout";
import { LanguageSettings } from "@/features/settings/components/language";

export const metadata: Metadata = {
  title: "Ngôn ngữ - Cài đặt - VietSignSchool",
  description: "Cài đặt ngôn ngữ VietSignSchool",
};

export default function LanguageSettingsPage() {
  return (
    <DashboardLayout>
      <LanguageSettings />
    </DashboardLayout>
  );
}
