import { DashboardLayout } from "@/shared/components/layout";
import { WordPractice } from "@/features/practice";

export const metadata = {
  title: "Luyện tập theo từ | VietSign",
  description: "Học và thực hành các ký hiệu cho từng từ riêng lẻ",
};

export default function WordPracticePage() {
  return (
    <DashboardLayout>
      <WordPractice />
    </DashboardLayout>
  );
}
