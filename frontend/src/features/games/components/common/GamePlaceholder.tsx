"use client";

import React from "react";
import { ArrowLeft, Play, RotateCcw, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";

interface GamePlaceholderProps {
  title: string;
  description: string;
  colorClass?: string;
}

export const GamePlaceholder: React.FC<GamePlaceholderProps> = ({
  title,
  description,
  colorClass = "bg-primary-600",
}) => {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center">
        <button
          onClick={() => router.push("/games")}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-white rounded-xl transition-all font-medium border border-transparent hover:border-gray-200 hover:shadow-sm group"
        >
          <ArrowLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span>Trở về danh sách trò chơi</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden min-h-[600px] flex flex-col">
        {/* Header */}
        <div className={`${colorClass} p-8 text-white`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{title}</h1>
              <p className="text-white/80">{description}</p>
            </div>
            <div className="flex gap-4">
              <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2">
                <Trophy size={20} className="text-yellow-300" />
                <span className="font-bold">0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Game Area Placeholder */}
        <div className="flex-1 flex flex-col items-center justify-center p-12 bg-gray-50 text-center">
          <div
            className={`w-24 h-24 ${colorClass} rounded-full flex items-center justify-center mb-6 shadow-xl opacity-90`}
          >
            <Play size={40} className="text-white ml-2" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Sẵn sàng chơi?
          </h2>
          <p className="text-gray-500 max-w-md mb-8">
            Trò chơi này đang được phát triển. Hãy quay lại sau để trải nghiệm
            những thử thách thú vị!
          </p>
          <button
            className={`${colorClass} text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all flex items-center gap-2`}
          >
            <Play size={20} />
            Bắt đầu (Demo)
          </button>
        </div>
      </div>
    </div>
  );
};
