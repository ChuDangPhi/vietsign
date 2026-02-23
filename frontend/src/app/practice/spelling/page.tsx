import { DashboardLayout } from "@/shared/components/layout";
import { SpellingPractice } from "@/features/practice";

export const metadata = {
  title: "Luyện tập đánh vần - Luyện tập - VietSignSchool",
  description: "Đánh vần từ bằng ký hiệu chữ cái",
};

export default function SpellingPracticePage() {
  return (
    <DashboardLayout>
      <SpellingPractice />
    </DashboardLayout>
  );
}
