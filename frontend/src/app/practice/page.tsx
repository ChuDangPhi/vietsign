import { DashboardLayout } from "@/shared/components/layout";
import { PracticeModeSelection } from "@/features/practice";

export const metadata = {
  title: "Luyện tập - VietSignSchool",
  description: "Chọn chế độ luyện tập ký hiệu ngôn ngữ",
};

export default function PracticePage() {
  return (
    <DashboardLayout>
      <PracticeModeSelection />
    </DashboardLayout>
  );
}
