"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { StepProps } from "./types";
import { VideoPlayer } from "../VideoPlayer";

interface FlipCard {
  id: string;
  type: "video" | "text";
  content: string;
  matchId: number;
}

export const FlipCardStep: React.FC<StepProps> = ({ step, onComplete }) => {
  // Step đưa ra các thẻ bài úp. Người dùng lật từng cặp thẻ để tìm cặp video và từ vựng trùng khớp.
  const rawCards = step.flipCards || [];

  // Tạo danh sách thẻ đã shuffle - chỉ tạo 1 lần khi component mount
  const [shuffledCards] = useState<FlipCard[]>(() => {
    const cards: FlipCard[] = [];

    // Tạo thẻ video
    rawCards.forEach((c: any, i: number) => {
      cards.push({
        id: `video-${i}`,
        type: "video",
        content: c.videoUrl,
        matchId: i,
      });
    });

    // Tạo thẻ text
    rawCards.forEach((c: any, i: number) => {
      cards.push({
        id: `text-${i}`,
        type: "text",
        content: c.matchText,
        matchId: i,
      });
    });

    // Shuffle (Fisher-Yates algorithm)
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }

    return cards;
  });

  // State: Danh sách ID thẻ đang lật (tối đa 2)
  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  // State: Danh sách ID thẻ đã match thành công
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  // State: Đang trong quá trình check match (để tránh click thêm)
  const [isChecking, setIsChecking] = useState(false);

  // Số cặp đã ghép thành công
  const matchedPairs = matchedIds.length / 2;
  const totalPairs = rawCards.length;

  // Xử lý khi click vào thẻ
  const handleCardClick = useCallback(
    (cardId: string) => {
      // Không cho click khi đang check match hoặc thẻ đã match hoặc thẻ đang lật
      if (isChecking) return;
      if (matchedIds.includes(cardId)) return;
      if (flippedIds.includes(cardId)) return;

      // Nếu đã có 2 thẻ đang lật, không cho click thêm
      if (flippedIds.length >= 2) return;

      // Thêm thẻ vào danh sách đang lật
      const newFlippedIds = [...flippedIds, cardId];
      setFlippedIds(newFlippedIds);

      // Nếu đã lật 2 thẻ, kiểm tra match
      if (newFlippedIds.length === 2) {
        setIsChecking(true);

        const [firstId, secondId] = newFlippedIds;
        const firstCard = shuffledCards.find((c) => c.id === firstId);
        const secondCard = shuffledCards.find((c) => c.id === secondId);

        if (
          firstCard &&
          secondCard &&
          firstCard.matchId === secondCard.matchId &&
          firstCard.type !== secondCard.type
        ) {
          // Match thành công!
          setTimeout(() => {
            setMatchedIds((prev) => [...prev, firstId, secondId]);
            setFlippedIds([]);
            setIsChecking(false);

            // Kiểm tra nếu đã hoàn thành tất cả
            if (matchedIds.length + 2 === shuffledCards.length && onComplete) {
              setTimeout(onComplete, 800);
            }
          }, 600);
        } else {
          // Không match - đợi rồi úp lại
          setTimeout(() => {
            setFlippedIds([]);
            setIsChecking(false);
          }, 1200);
        }
      }
    },
    [flippedIds, matchedIds, isChecking, shuffledCards, onComplete],
  );

  // Kiểm tra thẻ có đang lật không (đang lật hoặc đã match)
  const isCardFlipped = useCallback(
    (cardId: string) => {
      return flippedIds.includes(cardId) || matchedIds.includes(cardId);
    },
    [flippedIds, matchedIds],
  );

  // Kiểm tra thẻ đã match chưa
  const isCardMatched = useCallback(
    (cardId: string) => {
      return matchedIds.includes(cardId);
    },
    [matchedIds],
  );

  // Tính số cột dựa trên số thẻ
  const gridCols = useMemo(() => {
    const count = shuffledCards.length;
    if (count <= 4) return "grid-cols-2";
    if (count <= 6) return "grid-cols-3";
    if (count <= 8) return "grid-cols-4";
    return "grid-cols-4";
  }, [shuffledCards.length]);

  if (rawCards.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        Không có dữ liệu thẻ để hiển thị.
      </div>
    );
  }

  return (
    <div className="p-6 animate-in fade-in duration-300">
      <p className="text-center text-sm text-gray-500 mb-6">
        Lật thẻ để tìm cặp hình ảnh - từ tương ứng:
      </p>

      <div
        className={`grid ${gridCols} gap-4 max-w-[900px] mx-auto justify-items-center`}
      >
        {shuffledCards.map((card) => {
          const flipped = isCardFlipped(card.id);
          const matched = isCardMatched(card.id);

          return (
            <div
              key={card.id}
              className="perspective-1000"
              style={{ perspective: "1000px" }}
            >
              <div
                onClick={() => handleCardClick(card.id)}
                className={`
                  relative w-40 h-32 cursor-pointer
                  transition-transform duration-500
                  ${flipped ? "[transform:rotateY(180deg)]" : ""}
                `}
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Mặt trước (úp) */}
                <div
                  className={`
                    absolute inset-0 w-full h-full
                    bg-gradient-to-br from-primary-500 to-primary-600 
                    rounded-xl flex items-center justify-center 
                    text-white text-3xl font-bold 
                    shadow-lg hover:shadow-xl 
                    transition-shadow
                    backface-hidden
                  `}
                  style={{ backfaceVisibility: "hidden" }}
                >
                  ?
                </div>

                {/* Mặt sau (hiển thị content) */}
                <div
                  className={`
                    absolute inset-0 w-full h-full
                    rounded-xl overflow-hidden 
                    border-2 
                    ${matched ? "border-green-500 bg-green-50" : "border-primary-300 bg-white"}
                    backface-hidden
                    [transform:rotateY(180deg)]
                  `}
                  style={{ backfaceVisibility: "hidden" }}
                >
                  {card.type === "video" ? (
                    <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                      {/* Sử dụng img trực tiếp nếu là webp, nếu không dùng VideoPlayer */}
                      {card.content?.match(/\.(webp|png|jpg|jpeg|gif)$/i) ? (
                        <img
                          src={card.content}
                          alt="Card"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <VideoPlayer
                          videoUrl={card.content}
                          autoPlay={flipped}
                          loop={true}
                          showControls={false}
                          className="w-full h-full object-contain"
                        />
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-3 text-center">
                      <span
                        className={`
                        font-bold text-lg
                        ${matched ? "text-green-700" : "text-primary-700"}
                      `}
                      >
                        {card.content}
                      </span>
                    </div>
                  )}

                  {/* Checkmark khi match thành công */}
                  {matched && (
                    <div className="absolute top-1 right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center mt-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full">
          <span className="text-sm font-medium text-primary-700">
            Đã ghép: {matchedPairs} / {totalPairs} cặp
          </span>
          {matchedPairs === totalPairs && totalPairs > 0 && (
            <span className="text-green-600 font-bold">🎉 Hoàn thành!</span>
          )}
        </div>
      </div>
    </div>
  );
};
