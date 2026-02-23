"use client";

import React, { useEffect } from "react";
import ScoreList from "@/features/grading/components/ScoreList";
import { DashboardLayout } from "@/shared/components/layout";

export default function GradingPage() {
  useEffect(() => { document.title = "Chấm điểm - VietSignSchool"; }, []);

  return (
    <DashboardLayout>
      <ScoreList />
    </DashboardLayout>
  );
}
