import React from "react";
import { Metadata } from "next";
import { DashboardLayout } from "@/shared/components/layout";
import { GuessVideoGame } from "@/features/games/components/guess-video";

export const metadata: Metadata = {
  title: "Đoán Ký Hiệu - VietSignSchool",
  description:
    "Challenge your sign language skills by guessing the correct word from videos.",
};

export default function GuessVideoPage() {
  return (
    <DashboardLayout>
      <GuessVideoGame />
    </DashboardLayout>
  );
}
