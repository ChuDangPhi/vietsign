import React from "react";
import { StepProps } from "./types";
import { VideoContainer } from "./VideoContainer";

export const SentenceStep: React.FC<StepProps> = ({ step }) => (
  // Step đưa ra video mẫu câu và phân tích cấu trúc câu. Người dùng xem để học kiến thức mới.
  <div className="p-6 animate-in fade-in duration-300">
    <div className="flex flex-col lg:flex-row gap-6 items-center justify-center">
      {/* Video */}
      <VideoContainer
        videoUrl={step.videoUrl || step.imageUrl || ""}
        size="lg"
      />

      {/* Info panel */}
      <div className="w-80 flex flex-col gap-4">
        <div className="p-5 bg-green-50 rounded-xl border border-green-100">
          <p className="text-xs text-green-600 font-medium mb-2">Câu mẫu</p>
          <p className="text-2xl font-bold text-green-700">{step.sentence}</p>
        </div>

        {step.words && step.words.length > 0 && (
          <div className="p-4 bg-white rounded-xl border border-gray-100">
            <p className="text-xs font-medium text-gray-500 mb-3">
              🧩 Phân tích
            </p>
            <div className="flex flex-wrap gap-2">
              {step.words.map((w: any, idx: number) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm font-medium text-gray-700"
                >
                  {w.word}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);
