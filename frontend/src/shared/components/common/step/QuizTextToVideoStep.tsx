import React, { useState } from "react";
import { StepProps } from "./types";
import { VideoPlayer } from "../VideoPlayer";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

export const QuizTextToVideoStep: React.FC<StepProps> = ({
  step,
  onComplete,
}) => {
  // Step đưa ra một từ vựng và các lựa chọn video. Người dùng chọn video đúng nghĩa với từ vựng.
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = () => {
    if (selectedId === null) return;
    const selectedOption = step.options.find((o: any) => o.id === selectedId);
    const correct = selectedOption?.isCorrect || false;

    setSubmitted(true);
    setIsCorrect(correct);

    if (correct && onComplete) setTimeout(onComplete, 1200);
  };

  return (
    <div className="p-6 animate-in fade-in duration-300">
      <div className="text-center mb-6">
        <p className="text-sm text-gray-500 mb-2">
          Chọn video tương ứng với từ:
        </p>
        <span className="inline-block px-8 py-3 bg-primary-50 text-primary-700 text-2xl font-bold rounded-xl border border-primary-100">
          {step.question}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-[680px] mx-auto">
        {step.options.map((option: any) => {
          const isSelected = selectedId === option.id;
          let borderClass = "border-gray-200 hover:border-primary-300";
          if (submitted) {
            if (option.isCorrect)
              borderClass = "ring-4 ring-green-500 border-green-500";
            else if (isSelected)
              borderClass = "ring-4 ring-red-500 border-red-500";
          } else if (isSelected) {
            borderClass = "ring-4 ring-primary-500 border-primary-500";
          }

          return (
            <div
              key={option.id}
              onClick={() => !submitted && setSelectedId(option.id)}
              className={`w-80 h-60 bg-gray-900 rounded-xl overflow-hidden cursor-pointer transition-all border-2 flex items-center justify-center ${borderClass}`}
            >
              <VideoPlayer
                videoUrl={option.videoUrl}
                autoPlay={false}
                loop={true}
                showControls={false}
                className="w-full h-full object-contain"
              />
              {submitted && option.isCorrect && (
                <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                  <CheckCircle size={20} />
                </div>
              )}
              {submitted && isSelected && !option.isCorrect && (
                <div className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full">
                  <XCircle size={20} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-center mt-6">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={selectedId === null}
            className={`px-8 py-3 rounded-xl font-bold text-lg transition-all ${
              selectedId !== null
                ? "bg-primary-600 text-white hover:bg-primary-700 shadow-lg"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Kiểm tra
          </button>
        ) : (
          <div
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-lg ${isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
          >
            {isCorrect ? (
              <>
                <CheckCircle size={20} /> Chính xác!
              </>
            ) : (
              <>
                <AlertCircle size={20} /> Chưa đúng
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
