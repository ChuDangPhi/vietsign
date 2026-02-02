"use client";

import React from "react";
import Link from "next/link";
import {
  Hand,
  Type,
  MessageSquare,
  Keyboard,
  Brain,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { mockQuestions } from "@/data/questionsData";
import { dictionaryItems } from "@/data/dictionaryData";

export * from "./AiPractice";
export * from "./SentencePractice";
export * from "./SpellingPractice";
export * from "./WordPractice";
import PracticeData from "./PracticeData";

// Sample sentences count
const sampleSentencesCount = 10;

export function PracticeModeSelection() {
  // Count practice items
  const practiceItemsCount =
    dictionaryItems.filter((d) => d.videoUrl && d.status === "published")
      .length +
    mockQuestions.filter((q) => q.type === "practice" && q.videoUrl).length;

  // Count alphabet letters
  const alphabetLettersCount = dictionaryItems.filter(
    (d) => d.category === "Chữ cái" && d.videoUrl,
  ).length;

  return (
    <div className="space-y-8">
      <PracticeData />
      {/* 
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3 mb-4">
          <Hand className="w-10 h-10 text-primary-600" />
          Luyện tập ký hiệu
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Chọn một chế độ luyện tập phù hợp với mục tiêu học tập của bạn. Tất cả
          các chế độ đều hỗ trợ chấm điểm bằng AI.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Link
          href="/practice/word"
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl hover:border-primary-300 transition-all cursor-pointer group"
        >
          <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Type className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Luyện tập theo từ
          </h3>
          <p className="text-gray-600 mb-4">
            Học và thực hành các ký hiệu cho từng từ riêng lẻ. AI sẽ kiểm tra độ
            chính xác của bạn.
          </p>
          <div className="flex items-center text-primary-600 font-medium">
            <span>{practiceItemsCount} từ có sẵn</span>
            <ChevronRight className="w-5 h-5 ml-auto group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href="/practice/sentence"
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl hover:border-primary-300 transition-all cursor-pointer group"
        >
          <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <MessageSquare className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Luyện tập theo câu
          </h3>
          <p className="text-gray-600 mb-4">
            Thực hành ghép các ký hiệu thành câu hoàn chỉnh. AI sẽ chấm điểm cả
            câu.
          </p>
          <div className="flex items-center text-primary-600 font-medium">
            <span>{sampleSentencesCount} câu mẫu</span>
            <ChevronRight className="w-5 h-5 ml-auto group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
        <Link
          href="/practice/spelling"
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl hover:border-primary-300 transition-all cursor-pointer group"
        >
          <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Keyboard className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Luyện tập đánh vần
          </h3>
          <p className="text-gray-600 mb-4">
            Đánh vần từ bằng ký hiệu chữ cái. AI kiểm tra từng chữ cái bạn thực
            hiện.
          </p>
          <div className="flex items-center text-primary-600 font-medium">
            <span>{alphabetLettersCount} chữ cái</span>
            <ChevronRight className="w-5 h-5 ml-auto group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href="/practice/ai"
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl hover:border-primary-300 transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute top-3 right-3 px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full">
            AI Pro
          </div>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Brain className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Luyện tập Tự do
          </h3>
          <p className="text-gray-600 mb-4">
            Thực hiện bất kỳ ký hiệu nào, AI sẽ tự động nhận diện và cho biết
            nghĩa của từ đó.
          </p>
          <div className="flex items-center text-primary-600 font-medium">
            <Sparkles className="w-4 h-4 mr-1" />
            <span>Nhận diện thời gian thực</span>
            <ChevronRight className="w-5 h-5 ml-auto group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div> 
      */}
    </div>
  );
}

// Re-export for backward compatibility
export { PracticeModeSelection as PracticeRoom };
