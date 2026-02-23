import { Metadata } from "next";
import { DashboardLayout } from "@/shared/components/layout";
import { GameManagementDetail } from "@/features/management/games";
import { gamesList } from "@/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id: idParam } = await params;
  const id = Number(idParam);
  const game = gamesList.find((g: { id: number }) => g.id === id);

  return {
    title: "Chi tiết trò chơi - Quản lý trò chơi - VietSignSchool",
    description: `Chi tiết và chỉnh sửa trò chơi: ${game?.name}`,
  };
}

export default function GameManagementDetailPage() {
  return (
    <DashboardLayout>
      <GameManagementDetail />
    </DashboardLayout>
  );
}
