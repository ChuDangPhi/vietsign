"use client";

import React, { useState, useEffect } from "react";
import { DictionaryItem } from "@/data/dictionaryData";
import { fetchAllWords } from "@/services/dictionaryService";
import {
  Play,
  CheckCircle,
  XCircle,
  ArrowRight,
  RefreshCw,
  Trophy,
  ArrowLeft,
  Loader2,
  Image as ImageIcon,
  Settings,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button, Tooltip } from "antd";

interface Question {
  targetItem: DictionaryItem;
  options: DictionaryItem[];
  answered: boolean;
  isCorrect: boolean;
  selectedOptionId: number | null;
}

interface GuessImageGameProps {
  difficulty: "Dễ" | "Trung bình" | "Khó";
  onRestart?: () => void;
  onChangeDifficulty?: () => void;
}

export const GuessImageGame: React.FC<GuessImageGameProps> = ({
  difficulty,
  onChangeDifficulty,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lastPoints, setLastPoints] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const savedHighScore = localStorage.getItem(
      `highScore_game2_${difficulty}`,
    );
    if (savedHighScore) setHighScore(parseInt(savedHighScore));
  }, [difficulty]);

  useEffect(() => {
    initGame();
  }, [difficulty]);

  const initGame = async () => {
    setLoading(true);
    try {
      const allWords = await fetchAllWords({ limit: 100 });
      const validItems = allWords.filter(
        (item) => item.imageUrl && item.imageUrl.trim().length > 0,
      );

      if (validItems.length < 4) {
        setQuestions([]);
        setLoading(false);
        return;
      }

      const questionCounts = { Dễ: 5, "Trung bình": 10, Khó: 15 };
      const totalQuestions = Math.min(
        questionCounts[difficulty],
        validItems.length,
      );

      const newQuestions: Question[] = [];
      const shuffled = [...validItems].sort(() => Math.random() - 0.5);

      for (let i = 0; i < totalQuestions; i++) {
        const randomTarget = shuffled[i];
        const distractors: DictionaryItem[] = [];
        let attempts = 0;
        while (distractors.length < 3 && attempts < 20) {
          const randomDist =
            allWords[Math.floor(Math.random() * allWords.length)];
          if (
            randomDist.id !== randomTarget.id &&
            !distractors.find((d) => d.id === randomDist.id)
          ) {
            distractors.push(randomDist);
          }
          attempts++;
        }

        if (distractors.length < 3) {
          const others = allWords.filter((v) => v.id !== randomTarget.id);
          others
            .slice(0, 3 - distractors.length)
            .forEach((o) => distractors.push(o));
        }

        const options = [...distractors, randomTarget].sort(
          () => Math.random() - 0.5,
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
      setLastPoints(0);
      setShowResult(false);
    } catch (error) {
      console.error("Error initializing game:", error);
    } finally {
      setLoading(false);
    }
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

    if (isCorrect) {
      const nextPoints = lastPoints + 100;
      const newScore = score + nextPoints;
      setScore(newScore);
      setLastPoints(nextPoints);

      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem(
          `highScore_game2_${difficulty}`,
          newScore.toString(),
        );
      }
    } else {
      setScore(0);
      setLastPoints(0);
    }
  };

  const nextQuestion = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
    } else {
      setShowResult(true);
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
          <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy size={48} className="text-yellow-600" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">
            Hoàn thành xuất sắc!
          </h1>
          <p className="text-gray-500">
            Chế độ: <strong>{difficulty}</strong>
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

  if (questions.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 p-12">
        <ImageIcon size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Không đủ dữ liệu</h2>
        <p className="text-gray-500 mt-2">
          Cần ít nhất 4 từ có hình ảnh để bắt đầu trò chơi này.
        </p>
        <button
          onClick={() => router.back()}
          className="mt-6 px-6 py-2 bg-primary-600 text-white rounded-lg"
        >
          Quay lại
        </button>
      </div>
    );
  }

  const currentQ = questions[currentQIndex];

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="text-gray-600" />
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
          <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 font-bold text-gray-700">
            Câu {currentQIndex + 1}/{questions.length}
          </div>
          <div className="bg-primary-600 px-4 py-2 rounded-full shadow-sm shadow-primary-200 font-bold text-white flex items-center gap-2 min-w-[100px] justify-center">
            <Trophy size={16} /> {score}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 min-h-[500px]">
        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl relative order-first ring-4 ring-gray-900/5 aspect-video lg:aspect-auto flex items-center justify-center p-4">
          <img
            src={currentQ.targetItem.imageUrl}
            alt="Question"
            className="max-w-full max-h-full object-contain rounded-2xl"
          />
        </div>

        <div className="flex flex-col justify-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-800">
              Hình ảnh trên có nghĩa là gì?
            </h2>
            <p className="text-gray-500">Mức độ: {difficulty}</p>
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
                className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-gray-800 flex items-center justify-center gap-2 shadow-xl shadow-gray-200"
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
