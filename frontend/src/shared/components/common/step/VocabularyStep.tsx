import React from "react";
import { StepProps } from "./types";
import { VideoContainer } from "./VideoContainer";

export const VocabularyStep: React.FC<StepProps> = ({ step }) => (
  // Step đưa ra video từ vựng và giải thích nghĩa. Người dùng xem để học từ mới.
  <div className="p-6 animate-in fade-in duration-300">
    <div className="flex flex-col lg:flex-row gap-6 items-center justify-center">
      {/* Video with fixed size */}
      <VideoContainer videoUrl={step.videoUrl} size="lg" />

      {/* Info panel */}
      <div className="w-72 flex flex-col gap-4">
        <div className="p-5 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-xs text-blue-600 font-medium mb-2">Từ vựng</p>
          <p className="text-3xl font-bold text-blue-700">{step.word}</p>
        </div>

        {step.description && (
          <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm text-sm text-gray-600">
            {step.description}
          </div>
        )}

        <div className="flex items-start gap-2 p-3 bg-yellow-50 text-yellow-800 rounded-lg text-xs border border-yellow-100">
          <span>💡</span>
          <span>Quan sát cử chỉ tay và biểu cảm khuôn mặt.</span>
        </div>
      </div>
    </div>
  </div>
);
