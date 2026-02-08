// Questions management data
// Quản lý câu hỏi và bộ câu hỏi

import { mockUsers, getUserById, type UserItem } from "./usersData";
import { mockOrganizations, getOrganizationById } from "./organizationsData";
import { gradeLevels, type GradeLevel } from "./classesData";

// ==================== INTERFACES ====================

export type QuestionType = "multiple_choice" | "practice";

export interface AnswerOption {
  id: string;
  content: string;
  isCorrect: boolean;
}

export interface QuestionItem {
  id: number;
  type: QuestionType;
  // Common fields
  content: string; // Nội dung câu hỏi (trắc nghiệm) hoặc từ cần thực hành
  description?: string; // Mô tả chi tiết
  explanation?: string; // Giải thích đáp án
  category?: string; // Danh mục (VD: "Ký hiệu cơ bản", "Số đếm", "Màu sắc"...)
  videoUrl?: string; // Video minh họa (nếu có)
  imageUrl?: string; // Hình ảnh minh họa (nếu có)

  // API response fields
  image?: string; // image_location from API
  video?: string; // video_location from API
  question_type?: string; // ONE_ANSWER, MULTIPLE_ANSWERS, PRACTICE
  questionType?: string; // camelCase variant

  // For multiple choice
  answers?: AnswerOption[];
  answerResList?: any[]; // Answers from API

  // For practice
  practiceWord?: string; // Từ cần thực hành
  practiceInstructions?: string; // Hướng dẫn thực hành chi tiết

  // Class/Grade Level
  gradeLevel?: GradeLevel; // Cấp lớp (Lớp 1, 2, 3, 4, 5)
  classId?: number; // ID lớp học liên quan

  // Ownership & Permissions
  creatorId?: number; // ID người tạo
  organizationId?: number; // ID cơ sở giáo dục
  allowedEditorIds?: number[]; // Danh sách ID người được phép sửa

  // Metadata
  createdAt?: string;
  updatedAt?: string;
}

export interface QuestionSetItem {
  id: number;
  name: string;
  description?: string;
  type: QuestionType; // Loại bộ câu hỏi (trắc nghiệm hoặc thực hành, không hỗn hợp)
  questionIds: number[]; // Danh sách ID câu hỏi trong bộ

  // Class/Grade Level
  gradeLevel?: GradeLevel;
  classId?: number;

  // Ownership & Permissions
  creatorId: number;
  organizationId: number;
  allowedEditorIds: number[];

  // Metadata
  createdAt: string;
  updatedAt: string;
  category?: string;
}

// ==================== CONFIG ====================

export const questionTypeConfig: Record<
  QuestionType,
  { label: string; color: string }
> = {
  multiple_choice: { label: "Trắc nghiệm", color: "bg-blue-100 text-blue-800" },
  practice: { label: "Thực hành", color: "bg-purple-100 text-purple-800" },
};

export const questionCategories = [
  "Ký hiệu cơ bản",
  "Số đếm",
  "Màu sắc",
  "Gia đình",
  "Thời gian",
  "Địa điểm",
  "Cảm xúc",
  "Hoạt động hàng ngày",
  "Thực phẩm",
  "Động vật",
  "Giao thông",
  "Trường học",
  "Y tế",
  "Nghề nghiệp",
  "Khác",
];

// ==================== MOCK DATA GENERATION ====================

// ==================== EXPORT DATA ====================
export const mockQuestions: QuestionItem[] = [];
export const mockQuestionSets: QuestionSetItem[] = [];

// ==================== HELPER FUNCTIONS (Deprecated - Use Service) ====================

export function getQuestionById(id: number): QuestionItem | undefined {
  return undefined;
}

export function getQuestionSetById(id: number): QuestionSetItem | undefined {
  return undefined;
}

export function getQuestionsByOrganization(orgId: number): QuestionItem[] {
  return [];
}

export function getQuestionSetsByOrganization(
  orgId: number,
): QuestionSetItem[] {
  return [];
}

export function getQuestionsByCreator(creatorId: number): QuestionItem[] {
  return [];
}

export function getQuestionSetsByCreator(creatorId: number): QuestionSetItem[] {
  return [];
}

export function getQuestionsByGradeLevel(
  gradeLevel: GradeLevel,
): QuestionItem[] {
  return [];
}

export function getQuestionSetsByGradeLevel(
  gradeLevel: GradeLevel,
): QuestionSetItem[] {
  return [];
}

export function getQuestionsInSet(setId: number): QuestionItem[] {
  return [];
}

// Permission checks
export function canEditQuestion(
  question: QuestionItem,
  userId: number,
  userRole: string,
  userOrgId?: number,
): boolean {
  return false;
}

export function canEditQuestionSet(
  questionSet: QuestionSetItem,
  userId: number,
  userRole: string,
  userOrgId?: number,
): boolean {
  return false;
}

// Get questions visible to a user based on their role and organization
export function getVisibleQuestions(
  userId: number,
  userRole: string,
  userOrgId?: number,
): QuestionItem[] {
  return [];
}

export function getVisibleQuestionSets(
  userId: number,
  userRole: string,
  userOrgId?: number,
): QuestionSetItem[] {
  return [];
}

// Get creator info
export function getQuestionCreator(questionId: number): UserItem | undefined {
  return undefined;
}

export function getQuestionSetCreator(setId: number): UserItem | undefined {
  return undefined;
}

// Stats
export function getQuestionsStats() {
  return {
    totalQuestions: 0,
    multipleChoice: 0,
    practice: 0,
    totalSets: 0,
  };
}
