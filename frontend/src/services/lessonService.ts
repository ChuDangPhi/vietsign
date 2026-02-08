import LessonModel from "@/domain/entities/Lesson";

// Lesson interface matches Backend API structure exactly
export interface Lesson {
  id: number;
  name: string;
  description: string | null;
  topic_id: number | null;
  classroom_id: number | null;
  content: string | null;
  difficulty_level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  order_number: number;
  is_active: number;
  created_by?: number;
  created_at?: string;
  updated_at?: string;

  // Optional frontend helper fields
  completed?: boolean;
  duration?: string;
  stepsCount?: number;
}

export async function fetchAllLessons(query?: any): Promise<Lesson[]> {
  try {
    const response = await LessonModel.getAllLessons(query);
    const data = response.data || response;
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return [];
  }
}

export async function fetchLessonById(id: number): Promise<Lesson | undefined> {
  try {
    const response = await LessonModel.getLessonById(id);
    return response.data || response;
  } catch (error) {
    console.error("Error fetching lesson:", error);
    return undefined;
  }
}

export async function fetchLessonsByClassroom(
  classroomId: number,
): Promise<Lesson[]> {
  try {
    const response = await LessonModel.getLessonsByClassroom(classroomId);
    const data = response.data || response;
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching lessons by classroom:", error);
    return [];
  }
}

export async function fetchLessonsByTopic(topicId: number): Promise<Lesson[]> {
  try {
    const response = await LessonModel.getLessonsByTopic(topicId);
    const data = response.data || response;
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching lessons by topic:", error);
    return [];
  }
}

export async function fetchLessonStatistics(
  classroomId: number,
  topicId?: number,
) {
  try {
    const response = await LessonModel.getLessonStatistics({
      classroom_id: classroomId,
      topic_id: topicId,
    });
    return response.data || response;
  } catch (error) {
    console.error("Error fetching lesson statistics:", error);
    return { total: 0, active: 0 };
  }
}

export async function createLesson(data: any) {
  // Pass data directly, assuming input follows BE structure
  return await LessonModel.createLesson(data);
}

export async function updateLesson(id: number, data: any) {
  return await LessonModel.updateLesson(id, data);
}

export async function deleteLesson(id: number) {
  return await LessonModel.deleteLesson(id);
}

export async function reorderLessons(
  topicId: number,
  lessons: { lesson_id: number; order_number: number }[],
) {
  return await LessonModel.reorderLessons(topicId, lessons);
}
