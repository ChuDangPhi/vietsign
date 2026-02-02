"use client";

import React, { useState, useRef } from "react";
import { StepItem } from "@/data/lessonsData";
import { Check, X, Play, Circle } from "lucide-react";

interface QuizChoiceStepProps {
  step: StepItem;
  onComplete: () => void;
}

export function QuizChoiceStep({ step, onComplete }: QuizChoiceStepProps) {
  // Step đưa ra một câu hỏi (từ/câu) và các lựa chọn video. Người dùng xem video và chọn video đúng với câu hỏi.
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Ref for video elements to allow individual play/pause control
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});

  const handleVideoClick = (id: number) => {
    const video = videoRefs.current[id];
    if (video) {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    }
  };

  const handleSelect = (id: number) => {
    if (submitted) return;
    setSelectedId(id);
  };

  const handleSubmit = () => {
    if (selectedId === null || submitted) return;

    const selectedOption = step.options?.find((o) => o.id === selectedId);
    const correct = selectedOption?.isCorrect || false;

    setSubmitted(true);
    setIsCorrect(correct);

    if (correct && onComplete) {
      setTimeout(onComplete, 1500);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto flex flex-col items-center">
      {/* Question Text */}
      <div className="text-center mb-10 w-full">
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">
          Chọn video tương ứng với từ:
        </p>
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-primary-100 blur-2xl opacity-30 rounded-full"></div>
          <h1 className="relative px-12 py-5 bg-white border-2 border-primary-100 rounded-[30px] text-4xl md:text-5xl font-black text-primary-900 shadow-xl shadow-primary-50">
            {step.question}
          </h1>
        </div>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-4xl">
        {step.options?.map((option) => {
          const isSelected = selectedId === option.id;
          const isMatched = submitted && option.isCorrect;
          const isWrong = submitted && isSelected && !option.isCorrect;

          let cardBorder = "border-transparent";
          let circleColor = "border-gray-200 bg-white";

          if (isSelected) {
            cardBorder =
              "border-primary-500 shadow-2xl shadow-primary-100 bg-primary-50/30";
            circleColor = "border-primary-500 bg-primary-500 text-white";
          }
          if (submitted) {
            if (option.isCorrect) {
              cardBorder =
                "border-green-500 bg-green-50/50 shadow-green-100 shadow-xl";
              circleColor = "border-green-500 bg-green-500 text-white";
            } else if (isSelected) {
              cardBorder = "border-red-500 bg-red-50/50";
              circleColor =
                "border-red-500 bg-red-500 text-white animate-shake";
            }
          }

          return (
            <div
              key={option.id}
              className={`flex flex-col items-center p-4 rounded-[40px] border-4 transition-all duration-300 ${cardBorder}`}
            >
              {/* Media Section */}
              <div
                onClick={() => handleVideoClick(option.id)}
                className="w-full aspect-video bg-gray-900 rounded-[32px] overflow-hidden relative cursor-pointer group shadow-lg"
              >
                {option.videoUrl ? (
                  <video
                    ref={(el) => {
                      videoRefs.current[option.id] = el;
                    }}
                    src={option.videoUrl}
                    className="w-full h-full object-cover"
                    loop
                    playsInline
                  />
                ) : (
                  <img
                    src={option.imageUrl}
                    className="w-full h-full object-cover"
                    alt="Option"
                  />
                )}

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30">
                    <Play size={28} className="fill-current ml-1" />
                  </div>
                </div>
              </div>

              {/* Selection Button Underneath */}
              <button
                onClick={() => handleSelect(option.id)}
                disabled={submitted}
                className={`
                  mt-6 w-full flex items-center justify-between px-6 py-4 rounded-2xl border-2 transition-all duration-300
                  ${
                    isSelected
                      ? "border-primary-500 bg-primary-50 text-primary-700 shadow-md"
                      : "border-gray-100 bg-white text-gray-500 hover:border-primary-200 hover:bg-gray-50"
                  }
                  ${submitted && option.isCorrect ? "border-green-500 bg-green-50 text-green-700" : ""}
                  ${submitted && isSelected && !option.isCorrect ? "border-red-500 bg-red-50 text-red-700" : ""}
                `}
              >
                <span className="font-bold tracking-wide uppercase text-xs">
                  Chọn đáp án này
                </span>
                <div
                  className={`
                  w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all
                  ${circleColor}
                `}
                >
                  {isSelected ? (
                    isWrong ? (
                      <X size={16} strokeWidth={4} />
                    ) : (
                      <Check size={16} strokeWidth={4} />
                    )
                  ) : isMatched ? (
                    <Check size={16} strokeWidth={4} />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-gray-200" />
                  )}
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer Actions */}
      <div className="mt-12 w-full flex flex-col items-center">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={selectedId === null}
            className={`
              px-16 py-5 rounded-[24px] text-xl font-black uppercase tracking-[0.1em] transition-all
              ${
                selectedId !== null
                  ? "bg-primary-600 text-white shadow-2xl shadow-primary-200 hover:bg-primary-700 hover:-translate-y-1 active:scale-95"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed opacity-70"
              }
            `}
          >
            Nộp bài kiểm tra
          </button>
        ) : (
          <div
            className={`
            px-12 py-6 rounded-[30px] flex items-center gap-4 animate-in zoom-in duration-300
            ${isCorrect ? "bg-green-100 text-green-800 border-2 border-green-200" : "bg-red-100 text-red-800 border-2 border-red-200"}
          `}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${isCorrect ? "bg-green-500 shadow-xl shadow-green-200" : "bg-red-500 shadow-xl shadow-red-200 animate-shake"}`}
            >
              {isCorrect ? (
                <Check size={28} strokeWidth={4} />
              ) : (
                <X size={28} strokeWidth={4} />
              )}
            </div>
            <div>
              <p className="font-black text-2xl italic leading-none">
                {isCorrect ? "CHÍNH XÁC!" : "CHƯA ĐÚNG RỒI!"}
              </p>
              {!isCorrect && (
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setSelectedId(null);
                  }}
                  className="mt-2 text-sm font-bold uppercase tracking-widest text-red-600 hover:underline"
                >
                  Thử lại ngay
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-8px);
          }
          75% {
            transform: translateX(8px);
          }
        }
        .animate-shake {
          animation: shake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }
      `}</style>
    </div>
  );
}
