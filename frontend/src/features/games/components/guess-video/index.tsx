"use client";

import React, { useState, useEffect } from "react";
import { dictionaryItems, DictionaryItem } from "@/data/dictionaryData";
import {
  Play,
  CheckCircle,
  XCircle,
  ArrowRight,
  RefreshCw,
  Trophy,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Question {
  targetItem: DictionaryItem;
  options: DictionaryItem[];
  answered: boolean;
  isCorrect: boolean;
  selectedOptionId: number | null;
}

export const GuessVideoGame: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  // Filter valid items (prefer Vimeo ones as requested)
  useEffect(() => {
    initGame();
  }, []);

  const initGame = () => {
    setLoading(true);
    // Ưu tiên các từ có video Vimeo (dữ liệu mới update)
    const vimeoItems = dictionaryItems.filter((item) =>
      item.videoUrl?.includes("vimeo")
    );

    // Nguồn dữ liệu chính
    let sourceItems = vimeoItems;
    if (sourceItems.length < 4) {
      sourceItems = dictionaryItems.filter(
        (i) => i.videoUrl && i.videoUrl.length > 0
      );
    }

    // Tạo 5 câu hỏi ngẫu nhiên
    const newQuestions: Question[] = [];
    const totalQuestions = 5;

    for (let i = 0; i < totalQuestions; i++) {
      // Pick random target
      const randomTarget =
        sourceItems[Math.floor(Math.random() * sourceItems.length)];

      // Pick 3 distractors
      const distractors: DictionaryItem[] = [];
      while (distractors.length < 3) {
        const randomDist =
          dictionaryItems[Math.floor(Math.random() * dictionaryItems.length)];
        if (
          randomDist.id !== randomTarget.id &&
          !distractors.find((d) => d.id === randomDist.id)
        ) {
          distractors.push(randomDist);
        }
      }

      // Shuffle options
      const options = [...distractors, randomTarget].sort(
        () => Math.random() - 0.5
      );

      newQuestions.push({
        targetItem: randomTarget,
        options,
        answered: false,
        isCorrect: false,
        selectedOptionId: null,
      });
    }

    setQuestions(newQuestions);
    setCurrentQIndex(0);
    setScore(0);
    setShowResult(false);
    setLoading(false);
  };

  const handleAnswer = (optionId: number) => {
    if (questions[currentQIndex].answered) return;

    const currentQ = questions[currentQIndex];
    const isCorrect = optionId === currentQ.targetItem.id;

    const updatedQuestions = [...questions];
    updatedQuestions[currentQIndex] = {
      ...currentQ,
      answered: true,
      selectedOptionId: optionId,
      isCorrect,
    };

    setQuestions(updatedQuestions);
    if (isCorrect) setScore((s) => s + 100);
  };

  const nextQuestion = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const renderVideo = (url: string) => {
    if (url.includes("vimeo")) {
      // Extract ID logic similar to DictionaryDetail
      const idMatch = url.match(/(?:vimeo.com\/|video\/)(\d+)/);
      const videoId = idMatch ? idMatch[1] : "";

      return (
        <iframe
          src={`https://player.vimeo.com/video/${videoId}?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&loop=1&background=1`}
          width="100%"
          height="100%"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          className="w-full h-full object-cover"
          title="Video Quiz"
        />
      );
    }

    if (url.includes("youtube") || url.includes("youtu.be")) {
      const embedUrl = url.includes("embed")
        ? url
        : url.replace("watch?v=", "embed/");
      return (
        <iframe
          src={`${embedUrl}?autoplay=1&mute=1&controls=0&loop=1`}
          width="100%"
          height="100%"
          frameBorder="0"
          className="w-full h-full object-cover"
        />
      );
    }

    return (
      <video
        src={url}
        className="w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      />
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-primary-600" size={40} />
      </div>
    );
  }

  // End Game Result Screen
  if (showResult) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100">
          <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy size={48} className="text-yellow-600" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">
            Hoàn thành xuất sắc!
          </h1>
          <p className="text-gray-500">
            Bạn đã hoàn thành bài kiểm tra đoản ký hiệu.
          </p>

          <div className="text-6xl font-black text-primary-600 my-8">
            {score}{" "}
            <span className="text-2xl text-gray-400 font-bold">điểm</span>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            <button
              onClick={initGame}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors"
            >
              <RefreshCw size={20} /> Chơi lại
            </button>
            <button
              onClick={() => router.push("/games")}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors"
            >
              Thoát game
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQIndex];

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="text-gray-600" />
        </button>
        <div className="flex items-center gap-4">
          <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 font-bold text-gray-700">
            Câu {currentQIndex + 1}/{questions.length}
          </div>
          <div className="bg-primary-600 px-4 py-2 rounded-full shadow-sm shadow-primary-200 font-bold text-white flex items-center gap-2">
            <Trophy size={16} /> {score}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 min-h-[500px]">
        {/* Left: Video */}
        <div className="bg-black rounded-3xl overflow-hidden shadow-2xl relative order-first ring-4 ring-gray-900/5 aspect-video lg:aspect-auto">
          {renderVideo(currentQ.targetItem.videoUrl || "")}
          <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl pointer-events-none"></div>
        </div>

        {/* Right: Options */}
        <div className="flex flex-col justify-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-800">
              Video trên có nghĩa là gì?
            </h2>
            <p className="text-gray-500">Chọn đáp án đúng nhất bên dưới.</p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {currentQ.options.map((option) => {
              const isSelected = currentQ.selectedOptionId === option.id;
              const isTarget = option.id === currentQ.targetItem.id;

              let btnClass =
                "bg-white border-2 border-gray-100 hover:border-primary-200 hover:bg-primary-50 text-gray-700";
              let icon = null;

              if (currentQ.answered) {
                if (isTarget) {
                  btnClass = "bg-green-100 border-green-500 text-green-700";
                  icon = <CheckCircle size={20} />;
                } else if (isSelected) {
                  btnClass = "bg-red-100 border-red-500 text-red-700";
                  icon = <XCircle size={20} />;
                } else {
                  btnClass =
                    "bg-gray-50 border-gray-100 text-gray-400 opacity-50";
                }
              }

              return (
                <button
                  key={option.id}
                  disabled={currentQ.answered}
                  onClick={() => handleAnswer(option.id)}
                  className={`p-4 rounded-xl font-bold text-lg text-left transition-all duration-200 flex items-center justify-between ${btnClass} shadow-sm group`}
                >
                  <span className="group-hover:translate-x-1 transition-transform">
                    {option.word}
                  </span>
                  {icon}
                </button>
              );
            })}
          </div>

          {currentQ.answered && (
            <div className="pt-4 animate-in slide-in-from-bottom-5 fade-in">
              <button
                onClick={nextQuestion}
                className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition-transform active:scale-[0.98] flex items-center justify-center gap-2 shadow-xl shadow-gray-200"
              >
                {currentQIndex < questions.length - 1
                  ? "Câu tiếp theo"
                  : "Xem kết quả"}{" "}
                <ArrowRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
