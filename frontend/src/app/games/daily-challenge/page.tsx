import React from "react";
import { Metadata } from "next";
import { DashboardLayout } from "@/shared/components/layout";
import { GamePlaceholder } from "@/features/games/components/common/GamePlaceholder";

export const metadata: Metadata = {
  title: "Ký Hiệu Hàng Ngày - VietSignSchool",
  description: "Thử thách mới mỗi ngày.",
};

export default function DailyChallengePage() {
  return (
    <DashboardLayout>
      <GamePlaceholder
        title="Ký Hiệu Hàng Ngày"
        description="Mỗi ngày một thử thách mới để duy trì thói quen học tập. Hoàn thành để nhận chuỗi (streak) và phần thưởng!"
        colorClass="bg-yellow-500"
      />
    </DashboardLayout>
  );
}
