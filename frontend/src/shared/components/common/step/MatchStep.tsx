"use client";

import React, { useState, useEffect } from "react";
import { StepItem } from "@/data/lessonsData";
import { Check, X } from "lucide-react";

interface MatchStepProps {
  step: StepItem;
}

export function MatchStep({ step }: MatchStepProps) {
  // Step đưa ra các video và các từ vựng (hoặc hình ảnh). Người dùng chọn một video và chọn đối tượng tương ứng để ghép cặp.
  // Xác định chế độ chơi: Nối Video-Hình ảnh hay Video-Từ vựng
  const isImageMode = step.type === "match-video-image";

  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [targetItems, setTargetItems] = useState<any[]>([]);

  const [selectedTargetId, setSelectedTargetId] = useState<number | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]); // Array of IDs that are matched correctly
  const [wrongMatch, setWrongMatch] = useState<{
    targetId: number;
    mediaId: number;
  } | null>(null);

  useEffect(() => {
    if (step.matchPairs) {
      // Shuffle media items and target items independently
      setMediaItems([...step.matchPairs].sort(() => Math.random() - 0.5));
      setTargetItems([...step.matchPairs].sort(() => Math.random() - 0.5));

      // Reset state when step changes
      setSelectedTargetId(null);
      setMatchedPairs([]);
      setWrongMatch(null);
    }
  }, [step]);

  const handleTargetSelect = (id: number) => {
    if (matchedPairs.includes(id)) return;
    setSelectedTargetId(id);
    setWrongMatch(null);
  };

  const handleMediaSelect = (mediaId: number) => {
    if (!selectedTargetId) return;
    if (matchedPairs.includes(mediaId)) return;

    if (selectedTargetId === mediaId) {
      // Correct match
      setMatchedPairs([...matchedPairs, mediaId]);
      setSelectedTargetId(null);
    } else {
      // Wrong match
      setWrongMatch({ targetId: selectedTargetId, mediaId: mediaId });
      setTimeout(() => setWrongMatch(null), 1000);
      setSelectedTargetId(null);
    }
  };

  const isAllMatched =
    matchedPairs.length === mediaItems.length && mediaItems.length > 0;

  // Determine grid columns based on item count
  const gridCols = mediaItems.length <= 3 ? "grid-cols-3" : "grid-cols-4";

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h3 className="text-2xl font-bold text-primary-900 mb-3 italic">
          {step.title ||
            (isImageMode ? "Nối video với hình ảnh" : "Nối video với từ vựng")}
        </h3>
        <p className="text-gray-500 font-medium">
          Chọn một {isImageMode ? "hình ảnh" : "từ vựng"} ở bên dưới, sau đó
          chọn nút dưới video tương ứng.
        </p>
      </div>

      {/* Row 1: Media Items (Videos) */}
      <div className={`grid ${gridCols} gap-4 md:gap-8 mb-4`}>
        {mediaItems.map((item) => {
          const isMatched = matchedPairs.includes(item.id);
          const isWrong = wrongMatch?.mediaId === item.id;

          return (
            <div
              key={`media-${item.id}`}
              className="space-y-4 flex flex-col items-center"
            >
              <div
                className={`
                  w-full aspect-video rounded-2xl overflow-hidden border-4 transition-all duration-300 shadow-lg
                  ${isMatched ? "border-green-500 opacity-60 grayscale-[0.5]" : "border-white bg-gray-100"}
                  ${isWrong ? "border-red-500 animate-shake" : ""}
                `}
              >
                <video
                  src={item.videoUrl}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>

              {/* Selection Circle (The "Nút chọn") */}
              <button
                onClick={() => handleMediaSelect(item.id)}
                disabled={isMatched}
                className={`
                  w-12 h-12 rounded-full border-4 flex items-center justify-center transition-all duration-300
                  ${
                    isMatched
                      ? "bg-green-500 border-green-600 text-white cursor-default shadow-none"
                      : selectedTargetId
                        ? "bg-white border-primary-400 text-primary-600 hover:scale-110 hover:border-primary-600 shadow-md cursor-pointer"
                        : "bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed"
                  }
                  ${isWrong ? "bg-red-500 border-red-600 text-white animate-shake" : ""}
                `}
              >
                {isMatched ? (
                  <Check size={24} strokeWidth={3} />
                ) : isWrong ? (
                  <X size={24} strokeWidth={3} />
                ) : (
                  <div
                    className={`w-3 h-3 rounded-full ${selectedTargetId ? "bg-primary-400" : "bg-gray-200"}`}
                  />
                )}
              </button>
            </div>
          );
        })}
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-12" />

      {/* Row 2: Targets (Images or Words) */}
      <div className={`grid ${gridCols} gap-4 md:gap-8`}>
        {targetItems.map((item) => {
          const isMatched = matchedPairs.includes(item.id);
          const isSelected = selectedTargetId === item.id;
          const isWrong = wrongMatch?.targetId === item.id;

          return (
            <button
              key={`target-${item.id}`}
              onClick={() => handleTargetSelect(item.id)}
              disabled={isMatched}
              className={`
                relative p-4 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center justify-center min-h-[120px]
                ${
                  isMatched
                    ? "border-green-500 bg-green-50 text-green-700 opacity-50 cursor-default"
                    : isSelected
                      ? "border-primary-600 bg-primary-600 text-white shadow-xl shadow-primary-200 -translate-y-2"
                      : "border-gray-200 bg-white text-gray-800 hover:border-primary-400 hover:shadow-lg cursor-pointer"
                }
                ${isWrong ? "border-red-500 bg-red-50 text-red-700 animate-shake" : ""}
              `}
            >
              {isImageMode ? (
                <img
                  src={item.targetUrl}
                  alt="Target"
                  className={`w-full h-24 object-contain rounded-lg ${isSelected ? "brightness-110 contrast-110 invert" : ""}`}
                />
              ) : (
                <span
                  className={`text-xl md:text-2xl font-black italic tracking-tight ${isSelected ? "text-white" : ""}`}
                >
                  {item.targetText}
                </span>
              )}

              {isMatched && (
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white">
                  <Check size={16} strokeWidth={4} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {isAllMatched && (
        <div className="mt-16 p-6 bg-green-50 rounded-[40px] border-2 border-green-100 flex flex-col items-center animate-bounce">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white mb-4 shadow-xl shadow-green-200">
            <Check size={40} strokeWidth={4} />
          </div>
          <h4 className="text-2xl font-black text-green-800 mb-1">
            Tuyệt vời!
          </h4>
          <p className="text-green-600 font-bold uppercase tracking-widest text-xs">
            Bạn đã hoàn thành bài luyện tập
          </p>
        </div>
      )}

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
