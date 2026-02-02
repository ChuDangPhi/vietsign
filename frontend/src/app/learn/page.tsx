import React from "react";
import { Metadata } from "next";
import { DashboardLayout } from "@/shared/components/layout";
import { Learn } from "@/features/learn/index";

export const metadata: Metadata = {
  title: "Học tập - VietSignSchool",
  description: "Learn Vietnamese Sign Language",
  
};

export default function LearnPage() {
  return (
    <DashboardLayout>
      <Learn />
    </DashboardLayout>
  );
}
