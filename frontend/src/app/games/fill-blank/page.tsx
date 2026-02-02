import React from "react";
import { Metadata } from "next";
import { DashboardLayout } from "@/shared/components/layout";
import { GamePlaceholder } from "@/features/games/components/common/GamePlaceholder";

export const metadata: Metadata = {
  title: "Điền Từ Còn Thiếu - VietSignSchool",
  description: "Chọn ký hiệu phù hợp để hoàn thành câu.",
};

export default function FillBlankPage() {
  return (
    <DashboardLayout>
      <GamePlaceholder
        title="Điền Từ Còn Thiếu"
        description="Kiểm tra kiến thức ngữ pháp của bạn. Xem một câu chưa hoàn chỉnh và chọn ký hiệu đúng để điền vào chỗ trống."
        colorClass="bg-indigo-500"
      />
    </DashboardLayout>
  );
}
