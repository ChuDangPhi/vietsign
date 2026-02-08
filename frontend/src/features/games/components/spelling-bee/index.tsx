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
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(
    null,
  );

  // Slideshow states
  const [charIndex, setCharIndex] = useState(0);
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [speed, setSpeed] = useState(1000); // 1000ms = 1s

  // Cache words
  const allValidWordsRef = useRef<any[]>([]);

  useEffect(() => {
    const savedHighScore = localStorage.getItem(
      `highScore_game4_${difficulty}`,
    );
    if (savedHighScore) setHighScore(parseInt(savedHighScore));
  }, [difficulty]);

  useEffect(() => {
    initGame();
  }, [difficulty]);

  // Slideshow Effect
  useEffect(() => {
    if (!questions[currentIndex] || !isAutoMode || feedback) return;

    const chars = questions[currentIndex].normalizedChars;
    const interval = setInterval(() => {
      setCharIndex((prev) => (prev + 1) % chars.length);
    }, speed);

    return () => clearInterval(interval);
  }, [currentIndex, questions, isAutoMode, speed, feedback]);

  // Reset char index when question changes
  useEffect(() => {
    setCharIndex(0);
  }, [currentIndex]);

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

  const generateQuestions = (count: number, sourceWords: any[]) => {
    const config = {
      Dễ: { min: 2, max: 4 },
      "Trung bình": { min: 4, max: 6 },
      Khó: { min: 6, max: 15 },
    };
    const { min, max } = config[difficulty];

    const validWords = sourceWords.filter(
      (w) =>
        !w.word.includes(" ") && w.word.length >= min && w.word.length <= max,
    );

    if (validWords.length === 0) return [];

    const newQuestions: SpellingQuestion[] = [];
    for (let i = 0; i < count; i++) {
      const randomWord =
        validWords[Math.floor(Math.random() * validWords.length)];
      newQuestions.push({
        originalWord: randomWord.word,
        normalizedChars: normalizeForSpelling(randomWord.word),
      });
    }
    return newQuestions;
  };

  const initGame = useCallback(async () => {
    setLoading(true);
    try {
      const allWords = await fetchAllWords({ limit: 200 });
      allValidWordsRef.current = allWords;

      const initialQuestions = generateQuestions(10, allWords); // Init 10 items

      setQuestions(initialQuestions);
      setCurrentIndex(0);
      setScore(0);
      setLastPoints(0);
      setUserInput("");
      setFeedback(null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [difficulty]);

  const handleSkip = () => {
    setFeedback("incorrect");
    setScore(0);
    setLastPoints(0);

    // Show "incorrect" state briefly then moving next
    setTimeout(() => {
      nextQuestion();
      setFeedback(null);
    }, 1000);
  };

  const nextQuestion = () => {
    if (currentIndex >= questions.length - 1) {
      const more = generateQuestions(5, allValidWordsRef.current);
      setQuestions((prev) => [...prev, ...more]);
    }
    setCurrentIndex((prev) => prev + 1);
    setUserInput("");
    setCharIndex(0);

    // Auto-focus input for continuous play
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

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

      // Move to next question faster
      setTimeout(() => {
        nextQuestion();
        setFeedback(null);
      }, 1000);
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

  if (!questions[currentIndex]) return null;
  const currentQ = questions[currentIndex];
  const safeCharIndex = charIndex % currentQ.normalizedChars.length;
  const currentChar = currentQ.normalizedChars[safeCharIndex];

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col max-w-6xl mx-auto p-4 gap-4">
      {/* Header Compact */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 bg-white shadow-sm"
          >
            <ArrowLeft className="text-gray-600" size={20} />
          </button>

          <div className="flex flex-col">
            <h2 className="text-lg font-black text-gray-900 leading-tight">
              Thử thách Đánh vần
            </h2>
            <p className="text-xs text-gray-500 font-medium">
              Mức độ: {difficulty}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            <Tooltip title="Chơi lại">
              <Button
                icon={<RefreshCw size={16} />}
                onClick={initGame}
                shape="circle"
                size="small"
              />
            </Tooltip>
            <Tooltip title="Đổi độ khó">
              <Button
                icon={<Settings size={16} />}
                onClick={onChangeDifficulty}
                shape="circle"
                size="small"
              />
            </Tooltip>
          </div>

          <div className="hidden md:block text-right">
            <div className="text-[10px] font-bold text-gray-400 uppercase">
              Kỷ lục
            </div>
            <div className="text-sm font-black text-orange-500">
              {highScore}
            </div>
          </div>

          {lastPoints > 0 && (
            <div className="hidden md:flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs font-black animate-bounce shadow-sm border border-yellow-200">
              <Zap size={12} fill="currentColor" /> +{lastPoints + 100}
            </div>
          )}

          <div className="bg-primary-600 px-4 py-1.5 rounded-xl shadow-md font-bold text-white flex items-center gap-2">
            <Trophy size={16} /> {score}
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-shrink-0 flex-wrap items-center justify-center gap-4 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setIsAutoMode(true)}
            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${isAutoMode ? "bg-white shadow-sm text-primary-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            Tự động
          </button>
          <button
            onClick={() => setIsAutoMode(false)}
            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${!isAutoMode ? "bg-white shadow-sm text-primary-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            Thủ công
          </button>
        </div>

        {isAutoMode && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-600">Tốc độ:</span>
            <select
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="bg-gray-100 border-none rounded-lg text-xs font-bold text-gray-700 py-1 pl-2 pr-6 focus:ring-1 focus:ring-primary-500"
            >
              <option value={1000}>1s</option>
              <option value={2000}>2s</option>
              <option value={3000}>3s</option>
            </select>
          </div>
        )}

        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-4 border-l border-gray-200">
          Ký tự {safeCharIndex + 1} / {currentQ.normalizedChars.length}
        </div>
      </div>

      {/* Image Container - Flex Grow */}
      <div className="flex-1 min-h-0 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 relative overflow-hidden flex flex-col items-center justify-center">
        {/* Main Image */}
        <div className="absolute inset-0 p-4 flex items-center justify-center">
          {currentChar && (
            <img
              key={currentChar}
              src={`/A-Z/${currentChar}.webp`}
              alt={currentChar}
              className="w-full h-full object-contain drop-shadow-lg animate-in zoom-in duration-300"
              onError={(e) => {
                (e.target as any).src =
                  `https://via.placeholder.com/400?text=${currentChar}`;
              }}
            />
          )}
        </div>

        {/* Nav Controls Overlay */}
        {!isAutoMode && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-8 z-10">
            <button
              onClick={() =>
                setCharIndex(
                  (prev) =>
                    (prev - 1 + currentQ.normalizedChars.length) %
                    currentQ.normalizedChars.length,
                )
              }
              className="p-3 bg-white/90 backdrop-blur rounded-full shadow-lg border border-gray-200 hover:bg-white hover:scale-110 transition-all text-gray-700"
            >
              <ArrowLeft size={24} />
            </button>
            <button
              onClick={() =>
                setCharIndex(
                  (prev) => (prev + 1) % currentQ.normalizedChars.length,
                )
              }
              className="p-3 bg-white/90 backdrop-blur rounded-full shadow-lg border border-gray-200 hover:bg-white hover:scale-110 transition-all text-gray-700 transform rotate-180"
            >
              <ArrowLeft size={24} />
            </button>
          </div>
        )}
      </div>

      {/* Input Area - Fixed Bottom */}
      <div className="flex-shrink-0 w-full max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="relative flex gap-3">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              autoFocus
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={feedback !== null}
              placeholder="Nhập từ..."
              className={`w-full h-14 pl-6 pr-12 rounded-xl text-xl font-black border-2 transition-all outline-none 
                  ${
                    feedback === "correct"
                      ? "border-green-500 bg-green-50 text-green-700"
                      : feedback === "incorrect"
                        ? "border-red-500 bg-red-50 text-red-700 animate-shake"
                        : "border-gray-300 bg-white focus:border-primary-500 focus:shadow-lg"
                  }`}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              {feedback === "correct" && (
                <CheckCircle2 className="text-green-600" size={24} />
              )}
              {feedback === "incorrect" && (
                <XCircle className="text-red-600" size={24} />
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleSkip}
            disabled={feedback !== null}
            className="h-14 px-5 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 whitespace-nowrap"
          >
            Bỏ qua
          </button>

          <button
            type="submit"
            disabled={feedback !== null || !userInput}
            className="h-14 px-8 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 shadow-lg disabled:opacity-50 whitespace-nowrap flex items-center gap-2"
          >
            <Keyboard size={18} /> Kiểm tra
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
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
};
