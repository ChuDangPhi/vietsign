import React from "react";
import { Metadata } from "next";
import { DashboardLayout } from "@/shared/components/layout";
import { GamePlaceholder } from "@/features/games/components/common/GamePlaceholder";

export const metadata: Metadata = {
  title: "Vua Tốc Độ - VietSignSchool",
  description: "Thử thách phản xạ với chuỗi ký hiệu.",
};

export default function SpeedKingPage() {
  return (
    <DashboardLayout>
      <GamePlaceholder
        title="Vua Tốc Độ"
        description="Thử thách phản xạ với chuỗi ký hiệu. Bạn cần nhận diện ký hiệu và chọn đáp án đúng nhanh nhất có thể!"
        colorClass="bg-blue-500"
      />
    </DashboardLayout>
  );
}
