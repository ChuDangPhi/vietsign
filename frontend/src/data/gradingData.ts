// Grading/Submissions data
// Sử dụng ID để liên kết với các bảng khác

import { getUserById } from './usersData';
import { getExamById } from './examsData';
import { getClassById } from './classesData';

export interface SubmissionItem {
  id: number;
  studentId: number;         // ID học sinh (thay vì tên)
  examId: number;            // ID bài kiểm tra (thay vì tên)
  classId: number;           // ID lớp học (thay vì tên)
  submittedAt: string;
  status: 'pending' | 'graded';
  score: number | null;
  duration?: string;
  feedback?: string;
  gradedById?: number;       // ID người chấm điểm
  gradedAt?: string;
}

export const mockSubmissions: SubmissionItem[] = [
  { id: 1, studentId: 4, examId: 1, classId: 1, submittedAt: "15/01/2025 10:30", status: "pending", score: null, duration: "45 phút" },
  { id: 2, studentId: 7, examId: 1, classId: 1, submittedAt: "15/01/2025 10:45", status: "pending", score: null, duration: "48 phút" },
  { id: 3, studentId: 4, examId: 3, classId: 2, submittedAt: "10/01/2025 09:30", status: "graded", score: 8.5, duration: "42 phút", gradedById: 3, gradedAt: "10/01/2025 15:00" },
  { id: 4, studentId: 7, examId: 3, classId: 2, submittedAt: "10/01/2025 09:20", status: "graded", score: 9.0, duration: "40 phút", gradedById: 3, gradedAt: "10/01/2025 15:30" },
  { id: 5, studentId: 5, examId: 10, classId: 4, submittedAt: "20/01/2025 14:00", status: "pending", score: null, duration: "55 phút" },
  { id: 6, studentId: 4, examId: 10, classId: 4, submittedAt: "20/01/2025 14:15", status: "pending", score: null, duration: "52 phút" },
  { id: 7, studentId: 5, examId: 4, classId: 5, submittedAt: "12/01/2025 11:00", status: "graded", score: 7.5, duration: "25 phút", gradedById: 6, gradedAt: "12/01/2025 14:00" },
  { id: 8, studentId: 7, examId: 4, classId: 5, submittedAt: "12/01/2025 11:10", status: "graded", score: 8.0, duration: "22 phút", gradedById: 6, gradedAt: "12/01/2025 14:30" },
  ...Array.from({ length: 50 }, (_, i) => {
    const id = i + 9;
    const studentIds = [4, 7, 5, 18, 21, 22, 23, 26, 27, 28, 31, 32, 33];
    const studentId = studentIds[i % studentIds.length];
    const examRange = [1, 2, 3, 4, 5, 10, 19, 20]; // Các bài kiểm tra tiêu biểu
    const examId = examRange[i % examRange.length];
    
    // Ánh xạ examId sang classId từ mockExams
    const examToClassMap: Record<number, number> = {
      1: 1, 2: 2, 3: 1, 4: 5, 5: 2, 10: 4, 19: 16, 20: 1
    };
    const classId = examToClassMap[examId];
    
    const isGraded = i % 3 !== 0; // 2/3 đã chấm, 1/3 chưa chấm
    const score = isGraded ? (Math.floor(Math.random() * 5) + 5) + (Math.random() > 0.5 ? 0.5 : 0) : null;
    
    return {
      id,
      studentId,
      examId,
      classId,
      submittedAt: `${(i % 28 + 1).toString().padStart(2, '0')}/01/2025 ${10 + (i % 8)}:${(i * 7) % 60}`,
      status: (isGraded ? "graded" : "pending") as "graded" | "pending",
      score,
      duration: `${30 + (i % 30)} phút`,
      gradedById: isGraded ? (i % 2 === 0 ? 3 : 6) : undefined,
      gradedAt: isGraded ? `${(i % 28 + 1).toString().padStart(2, '0')}/01/2025 16:00` : undefined
    };
  })
];

export const submissionStatusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "Chờ chấm", color: "bg-amber-100 text-amber-800" },
  graded: { label: "Đã chấm", color: "bg-green-100 text-green-800" },
};

// Helper functions
export function getSubmissionById(id: number): SubmissionItem | undefined {
  return mockSubmissions.find(s => s.id === id);
}

export function getSubmissionStudentName(submissionId: number): string {
  const submission = getSubmissionById(submissionId);
  if (!submission) return 'Không xác định';
  const student = getUserById(submission.studentId);
  return student?.name || 'Không xác định';
}

export function getSubmissionExamTitle(submissionId: number): string {
  const submission = getSubmissionById(submissionId);
  if (!submission) return 'Không xác định';
  const exam = getExamById(submission.examId);
  return exam?.title || 'Không xác định';
}

export function getSubmissionClassName(submissionId: number): string {
  const submission = getSubmissionById(submissionId);
  if (!submission) return 'Không xác định';
  const classItem = getClassById(submission.classId);
  return classItem?.name || 'Không xác định';
}

export function getSubmissionsByStudent(studentId: number): SubmissionItem[] {
  return mockSubmissions.filter(s => s.studentId === studentId);
}

export function getSubmissionsByExam(examId: number): SubmissionItem[] {
  return mockSubmissions.filter(s => s.examId === examId);
}

export function getSubmissionsByClass(classId: number): SubmissionItem[] {
  return mockSubmissions.filter(s => s.classId === classId);
}

export function getPendingSubmissions(): SubmissionItem[] {
  return mockSubmissions.filter(s => s.status === 'pending');
}

export function getGradedSubmissions(): SubmissionItem[] {
  return mockSubmissions.filter(s => s.status === 'graded');
}

// Tính điểm trung bình của học sinh
export function getStudentAverageScore(studentId: number): number | null {
  const gradedSubmissions = mockSubmissions.filter(
    s => s.studentId === studentId && s.status === 'graded' && s.score !== null
  );
  if (gradedSubmissions.length === 0) return null;
  const total = gradedSubmissions.reduce((sum, s) => sum + (s.score || 0), 0);
  return Math.round((total / gradedSubmissions.length) * 10) / 10;
}
