import React from "react";
import { StepProps } from "./types";
import { AlertCircle } from "lucide-react";

export const QuizVideoToImageStep: React.FC<StepProps> = ({
  step,
  onComplete,
}) => (
  // Step đưa ra video và yêu cầu chọn hình ảnh tương ứng.
  <div className="p-8 text-center text-gray-500">
    <div className="max-w-md mx-auto">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertCircle size={32} className="text-gray-400" />
      </div>
      <p>Tính năng "Video → Hình ảnh" đang được phát triển</p>
    </div>
  </div>
);
