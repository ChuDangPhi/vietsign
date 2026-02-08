"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/shared/components/layout";
import {
  GuessVideoGame,
  GuessImageGame,
  MemoryMatchGame,
  SpellingBeeGame,
} from "@/features/games";
import { Button } from "antd";
import { ArrowLeft } from "lucide-react";

export default function GameRunnerPage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const [difficulty, setDifficulty] = React.useState<
    "Dễ" | "Trung bình" | "Khó" | null
  >(null);

  const renderGame = () => {
    const commonProps = {
      difficulty: difficulty || "Dễ",
      onRestart: () => {
        // Trigger re-render of child by setting same difficulty?
        // Better yet, child components should handle internal restart.
      },
      onChangeDifficulty: () => setDifficulty(null),
    };

    switch (id) {
      case "1":
        return <GuessVideoGame {...commonProps} />;
      case "2":
        return <GuessImageGame {...commonProps} />;
      case "3":
        return <MemoryMatchGame {...commonProps} />;
      case "4":
        return <SpellingBeeGame {...commonProps} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Trò chơi đang phát triển
            </h2>
            <p className="text-gray-500 mb-8 text-center max-w-md">
              Trò chơi này hiện chưa sẵn sàng. Vui lòng quay lại sau hoặc thử
              các trò chơi khác.
            </p>
            <Button
              type="primary"
              icon={<ArrowLeft size={18} />}
              onClick={() => router.push("/games")}
              className="flex items-center gap-2 h-12 px-8 rounded-xl font-bold bg-primary-600"
            >
              Quay lại danh sách
            </Button>
          </div>
        );
    }
  };

  if (!difficulty) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto py-12 px-4 shadow-xl">
          <div className="bg-white rounded-[2rem] p-8 md:p-12 text-center border border-gray-100 shadow-xl overflow-hidden relative">
            {/* Decorative background gradients */}

            <div className="relative z-10">
              <h1 className="text-4xl font-black text-gray-900 mb-4">
                Chọn mức độ thử thách
              </h1>
              <p className="text-gray-600 mb-12 text-lg">
                Mức độ càng khó, điểm số nhận được càng cao!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    label: "Dễ",
                    color: "bg-green-500",
                    desc: "Dành cho người mới bắt đầu",
                    value: "Dễ",
                  },
                  {
                    label: "Trung bình",
                    color: "bg-yellow-500",
                    desc: "Thử thách tầm trung",
                    value: "Trung bình",
                  },
                  {
                    label: "Khó",
                    color: "bg-red-500",
                    desc: "Chỉ dành cho chuyên gia",
                    value: "Khó",
                  },
                ].map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setDifficulty(level.value as any)}
                    className="group bg-white p-6 rounded-3xl border-2 border-gray-100 hover:border-primary-500 hover:shadow-2xl hover:shadow-primary-100 transition-all duration-300 transform hover:-translate-y-2 text-left"
                  >
                    <div
                      className={`w-12 h-12 ${level.color} rounded-2xl mb-4 flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform`}
                    >
                      <div className="w-6 h-6 border-2 border-white rounded-lg"></div>
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2">
                      {level.label}
                    </h3>
                    <p className="text-gray-500 text-sm">{level.desc}</p>
                  </button>
                ))}
              </div>

              <div className="mt-12">
                <Button
                  onClick={() => router.push("/games")}
                  type="text"
                  className="text-gray-500 font-bold hover:text-gray-900"
                >
                  Quay lại danh sách trò chơi
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="py-6">{renderGame()}</div>
    </DashboardLayout>
  );
}
