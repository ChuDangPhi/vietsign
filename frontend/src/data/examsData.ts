// Exams management data
// Sử dụng ID để liên kết với các bảng khác

import { getClassById } from "./classesData";

export type ExamType = "practice" | "multiple_choice" | "QUIZ" | "PRACTICE";

export interface ExamItem {
  id: number;
  title: string;
  classId: number;
  date: string;
  time: string;
  duration: string;
  questions: number;
  students: number;
  status: "upcoming" | "ongoing" | "completed";
  type: string;
  examType: ExamType;
  passingScore?: number;
  description?: string;
  createdById?: number;
  questionIds?: number[];
  questionSetIds?: number[];
  practiceQuestions?: any[];
  questionsList?: any[];
  createdAt?: string;
  is_active?: boolean;
}

export const mockExams: ExamItem[] = [];

export const examStatusConfig: Record<
  string,
  { label: string; color: string }
> = {
  upcoming: { label: "Sắp diễn ra", color: "bg-blue-100 text-blue-800" },
  ongoing: { label: "Đang diễn ra", color: "bg-green-100 text-green-800" },
  completed: { label: "Đã hoàn thành", color: "bg-gray-100 text-gray-600" },
};

export const examTypes = [
  { id: "all", label: "Tất cả loại" },
  { id: "midterm", label: "Giữa kỳ" },
  { id: "final", label: "Cuối kỳ" },
  { id: "regular", label: "Định kỳ" },
  { id: "quick", label: "Nhanh" },
  { id: "practical", label: "Thực hành" },
  { id: "online", label: "Online" },
  { id: "entrance", label: "Đầu vào" },
];

// Helper functions (Deprecated - Use Service)
export function getExamById(id: number): ExamItem | undefined {
  return undefined;
}

export function getExamClassName(examId: number): string {
  return "Không xác định";
}

export function getExamsByClass(classId: number): ExamItem[] {
  return [];
}

export function getExamsByStatus(status: ExamItem["status"]): ExamItem[] {
  return [];
}

export function getUpcomingExams(): ExamItem[] {
  return [];
}

export function getCompletedExams(): ExamItem[] {
  return [];
}
