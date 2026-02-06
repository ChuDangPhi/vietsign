"use client";

import React, { useState, useEffect, useCallback } from "react";
import { DictionaryItem } from "@/data/dictionaryData";
import { fetchAllWords } from "@/services/dictionaryService";
import {
  RefreshCw,
  Trophy,
  ArrowLeft,
  Loader2,
  Brain,
  Timer,
  Settings,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button, Tooltip } from "antd";

interface Card {
  id: string;
  wordId: number;
  content: string;
  type: "word" | "image";
  imageUrl?: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryMatchGameProps {
  difficulty: "Dễ" | "Trung bình" | "Khó";
  onRestart?: () => void;
  onChangeDifficulty?: () => void;
}

export const MemoryMatchGame: React.FC<MemoryMatchGameProps> = ({
  difficulty,
  onChangeDifficulty,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [time, setTime] = useState(0); // Elapsed time
  const [lastMatchTime, setLastMatchTime] = useState(0); // Time when last match occurred
  const [isActive, setIsActive] = useState(false);

  // Difficulty configs
  const diffConfigs = {
    Dễ: { pairs: 3, gridCols: "grid-cols-3", timeLimit: 90 },
    "Trung bình": {
      pairs: 6,
      gridCols: "grid-cols-3 md:grid-cols-4",
      timeLimit: 150,
    },
    Khó: { pairs: 10, gridCols: "grid-cols-4 md:grid-cols-5", timeLimit: 240 },
  };
  const config = diffConfigs[difficulty];

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          const nextTime = prevTime + 1;
          if (nextTime >= config.timeLimit) {
            setIsActive(false);
            setIsGameOver(true);
            setShowResult(true);
            return config.timeLimit;
          }
          return nextTime;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, config.timeLimit]);

  const initGame = useCallback(async () => {
    setLoading(true);
    try {
      const allWords = await fetchAllWords({ limit: 100 });
      const validItems = allWords.filter(
        (item) => item.imageUrl && item.imageUrl.trim().length > 0,
      );

      const pairCount = config.pairs;
      const selectedWords = validItems
        .sort(() => Math.random() - 0.5)
        .slice(0, pairCount);

      const gameCards: Card[] = [];
      selectedWords.forEach((word) => {
        gameCards.push({
          id: `word-${word.id}`,
          wordId: Number(word.id),
          content: word.word,
          type: "word",
          isFlipped: false,
          isMatched: false,
        });
        gameCards.push({
          id: `image-${word.id}`,
          wordId: Number(word.id),
          content: word.word,
          type: "image",
          imageUrl: word.imageUrl,
          isFlipped: false,
          isMatched: false,
        });
      });

      setCards(gameCards.sort(() => Math.random() - 0.5));
      setFlippedCards([]);
      setMoves(0);
      setMatches(0);
      setScore(0);
      setTime(0);
      setLastMatchTime(0);
      setShowResult(false);
      setIsGameOver(false);
      setIsActive(true);
    } catch (error) {
      console.error("Error initializing game:", error);
    } finally {
      setLoading(false);
    }
  }, [difficulty, config.pairs]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const calculatePoints = (timeTaken: number) => {
    if (timeTaken <= 5) return 100;
    if (timeTaken >= 40) return 10;
    // Linear decrease from 100 at 5s to 10 at 40s
    // points = 100 - (timeTaken - 5) * (90 / 35)
    return Math.floor(100 - (timeTaken - 5) * (90 / 35));
  };

  const handleCardClick = (index: number) => {
    if (
      !isActive ||
      cards[index].isFlipped ||
      cards[index].isMatched ||
      flippedCards.length === 2
    ) {
      return;
    }

    const newFlippedCards = [...flippedCards, index];
    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves((m) => m + 1);
      const [firstIndex, secondIndex] = newFlippedCards;

      if (cards[firstIndex].wordId === cards[secondIndex].wordId) {
        // Match found
        const timeTaken = time - lastMatchTime;
        const points = calculatePoints(timeTaken);
        setScore((s) => s + points);
        setLastMatchTime(time);

        setTimeout(() => {
          setCards((prev) => {
            const updated = [...prev];
            updated[firstIndex].isMatched = true;
            updated[secondIndex].isMatched = true;
            return updated;
          });
          setMatches((m) => {
            const newMatches = m + 1;
            if (newMatches === config.pairs) {
              setIsActive(false);
              setTimeout(() => setShowResult(true), 500);
            }
            return newMatches;
          });
          setFlippedCards([]);
        }, 600);
      } else {
        setTimeout(() => {
          setCards((prev) => {
            const updated = [...prev];
            updated[firstIndex].isFlipped = false;
            updated[secondIndex].isFlipped = false;
            return updated;
          });
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const formatTime = (seconds: number) =>
    `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`;

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-primary-600" size={40} />
      </div>
    );

  if (showResult) {
    const timeLeft = config.timeLimit - time;
    return (
      <div className="max-w-2xl mx-auto p-6 text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100">
          <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            {isGameOver ? (
              <Timer size={48} className="text-red-600" />
            ) : (
              <Trophy size={48} className="text-purple-600" />
            )}
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">
            {isGameOver ? "Hết giờ!" : "Tuyệt vời!"}
          </h1>
          <p className="text-gray-500">
            Mức độ: <strong>{difficulty}</strong>
          </p>

          <div className="text-6xl font-black text-primary-600 my-8">
            {score}{" "}
            <span className="text-2xl text-gray-400 font-bold">điểm</span>
          </div>

          <div className="grid grid-cols-2 gap-8 my-8">
            <div className="text-center">
              <div className="text-4xl font-black text-primary-600">
                {moves}
              </div>
              <div className="text-sm text-gray-500 font-bold uppercase whitespace-nowrap">
                Lượt đi
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-primary-600">
                {formatTime(time)}
              </div>
              <div className="text-sm text-gray-500 font-bold uppercase whitespace-nowrap">
                Thời gian
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
          <div className="bg-white px-4 md:px-6 py-2 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3 font-bold text-gray-700">
            <Brain size={20} className="text-purple-500" />
            <span className="whitespace-nowrap">Lượt: {moves}</span>
          </div>
          <div className="bg-white px-4 md:px-6 py-2 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3 font-bold text-gray-700">
            <Timer size={20} className="text-blue-500" />
            <span className="whitespace-nowrap">{formatTime(time)}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-gray-900">Lật bài trí nhớ</h2>
          <p className="text-gray-500 mt-2">
            Độ khó: {difficulty} ({config.pairs} cặp thẻ)
          </p>
        </div>

        <div className={`grid ${config.gridCols} gap-4 md:gap-6`}>
          {cards.map((card, index) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(index)}
              className={`relative aspect-[3/4] cursor-pointer transition-all duration-500 transform-gpu ${card.isFlipped ? "[transform:rotateY(180deg)]" : ""} ${card.isMatched ? "opacity-0 scale-90 pointer-events-none" : "hover:scale-105 active:scale-95"}`}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div
                className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl shadow-lg border-4 border-white flex items-center justify-center overflow-hidden"
                style={{ backfaceVisibility: "hidden" }}
              >
                <Brain size={48} className="text-white opacity-30" />
              </div>
              <div
                className={`absolute inset-0 bg-white rounded-2xl shadow-xl border-4 border-primary-100 flex items-center justify-center p-2 [transform:rotateY(180deg)]`}
                style={{ backfaceVisibility: "hidden" }}
              >
                {card.type === "word" ? (
                  <span className="text-base md:text-xl font-black text-primary-700 text-center leading-tight px-1 uppercase">
                    {card.content}
                  </span>
                ) : (
                  <img
                    src={card.imageUrl}
                    alt="Sign"
                    className="w-full h-full object-contain rounded-xl"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
