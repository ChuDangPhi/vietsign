import { Metadata } from "next";
import { DashboardLayout } from "@/shared/components/layout";
import { LearningManagementDetail } from "@/features/management/learning";
import { learnCategories } from "@/data/learnData";

function getAllLearningItems() {
  return learnCategories.flatMap((category) =>
    category.items.map((item) => ({
      ...item,
      categoryTitle: category.title,
    })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id: idParam } = await params;
  const id = Number(idParam);
  const allItems = getAllLearningItems();
  const learning = allItems.find((l) => l.id === id);

  return {
    title: "Chi tiết khóa học - Quản lý học tập - VietSignSchool",
    description: `Chi tiết và chỉnh sửa khóa học: ${learning?.title}`,
  };
}

export default function LearningManagementDetailPage() {
  return (
    <DashboardLayout>
      <LearningManagementDetail />
    </DashboardLayout>
  );
}
