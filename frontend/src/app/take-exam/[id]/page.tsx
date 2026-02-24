"use client";

import React from "react";
import QuestionsPractice from "@/features/exam/components/Practice/QuestionsPractice";
import QuestionsPage from "@/features/exam/components/Quiz/QuestionsPage";
import { useQuery } from "@tanstack/react-query";
import { fetchExamById } from "@/services/examService";
import { useParams } from "next/navigation";
import { Spin, Alert } from "antd";
import { DashboardLayout } from "@/shared/components/layout";

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
      <DashboardLayout>
        <div className="p-10 flex justify-center">
          <Spin size="large" />
        </div>
      </DashboardLayout>
    );
  if (error)
    return (
      <DashboardLayout>
        <Alert message="Lỗi tải bài kiểm tra" type="error" />
      </DashboardLayout>
    );
  if (!exam)
    return (
      <DashboardLayout>
        <div className="p-10 text-center">Không tìm thấy bài kiểm tra</div>
      </DashboardLayout>
    );

  // Detect type. Backend might return "QUIZ" or "PRACTICE" or "practice" etc.
  // Normalized as examType.
  const type = String(exam.examType || "").toUpperCase();

  if (type === "PRACTICE" || type === "PRACTICAL") {
    return (
      <DashboardLayout>
        <QuestionsPractice />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <QuestionsPage />
    </DashboardLayout>
  );
}

