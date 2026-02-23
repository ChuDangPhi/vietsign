"use client";

import React, { useEffect } from "react";
import GradeDetail from "@/features/grading/components/GradeDetail";
import { DashboardLayout } from "@/shared/components/layout";

export default function GradingDetailPage() {
  useEffect(() => { document.title = "Chi tiết chấm điểm - Chấm điểm - VietSignSchool"; }, []);

  return (
    <DashboardLayout>
      <GradeDetail />
    </DashboardLayout>
  );
}
