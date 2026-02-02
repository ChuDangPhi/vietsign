import { DashboardLayout } from "@/shared/components/layout";
import { SentencePractice } from "@/features/practice";

export const metadata = {
  title: "Luyện tập theo câu | VietSign",
  description: "Thực hành ghép các ký hiệu thành câu hoàn chỉnh",
};

export default function SentencePracticePage() {
  return (
    <DashboardLayout>
      <SentencePractice />
    </DashboardLayout>
  );
}
