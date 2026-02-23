import { Metadata } from "next";
import { DashboardLayout } from "@/shared/components/layout";
import { DictionaryDetail } from "@/features/dictionary/components/detail";
import { fetchWordById } from "@/services/dictionaryService";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id: idParam } = await params;
  const id = Number(idParam);
  const item = await fetchWordById(id);

  return {
    title: `${item?.word || "Chi tiết từ"} - VietSignSchool`,
    description: `Chi tiết từ vựng ngôn ngữ ký hiệu: ${item?.word}`,
  };
}

export default function DictionaryDetailPage() {
  return (
    <DashboardLayout>
      <DictionaryDetail />
    </DashboardLayout>
  );
}
