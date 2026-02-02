import { Metadata } from "next";
import { DashboardLayout } from "@/shared/components/layout";
import { GamesManagementComponent } from "@/features/management/games";

export const metadata: Metadata = {
  title: "Quản lý trò chơi - VietSignSchool",
  description: "Quản lý trò chơi VietSignSchool",
};

export default function GamesManagementPage() {
  return (
    <DashboardLayout>
      <GamesManagementComponent />
    </DashboardLayout>
  );
}
