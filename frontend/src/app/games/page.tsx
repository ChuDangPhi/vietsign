import React from "react";
import { Metadata } from "next";
import { DashboardLayout } from "@/shared/components/layout";
import { Games } from "@/features/games";

export const metadata: Metadata = {
  title: "Trò Chơi - VietSignSchool",
  description: "Games for learning Vietnamese Sign Language",
  
};

export default function GamesPage() {
  return (
    <DashboardLayout>
      <Games />
    </DashboardLayout>
  );
}
