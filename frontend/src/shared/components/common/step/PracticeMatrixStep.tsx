"use client";

import React, { useState } from "react";
import { StepItem } from "@/data/lessonsData";
import { Modal } from "antd";
import { PracticeVideoStep } from "./PracticeVideoStep"; // Reuse logic
import { PlayCircle, CheckCircle } from "lucide-react";

interface PracticeMatrixStepProps {
  step: StepItem;
}

export function PracticeMatrixStep({ step }: PracticeMatrixStepProps) {
  // Step đưa ra một lưới các bài tập. Người dùng chọn bài từ lưới để mở bài luyện tập chi tiết (quay video).
  // Item đang được chọn để thực hành (hiển thị trong modal)
  const [selectedItem, setSelectedItem] = useState<
    NonNullable<typeof step.matrixItems>[number] | null
  >(null);

  // Danh sách ID các item đã hoàn thành thực hành
  const [completedItems, setCompletedItems] = useState<number[]>([]);

  // Tạo một step giả lập từ item được chọn để tái sử dụng component PracticeVideoStep
  const handleCreateMiniStep = (item: typeof selectedItem): StepItem => {
    if (!item) return step;
    return {
      ...step,
      word: item.word,
      videoUrl: item.videoUrl,
      title: `Thực hành: ${item.label}`,
      description: `Thực hành ký hiệu cho "${item.label}"`,
    };
  };

  // Xử lý khi người dùng hoàn thành thực hành một item
  const handleCompleteItem = () => {
    if (selectedItem && !completedItems.includes(selectedItem.id)) {
      setCompletedItems([...completedItems, selectedItem.id]);
    }
  };

  return (
    <div className="p-6">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold mb-2 text-primary-900">
          {step.title}
        </h3>
        <p className="text-gray-500">{step.description}</p>
        <div className="mt-2 text-sm font-medium text-primary-600">
          Đã hoàn thành: {completedItems.length} /{" "}
          {step.matrixItems?.length || 0}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {step.matrixItems?.map((item) => {
          const isCompleted = completedItems.includes(item.id);
          return (
            <button
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className={`relative aspect-square rounded-2xl p-4 flex flex-col items-center justify-center gap-3 transition-all border-2 group ${
                isCompleted
                  ? "bg-green-50 border-green-200"
                  : "bg-white border-gray-100 hover:border-primary-300 hover:shadow-md"
              }`}
            >
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.label}
                  className="w-16 h-16 rounded-full object-cover mb-2"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-xl">
                  {item.label.charAt(0)}
                </div>
              )}

              <span
                className={`font-medium text-center ${isCompleted ? "text-green-700" : "text-gray-700"}`}
              >
                {item.label}
              </span>

              {isCompleted ? (
                <div className="absolute top-3 right-3 text-green-500">
                  <CheckCircle size={20} className="fill-green-100" />
                </div>
              ) : (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                  <PlayCircle
                    size={40}
                    className="text-primary-600 fill-white"
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <Modal
        open={!!selectedItem}
        onCancel={() => setSelectedItem(null)}
        footer={null}
        width={1000}
        destroyOnClose
        centered
        className="top-5"
      >
        {selectedItem && (
          <div className="pt-6">
            <PracticeVideoStep
              step={handleCreateMiniStep(selectedItem)}
              onComplete={handleCompleteItem}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
