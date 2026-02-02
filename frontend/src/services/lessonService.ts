import LessonModel from "@/domain/entities/Lesson";
import { learnCategories, LearnItem, LearnCategory } from "@/data/learnData";

const USE_API = true;

export interface Lesson extends LearnItem {
  category?: string; // Add category field for flat list handling
}

export async function fetchAllLessons(query?: any): Promise<Lesson[]> {
  if (!USE_API) {
    // Flatten mock data for fallback
    const flatLessons: Lesson[] = [];
    learnCategories.forEach((cat) => {
      cat.items.forEach((item) => {
        flatLessons.push({ ...item, category: cat.id });
      });
    });
    return flatLessons;
  }

  try {
    const response = await LessonModel.getAllLessons(query);
    const data = response.data || response;
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching lessons:", error);
    // Flatten mock data for fallback
    const flatLessons: Lesson[] = [];
    learnCategories.forEach((cat) => {
      cat.items.forEach((item) => {
        flatLessons.push({ ...item, category: cat.id });
      });
    });
    return flatLessons;
  }
}

export async function fetchLessonById(id: number): Promise<Lesson | undefined> {
  const flatLessons: Lesson[] = [];
  learnCategories.forEach((cat) => {
    cat.items.forEach((item) => {
      flatLessons.push({ ...item, category: cat.id });
    });
  });

  if (!USE_API) return flatLessons.find((l) => l.id === id);

  try {
    const response = await LessonModel.getLessonById(id);
    return (response.data || response) as Lesson;
  } catch (error) {
    console.error("Error fetching lesson:", error);
    return flatLessons.find((l) => l.id === id);
  }
}

/**
 * Helper to convert Lesson (LearnItem) to API payload
 */
function convertItemToApiPayload(data: any): any {
  // Parse duration string "15 phút" to number 15
  let durationMinutes = 0;
  if (typeof data.duration === "string") {
    const match = data.duration.match(/(\d+)/);
    if (match) durationMinutes = parseInt(match[1], 10);
  } else if (typeof data.duration === "number") {
    durationMinutes = data.duration;
  }

  return {
    lesson_name: data.name || data.title, // Map name/title -> lesson_name
    description: data.description,
    topic_id: data.topicId,
    classroom_id: data.classId,
    order_number: data.order,
    image_url: data.thumbnail || data.thumbnailUrl, // Map thumbnail -> image_url
    video_url: data.video || data.videoUrl, // Map video -> video_url
    duration_minutes: durationMinutes,
    difficulty_level: data.level === "Cơ bản" ? "BEGINNER" : "INTERMEDIATE", // Simple mapping
    vocabulary_count: data.vocabularyCount || 0,
    is_active: 1,
  };
}

export async function createLesson(data: any) {
  const payload = convertItemToApiPayload(data);
  return await LessonModel.createLesson(payload);
}

export async function updateLesson(id: number, data: any) {
  const payload = convertItemToApiPayload(data);
  return await LessonModel.updateLesson(id, payload);
}

export async function deleteLesson(id: number) {
  return await LessonModel.deleteLesson(id);
}
