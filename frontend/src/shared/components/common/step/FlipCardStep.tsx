import React, { useState, useMemo } from "react";
import { StepProps } from "./types";
import { VideoPlayer } from "../VideoPlayer";

export const FlipCardStep: React.FC<StepProps> = ({ step, onComplete }) => {
  // Step đưa ra các thẻ bài úp. Người dùng lật từng cặp thẻ để tìm cặp video và từ vựng trùng khớp.
  const cards = step.flipCards || [];
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);

  const allCards = useMemo(() => {
    return [
      ...cards.map((c: any, i: number) => ({
        id: i,
        type: "video",
        content: c.videoUrl,
        matchId: i,
      })),
      ...cards.map((c: any, i: number) => ({
        id: i + cards.length,
        type: "text",
        content: c.matchText,
        matchId: i,
      })),
    ].sort(() => Math.random() - 0.5);
  }, [cards]);

  const handleFlip = (cardIdx: number) => {
    if (
      flipped.length === 2 ||
      matched.includes(cardIdx) ||
      flipped.includes(cardIdx)
    )
      return;

    const newFlipped = [...flipped, cardIdx];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      const card1 = allCards[first];
      const card2 = allCards[second];

      if (card1.matchId === card2.matchId && card1.type !== card2.type) {
        setMatched((prev) => [...prev, first, second]);
        setFlipped([]);

        if (matched.length + 2 === allCards.length && onComplete) {
          setTimeout(onComplete, 1000);
        }
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  return (
    <div className="p-6 animate-in fade-in duration-300">
      <p className="text-center text-sm text-gray-500 mb-4">
        Lật thẻ để tìm cặp video - từ tương ứng:
      </p>

      <div className="grid grid-cols-3 gap-6 max-w-[800px] mx-auto">
        {allCards.map((card: any, idx: number) => {
          const isFlipped = flipped.includes(idx) || matched.includes(idx);
          return (
            <div
              key={idx}
              onClick={() => handleFlip(idx)}
              className="w-56 h-40 cursor-pointer"
            >
              {isFlipped ? (
                <div
                  className={`w-full h-full rounded-xl overflow-hidden border-2 ${
                    matched.includes(idx)
                      ? "border-green-500 bg-green-50"
                      : "border-primary-300"
                  }`}
                >
                  {card.type === "video" ? (
                    <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                      <VideoPlayer
                        videoUrl={card.content}
                        autoPlay={true}
                        loop={true}
                        showControls={false}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-2 text-center font-bold text-primary-700 bg-primary-50">
                      {card.content}
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-md hover:shadow-lg transition-shadow">
                  ?
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-center mt-4 text-sm text-gray-500">
        Đã ghép: {matched.length / 2} / {cards.length} cặp
      </div>
    </div>
  );
};
