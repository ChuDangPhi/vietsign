"use client";

import React from "react";
import QuestionsPractice from "@/features/exam/components/Practice/QuestionsPractice";
import QuestionsPage from "@/features/exam/components/Quiz/QuestionsPage";
import { useQuery } from "@tanstack/react-query";
import { fetchExamById } from "@/services/examService";
import { useParams } from "next/navigation";
import { Spin, Alert } from "antd";

export default function TakeExamDetail() {
  const params = useParams();
  const id = params?.id;

  const {
    data: exam,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["exam", id],
    queryFn: async () => {
      if (!id) return null;
      return await fetchExamById(Number(id));
    },
    enabled: !!id,
  });

  if (isLoading)
    return (
      <div className="p-10 flex justify-center">
        <Spin size="large" />
      </div>
    );
  if (error) return <Alert message="Lỗi tải bài kiểm tra" type="error" />;
  if (!exam)
    return <div className="p-10 text-center">Không tìm thấy bài kiểm tra</div>;

  // Detect type. Backend might return "QUIZ" or "PRACTICE" or "practice" etc.
  // Normalized as examType.
  const type = String(exam.examType || "").toUpperCase();

  if (type === "PRACTICE" || type === "PRACTICAL") {
    return <QuestionsPractice />;
  }

  return <QuestionsPage />;
}
