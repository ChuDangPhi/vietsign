"use client";

import React, { useState } from "react";
import { StepItem } from "@/data/lessonsData";
import { PlayCircle, Check, X } from "lucide-react";
import { Modal } from "antd";

interface DragDropVideoWordStepProps {
  step: StepItem;
}
// mô tả cách hoạt động của step tại đây
export function DragDropVideoWordStep({ step }: DragDropVideoWordStepProps) {
  // Step đưa ra các ô chứa video và các từ vựng. Người dùng xem video trong ô và kéo thả từ vựng đúng vào ô đó.
  // State quản lý video đang phát trong modal (null nếu không có video nào đang phát)
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  // State lưu trữ các từ đã được thả vào các ô (key là ID của ô, value là từ vựng)
  const [droppedItems, setDroppedItems] = useState<Record<number, string>>({});

  // State lưu trữ danh sách các từ còn lại trong kho từ vựng (chưa được thả vào ô nào)
  const [availableWords, setAvailableWords] = useState<string[]>(
    step.availableWords || [],
  );

  // Xử lý sự kiện khi bắt đầu kéo một từ từ kho từ vựng hoặc từ một ô đã thả
  const handleDragStart = (e: React.DragEvent, word: string) => {
    e.dataTransfer.setData("text/plain", word);
    e.dataTransfer.effectAllowed = "move";
  };

  // Xử lý sự kiện khi một từ được kéo qua vùng thả (cần thiết để cho phép thả)
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  // Xử lý sự kiện khi thả một từ vào ô đích
  const handleDrop = (e: React.DragEvent, boxId: number) => {
    e.preventDefault();
    const word = e.dataTransfer.getData("text/plain");

    // Lấy từ hiện tại đang ở trong ô này (nếu có)
    const currentItem = droppedItems[boxId];

    // Cập nhật state droppedItems: Gán từ mới vào ô này
    setDroppedItems((prev) => ({ ...prev, [boxId]: word }));

    // Cập nhật kho từ vựng:
    // 1. Xóa từ vừa thả khỏi kho
    // 2. Nếu ô đã có từ trước đó, trả từ đó về lại kho
    const newPool = availableWords.filter((w) => w !== word);
    if (currentItem) newPool.push(currentItem);
    setAvailableWords(newPool.sort());
  };

  // Xử lý việc xóa một từ khỏi ô (trả về kho từ vựng)
  const handleRemoveItem = (boxId: number) => {
    const word = droppedItems[boxId];
    if (word) {
      // Cập nhật droppedItems: Xóa key boxId
      setDroppedItems((prev) => {
        const next = { ...prev };
        delete next[boxId];
        return next;
      });
      // Trả từ về kho từ vựng và sắp xếp lại
      setAvailableWords((prev) => [...prev, word].sort());
    }
  };

  // Check results visual helper
  const isCorrect = (boxId: number) => {
    const droppedWord = droppedItems[boxId];
    const targetItem = step.dragDropItems?.find((i) => i.id === boxId);
    return droppedWord && targetItem && droppedWord === targetItem.correctWord;
  };

  return (
    <div className="p-6">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold mb-2 text-primary-900">
          {step.title}
        </h3>
        <p className="text-gray-500">
          Nhấn vào ô để xem video, sau đó kéo từ thích hợp vào ô đó.
        </p>
      </div>

      {/* Grid of Boxes */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
        {step.dragDropItems?.map((item) => {
          const hasItem = !!droppedItems[item.id];
          const correct = isCorrect(item.id);
          const droppedWord = droppedItems[item.id];

          return (
            <div
              key={item.id}
              className={`
                relative h-40 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center bg-gray-50
                ${
                  hasItem
                    ? correct
                      ? "border-green-500 bg-green-50 border-solid"
                      : "border-amber-400 bg-amber-50 border-solid"
                    : "border-gray-300 hover:border-primary-400"
                }
              `}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, item.id)}
            >
              {hasItem ? (
                <div
                  className="w-full h-full flex items-center justify-center relative cursor-grab active:cursor-grabbing"
                  draggable
                  onDragStart={(e) => {
                    handleRemoveItem(item.id);
                    handleDragStart(e, droppedWord);
                  }}
                >
                  <span
                    className={`text-xl font-bold ${correct ? "text-green-700" : "text-amber-700"}`}
                  >
                    {droppedWord}
                  </span>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="absolute top-2 right-2 p-1 hover:bg-black/10 rounded-full text-gray-500"
                  >
                    <X size={16} />
                  </button>
                  {correct && (
                    <div className="absolute bottom-2 right-2 text-green-600">
                      <Check size={20} />
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setActiveVideo(item.videoUrl)}
                  className="flex flex-col items-center gap-2 text-gray-400 hover:text-primary-600 transition-colors"
                >
                  <PlayCircle size={40} />
                  <span className="text-sm font-medium">Xem Video</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Word Pool */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Từ vựng (Kéo thả vào ô)
        </h4>
        <div className="flex flex-wrap gap-3">
          {availableWords.map((word, idx) => (
            <div
              key={`${word}-${idx}`}
              draggable
              onDragStart={(e) => handleDragStart(e, word)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm cursor-grab active:cursor-grabbing hover:border-primary-400 hover:shadow-md transition-all font-medium text-gray-700 select-none"
            >
              {word}
            </div>
          ))}
          {availableWords.length === 0 && (
            <p className="text-gray-400 italic text-sm">Đã dùng hết từ</p>
          )}
        </div>
      </div>

      <Modal
        open={!!activeVideo}
        onCancel={() => setActiveVideo(null)}
        footer={null}
        width={700}
        centered
        destroyOnClose
      >
        <div className="aspect-video bg-black rounded-lg overflow-hidden mt-6">
          {activeVideo && (
            <video
              src={activeVideo}
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
          )}
        </div>
      </Modal>
    </div>
  );
}
