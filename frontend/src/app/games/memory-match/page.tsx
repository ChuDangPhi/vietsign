import React from "react";
import { Metadata } from "next";
import { DashboardLayout } from "@/shared/components/layout";
import { GamePlaceholder } from "@/features/games/components/common/GamePlaceholder";

export const metadata: Metadata = {
  title: "Nhớ Cặp Đôi - VietSignSchool",
  description: "Tìm các cặp hình ảnh và ký hiệu.",
};

export default function MemoryMatchPage() {
  return (
    <DashboardLayout>
      <GamePlaceholder
        title="Nhớ Cặp Đôi"
        description="Lật thẻ và tìm các cặp hình ảnh - ký hiệu tương ứng. Trò chơi kinh điển giúp tăng cường trí nhớ ngắn hạn."
        colorClass="bg-green-500"
      />
    </DashboardLayout>
  );
}
