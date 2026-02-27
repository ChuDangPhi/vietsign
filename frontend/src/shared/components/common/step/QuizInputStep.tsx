import React, { useState } from "react";
import { StepProps } from "./types";
import { VideoContainer } from "./VideoContainer";
import { CheckCircle, XCircle } from "lucide-react";

export const QuizInputStep: React.FC<StepProps> = ({ step, onComplete }) => {
  // Step đưa ra một video câu hỏi. Người dùng xem video và nhập nội dung tương ứng vào ô trống.
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const correct =
      input.trim().toLowerCase() === step.correctAnswer?.toLowerCase();

    setSubmitted(true);
    setIsCorrect(correct);

    if (correct && onComplete) setTimeout(onComplete, 1200);
  };

  return (
    <div className="p-6 animate-in fade-in duration-300">
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-center">
        {/* Video */}
        <div className="flex flex-col items-center gap-3">
          <VideoContainer
            videoUrl={step.questionVideoUrl || step.imageUrl || ""}
            size="lg"
          />
        </div>

        {/* Input panel */}
        <div className="w-72">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  if (submitted) setSubmitted(false);
                }}
                placeholder="Nhập đáp án..."
                className={`w-full p-4 text-center text-xl font-medium rounded-xl border-2 focus:outline-none transition-all ${
                  submitted
                    ? isCorrect
                      ? "border-green-500 bg-green-50"
                      : "border-red-500 bg-red-50"
                    : "border-gray-200 focus:border-primary-500"
                }`}
              />
              {submitted && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  {isCorrect ? (
                    <CheckCircle className="text-green-600" size={24} />
                  ) : (
                    <XCircle className="text-red-600" size={24} />
                  )}
                </div>
              )}
            </div>

            {step.hint && !isCorrect && (
              <p className="text-center text-sm text-gray-500">
                Gợi ý: {step.hint}
              </p>
            )}

            <button
              type="submit"
              disabled={!input.trim()}
              className={`w-full py-3 rounded-xl font-bold text-lg transition-all ${
                input.trim()
                  ? "bg-primary-600 text-white hover:bg-primary-700"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Kiểm tra
            </button>

            {submitted && !isCorrect && (
              <p className="text-center text-red-600 text-sm font-medium">
                Chưa đúng, thử lại!
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
