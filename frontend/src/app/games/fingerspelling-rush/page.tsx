import React from "react";
import { Metadata } from "next";
import { DashboardLayout } from "@/shared/components/layout";
import { GamePlaceholder } from "@/features/games/components/common/GamePlaceholder";

export const metadata: Metadata = {
  title: "Ngón Tay Thần Tốc - VietSignSchool",
  description: "Luyện tập đánh vần ngón tay tốc độ cao.",
};

export default function FingerspellingRushPage() {
  return (
    <DashboardLayout>
      <GamePlaceholder
        title="Ngón Tay Thần Tốc"
        description="Thử thách khả năng nhận diện và thực hiện các chữ cái ngón tay (fingerspelling) với tốc độ tăng dần!"
        colorClass="bg-red-500"
      />
    </DashboardLayout>
  );
}
