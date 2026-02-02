import React, { useState } from "react";
import { StepProps } from "./types";
import { VideoPlayer } from "../VideoPlayer";
import { RotateCcw } from "lucide-react";

export const MatchVideoToTextStep: React.FC<StepProps> = ({
  step,
  onComplete,
}) => {
  // Step đưa ra danh sách video và danh sách từ vựng. Người dùng chọn video và chọn từ tương ứng để nối chúng.
  const [matches, setMatches] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);
  const pairs = step.matchPairs || [];

  const handleVideoClick = (videoId: number) => {
    if (submitted) return;
    setSelectedVideo(videoId);
  };

  const handleTextClick = (textIdx: number) => {
    if (submitted || selectedVideo === null) return;
    setMatches((prev) => ({ ...prev, [selectedVideo]: textIdx }));
    setSelectedVideo(null);
  };

  const checkAnswers = () => {
    setSubmitted(true);
    const allCorrect = pairs.every(
      (p: any, idx: number) => matches[p.id] === idx,
    );
    if (allCorrect && onComplete) setTimeout(onComplete, 1500);
  };

  const isCorrectMatch = (videoId: number, textIdx: number) => {
    const pair = pairs.find((p: any) => p.id === videoId);
    const pairIdx = pairs.indexOf(pair);
    return matches[videoId] === textIdx && pairIdx === textIdx;
  };

  return (
    <div className="p-6 animate-in fade-in duration-300">
      <p className="text-center text-sm text-gray-500 mb-4">
        Nhấn video rồi nhấn từ tương ứng để nối:
      </p>

      <div className="flex gap-8 justify-center items-start">
        <div className="space-y-3">
          {pairs.map((pair: any) => (
            <div
              key={pair.id}
              onClick={() => handleVideoClick(pair.id)}
              className={`w-40 h-30 bg-gray-900 rounded-xl overflow-hidden cursor-pointer border-2 transition-all flex items-center justify-center ${
                selectedVideo === pair.id
                  ? "ring-3 ring-primary-500 border-primary-500"
                  : matches[pair.id] !== undefined
                    ? "border-green-300 opacity-70"
                    : "border-gray-200 hover:border-primary-300"
              }`}
            >
              <VideoPlayer
                videoUrl={pair.videoUrl}
                autoPlay={false}
                loop={true}
                showControls={false}
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center self-center">
          <div className="w-12 border-t-2 border-dashed border-gray-300"></div>
        </div>

        <div className="space-y-3">
          {pairs.map((pair: any, idx: number) => {
            const matchedBy = Object.entries(matches).find(
              ([_, v]) => v === idx,
            )?.[0];
            const isMatched = matchedBy !== undefined;
            const correct = submitted && isCorrectMatch(Number(matchedBy), idx);
            const wrong = submitted && isMatched && !correct;

            return (
              <div
                key={idx}
                onClick={() => handleTextClick(idx)}
                className={`w-40 h-30 p-4 rounded-xl text-center font-bold cursor-pointer border-2 transition-all flex items-center justify-center ${
                  wrong
                    ? "border-red-500 bg-red-50 text-red-700"
                    : correct
                      ? "border-green-500 bg-green-50 text-green-700"
                      : isMatched
                        ? "border-primary-300 bg-primary-50 text-primary-700"
                        : "border-gray-200 bg-white hover:border-primary-300"
                }`}
              >
                {pair.matchText}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={() => {
            setMatches({});
            setSubmitted(false);
          }}
          className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 flex items-center gap-2 font-medium"
        >
          <RotateCcw size={18} /> Làm lại
        </button>
        <button
          onClick={checkAnswers}
          disabled={Object.keys(matches).length < pairs.length}
          className={`px-8 py-2.5 rounded-xl font-bold transition-all ${
            Object.keys(matches).length >= pairs.length
              ? "bg-primary-600 text-white hover:bg-primary-700"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Kiểm tra
        </button>
      </div>
    </div>
  );
};
