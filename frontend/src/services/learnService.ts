/**
 * Learn Service
 *
 * Gọi API backend để lấy dữ liệu khóa học tự học.
 * Thay thế mock data từ selfLearnData.ts.
 */

import LearnModel from "@/domain/entities/Learn";
import { SelfLearnCourse } from "@/data/selfLearnData";

// Danh sách gradient color mặc định cho mỗi category
const DEFAULT_COLORS = [
  {
    colorClass: "bg-gradient-to-r from-purple-500 to-indigo-600",
    textClass: "text-purple-600",
  },
  {
    colorClass: "bg-gradient-to-r from-orange-500 to-red-600",
    textClass: "text-orange-600",
  },
  {
    colorClass: "bg-gradient-to-r from-amber-500 to-orange-600",
    textClass: "text-amber-600",
  },
  {
    colorClass: "bg-gradient-to-r from-emerald-500 to-teal-600",
    textClass: "text-emerald-600",
  },
  {
    colorClass: "bg-gradient-to-r from-blue-500 to-indigo-600",
    textClass: "text-blue-600",
  },
  {
    colorClass: "bg-gradient-to-r from-green-500 to-lime-600",
    textClass: "text-green-600",
  },
];

/**
 * Map API item sang SelfLearnCourse interface dùng trong FE
 */
function mapItemToCourse(
  item: any,
  categoryColorClass?: string,
  categoryTextClass?: string,
  fallbackIndex?: number,
): SelfLearnCourse {
  const idx = fallbackIndex ?? 0;
  const fallback = DEFAULT_COLORS[idx % DEFAULT_COLORS.length];

  return {
    id: item.id,
    title: item.title || "Khóa học",
    subtitle: item.subtitle || item.description || "",
    description: item.description || "",
    colorClass: categoryColorClass || item.colorClass || fallback.colorClass,
    textClass: categoryTextClass || item.textClass || fallback.textClass,
    totalLessons: item.lessons || 0,
    duration: item.duration || "Chưa xác định",
    level: item.level || "Cơ bản",
    progress: item.progress ?? 0,
  };
}

/**
 * Lấy tất cả khóa học tự học từ API
 * API: GET /learn/categories → categories[].items[]
 */
export async function fetchAllCourses(): Promise<SelfLearnCourse[]> {
  try {
    const response = await LearnModel.getCategories();
    const data = response.data || response;

    // Flatten: categories → items
    const courses: SelfLearnCourse[] = [];
    let globalIndex = 0;

    if (Array.isArray(data)) {
      for (const category of data) {
        const items = category.items || [];
        for (const item of items) {
          courses.push(
            mapItemToCourse(
              item,
              category.colorClass,
              category.textClass,
              globalIndex,
            ),
          );
          globalIndex++;
        }
      }
    }

    return courses;
  } catch (error) {
    console.error("[learnService] Error fetching courses:", error);
    return [];
  }
}

/**
 * Lấy khóa học theo ID
 * API: GET /learn/items/:itemId
 */
export async function fetchCourseById(
  courseId: number,
): Promise<SelfLearnCourse | undefined> {
  try {
    const response = await LearnModel.getItemById(courseId);
    const data = response.data || response;

    if (!data) return undefined;

    return mapItemToCourse(data);
  } catch (error) {
    console.error(`[learnService] Error fetching course ${courseId}:`, error);
    return undefined;
  }
}

/**
 * Lấy lessons theo courseId (itemId)
 * API: GET /learn/items/:itemId/lessons
 */
export async function fetchLessonsByCourseId(courseId: number): Promise<any[]> {
  try {
    const response = await LearnModel.getLessonsByItemId(courseId);
    const data = response.data || response;

    if (!Array.isArray(data)) return [];

    return data.map((lesson: any, index: number) => ({
      id: lesson.id,
      courseId: courseId,
      title: lesson.title || `Bài ${index + 1}`,
      description: lesson.description || "",
      duration: lesson.duration || "15 phút",
      order: lesson.order || index + 1,
      completed: false,
      stepsCount: 10,
      topicId: lesson.topicId,
      vocabularyList: lesson.vocabularyList || [],
    }));
  } catch (error) {
    console.error(
      `[learnService] Error fetching lessons for course ${courseId}:`,
      error,
    );
    return [];
  }
}

/**
 * Lấy steps cho một lesson
 * API: GET /learn/lessons/:lessonId/steps
 */
export async function fetchStepsByLessonId(lessonId: number): Promise<any[]> {
  try {
    const response = await LearnModel.getStepsForLesson(lessonId);
    const data = response.data || response;

    if (!Array.isArray(data)) return [];

    return data;
  } catch (error) {
    console.error(
      `[learnService] Error fetching steps for lesson ${lessonId}:`,
      error,
    );
    return [];
  }
}

/**
 * Cập nhật tiến độ học
 * API: POST /learn/progress
 */
export async function updateLearningProgress(data: {
  itemId: number;
  completedLessons: number;
  totalLessons: number;
  lastLessonId?: number;
}): Promise<any> {
  try {
    const response = await LearnModel.updateProgress(data);
    return response.data || response;
  } catch (error) {
    console.error("[learnService] Error updating progress:", error);
    return null;
  }
}

/**
 * Lấy tiến độ tổng quan
 * API: GET /learn/progress
 */
export async function fetchUserProgress(): Promise<any> {
  try {
    const response = await LearnModel.getUserProgress();
    return response.data || response;
  } catch (error) {
    console.error("[learnService] Error fetching user progress:", error);
    return null;
  }
}
