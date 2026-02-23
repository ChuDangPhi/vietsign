import { DashboardLayout } from "@/shared/components/layout";
import { AiPractice } from "@/features/practice";

export const metadata = {
  title: "Luyện tập AI - Luyện tập - VietSignSchool",
  description: "Thực hiện ký hiệu và AI sẽ nhận diện",
};

export default function AiPracticePage() {
  return (
    <DashboardLayout>
      <AiPractice />
    </DashboardLayout>
  );
}
