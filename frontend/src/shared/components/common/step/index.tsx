"use client";

import React from "react";

// Import all step components
import { VocabularyStep } from "./VocabularyStep";
import { SentenceStep } from "./SentenceStep";
import { MatchVideoToTextStep } from "./MatchVideoToTextStep";
import { QuizVideoToTextStep } from "./QuizVideoToTextStep";
import { QuizTextToVideoStep } from "./QuizTextToVideoStep";
import { QuizVideoToImageStep } from "./QuizVideoToImageStep";
import { QuizInputStep } from "./QuizInputStep";
import { FlipCardStep } from "./FlipCardStep";
import { TrueFalseStep } from "./TrueFalseStep";
import { PracticeVideoStep } from "./PracticeVideoStep";
import { PracticeMatrixStep } from "./PracticeMatrixStep";
import { MatchStep } from "./MatchStep";
import { DragDropVideoWordStep } from "./DragDropVideoWordStep";
import { MatchHorizontalStep } from "./MatchHorizontalStep";
import { QuizChoiceStep } from "./QuizChoiceStep";

export * from "./types";
export * from "./VideoContainer";
export * from "./VocabularyStep";
export * from "./SentenceStep";
export * from "./MatchVideoToTextStep";
export * from "./QuizVideoToTextStep";
export * from "./QuizTextToVideoStep";
export * from "./QuizVideoToImageStep";
export * from "./QuizInputStep";
export * from "./FlipCardStep";
export * from "./TrueFalseStep";
export * from "./PracticeVideoStep";
export * from "./PracticeMatrixStep";
export * from "./MatchStep";
export * from "./DragDropVideoWordStep";
export * from "./MatchHorizontalStep";
export * from "./QuizChoiceStep";

export const stepTypeConfig: Record<string, React.FC<any>> = {
  vocabulary: VocabularyStep,
  sentence: SentenceStep,
  "match-video-to-text": MatchVideoToTextStep, // Old one
  "quiz-video-to-text": QuizVideoToTextStep,
  "quiz-text-to-video": QuizTextToVideoStep,
  "quiz-video-to-image": QuizVideoToImageStep,
  "quiz-input": QuizInputStep,
  "flip-card": FlipCardStep,
  "true-false": TrueFalseStep,
  "practice-video": PracticeVideoStep,
  "practice-matrix": PracticeMatrixStep,
  "match-video-image": MatchStep, // Handled by MatchStep
  "match-video-word": MatchStep, // Handled by MatchStep
  "drag-drop-video-word": DragDropVideoWordStep,
  "match-horizontal": MatchHorizontalStep,
  "quiz-choice": QuizChoiceStep,
};

export const stepTypeMeta: Record<
  string,
  { label: string; color: string; description: string }
> = {
  vocabulary: {
    label: "Từ vựng",
    color: "bg-blue-100 text-blue-800",
    description: "Học từ vựng mới qua video và hình ảnh minh họa.",
  },
  sentence: {
    label: "Câu",
    color: "bg-green-100 text-green-800",
    description: "Học cấu trúc câu và ngữ pháp qua các ví dụ thực tế.",
  },
  "match-video-to-text": {
    label: "Nối từ",
    color: "bg-purple-100 text-purple-800",
    description: "Nối video ký hiệu với từ vựng tương ứng.",
  },
  "quiz-video-to-text": {
    label: "Trắc nghiệm",
    color: "bg-orange-100 text-orange-800",
    description: "Xem video và chọn đáp án đúng nhất mô tả ký hiệu.",
  },
  "quiz-text-to-video": {
    label: "Chọn video",
    color: "bg-pink-100 text-pink-800",
    description: "Đọc từ vựng và chọn video ký hiệu chính xác.",
  },
  "quiz-video-to-image": {
    label: "Chọn hình",
    color: "bg-indigo-100 text-indigo-800",
    description: "Xem video và chọn hình ảnh minh họa phù hợp.",
  },
  "quiz-input": {
    label: "Gõ từ",
    color: "bg-red-100 text-red-800",
    description: "Xem video và gõ lại từ vựng tương ứng.",
  },
  "flip-card": {
    label: "Lật thẻ",
    color: "bg-teal-100 text-teal-800",
    description: "Lật thẻ để tìm các cặp video và từ vựng giống nhau.",
  },
  "true-false": {
    label: "Đúng/Sai",
    color: "bg-yellow-100 text-yellow-800",
    description: "Xác định tính đúng sai của video ký hiệu so với từ đã cho.",
  },
  "practice-video": {
    label: "Thực hành",
    color: "bg-cyan-100 text-cyan-800",
    description: "Thực hành quay video ký hiệu và nhận phản hồi từ AI.",
  },
  "practice-matrix": {
    label: "Ma trận",
    color: "bg-emerald-100 text-emerald-800",
    description: "Luyện tập tổng hợp nhiều từ vựng trong một ma trận.",
  },
  "match-video-image": {
    label: "Nối hình",
    color: "bg-violet-100 text-violet-800",
    description: "Nối video ký hiệu với hình ảnh minh họa.",
  },
  "match-video-word": {
    label: "Nối từ",
    color: "bg-fuchsia-100 text-fuchsia-800",
    description: "Nối video ký hiệu với từ vựng.",
  },
  "drag-drop-video-word": {
    label: "Kéo thả",
    color: "bg-rose-100 text-rose-800",
    description: "Kéo thả từ vựng vào ô video tương ứng.",
  },
  "match-horizontal": {
    label: "Nối ngang",
    color: "bg-sky-100 text-sky-800",
    description: "Bài tập nối từ và video theo hàng ngang.",
  },
  "quiz-choice": {
    label: "Chọn video",
    color: "bg-lime-100 text-lime-800",
    description: "Trắc nghiệm lựa chọn đáp án đúng (video hoặc hình ảnh).",
  },
};
