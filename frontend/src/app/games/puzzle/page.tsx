import React from "react";
import { Metadata } from "next";
import { DashboardLayout } from "@/shared/components/layout";
import { GamePlaceholder } from "@/features/games/components/common/GamePlaceholder";

export const metadata: Metadata = {
  title: "Xếp Hình Ký Hiệu - VietSignSchool",
  description: "Ghép các mảnh ghép tạo thành ký hiệu.",
};

export default function PuzzlePage() {
  return (
    <DashboardLayout>
      <GamePlaceholder
        title="Xếp Hình Ký Hiệu"
        description="Ghép các mảnh ghép rời rạc để tạo thành hình ảnh ký hiệu hoàn chỉnh. Rèn luyện tư duy không gian và ghi nhớ hình dạng."
        colorClass="bg-purple-500"
      />
    </DashboardLayout>
  );
}
