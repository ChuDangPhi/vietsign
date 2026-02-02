import QuestionModel from "@/domain/entities/Question";
import { QuestionItem } from "@/data/questionsData";

// Helper to normalize question data from API
function normalizeQuestion(q: any): any {
  if (!q) return null;
  return {
    ...q,
    id: q.question_id || q.id,
    content: q.content,
    explanation: q.explanation,
    classId: q.class_room_id || q.classId,
    image: q.image_location,
    video: q.video_location,
    createdAt: q.created_date || q.created_at || q.createdAt,
  };
}

export async function fetchAllQuestions(query?: any): Promise<QuestionItem[]> {
  try {
    const response = await QuestionModel.getQuestions(query);
    const data = response.data || response;
    return Array.isArray(data) ? data.map(normalizeQuestion) : [];
  } catch (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
}

export async function fetchQuestionById(
  id: number,
): Promise<QuestionItem | undefined> {
  try {
    const response = await QuestionModel.getQuestionById(id);
    const data = response.data || response;
    return normalizeQuestion(data);
  } catch (error) {
    console.error("Error fetching question:", error);
    return undefined;
  }
}

export async function createQuestion(data: any) {
  const payload = {
    content: data.content,
    explanation: data.explanation,
    class_room_id: data.class_room_id || data.classId || data.classroomId,
    image_location: data.image_location || data.imageLocation,
    video_location: data.video_location || data.videoLocation,
    question_type: data.question_type || "ONE_ANSWER",
    file_type: data.file_type || "TEXT",
  };
  return await QuestionModel.createQuestion(payload);
}

export async function updateQuestion(id: number, data: any) {
  const payload = {
    content: data.content,
    explanation: data.explanation,
    class_room_id: data.class_room_id || data.classId || data.classroomId,
    image_location: data.image_location || data.imageLocation,
    video_location: data.video_location || data.videoLocation,
    question_type: data.question_type,
  };
  return await QuestionModel.updateQuestion(id, payload);
}

export async function deleteQuestion(id: number) {
  return await QuestionModel.deleteQuestion(id);
}

export async function fetchQuestionsByClassroom(
  classroomId: number,
): Promise<QuestionItem[]> {
  try {
    const response = await QuestionModel.getQuestionsByClassroom(classroomId);
    const data = response.data || response;
    return Array.isArray(data) ? data.map(normalizeQuestion) : [];
  } catch (error) {
    console.error("Error fetching questions by classroom:", error);
    return [];
  }
}
