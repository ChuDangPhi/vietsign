import React from "react";
import { Metadata } from "next";
import { DashboardLayout } from "@/shared/components/layout";
import { GamePlaceholder } from "@/features/games/components/common/GamePlaceholder";

export const metadata: Metadata = {
  title: "Bé Học Ký Hiệu - VietSignSchool",
  description: "Trò chơi đơn giản cho bé 4-6 tuổi.",
};

export default function KidsLearningPage() {
  return (
    <DashboardLayout>
      <GamePlaceholder
        title="Bé Học Ký Hiệu"
        description="Giao diện đầy màu sắc và thân thiện, thiết kế riêng cho các bé 4-6 tuổi làm quen với ngôn ngữ ký hiệu."
        colorClass="bg-lime-500"
      />
    </DashboardLayout>
  );
}
