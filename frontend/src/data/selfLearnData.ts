// Self-learning courses data for /learn page (học viên tự do không thuộc trường/cơ sở)
// Based on: B2026. Khung Nội dung hỗ trợ dạy và học ký hiệu.xlsx

import { BaseStepItem, StepType } from "@/shared/components/common/step";

// Course structure for self-learning
export interface SelfLearnCourse {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  colorClass: string;
  textClass: string;
  totalLessons: number;
  duration: string;
  level: string;
  progress?: number;
}

export interface SelfLearnLesson {
  id: number;
  courseId: number;
  title: string;
  description: string;
  duration: string;
  order: number;
  completed?: boolean;
  stepsCount: number;
  topicId?: number;
}

// Sample vocabulary words for lessons
const vocabularyWords = [
  { word: "Xin chào", videoUrl: "https://player.vimeo.com/video/824804225" },
  { word: "Cảm ơn", videoUrl: "https://player.vimeo.com/video/824804225" },
  { word: "Tạm biệt", videoUrl: "https://player.vimeo.com/video/824804225" },
  { word: "Xin lỗi", videoUrl: "https://player.vimeo.com/video/824804225" },
  { word: "A", videoUrl: "https://player.vimeo.com/video/824804225" },
  { word: "B", videoUrl: "https://player.vimeo.com/video/824804225" },
  { word: "C", videoUrl: "https://player.vimeo.com/video/824804225" },
  { word: "Một", videoUrl: "https://player.vimeo.com/video/824804225" },
  { word: "Hai", videoUrl: "https://player.vimeo.com/video/824804225" },
  { word: "Ba", videoUrl: "https://player.vimeo.com/video/824804225" },
  { word: "Gia đình", videoUrl: "https://player.vimeo.com/video/824804225" },
  { word: "Bố", videoUrl: "https://player.vimeo.com/video/824804225" },
  { word: "Mẹ", videoUrl: "https://player.vimeo.com/video/824804225" },
  { word: "Anh", videoUrl: "https://player.vimeo.com/video/824804225" },
  { word: "Chị", videoUrl: "https://player.vimeo.com/video/824804225" },
  { word: "Em", videoUrl: "https://player.vimeo.com/video/824804225" },
  { word: "Nhà", videoUrl: "https://player.vimeo.com/video/824804225" },
  { word: "Trường", videoUrl: "https://player.vimeo.com/video/824804225" },
  { word: "Cây", videoUrl: "https://player.vimeo.com/video/824804225" },
  { word: "Hoa", videoUrl: "https://player.vimeo.com/video/824804225" },
];

// All courses data
export const selfLearnCourses: SelfLearnCourse[] = [
  {
    id: 6,
    title: "Bảng chữ cái",
    subtitle: "Học chữ cái qua hình ảnh",
    description:
      "Làm quen với bảng chữ cái ngôn ngữ ký hiệu thông qua hình ảnh minh họa.",
    colorClass: "bg-gradient-to-r from-purple-500 to-indigo-600",
    textClass: "text-purple-600",
    totalLessons: 9,
    duration: "2 giờ",
    level: "Cơ bản",
    progress: 0,
  },
  {
    id: 7,
    title: "Chữ số",
    subtitle: "Học chữ số qua hình ảnh",
    description: "Làm quen với các con số trong ngôn ngữ ký hiệu qua hình ảnh.",
    colorClass: "bg-gradient-to-r from-orange-500 to-red-600",
    textClass: "text-orange-600",
    totalLessons: 3,
    duration: "1 giờ",
    level: "Cơ bản",
    progress: 0,
  },
  {
    id: 2,
    title: "Bản thân em",
    subtitle: "Cơ thể, hoạt động và cảm xúc",
    description:
      "Học về các bộ phận cơ thể, hoạt động hàng ngày, thế giới cảm xúc và sở thích.",
    colorClass: "bg-gradient-to-r from-amber-500 to-orange-600",
    textClass: "text-amber-600",
    totalLessons: 10,
    duration: "3 giờ",
    level: "Cơ bản",
    progress: 0,
  },
  {
    id: 3,
    title: "Gia đình",
    subtitle: "Người thân, ngôi nhà và tình yêu thương",
    description:
      "Học về các thành viên gia đình, ngôi nhà và cách thể hiện yêu thương.",
    colorClass: "bg-gradient-to-r from-emerald-500 to-teal-600",
    textClass: "text-emerald-600",
    totalLessons: 10,
    duration: "3 giờ",
    level: "Cơ bản",
    progress: 0,
  },
  {
    id: 4,
    title: "Nhà trường",
    subtitle: "Trường học, giao tiếp và mọi người",
    description:
      "Học về môi trường học đường, giao tiếp lịch sự và an toàn giao thông.",
    colorClass: "bg-gradient-to-r from-blue-500 to-indigo-600",
    textClass: "text-blue-600",
    totalLessons: 8,
    duration: "3 giờ",
    level: "Cơ bản",
    progress: 0,
  },
  {
    id: 5,
    title: "Thiên nhiên và Đất nước",
    subtitle: "Thiên nhiên, đất nước và môi trường",
    description:
      "Khám phá thiên nhiên kỳ thú, đất nước tươi đẹp và bảo vệ môi trường.",
    colorClass: "bg-gradient-to-r from-green-500 to-lime-600",
    textClass: "text-green-600",
    totalLessons: 8,
    duration: "3 giờ",
    level: "Cơ bản",
    progress: 0,
  },
];

// Lesson titles for each course
const lessonTitlesPerCourse: Record<number, string[]> = {
  1: [
    "Chữ cái A-E",
    "Chữ cái F-J",
    "Chữ cái K-O",
    "Chữ cái P-T",
    "Chữ cái U-Z",
    "Dấu thanh cơ bản",
    "Số 0-5",
    "Số 6-10",
    "Số 11-15",
    "Số 16-20",
    "Ôn tập chữ cái",
    "Ôn tập số",
  ],
  2: [
    "Khuôn mặt",
    "Bàn tay và chân",
    "Các bộ phận cơ thể khác",
    "Hoạt động buổi sáng",
    "Hoạt động buổi chiều",
    "Cảm xúc vui buồn",
    "Cảm xúc khác",
    "Sở thích cá nhân",
    "Ước mơ của em",
    "Ôn tập tổng hợp",
  ],
  3: [
    "Bố và Mẹ",
    "Anh chị em",
    "Ông bà",
    "Các phòng trong nhà",
    "Đồ dùng phòng khách",
    "Đồ dùng phòng ngủ",
    "Đồ dùng nhà bếp",
    "Yêu thương gia đình",
    "Chia sẻ và giúp đỡ",
    "Ôn tập gia đình",
  ],
  4: [
    "Lớp học",
    "Đồ dùng học tập",
    "Thầy cô giáo",
    "Bạn bè",
    "Chào hỏi lịch sự",
    "Xin phép và cảm ơn",
    "Phương tiện giao thông",
    "An toàn giao thông",
  ],
  5: [
    "Động vật nuôi",
    "Động vật hoang dã",
    "Cây cối và hoa",
    "Địa danh nổi tiếng",
    "Lễ hội Việt Nam",
    "Văn hóa dân tộc",
    "Bảo vệ môi trường",
    "Trái đất xanh",
  ],
  6: [
    "Chữ A - C",
    "Chữ D - F",
    "Chữ G - I",
    "Chữ J - L",
    "Chữ M - O",
    "Chữ P - R",
    "Chữ S - U",
    "Chữ V - X",
    "Chữ Y - Z",
  ],
  7: ["Số 1 - 3", "Số 4 - 6", "Số 7 - 9"],
};

// Generate steps for a self-learn lesson
const generateStepsForSelfLearnLesson = (
  lessonId: number,
  lessonOrder: number,
): BaseStepItem[] => {
  const steps: BaseStepItem[] = [];
  let stepOrder = 1;
  const courseId = Math.floor(lessonId / 100);

  // Define helpers for new courses
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const numbers = "123456789".split("");

  // Logic for Course 6 (Alphabet) & 7 (Numbers)
  if (courseId === 6 || courseId === 7) {
    const isAlpha = courseId === 6;
    const sourceArr = isAlpha ? alphabet : numbers;
    const folder = isAlpha ? "A-Z" : "1-9";
    const perLesson = 3;
    const startIdx = lessonOrder * perLesson;
    const items = sourceArr.slice(startIdx, startIdx + perLesson);

    // 1. Vocabulary Steps
    items.forEach((item) => {
      steps.push({
        id: lessonId * 100 + stepOrder,
        title: `${isAlpha ? "Chữ" : "Số"}: ${item}`,
        type: "vocabulary" as StepType,
        order: stepOrder,
        completed: stepOrder <= 1,
        word: item,
        videoUrl: `/${folder}/${item}.webp`,
        description: `Ký hiệu cho ${isAlpha ? "chữ" : "số"} ${item}`,
      });
      stepOrder++;
    });

    if (items.length > 0) {
      const quizItem = items[0];
      const otherItems = sourceArr
        .filter((i) => !items.includes(i))
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      // 2. Quiz Image -> Text
      steps.push({
        id: lessonId * 100 + stepOrder,
        title: "Trắc nghiệm: Nhìn hình đoán ý",
        type: "quiz-video-to-text" as StepType,
        order: stepOrder,
        completed: false,
        questionVideoUrl: `/${folder}/${quizItem}.webp`,
        options: [
          { id: 1, text: quizItem, isCorrect: true },
          { id: 2, text: otherItems[0] || "A", isCorrect: false },
          { id: 3, text: otherItems[1] || "B", isCorrect: false },
          { id: 4, text: otherItems[2] || "C", isCorrect: false },
        ].sort(() => Math.random() - 0.5),
      });
      stepOrder++;

      // 3. Quiz Input
      steps.push({
        id: lessonId * 100 + stepOrder,
        title: "Gõ đáp án",
        type: "quiz-input" as StepType,
        order: stepOrder,
        completed: false,
        questionVideoUrl: `/${folder}/${items[1] || quizItem}.webp`,
        correctAnswer: items[1] || quizItem,
        hint: `Nhập ${isAlpha ? "chữ cái" : "số"} bạn nhìn thấy`,
      });
      stepOrder++;

      // 4. Flip Card (Ghép hình với chữ/số)
      steps.push({
        id: lessonId * 100 + stepOrder,
        title: "Lật thẻ",
        type: "flip-card" as StepType,
        order: stepOrder,
        completed: false,
        flipCards: items.map((val) => ({
          videoUrl: `/${folder}/${val}.webp`,
          matchText: val,
        })),
      });
      stepOrder++;
    }

    return steps;
  }

  // Default logic for courses 1-5

  // Get vocabulary words for this lesson
  const startIdx = (lessonOrder * 2) % vocabularyWords.length;
  const vocabCount = 3;

  // Step 1-3: Vocabulary
  for (let i = 0; i < vocabCount; i++) {
    const vocab = vocabularyWords[(startIdx + i) % vocabularyWords.length];
    steps.push({
      id: lessonId * 100 + stepOrder,
      title: `Từ vựng: ${vocab.word}`,
      type: "vocabulary" as StepType,
      order: stepOrder,
      completed: stepOrder <= 1,
      word: vocab.word,
      videoUrl: vocab.videoUrl,
      description: `Quan sát video và làm ký hiệu theo mẫu cho từ "${vocab.word}"`,
    });
    stepOrder++;
  }

  // Step 4: Sentence
  const sentenceWords = vocabularyWords
    .slice(startIdx, startIdx + 3)
    .map((v) => ({
      word: v.word,
      videoUrl: v.videoUrl,
    }));
  steps.push({
    id: lessonId * 100 + stepOrder,
    title: "Luyện tập: Cấu trúc câu",
    type: "sentence" as StepType,
    order: stepOrder,
    completed: false,
    sentence: sentenceWords.map((w) => w.word).join(" "),
    words: sentenceWords,
    videoUrl: "https://player.vimeo.com/video/824804225",
  });
  stepOrder++;

  // Step 5: Quiz Video to Text
  const quizVocab = vocabularyWords[(startIdx + 1) % vocabularyWords.length];
  const wrongOptions = vocabularyWords
    .filter((_, i) => i !== (startIdx + 1) % vocabularyWords.length)
    .slice(0, 3);

  steps.push({
    id: lessonId * 100 + stepOrder,
    title: "Kiểm tra: Nhìn video chọn từ",
    type: "quiz-video-to-text" as StepType,
    order: stepOrder,
    completed: false,
    questionVideoUrl: quizVocab.videoUrl,
    options: [
      { id: 1, text: quizVocab.word, isCorrect: true },
      { id: 2, text: wrongOptions[0]?.word || "Khác", isCorrect: false },
      { id: 3, text: wrongOptions[1]?.word || "Khác", isCorrect: false },
      { id: 4, text: wrongOptions[2]?.word || "Khác", isCorrect: false },
    ].sort(() => Math.random() - 0.5),
  });
  stepOrder++;

  // Step 6: Quiz Input
  steps.push({
    id: lessonId * 100 + stepOrder,
    title: "Kiểm tra: Gõ đáp án",
    type: "quiz-input" as StepType,
    order: stepOrder,
    completed: false,
    questionVideoUrl: quizVocab.videoUrl,
    correctAnswer: quizVocab.word,
    hint: quizVocab.word.charAt(0) + "...",
  });
  stepOrder++;

  // Step 7: Match Video to Text (Nối từ)
  const matchItems = vocabularyWords.slice(startIdx, startIdx + 3);
  steps.push({
    id: lessonId * 100 + stepOrder,
    title: "Trò chơi: Nối từ",
    type: "match-video-to-text" as StepType,
    order: stepOrder,
    completed: false,
    matchPairs: matchItems.map((v, idx) => ({
      id: idx + 1,
      videoUrl: v.videoUrl,
      matchText: v.word,
    })),
  });
  stepOrder++;

  // Step 8: Quiz Text to Video (Chọn video đúng)
  steps.push({
    id: lessonId * 100 + stepOrder,
    title: "Kiểm tra: Chọn video đúng",
    type: "quiz-text-to-video" as StepType,
    order: stepOrder,
    completed: false,
    question: quizVocab.word,
    options: [
      { id: 1, videoUrl: quizVocab.videoUrl, isCorrect: true },
      { id: 2, videoUrl: wrongOptions[0]?.videoUrl || "", isCorrect: false },
      { id: 3, videoUrl: wrongOptions[1]?.videoUrl || "", isCorrect: false },
      { id: 4, videoUrl: wrongOptions[2]?.videoUrl || "", isCorrect: false },
    ].sort(() => Math.random() - 0.5),
  });
  stepOrder++;

  // Step 9: Flip Card (Lật thẻ nhớ)
  steps.push({
    id: lessonId * 100 + stepOrder,
    title: "Trò chơi: Lật thẻ",
    type: "flip-card" as StepType,
    order: stepOrder,
    completed: false,
    flipCards: matchItems.map((v) => ({
      videoUrl: v.videoUrl,
      matchText: v.word,
    })),
  });
  stepOrder++;

  // Step 10: True/False
  const isTrue = Math.random() > 0.5;
  steps.push({
    id: lessonId * 100 + stepOrder,
    title: "Kiểm tra: Đúng hay Sai?",
    type: "true-false" as StepType,
    order: stepOrder,
    completed: false,
    statementVideoUrl: quizVocab.videoUrl,
    statement: isTrue ? quizVocab.word : wrongOptions[0]?.word || "Khác",
    isTrue: isTrue,
  });

  return steps;
};

// Generate lessons for a course
const generateLessonsForCourse = (courseId: number): SelfLearnLesson[] => {
  const lessonTitles = lessonTitlesPerCourse[courseId] || [];
  const lessons: SelfLearnLesson[] = [];

  lessonTitles.forEach((title, index) => {
    const lessonId = courseId * 100 + index + 1;
    lessons.push({
      id: lessonId,
      courseId: courseId,
      title: `Bài ${index + 1}: ${title}`,
      description: `Học về ${title.toLowerCase()}`,
      duration: "15 phút",
      order: index + 1,
      completed: index < 2, // First 2 lessons marked as completed
      stepsCount: 10,
    });
  });

  return lessons;
};

// Cache for generated data
const lessonsCache: Record<number, SelfLearnLesson[]> = {};
const stepsCache: Record<number, BaseStepItem[]> = {};

// Get all courses
export const getAllSelfLearnCourses = (): SelfLearnCourse[] => {
  return selfLearnCourses;
};

// Get course by ID
export const getSelfLearnCourseById = (
  courseId: number,
): SelfLearnCourse | undefined => {
  return selfLearnCourses.find((c) => c.id === courseId);
};

// Get lessons by course ID
export const getLessonsByCourseId = (courseId: number): SelfLearnLesson[] => {
  if (!lessonsCache[courseId]) {
    lessonsCache[courseId] = generateLessonsForCourse(courseId);
  }
  return lessonsCache[courseId];
};

// Get lesson by ID
export const getSelfLearnLessonById = (
  lessonId: number,
): SelfLearnLesson | undefined => {
  const courseId = Math.floor(lessonId / 100);
  const lessons = getLessonsByCourseId(courseId);
  return lessons.find((l) => l.id === lessonId);
};

// Get steps by lesson ID
export const getSelfLearnStepsByLessonId = (
  lessonId: number,
): BaseStepItem[] => {
  if (!stepsCache[lessonId]) {
    const lessonOrder = (lessonId % 100) - 1;
    stepsCache[lessonId] = generateStepsForSelfLearnLesson(
      lessonId,
      lessonOrder,
    );
  }
  return stepsCache[lessonId];
};

// Get step by ID
export const getSelfLearnStepById = (
  stepId: number,
): BaseStepItem | undefined => {
  const lessonId = Math.floor(stepId / 100);
  const steps = getSelfLearnStepsByLessonId(lessonId);
  return steps.find((s) => s.id === stepId);
};
