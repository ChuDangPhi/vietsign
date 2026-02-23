import { Metadata } from "next";
import { DashboardLayout } from "@/shared/components/layout";
import { LessonDetail } from "@/features/learn";

export const metadata: Metadata = {
  title: "Chi tiết bài học - Học tập - VietSignSchool",
  description: "Learn Vietnamese Sign Language Lesson Detail",
};

export default function LearnLessonPage() {
  return (
    <DashboardLayout>
      <LessonDetail />
    </DashboardLayout>
  );
}
