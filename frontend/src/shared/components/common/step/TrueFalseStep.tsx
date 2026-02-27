import React, { useState } from "react";
import { StepProps } from "./types";
import { VideoContainer } from "./VideoContainer";
import { ThumbsUp, ThumbsDown } from "lucide-react";

export const TrueFalseStep: React.FC<StepProps> = ({ step, onComplete }) => {
  // Step đưa ra một video và một nhận định. Người dùng xem video rồi chọn Đúng hoặc Sai.
  const [answer, setAnswer] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const isCorrect = answer === step.isTrue;

  const handleSubmit = (choice: boolean) => {
    setAnswer(choice);
    setSubmitted(true);
    if (choice === step.isTrue && onComplete) {
      setTimeout(onComplete, 1200);
    }
  };

  return (
    <div className="p-6 animate-in fade-in duration-300">
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-center">
        {/* Video */}
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm text-gray-500">
            Video này biểu diễn từ dưới đây đúng hay sai?
          </p>
          <VideoContainer
            videoUrl={step.statementVideoUrl || step.imageUrl || ""}
            size="lg"
          />
        </div>

        {/* Statement and buttons */}
        <div className="w-72 space-y-4">
          <div className="p-5 bg-gray-100 rounded-xl text-center">
            <p className="text-xs text-gray-500 mb-2">Từ được hỏi:</p>
            <p className="text-3xl font-bold text-gray-800">{step.statement}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handleSubmit(true)}
              disabled={submitted}
              className={`flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-lg ${
                submitted && answer === true
                  ? isCorrect
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                  : "bg-green-100 text-green-700 hover:bg-green-200"
              }`}
            >
              <ThumbsUp size={20} /> Đúng
            </button>
            <button
              onClick={() => handleSubmit(false)}
              disabled={submitted}
              className={`flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-lg ${
                submitted && answer === false
                  ? isCorrect
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                  : "bg-red-100 text-red-700 hover:bg-red-200"
              }`}
            >
              <ThumbsDown size={20} /> Sai
            </button>
          </div>

          {submitted && (
            <div
              className={`p-4 rounded-xl text-center font-bold text-lg ${isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
            >
              {isCorrect ? "🎉 Chính xác!" : "❌ Sai rồi!"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
