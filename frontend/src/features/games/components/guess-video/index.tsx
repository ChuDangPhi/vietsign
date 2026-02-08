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

interface GuessVideoGameProps {
  difficulty: "Dễ" | "Trung bình" | "Khó";
  onRestart?: () => void;
  onChangeDifficulty?: () => void;
}

export const GuessVideoGame: React.FC<GuessVideoGameProps> = ({
  difficulty,
  onRestart,
  onChangeDifficulty,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lastPoints, setLastPoints] = useState(0);
  const [highScore, setHighScore] = useState(0);

  // Store all valid items to generate more questions without refetching
  const allValidItemsRef = React.useRef<DictionaryItem[]>([]);

  useEffect(() => {
    const savedHighScore = localStorage.getItem(
      `highScore_game1_${difficulty}`,
    );
    if (savedHighScore) setHighScore(parseInt(savedHighScore));
  }, [difficulty]);

  useEffect(() => {
    initGame();
  }, [difficulty]);

  const generateQuestions = (count: number, sourceItems: DictionaryItem[]) => {
    const newQuestions: Question[] = [];
    if (sourceItems.length < 4) return [];

    for (let i = 0; i < count; i++) {
      const randomTarget =
        sourceItems[Math.floor(Math.random() * sourceItems.length)];
      const distractors: DictionaryItem[] = [];
      let attempts = 0;

      // Select 3 distractors
      while (distractors.length < 3 && attempts < 20) {
        const randomDist =
          sourceItems[Math.floor(Math.random() * sourceItems.length)];
        if (
          randomDist.id !== randomTarget.id &&
          !distractors.find((d) => d.id === randomDist.id)
        ) {
          distractors.push(randomDist);
        }
        attempts++;
      }

      // Fallback if not enough random unique distractors found
      if (distractors.length < 3) {
        const others = sourceItems.filter((v) => v.id !== randomTarget.id);
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
    return newQuestions;
  };

  const initGame = async () => {
    setLoading(true);
    try {
      const allWords = await fetchAllWords({ limit: 100 });
      const validItems = allWords.filter(
        (item) => item.videoUrl && item.videoUrl.trim().length > 0,
      );

      allValidItemsRef.current = validItems;

      if (validItems.length < 4) {
        setQuestions([]);
        setLoading(false);
        return;
      }

      // Initial batch
      const initialQuestions = generateQuestions(5, validItems);

      setQuestions(initialQuestions);
      setCurrentQIndex(0);
      setScore(0);
      setLastPoints(0);
    } catch (error) {
      console.error("Error initializing game:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (optionId: number) => {
    if (questions[currentQIndex].answered) return;

    const currentQ = questions[currentQIndex];
    // If optionId is -1, it's a skip (wrong answer)
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
          `highScore_game1_${difficulty}`,
          newScore.toString(),
        );
      }
    } else {
      // Wrong answer or Skip: Reset score and streak
      setScore(0);
      setLastPoints(0);
    }
  };

  const handleSkip = () => {
    handleAnswer(-1);
  };

  const nextQuestion = () => {
    // If we are at the last question, generate more
    if (currentQIndex >= questions.length - 1) {
      const moreQuestions = generateQuestions(5, allValidItemsRef.current);
      setQuestions((prev) => [...prev, ...moreQuestions]);
    }
    setCurrentQIndex((prev) => prev + 1);
  };

  const renderVideo = (url: string) => {
    if (url.includes("vimeo")) {
      const idMatch = url.match(/(?:vimeo.com\/|video\/)(\d+)/);
      const videoId = idMatch ? idMatch[1] : "";
      return (
        <iframe
          src={`https://player.vimeo.com/video/${videoId}?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&loop=1&background=1`}
          width="100%"
          height="100%"
          frameBorder="0"
          allow="autoplay; fullscreen"
          className="w-full h-full object-cover"
          title="Video Quiz"
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

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-primary-600" size={40} />
      </div>
    );

  if (!questions[currentQIndex]) return null;
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
            Câu {currentQIndex + 1}
          </div>
          <div className="bg-primary-600 px-4 py-2 rounded-full shadow-sm shadow-primary-200 font-bold text-white flex items-center gap-2 min-w-[100px] justify-center">
            <Trophy size={16} /> {score}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 min-h-[500px]">
        <div className="bg-black rounded-3xl overflow-hidden shadow-2xl relative order-first ring-4 ring-gray-900/5 aspect-video lg:aspect-auto">
          {renderVideo(currentQ.targetItem.videoUrl || "")}
        </div>

        <div className="flex flex-col justify-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-800">
              Video trên có nghĩa là gì?
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

          <div className="pt-4 flex gap-3 animate-in slide-in-from-bottom-5 fade-in">
            {!currentQ.answered && (
              <button
                onClick={handleSkip}
                className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-xl font-bold text-lg hover:bg-gray-200 flex items-center justify-center gap-2"
              >
                Bỏ qua (Reset điểm)
              </button>
            )}
            {currentQ.answered && (
              <button
                onClick={nextQuestion}
                className="flex-1 py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-gray-800 flex items-center justify-center gap-2 shadow-xl shadow-gray-200"
              >
                Câu tiếp theo <ArrowRight size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
