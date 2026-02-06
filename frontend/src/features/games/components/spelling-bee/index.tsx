"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { fetchAllWords } from "@/services/dictionaryService";
import {
  RefreshCw,
  Trophy,
  ArrowLeft,
  Loader2,
  Keyboard,
  CheckCircle2,
  XCircle,
  Settings,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button, Tooltip } from "antd";

interface SpellingQuestion {
  originalWord: string;
  normalizedChars: string[];
}

interface SpellingBeeGameProps {
  difficulty: "Dễ" | "Trung bình" | "Khó";
  onRestart?: () => void;
  onChangeDifficulty?: () => void;
}

export const SpellingBeeGame: React.FC<SpellingBeeGameProps> = ({
  difficulty,
  onChangeDifficulty,
}) => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<SpellingQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState(0);
  const [lastPoints, setLastPoints] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(
    null,
  );

  useEffect(() => {
    const savedHighScore = localStorage.getItem(
      `highScore_game4_${difficulty}`,
    );
    if (savedHighScore) setHighScore(parseInt(savedHighScore));
  }, [difficulty]);

  const normalizeForSpelling = (str: string): string[] => {
    return str
      .toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[Đ]/g, "D")
      .replace(/[ĂÂ]/g, "A")
      .replace(/[Ê]/g, "E")
      .replace(/[ÔƠ]/g, "O")
      .replace(/[Ư]/g, "U")
      .split("")
      .filter((c) => /[A-Z]/.test(c));
  };

  const initGame = useCallback(async () => {
    setLoading(true);
    try {
      const allWords = await fetchAllWords({ limit: 200 });

      const config = {
        Dễ: { count: 5, min: 2, max: 4 },
        "Trung bình": { count: 10, min: 5, max: 7 },
        Khó: { count: 15, min: 8, max: 15 },
      };
      const { count, min, max } = config[difficulty];

      const validWords = allWords
        .filter(
          (w) =>
            !w.word.includes(" ") &&
            w.word.length >= min &&
            w.word.length <= max,
        )
        .sort(() => Math.random() - 0.5)
        .slice(0, count);

      const qs = validWords.map((w) => ({
        originalWord: w.word,
        normalizedChars: normalizeForSpelling(w.word),
      }));

      setQuestions(qs);
      setCurrentIndex(0);
      setScore(0);
      setLastPoints(0);
      setUserInput("");
      setFeedback(null);
      setShowResult(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [difficulty]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback || !userInput) return;

    const isCorrect =
      userInput.trim().toLowerCase() ===
      questions[currentIndex].originalWord.toLowerCase();

    if (isCorrect) {
      setFeedback("correct");
      const nextPoints = lastPoints + 100;
      const newScore = score + nextPoints;
      setScore(newScore);
      setLastPoints(nextPoints);

      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem(
          `highScore_game4_${difficulty}`,
          newScore.toString(),
        );
      }

      setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex((i) => i + 1);
          setUserInput("");
          setFeedback(null);
        } else {
          setShowResult(true);
        }
      }, 1500);
    } else {
      setFeedback("incorrect");
      setScore(0);
      setLastPoints(0);
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-primary-600" size={40} />
      </div>
    );

  if (showResult) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100">
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy size={48} className="text-orange-600" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">
            Hoàn thành!
          </h1>
          <p className="text-gray-500">
            Mức độ: <strong>{difficulty}</strong>
          </p>

          <div className="flex justify-center gap-12 my-8">
            <div className="text-center">
              <div className="text-5xl font-black text-primary-600">
                {score}
              </div>
              <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                Điểm đạt được
              </div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black text-orange-500">
                {highScore}
              </div>
              <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                Kỷ lục của bạn
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            <button
              onClick={initGame}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors"
            >
              <RefreshCw size={20} /> Chơi lại
            </button>
            <button
              onClick={onChangeDifficulty}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors"
            >
              <Settings size={20} /> Đổi độ khó
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 bg-white shadow-sm"
          >
            <ArrowLeft className="text-gray-600" size={24} />
          </button>
          <div className="flex gap-2">
            <Tooltip title="Chơi lại">
              <Button
                icon={<RefreshCw size={18} />}
                onClick={initGame}
                shape="circle"
              />
            </Tooltip>
            <Tooltip title="Đổi độ khó">
              <Button
                icon={<Settings size={18} />}
                onClick={onChangeDifficulty}
                shape="circle"
              />
            </Tooltip>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:block text-right">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Kỷ lục
            </div>
            <div className="text-sm font-black text-orange-500">
              {highScore}
            </div>
          </div>
          {lastPoints > 0 && (
            <div className="hidden md:flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-black animate-bounce shadow-sm border border-yellow-200">
              <Zap size={14} fill="currentColor" /> +{lastPoints + 100} kế tiếp!
            </div>
          )}
          <div className="bg-white px-6 py-2.5 rounded-2xl shadow-sm border border-gray-100 font-bold text-gray-700">
            Câu {currentIndex + 1}/{questions.length}
          </div>
          <div className="bg-primary-600 px-6 py-2.5 rounded-2xl shadow-lg shadow-primary-100 font-bold text-white flex items-center gap-2 min-w-[100px] justify-center">
            <Trophy size={18} /> {score}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto text-center space-y-12">
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-gray-900">
            Thử thách Đánh vần
          </h2>
          <p className="text-gray-500">
            Quan sát và nhập từ tương ứng (Mức độ: {difficulty})
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 py-8 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 min-h-[220px] items-center px-6">
          {currentQ?.normalizedChars.map((char, i) => (
            <div
              key={i}
              className="bg-white p-3 rounded-2xl shadow-md border border-gray-100 animate-in slide-in-from-bottom"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <img
                src={`/A-Z/${char}.webp`}
                alt={char}
                className="w-16 h-16 md:w-24 md:h-24 object-contain"
                onError={(e) => {
                  (e.target as any).src =
                    `https://via.placeholder.com/100?text=${char}`;
                }}
              />
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto relative">
          <input
            ref={inputRef}
            type="text"
            autoFocus
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={feedback !== null}
            placeholder="Nhập từ..."
            className={`w-full p-5 rounded-2xl text-2xl font-black text-center border-4 transition-all outline-none ${feedback === "correct" ? "border-green-500 bg-green-50 text-green-700" : feedback === "incorrect" ? "border-red-500 bg-red-50 text-red-700 animate-shake" : "border-gray-200 bg-white focus:border-primary-500 focus:shadow-xl"}`}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {feedback === "correct" && (
              <CheckCircle2 className="text-green-600" size={32} />
            )}
            {feedback === "incorrect" && (
              <XCircle className="text-red-600" size={32} />
            )}
          </div>
          <button
            type="submit"
            disabled={feedback !== null || !userInput}
            className="mt-6 w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-gray-800 flex items-center justify-center gap-2 shadow-xl disabled:opacity-50"
          >
            <Keyboard size={20} /> Kiểm tra
          </button>
        </form>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-10px);
          }
          75% {
            transform: translateX(10px);
          }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
};
