"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Timer, ChevronRight, ChevronLeft, CheckCircle } from "lucide-react";
import { getExamById } from "@/data/examsData";
import { QuestionItem } from "@/data/questionsData";

export function ExamTaking() {
  const params = useParams();
  const router = useRouter();
  const examId = Number(params.examId);
  const classId = Number(params.id);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({}); // questionId -> answerId
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [exam, setExam] = useState<any>(null);
  const [questions, setQuestions] = useState<QuestionItem[]>([]);

  useEffect(() => {
    // Load exam data
    const examData = getExamById(examId);
    if (examData) {
      setExam(examData);
      // Parse duration "60 phút" -> 60 minutes
      const durationMatch = examData.duration?.toString().match(/(\d+)/);
      const durationMinutes = durationMatch ? parseInt(durationMatch[0]) : 60;
      setTimeLeft(durationMinutes * 60);

      // Load questions (Mocking logic based on exam data)
      // If we had real relations, we'd fetch questions by exam ID.
      // For now, we generate mock questions matching the QuestionItem interface.
      const mockQs: Partial<QuestionItem>[] = Array.from({
        length: examData.questions || 10,
      }).map((_, i) => ({
        id: i + 1,
        type: "multiple_choice",
        content: `Câu hỏi số ${i + 1}: Ký hiệu này nghĩa là gì?`,
        videoUrl: "https://player.vimeo.com/video/824804225",
        answers: [
          {
            id: "a",
            content: "Đáp án A: Xin chào",
            isCorrect: i % 4 === 0,
          },
          {
            id: "b",
            content: "Đáp án B: Tạm biệt",
            isCorrect: i % 4 === 1,
          },
          {
            id: "c",
            content: "Đáp án C: Cảm ơn",
            isCorrect: i % 4 === 2,
          },
          {
            id: "d",
            content: "Đáp án D: Xin lỗi",
            isCorrect: i % 4 === 3,
          },
        ],
        creatorId: 1,
        organizationId: 1,
        allowedEditorIds: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      setQuestions(mockQs as QuestionItem[]);
    }
  }, [examId]);

  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !isSubmitted && exam) {
      handleSubmit();
    }
  }, [timeLeft, isSubmitted, exam]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSelectOption = (questionId: number, optionId: string) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  if (!exam) return <div className="p-8 text-center">Đang tải bài thi...</div>;

  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row items-center justify-between sticky top-4 z-10">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{exam.title}</h1>
          <p className="text-sm text-gray-500">
            Câu hỏi: {currentQuestionIndex + 1}/{questions.length} • Đã làm:{" "}
            {answeredCount}/{questions.length}
          </p>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold text-lg ${
              timeLeft < 300
                ? "bg-red-50 text-red-600 animate-pulse"
                : "bg-blue-50 text-blue-600"
            }`}
          >
            <Timer size={20} />
            {formatTime(timeLeft)}
          </div>
          {!isSubmitted && (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors shadow-sm"
            >
              Nộp bài
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Question Area */}
        <div className="lg:col-span-3 space-y-6">
          {currentQuestion && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Question Video/Content */}
              <div className="aspect-video bg-black relative">
                <iframe
                  src={currentQuestion.videoUrl}
                  className="w-full h-full"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  {currentQuestion.content}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentQuestion.answers?.map((option) => (
                    <button
                      key={option.id}
                      onClick={() =>
                        handleSelectOption(currentQuestion.id, option.id)
                      }
                      disabled={isSubmitted}
                      className={`p-4 rounded-xl border-2 text-left transition-all relative ${
                        answers[currentQuestion.id] === option.id
                          ? "border-primary-600 bg-primary-50 text-primary-900"
                          : "border-gray-100 hover:border-gray-200 hover:bg-gray-50 bg-white"
                      } ${
                        isSubmitted && option.isCorrect
                          ? "!border-green-500 !bg-green-50"
                          : ""
                      } ${
                        isSubmitted &&
                        answers[currentQuestion.id] === option.id &&
                        !option.isCorrect
                          ? "!border-red-500 !bg-red-50"
                          : ""
                      }`}
                    >
                      <span className="font-medium">{option.content}</span>
                      {answers[currentQuestion.id] === option.id && (
                        <div className="absolute top-4 right-4 text-primary-600">
                          <CheckCircle size={20} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                <button
                  onClick={() =>
                    setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
                  }
                  disabled={currentQuestionIndex === 0}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 disabled:opacity-50 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <ChevronLeft size={20} />
                  Câu trước
                </button>
                <button
                  onClick={() =>
                    setCurrentQuestionIndex((prev) =>
                      Math.min(questions.length - 1, prev + 1),
                    )
                  }
                  disabled={currentQuestionIndex === questions.length - 1}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 disabled:opacity-50 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Câu tiếp
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}

          {/* Result View (Overlay or conditional) */}
          {isSubmitted && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center animate-in zoom-in duration-300">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Đã hoàn thành bài thi!
              </h2>
              <p className="text-gray-600 mb-6">
                Bạn đã trả lời được {answeredCount}/{questions.length} câu hỏi.
              </p>
              <button
                onClick={() => router.push(`/study/${classId}`)}
                className="px-6 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
              >
                Quay lại lớp học
              </button>
            </div>
          )}
        </div>

        {/* Sidebar Question Palette */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              Danh sách câu hỏi
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                    currentQuestionIndex === idx
                      ? "ring-2 ring-primary-600 ring-offset-1 bg-white border-primary-600 text-primary-600"
                      : answers[q.id]
                        ? "bg-blue-50 text-blue-700 border border-blue-100"
                        : "bg-gray-50 text-gray-600 border border-gray-100 hover:bg-gray-100"
                  }`}
                >
                  {idx + 1}
                  {answers[q.id] && (
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full absolute top-1 right-1"></div>
                  )}
                </button>
              ))}
            </div>
            <div className="mt-6 space-y-2 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-50 border border-blue-100"></div>
                <span>Đã trả lời</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-50 border border-gray-100"></div>
                <span>Chưa trả lời</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-white border border-primary-600"></div>
                <span>Đang xem</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
