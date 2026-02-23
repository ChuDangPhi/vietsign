"use client";

import React from "react";
import ScoreList from "@/features/grading/components/ScoreList";
import { DashboardLayout } from "@/shared/components/layout";

export default function GradingPage() {
  return (
    <DashboardLayout>
      <ScoreList />
    </DashboardLayout>
  );
}
