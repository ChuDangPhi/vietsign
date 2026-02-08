"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { fetchAllWords } from "@/services/dictionaryService";
import {
  RefreshCw,
  Trophy,
  ArrowLeft,
  Loader2,
  Settings,
  Brain,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button, Tooltip, message } from "antd";

interface Card {
  id: number;
  type: "video" | "image" | "text";
  content: string;
  pairId: number;
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
  const [allCards, setAllCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);

  // Game config
  const config = {
    Dễ: { pairs: 6, gridCols: "grid-cols-3 md:grid-cols-4" },
    "Trung bình": { pairs: 10, gridCols: "grid-cols-4 md:grid-cols-5" },
    Khó: { pairs: 15, gridCols: "grid-cols-5 md:grid-cols-6" },
  }[difficulty];

  const totalPairs = config.pairs;
  const matchedPairs = matched.length / 2;

  const initGame = useCallback(async () => {
    setLoading(true);
    setGameCompleted(false);
    setScore(0);
    setMoves(0);
    setMatched([]);
    setFlipped([]);

    try {
      const allWords = await fetchAllWords({ limit: 200 });
      // Filter valid items
      const validItems = allWords.filter(
        (item) =>
          (item.videoUrl && item.videoUrl.trim().length > 0) ||
          (item.imageUrl && item.imageUrl.trim().length > 0),
      );

      if (validItems.length < totalPairs) {
        message.warning("Không đủ dữ liệu từ vựng để tạo trò chơi.");
        return;
      }

      // Select random pairs
      const selected = [];
      const indices = new Set<number>();
      while (selected.length < totalPairs) {
        const idx = Math.floor(Math.random() * validItems.length);
        if (!indices.has(idx)) {
          indices.add(idx);
          selected.push(validItems[idx]);
        }
      }

      // Generate cards
      const cards: Card[] = [];
      selected.forEach((item, index) => {
        // Card 1: Video/Image
        cards.push({
          id: index * 2,
          content: item.videoUrl || item.imageUrl || "", // Priority video
          type: item.videoUrl ? "video" : "image",
          pairId: index,
        });
        // Card 2: Word
        cards.push({
          id: index * 2 + 1,
          content: item.word,
          type: "text",
          pairId: index,
        });
      });

      // Shuffle
      setAllCards(cards.sort(() => Math.random() - 0.5));
    } catch (error) {
      console.error(error);
      message.error("Lỗi tải dữ liệu trò chơi.");
    } finally {
      setLoading(false);
    }
  }, [difficulty, totalPairs]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleFlip = (index: number) => {
    // Prevent flipping if already matched, already flipped, or 2 cards already flipped
    if (
      flipped.length === 2 ||
      matched.includes(index) ||
      flipped.includes(index)
    ) {
      return;
    }

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((prev) => prev + 1);
      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = allCards[firstIdx];
      const secondCard = allCards[secondIdx];

      if (firstCard.pairId === secondCard.pairId) {
        // Match found
        setMatched((prev) => [...prev, firstIdx, secondIdx]);
        setScore((prev) => prev + 100);
        setFlipped([]);

        // Check completion
        if (matched.length + 2 === allCards.length) {
          setTimeout(() => setGameCompleted(true), 500);
        }
      } else {
        // No match
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-primary-600" size={40} />
      </div>
    );
  }

  if (gameCompleted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-4 mx-auto animate-bounce">
          <Trophy size={48} className="text-yellow-600" />
        </div>
        <div>
          <h2 className="text-4xl font-black text-gray-900 mb-2">Chúc mừng!</h2>
          <p className="text-xl text-gray-600">Bạn đã hoàn thành trò chơi</p>
        </div>

        <div className="grid grid-cols-2 gap-8 w-full max-w-md mx-auto">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="text-gray-500 font-medium mb-1">Số lượt lật</div>
            <div className="text-3xl font-black text-primary-600">{moves}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="text-gray-500 font-medium mb-1">Điểm số</div>
            <div className="text-3xl font-black text-orange-500">{score}</div>
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
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
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
          <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 font-bold text-orange-500">
            Điểm: {score}
          </div>
          <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 font-bold text-gray-700">
            Ghép: {matchedPairs}/{totalPairs}
          </div>
        </div>
      </div>

      {/* Game Content */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-primary-900 mb-3">
            Lật thẻ để tìm cặp video/hình ảnh - từ tương ứng
          </h3>
          <p className="text-gray-500 font-medium">
            Mức độ: {difficulty} ({totalPairs} cặp thẻ)
          </p>
        </div>

        {/* Card Grid */}
        <div className={`grid ${config.gridCols} gap-4 md:gap-6`}>
          {allCards.map((card, idx) => {
            const isFlipped = flipped.includes(idx) || matched.includes(idx);
            const isMatched = matched.includes(idx);

            return (
              <div
                key={idx}
                onClick={() => handleFlip(idx)}
                className="relative aspect-[4/3] cursor-pointer transition-transform duration-300 hover:scale-105"
              >
                {/* Conditional Rendering logic exactly like FlipCardStep */}
                {isFlipped ? (
                  <div
                    className={`absolute inset-0 rounded-2xl shadow-xl overflow-hidden animate-in zoom-in duration-300 border-4 flex items-center justify-center p-2 
                      ${isMatched ? "border-green-500 bg-green-50" : "border-primary-200 bg-white"}`}
                  >
                    {card.type === "video" ? (
                      <video
                        src={card.content}
                        className="w-full h-full object-contain rounded-lg"
                        autoPlay
                        muted
                        loop
                        playsInline
                      />
                    ) : card.type === "image" ? (
                      <img
                        src={card.content}
                        alt="card content"
                        className="w-full h-full object-contain rounded-lg"
                      />
                    ) : (
                      <span className="text-lg md:text-xl font-bold text-center text-primary-800 break-words">
                        {card.content}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl shadow-lg border-4 border-white flex items-center justify-center">
                    <Brain size={32} className="text-white opacity-40" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
