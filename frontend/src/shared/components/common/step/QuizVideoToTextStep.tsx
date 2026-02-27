import React, { useState } from "react";
import { StepProps } from "./types";
import { VideoContainer } from "./VideoContainer";
import { CheckCircle, XCircle } from "lucide-react";

export const QuizVideoToTextStep: React.FC<StepProps> = ({
  step,
  onComplete,
}) => {
  // Step đưa ra một video và các lựa chọn văn bản. Người dùng xem video và chọn đáp án văn bản đúng.
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
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-center">
        {/* Video - fixed size */}
        <div className="flex flex-col items-center gap-3">
          <VideoContainer
            videoUrl={step.questionVideoUrl || step.imageUrl || ""}
            size="lg"
          />
        </div>

        {/* Options panel */}
        <div className="w-72 space-y-3">
          {step.options.map((option: any) => {
            const isSelected = selectedId === option.id;
            let btnClass =
              "bg-white border-2 border-gray-200 text-gray-700 hover:border-primary-300";
            if (submitted) {
              if (option.isCorrect)
                btnClass =
                  "bg-green-50 border-2 border-green-500 text-green-700";
              else if (isSelected)
                btnClass = "bg-red-50 border-2 border-red-500 text-red-700";
              else
                btnClass =
                  "bg-gray-50 border-gray-100 text-gray-400 opacity-50";
            } else if (isSelected) {
              btnClass =
                "bg-primary-50 border-2 border-primary-500 text-primary-700";
            }
            return (
              <button
                key={option.id}
                onClick={() => !submitted && setSelectedId(option.id)}
                disabled={submitted}
                className={`w-full p-4 rounded-xl font-medium text-left transition-all ${btnClass}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg">{option.text}</span>
                  {submitted && option.isCorrect && (
                    <CheckCircle size={20} className="text-green-600" />
                  )}
                  {submitted && isSelected && !option.isCorrect && (
                    <XCircle size={20} className="text-red-600" />
                  )}
                </div>
              </button>
            );
          })}

          <div className="pt-3">
            {!submitted ? (
              <button
                onClick={handleSubmit}
                disabled={selectedId === null}
                className={`w-full py-3 rounded-xl font-bold text-lg transition-all ${
                  selectedId !== null
                    ? "bg-primary-600 text-white hover:bg-primary-700"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Kiểm tra
              </button>
            ) : (
              <div
                className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold ${isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
              >
                {isCorrect ? (
                  <>
                    <CheckCircle size={18} /> Đúng!
                  </>
                ) : (
                  <>
                    <XCircle size={18} /> Sai
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
