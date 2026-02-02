import React from "react";
import { Metadata } from "next";
import { DashboardLayout } from "@/shared/components/layout";
import { GamePlaceholder } from "@/features/games/components/common/GamePlaceholder";

export const metadata: Metadata = {
  title: "Đố Vui Ký Hiệu - VietSignSchool",
  description: "Trả lời các câu đố về ký hiệu.",
};

export default function QuizPage() {
  return (
    <DashboardLayout>
      <GamePlaceholder
        title="Đố Vui Ký Hiệu"
        description="Thử thách kiến thức của bạn với hàng trăm câu đố vui nhộn về ngôn ngữ ký hiệu và văn hóa người khiếm thính."
        colorClass="bg-amber-500"
      />
    </DashboardLayout>
  );
}
