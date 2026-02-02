export interface LearnCategory {
  id: string;
  title: string;
  colorClass: string;
  textClass: string;
  items: LearnItem[];
}

export interface LearnItem {
  id: number;
  title: string;
  subtitle: string;
  progress?: number;
  lessons?: number;
  duration?: string;
  level?: string;
  // Extended properties
  description?: string;
  students?: number;
  rating?: number;
  categoryTitle?: string;
  colorClass?: string;
  lessonsList?: Lesson[];
  videoUrl?: string;
  vocabularyList?: string[];
}

export interface Lesson {
  id: number;
  title: string;
  description: string;
  duration: string;
  videoUrl?: string;
  vocabularyList?: string[];
}

export const learnCategories: LearnCategory[] = [
  {
    id: "topics",
    title: "Chủ đề",
    colorClass: "bg-red-500",
    textClass: "text-red-500",
    items: [
      {
        id: 1,
        title: "Cơ bản",
        subtitle: "Hội thoại ký hiệu theo chủ đề",
        progress: 45,
        lessons: 20,
        duration: "4 giờ",
        level: "Cơ bản",
        description:
          "Khóa học này cung cấp kiến thức cơ bản về ngôn ngữ ký hiệu, giúp bạn làm quen với các bảng chữ cái, số đếm và các câu giao tiếp thông dụng hàng ngày.",
        videoUrl: "https://www.youtube.com/watch?v=DaMjr4AfYA0",
        vocabularyList: [
          "Xin chào",
          "Cảm ơn",
          "Tạm biệt",
          "Xin lỗi",
          "Tôi tên là...",
          "Bạn khỏe không?",
        ],
        lessonsList: [
          {
            id: 1,
            title: "Bảng chữ cái",
            description:
              "Học cách đánh vần bằng ngón tay bảng chữ cái tiếng Việt.",
            duration: "15 phút",
            videoUrl: "https://www.youtube.com/watch?v=DaMjr4AfYA0",
            vocabularyList: [
              "A",
              "B",
              "C",
              "D",
              "Đ",
              "E",
              "G",
              "H",
              "I",
              "K",
              "L",
              "M",
            ],
          },
          {
            id: 2,
            title: "Số đếm",
            description: "Học cách đếm số từ 0 đến 100 bằng ký hiệu tay.",
            duration: "20 phút",
            videoUrl: "https://www.youtube.com/watch?v=DaMjr4AfYA0",
            vocabularyList: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
          },
          {
            id: 3,
            title: "Lời chào hỏi",
            description:
              "Các mẫu câu chào hỏi thông dụng trong giao tiếp hàng ngày.",
            duration: "10 phút",
            videoUrl: "https://www.youtube.com/watch?v=DaMjr4AfYA0",
            vocabularyList: [
              "Chào buổi sáng",
              "Chào buổi trưa",
              "Chào buổi tối",
              "Gặp lại sau",
            ],
          },
        ],
      },
      {
        id: 2,
        title: "Độc thoại: Cấp độ 1",
        subtitle: "Luyện tập hiểu ký hiệu",
        progress: 30,
        lessons: 15,
        duration: "3 giờ",
        level: "Cơ bản",
      },
      {
        id: 3,
        title: "Độc thoại: Cấp độ 2",
        subtitle: "Luyện tập ký hiệu nâng cao",
        progress: 0,
        lessons: 18,
        duration: "4 giờ",
        level: "Trung bình",
      },
      {
        id: 4,
        title: "Hội thoại hàng ngày",
        subtitle: "Giao tiếp trong cuộc sống",
        progress: 60,
        lessons: 25,
        duration: "5 giờ",
        level: "Cơ bản",
      },
      {
        id: 5,
        title: "Ký hiệu công sở",
        subtitle: "Giao tiếp trong môi trường làm việc",
        progress: 0,
        lessons: 12,
        duration: "2.5 giờ",
        level: "Nâng cao",
      },
      {
        id: 6,
        title: "Ký hiệu du lịch",
        subtitle: "Giao tiếp khi đi du lịch",
        progress: 15,
        lessons: 10,
        duration: "2 giờ",
        level: "Trung bình",
      },
    ],
  },
  {
    id: "grammar",
    title: "Ngữ pháp",
    colorClass: "bg-purple-600",
    textClass: "text-purple-600",
    items: [
      {
        id: 7,
        title: "Biểu cảm: Cấp độ 1",
        subtitle: "Cách khuôn mặt hoạt động với câu",
        progress: 80,
        lessons: 10,
        duration: "2 giờ",
        level: "Cơ bản",
      },
      {
        id: 8,
        title: "Biểu cảm: Cấp độ 2",
        subtitle: "Học các loại câu và biểu cảm nâng cao",
        progress: 20,
        lessons: 12,
        duration: "2.5 giờ",
        level: "Trung bình",
      },
      {
        id: 9,
        title: "Cấu trúc câu",
        subtitle: "Học cách sắp xếp ký hiệu trong câu",
        progress: 0,
        lessons: 15,
        duration: "3 giờ",
        level: "Trung bình",
      },
      {
        id: 10,
        title: "Thì trong ký hiệu",
        subtitle: "Diễn đạt thời gian qua ký hiệu",
        progress: 0,
        lessons: 8,
        duration: "1.5 giờ",
        level: "Nâng cao",
      },
      {
        id: 11,
        title: "Câu hỏi và phủ định",
        subtitle: "Cách đặt câu hỏi và phủ định",
        progress: 50,
        lessons: 10,
        duration: "2 giờ",
        level: "Cơ bản",
      },
      {
        id: 12,
        title: "Ngữ pháp nâng cao",
        subtitle: "Các cấu trúc phức tạp",
        progress: 0,
        lessons: 20,
        duration: "4 giờ",
        level: "Nâng cao",
      },
    ],
  },
  {
    id: "tools",
    title: "Công cụ",
    colorClass: "bg-blue-500",
    textClass: "text-blue-500",
    items: [
      {
        id: 13,
        title: "Học tên của tôi",
        subtitle: "Học cách giới thiệu bản thân",
        progress: 100,
        lessons: 5,
        duration: "1 giờ",
        level: "Cơ bản",
      },
      {
        id: 14,
        title: "Trò chơi đánh vần",
        subtitle: "Cải thiện kỹ năng ngón tay",
        progress: 70,
        lessons: 8,
        duration: "1.5 giờ",
        level: "Cơ bản",
      },
      {
        id: 15,
        title: "Ký hiệu của ngày",
        subtitle: "Học từ mới mỗi ngày",
        progress: 25,
        lessons: 30,
        duration: "1 giờ/ngày",
        level: "Tất cả",
      },
      {
        id: 16,
        title: "Từ điển",
        subtitle: "Học những từ mới mỗi ngày",
        progress: 40,
        lessons: 300,
        duration: "Không giới hạn",
        level: "Tất cả",
      },
      {
        id: 17,
        title: "Ôn tập ký hiệu",
        subtitle: "Ôn tập những ký hiệu đã học",
        progress: 55,
        lessons: 50,
        duration: "Tùy chọn",
        level: "Tất cả",
      },
      {
        id: 18,
        title: "Flashcard",
        subtitle: "Học qua thẻ ghi nhớ",
        progress: 35,
        lessons: 100,
        duration: "Không giới hạn",
        level: "Tất cả",
      },
    ],
  },
  {
    id: "practice",
    title: "Thực hành",
    colorClass: "bg-green-500",
    textClass: "text-green-500",
    items: [
      {
        id: 19,
        title: "Luyện tập camera",
        subtitle: "Thực hành với camera nhận diện",
        progress: 10,
        lessons: 20,
        duration: "4 giờ",
        level: "Tất cả",
      },
      {
        id: 20,
        title: "Bài tập tương tác",
        subtitle: "Bài tập có phản hồi ngay",
        progress: 65,
        lessons: 30,
        duration: "6 giờ",
        level: "Cơ bản",
      },
      {
        id: 21,
        title: "Mô phỏng hội thoại",
        subtitle: "Thực hành hội thoại thực tế",
        progress: 0,
        lessons: 15,
        duration: "3 giờ",
        level: "Trung bình",
      },
      {
        id: 22,
        title: "Thử thách hàng tuần",
        subtitle: "Bài tập thử thách mỗi tuần",
        progress: 20,
        lessons: 52,
        duration: "1 giờ/tuần",
        level: "Tất cả",
      },
      {
        id: 23,
        title: "Luyện tập nhóm",
        subtitle: "Thực hành cùng bạn bè",
        progress: 0,
        lessons: 10,
        duration: "Tùy chọn",
        level: "Trung bình",
      },
      {
        id: 24,
        title: "Kiểm tra kỹ năng",
        subtitle: "Đánh giá trình độ hiện tại",
        progress: 40,
        lessons: 5,
        duration: "30 phút",
        level: "Tất cả",
      },
    ],
  },
  {
    id: "specialized",
    title: "Chuyên ngành",
    colorClass: "bg-orange-500",
    textClass: "text-orange-500",
    items: [
      {
        id: 25,
        title: "Ký hiệu y tế",
        subtitle: "Từ vựng và giao tiếp trong y tế",
        progress: 0,
        lessons: 25,
        duration: "5 giờ",
        level: "Chuyên ngành",
      },
      {
        id: 26,
        title: "Ký hiệu giáo dục",
        subtitle: "Từ vựng trong môi trường giáo dục",
        progress: 0,
        lessons: 20,
        duration: "4 giờ",
        level: "Chuyên ngành",
      },
      {
        id: 27,
        title: "Ký hiệu pháp luật",
        subtitle: "Từ vựng trong lĩnh vực pháp luật",
        progress: 0,
        lessons: 18,
        duration: "3.5 giờ",
        level: "Chuyên ngành",
      },
      {
        id: 28,
        title: "Ký hiệu thể thao",
        subtitle: "Từ vựng trong thể thao",
        progress: 0,
        lessons: 15,
        duration: "3 giờ",
        level: "Chuyên ngành",
      },
      {
        id: 29,
        title: "Ký hiệu công nghệ",
        subtitle: "Từ vựng về công nghệ thông tin",
        progress: 0,
        lessons: 22,
        duration: "4.5 giờ",
        level: "Chuyên ngành",
      },
      {
        id: 30,
        title: "Ký hiệu nghệ thuật",
        subtitle: "Từ vựng về nghệ thuật và văn hóa",
        progress: 0,
        lessons: 12,
        duration: "2.5 giờ",
        level: "Chuyên ngành",
      },
    ],
  },
];

export const levelColors: Record<string, string> = {
  "Cơ bản": "text-green-600",
  "Trung bình": "text-yellow-600",
  "Nâng cao": "text-orange-600",
  "Chuyên ngành": "text-purple-600",
  "Tất cả": "text-blue-600",
};
