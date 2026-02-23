"use client";

import React from "react";
import GradeDetail from "@/features/grading/components/GradeDetail";
import { DashboardLayout } from "@/shared/components/layout";

export default function GradingDetailPage() {
  return (
    <DashboardLayout>
      <GradeDetail />
    </DashboardLayout>
  );
}
