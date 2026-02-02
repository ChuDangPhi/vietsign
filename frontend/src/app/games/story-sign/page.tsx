import React from "react";
import { Metadata } from "next";
import { DashboardLayout } from "@/shared/components/layout";
import { GamePlaceholder } from "@/features/games/components/common/GamePlaceholder";

export const metadata: Metadata = {
  title: "Câu Chuyện Ký Hiệu - VietSignSchool",
  description: "Học ký hiệu qua các câu chuyện thú vị.",
};

export default function StorySignPage() {
  return (
    <DashboardLayout>
      <GamePlaceholder
        title="Câu Chuyện Ký Hiệu"
        description="Khám phá các câu chuyện ý nghĩa và học từ vựng theo ngữ cảnh. Phương pháp học tự nhiên và dễ nhớ."
        colorClass="bg-teal-500"
      />
    </DashboardLayout>
  );
}
