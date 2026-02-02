import React from "react";
import { Metadata } from "next";
import { DashboardLayout } from "@/shared/components/layout";
import { GamePlaceholder } from "@/features/games/components/common/GamePlaceholder";

export const metadata: Metadata = {
  title: "Động Vật Ký Hiệu - VietSignSchool",
  description: "Học ký hiệu các con vật qua trò chơi.",
};

export default function AnimalSignsPage() {
  return (
    <DashboardLayout>
      <GamePlaceholder
        title="Động Vật Ký Hiệu"
        description="Khám phá thế giới động vật qua ngôn ngữ ký hiệu. Học tên các con vật yêu thích của bạn!"
        colorClass="bg-orange-400"
      />
    </DashboardLayout>
  );
}
