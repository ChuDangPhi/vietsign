import { Metadata } from "next";
import { DashboardLayout } from "@/shared/components/layout";
import { CourseDetail } from "@/features/learn";

export const metadata: Metadata = {
  title: "Chi tiết - Học tập - VietSignSchool",
  description: "Learn Vietnamese Sign Language Course Detail",
};

export default function LearnCoursePage() {
  return (
    <DashboardLayout>
      <CourseDetail />
    </DashboardLayout>
  );
}
