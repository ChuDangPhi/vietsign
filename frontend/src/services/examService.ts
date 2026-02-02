import ExamModel from "@/domain/entities/Exam";
import { ExamItem } from "@/data/examsData";

// Helper to normalize exam data from API
function normalizeExam(exam: any): any {
  if (!exam) return null;
  return {
    ...exam,
    id: exam.exam_id || exam.id,
    title: exam.name || exam.title,
    classId: exam.class_room_id || exam.classId,
    createdAt: exam.created_date || exam.created_at || exam.createdAt,
    examType: exam.exam_type || exam.examType,
    duration: exam.duration_minutes
      ? `${exam.duration_minutes} phút`
      : exam.duration || "60 phút",
    questions: exam.total_points || exam.questions || 10,
    passingScore: exam.passing_score || exam.passingScore || 5,
    status: exam.status || (exam.is_active ? "ongoing" : "upcoming"),
  };
}

export async function fetchAllExams(query?: any): Promise<ExamItem[]> {
  try {
    const response = await ExamModel.getAllExams(query);
    const data = response.data || response;
    return Array.isArray(data) ? data.map(normalizeExam) : [];
  } catch (error) {
    console.error("Error fetching exams:", error);
    return [];
  }
}

export async function fetchExamById(id: number): Promise<ExamItem | undefined> {
  try {
    const response = await ExamModel.getExamById(id);
    const data = response.data || response;
    return normalizeExam(data);
  } catch (error) {
    console.error("Error fetching exam:", error);
    return undefined;
  }
}

export async function createExam(data: any) {
  const payload = {
    name: data.name || data.title,
    class_room_id: data.class_room_id || data.classId,
    is_private: data.is_private || data.isPrivate ? 1 : 0,
    exam_type: data.examType || data.exam_type || "QUIZ",
    duration_minutes: data.durationMinutes || data.duration_minutes || 60,
    total_points: data.totalPoints || data.total_points || 10,
    passing_score: data.passingScore || data.passing_score || 5,
    description: data.description || "",
    practice_questions: data.practiceQuestions,
    question_ids: data.questionIds,
  };
  return await ExamModel.createExam(payload);
}

export async function updateExam(id: number, data: any) {
  const payload = {
    name: data.name || data.title,
    class_room_id: data.class_room_id || data.classId,
    is_private:
      data.is_private !== undefined ? (data.is_private ? 1 : 0) : undefined,
    exam_type: data.examType || data.type,
    duration_minutes:
      data.durationMinutes ||
      (data.duration ? parseInt(data.duration) : undefined),
    total_points: data.totalPoints || data.questions,
    passing_score: data.passingScore,
    description: data.description,
    practice_questions: data.practiceQuestions || data.practice_questions,
    question_ids: data.questionIds || data.question_ids,
  };
  return await ExamModel.updateExam(id, payload);
}

export async function deleteExam(id: number) {
  return await ExamModel.deleteExam(id);
}

export async function fetchExamsByClassroom(
  classroomId: number,
): Promise<ExamItem[]> {
  try {
    const response = await ExamModel.getExamsByClassroom(classroomId);
    const data = response.data || response;
    return Array.isArray(data) ? data.map(normalizeExam) : [];
  } catch (error) {
    console.error("Error fetching exams by classroom:", error);
    return [];
  }
}
