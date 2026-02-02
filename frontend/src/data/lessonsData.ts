// Lessons and Steps data for classes

// Step types
export type StepType =
  | "vocabulary" // Từ vựng đơn - video loop
  | "sentence" // Cấu trúc câu - video + thẻ từ
  | "quiz-text-to-video" // Nhìn chữ chọn video (3a)
  | "quiz-video-to-text" // Nhìn video chọn đáp án (3b)
  | "quiz-input" // Tự gõ đáp án (3c)
  // New types
  | "practice-video" // Xem video và quay video thực hành
  | "practice-matrix" // Ma trận thẻ -> xem -> thực hành
  | "match-video-image" // Nối video - hình ảnh
  | "match-video-word" // Nối video - từ
  | "drag-drop-video-word" // Kéo thả từ vào ô video
  | "match-horizontal" // Nối từ theo hàng ngang 3 video
  | "quiz-choice"; // Chọn video tương ứng (có nút bấm riêng)

// Step item
export interface StepItem {
  id: number;
  lessonId: number;
  title: string;
  type: StepType;
  order: number;
  completed?: boolean;

  // For vocabulary type
  word?: string;
  videoUrl?: string;
  description?: string;

  // For sentence type
  sentence?: string;
  words?: { word: string; videoUrl: string }[];

  // For quiz types
  question?: string;
  questionVideoUrl?: string;
  questionImageUrl?: string;
  options?: {
    id: number;
    text?: string;
    videoUrl?: string;
    imageUrl?: string;
    isCorrect: boolean;
  }[];
  correctAnswer?: string; // For quiz-input type
  hint?: string;

  // For new types
  // Practice Matrix Items
  matrixItems?: {
    id: number;
    label: string; // e.g. "Card 1" or image
    videoUrl: string;
    word: string;
    imageUrl?: string;
  }[];

  // Match Items (Video-Image or Video-Word)
  matchPairs?: {
    id: number;
    videoUrl: string;
    targetUrl?: string; // Image URL
    targetText?: string; // Word
  }[];

  // Drag Drop Items
  dragDropItems?: {
    id: number;
    videoUrl: string;
    correctWord: string;
  }[];
  availableWords?: string[]; // List of words to drag
}

// Lesson item - contains multiple steps
export interface LessonItem {
  id: number;
  classId: number;
  title: string;
  description: string;
  duration: string;
  order: number;
  completed?: boolean;
  stepsCount: number;
}

import { getExamsByClass, ExamItem } from "./examsData";
export type { ExamItem };

// ... (keep DocumentItem)

// ...

// Get exams by class ID
export const getExamsByClassId = (
  classId: number,
): (ExamItem & { studentStatus: string; score?: number })[] => {
  const exams = getExamsByClass(classId);
  return exams.map((exam) => ({
    ...exam,
    studentStatus: Math.random() > 0.5 ? "completed" : "pending",
    score:
      Math.random() > 0.5 ? 70 + Math.floor(Math.random() * 30) : undefined,
  }));
};

export interface DocumentItem {
  id: number;
  classId: number;
  title: string;
  type: "pdf" | "doc" | "video" | "link";
  size?: string;
  url: string;
  uploadedAt: string;
}

// Sample vocabulary words with Vimeo videos
const vocabularyWords = [
  { word: "Xin chào", videoUrl: "https://player.vimeo.com/video/824804225" },
  { word: "Cảm ơn", videoUrl: "https://player.vimeo.com/video/824804225" },
  { word: "Tạm biệt", videoUrl: "https://player.vimeo.com/video/824804225" },
  { word: "Xin lỗi", videoUrl: "https://player.vimeo.com/video/824804225" },
  { word: "Gia đình", videoUrl: "https://player.vimeo.com/video/824804225" },
  { word: "Bố", videoUrl: "https://player.vimeo.com/video/824804225" },
  { word: "Mẹ", videoUrl: "https://player.vimeo.com/video/824804225" },
  { word: "Anh", videoUrl: "https://player.vimeo.com/video/824804225" },
  { word: "Chị", videoUrl: "https://player.vimeo.com/video/824804225" },
  { word: "Em", videoUrl: "https://player.vimeo.com/video/824804225" },
  { word: "Bệnh viện", videoUrl: "https://player.vimeo.com/video/824804225" },
  { word: "Trường học", videoUrl: "https://player.vimeo.com/video/824804225" },
  { word: "Nhà", videoUrl: "https://player.vimeo.com/video/824804225" },
  { word: "Yêu", videoUrl: "https://player.vimeo.com/video/824804225" },
  { word: "Thích", videoUrl: "https://player.vimeo.com/video/824804225" },
  { word: "Ăn", videoUrl: "https://player.vimeo.com/video/824804225" },
  { word: "Uống", videoUrl: "https://player.vimeo.com/video/824804225" },
  { word: "Đi", videoUrl: "https://player.vimeo.com/video/824804225" },
  { word: "Về", videoUrl: "https://player.vimeo.com/video/824804225" },
  { word: "Làm việc", videoUrl: "https://player.vimeo.com/video/824804225" },
];

// Generate steps for a lesson
const generateStepsForLesson = (
  lessonId: number,
  lessonOrder: number,
): StepItem[] => {
  const steps: StepItem[] = [];
  let stepOrder = 1;

  // Get 3-5 vocabulary words for this lesson
  const startIdx = (lessonOrder * 3) % vocabularyWords.length;
  const vocabCount = 3 + (lessonOrder % 3);

  // Add vocabulary steps
  for (let i = 0; i < vocabCount; i++) {
    const vocab = vocabularyWords[(startIdx + i) % vocabularyWords.length];
    steps.push({
      id: lessonId * 100 + stepOrder,
      lessonId,
      title: `Từ vựng: ${vocab.word}`,
      type: "vocabulary",
      order: stepOrder,
      completed: stepOrder <= 2,
      word: vocab.word,
      videoUrl: vocab.videoUrl,
    });
    stepOrder++;
  }

  // Add sentence building step
  const sentenceWords = vocabularyWords
    .slice(startIdx, startIdx + 3)
    .map((v) => ({
      word: v.word,
      videoUrl: v.videoUrl,
    }));
  steps.push({
    id: lessonId * 100 + stepOrder,
    lessonId,
    title: "Luyện tập: Cấu trúc câu",
    type: "sentence",
    order: stepOrder,
    completed: false,
    sentence: sentenceWords.map((w) => w.word).join(" "),
    words: sentenceWords,
    videoUrl: "https://player.vimeo.com/video/824804225",
  });
  stepOrder++;

  // Add quiz: text-to-video
  const quizVocab = vocabularyWords[(startIdx + 1) % vocabularyWords.length];
  const wrongOptions = vocabularyWords
    .filter((_, i) => i !== (startIdx + 1) % vocabularyWords.length)
    .slice(0, 3);

  steps.push({
    id: lessonId * 100 + stepOrder,
    lessonId,
    title: "Kiểm tra: Nhìn chữ chọn video",
    type: "quiz-text-to-video",
    order: stepOrder,
    completed: false,
    question: quizVocab.word,
    options: [
      { id: 1, videoUrl: quizVocab.videoUrl, isCorrect: true },
      {
        id: 2,
        videoUrl: wrongOptions[0]?.videoUrl || quizVocab.videoUrl,
        isCorrect: false,
      },
      {
        id: 3,
        videoUrl: wrongOptions[1]?.videoUrl || quizVocab.videoUrl,
        isCorrect: false,
      },
      {
        id: 4,
        videoUrl: wrongOptions[2]?.videoUrl || quizVocab.videoUrl,
        isCorrect: false,
      },
    ].sort(() => Math.random() - 0.5),
  });
  stepOrder++;

  // Add quiz: video-to-text
  steps.push({
    id: lessonId * 100 + stepOrder,
    lessonId,
    title: "Kiểm tra: Nhìn video chọn đáp án",
    type: "quiz-video-to-text",
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

  // Add quiz: input
  steps.push({
    id: lessonId * 100 + stepOrder,
    lessonId,
    title: "Kiểm tra: Gõ đáp án",
    type: "quiz-input",
    order: stepOrder,
    completed: false,
    questionVideoUrl: quizVocab.videoUrl,
    correctAnswer: quizVocab.word,
    hint: quizVocab.word.charAt(0) + "...",
  });

  // Add Practice Video Step
  steps.push({
    id: lessonId * 100 + stepOrder,
    lessonId,
    title: "Luyện tập: Quay video ký hiệu",
    type: "practice-video",
    order: stepOrder++,
    completed: false,
    word: quizVocab.word,
    videoUrl: quizVocab.videoUrl,
    description: `Hãy xem video mẫu và thực hành ký hiệu từ "${quizVocab.word}"`,
  });

  // Add Practice Matrix Step (6-8 items)
  const matrixItems = vocabularyWords
    .sort(() => Math.random() - 0.5)
    .slice(0, 8)
    .map((v, idx) => ({
      id: idx + 1,
      label: v.word,
      videoUrl: v.videoUrl,
      word: v.word,
      imageUrl: `https://ui-avatars.com/api/?name=${v.word}&background=random&size=200`, // Mock image
    }));

  steps.push({
    id: lessonId * 100 + stepOrder,
    lessonId,
    title: "Luyện tập: Ma trận ký hiệu",
    type: "practice-matrix",
    order: stepOrder++,
    completed: false,
    matrixItems: matrixItems,
    description: "Chọn một thẻ để xem video và thực hành lại.",
  });

  // Add Match Video - Image Step
  const matchPairsImage = vocabularyWords.slice(0, 4).map((v, idx) => ({
    id: idx + 1,
    videoUrl: v.videoUrl,
    targetUrl: `https://ui-avatars.com/api/?name=${v.word}&background=0D8ABC&color=fff&size=200`, // Mock image
    targetText: v.word,
  }));

  steps.push({
    id: lessonId * 100 + stepOrder,
    lessonId,
    title: "Nối: Video - Hình ảnh",
    type: "match-video-image",
    order: stepOrder++,
    completed: false,
    matchPairs: matchPairsImage,
  });

  // Add Match Video - Word Step
  const matchPairsWord = vocabularyWords.slice(2, 6).map((v, idx) => ({
    id: idx + 1,
    videoUrl: v.videoUrl,
    targetText: v.word,
  }));

  steps.push({
    id: lessonId * 100 + stepOrder,
    lessonId,
    title: "Nối: Video - Từ vựng",
    type: "match-video-word",
    order: stepOrder++,
    completed: false,
    matchPairs: matchPairsWord,
  });

  // Add Drag Drop Video - Word Step (6 boxes)
  const dragDropItems = vocabularyWords
    .sort(() => Math.random() - 0.5)
    .slice(0, 6)
    .map((v, idx) => ({
      id: idx + 1,
      videoUrl: v.videoUrl,
      correctWord: v.word,
    }));

  steps.push({
    id: lessonId * 100 + stepOrder,
    lessonId,
    title: "Kéo thả: Ghép từ vào video",
    type: "drag-drop-video-word",
    order: stepOrder++,
    completed: false,
    dragDropItems: dragDropItems,
    availableWords: dragDropItems
      .map((i) => i.correctWord)
      .sort(() => Math.random() - 0.5),
  });
  stepOrder++;

  // Add Match Horizontal Step (3 items)
  const matchHorizontalItems = vocabularyWords.slice(1, 4).map((v, idx) => ({
    id: idx + 1,
    videoUrl: v.videoUrl,
    targetText: v.word,
  }));

  steps.push({
    id: lessonId * 100 + stepOrder,
    lessonId,
    title: "Thực hành: Nối từ (Hàng ngang)",
    type: "match-horizontal",
    order: stepOrder++,
    completed: false,
    matchPairs: matchHorizontalItems,
  });
  stepOrder++;

  // Add Quiz Choice Step (Pick video with button)
  steps.push({
    id: lessonId * 100 + stepOrder,
    lessonId,
    title: "Kiểm tra: Chọn video đúng",
    type: "quiz-choice",
    order: stepOrder++,
    completed: false,
    question: quizVocab.word,
    options: [
      { id: 1, videoUrl: quizVocab.videoUrl, isCorrect: true },
      {
        id: 2,
        videoUrl: wrongOptions[0]?.videoUrl || quizVocab.videoUrl,
        isCorrect: false,
      },
      {
        id: 3,
        videoUrl: wrongOptions[1]?.videoUrl || quizVocab.videoUrl,
        isCorrect: false,
      },
      {
        id: 4,
        videoUrl: wrongOptions[2]?.videoUrl || quizVocab.videoUrl,
        isCorrect: false,
      },
    ].sort(() => Math.random() - 0.5),
  });

  return steps;
};

// Generate mock lessons for a class
export const generateLessonsForClass = (classId: number): LessonItem[] => {
  const lessonTopics = [
    {
      title: "Chào hỏi cơ bản",
      desc: "Học cách nói Xin chào, Cảm ơn, Tạm biệt.",
    },
    {
      title: "Xin lỗi & Làm quen",
      desc: "Các cách xin lỗi và làm quen với người mới.",
    },
    {
      title: "Gia đình & Người thân",
      desc: "Từ vựng về các thành viên trong gia đình.",
    },
    { title: "Số đếm từ 1-20", desc: "Học cách đếm số bằng ngôn ngữ ký hiệu." },
    {
      title: "Màu sắc cơ bản",
      desc: "Các màu sắc thông dụng trong cuộc sống.",
    },
    {
      title: "Ngày tháng & Thời gian",
      desc: "Cách diễn đạt ngày tháng và giờ giấc.",
    },
    { title: "Đồ vật trong nhà", desc: "Từ vựng về các đồ dùng gia đình." },
    { title: "Động vật thường gặp", desc: "Tên các loài động vật phổ biến." },
    { title: "Thức ăn & Đồ uống", desc: "Từ vựng về ẩm thực và nước uống." },
    { title: "Cảm xúc & Trạng thái", desc: "Diễn đạt vui, buồn, giận, sợ..." },
    {
      title: "Phương tiện giao thông",
      desc: "Xe máy, ô tô, xe buýt, máy bay...",
    },
    { title: "Tổng kết & Ôn tập", desc: "Ôn lại tất cả nội dung đã học." },
  ];

  return lessonTopics.map((topic, index) => {
    const lessonId = classId * 100 + index + 1;
    const steps = generateStepsForLesson(lessonId, index);

    return {
      id: lessonId,
      classId,
      title: `Bài ${index + 1}: ${topic.title}`,
      description: topic.desc,
      duration: `${steps.length * 3}:00`,
      order: index + 1,
      completed: index < 2,
      stepsCount: steps.length,
    };
  });
};

// Legacy exam generation removed - using examsData instead

// Generate mock documents for a class
export const generateDocumentsForClass = (classId: number): DocumentItem[] => {
  const docs = [
    { title: "Giáo trình khóa học", type: "pdf" as const, size: "2.5 MB" },
    { title: "Bài tập thực hành tuần 1", type: "pdf" as const, size: "500 KB" },
    {
      title: "Video minh họa - Chào hỏi",
      type: "video" as const,
      size: "150 MB",
    },
    {
      title: "Tài liệu bổ sung - Gia đình",
      type: "doc" as const,
      size: "1.2 MB",
    },
    { title: "Link tham khảo - Từ điển VSL", type: "link" as const },
  ];

  return docs.map((doc, index) => ({
    id: classId * 100 + index + 1,
    classId,
    title: doc.title,
    type: doc.type,
    size: doc.size,
    url: "#",
    uploadedAt: new Date(
      Date.now() - index * 3 * 24 * 60 * 60 * 1000,
    ).toLocaleDateString("vi-VN"),
  }));
};

// Cache for generated data
const lessonsCache: Record<number, LessonItem[]> = {};
const stepsCache: Record<number, StepItem[]> = {};

// Get lessons by class ID
export const getLessonsByClassId = (classId: number): LessonItem[] => {
  if (!lessonsCache[classId]) {
    lessonsCache[classId] = generateLessonsForClass(classId);
  }
  return lessonsCache[classId];
};

// Get lesson by ID
export const getLessonById = (lessonId: number): LessonItem | undefined => {
  const classId = Math.floor(lessonId / 100);
  const lessons = getLessonsByClassId(classId);
  return lessons.find((l) => l.id === lessonId);
};

// Get steps by lesson ID
export const getStepsByLessonId = (lessonId: number): StepItem[] => {
  if (!stepsCache[lessonId]) {
    const lessonOrder = (lessonId % 100) - 1;
    stepsCache[lessonId] = generateStepsForLesson(lessonId, lessonOrder);
  }
  return stepsCache[lessonId];
};

// Get step by ID
export const getStepById = (stepId: number): StepItem | undefined => {
  const lessonId = Math.floor(stepId / 100);
  const steps = getStepsByLessonId(lessonId);
  return steps.find((s) => s.id === stepId);
};

// Get exams by class ID
// Removed duplicate implementation
// export const getExamsByClassId = (classId: number): ExamItem[] => {
//   return generateExamsForClass(classId);
// };

// Get documents by class ID
export const getDocumentsByClassId = (classId: number): DocumentItem[] => {
  return generateDocumentsForClass(classId);
};
