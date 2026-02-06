// Games data - Simplified structure for managing game levels and questions

export interface GameAnswerOption {
  id: string | number;
  text: string;
  isCorrect: boolean;
}

export interface GameQuestion {
  id: number;
  content: string;
  videoUrl?: string;
  imageUrl?: string;
  options?: GameAnswerOption[];
  correctAnswer?: string; // Cho game điền từ/nhập liệu
  timeLimit?: number; // Giới hạn thời gian (giây)
  points?: number;
}

export interface GameLevel {
  level: number;
  difficulty: "Dễ" | "Trung bình" | "Khó";
  detail: string;
  requiredScore?: number; // Điểm cần để qua màn
  questions: GameQuestion[];
}

export interface GameItem {
  id: number;
  name: string;
  description: string;
  levels: GameLevel[];
  icongame: string;
  isActive: boolean;
}

// Mock question data for games
const mockGameQuestions: GameQuestion[] = [
  // Questions for Game 1, Level 1
  {
    id: 1,
    content: "Ký hiệu này có nghĩa là gì?",
    videoUrl:
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    points: 100,
    timeLimit: 15,
    options: [
      { id: "a", text: "Xin chào", isCorrect: true },
      { id: "b", text: "Tạm biệt", isCorrect: false },
      { id: "c", text: "Cảm ơn", isCorrect: false },
      { id: "d", text: "Xin lỗi", isCorrect: false },
    ],
  },
  {
    id: 2,
    content: "Ký hiệu này có nghĩa là gì?",
    videoUrl:
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    points: 100,
    timeLimit: 15,
    options: [
      { id: "a", text: "Ăn cơm", isCorrect: true },
      { id: "b", text: "Uống nước", isCorrect: false },
      { id: "c", text: "Ngủ", isCorrect: false },
      { id: "d", text: "Đi", isCorrect: false },
    ],
  },
  {
    id: 3,
    content: "Ký hiệu này có nghĩa là gì?",
    videoUrl:
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    points: 100,
    timeLimit: 15,
    options: [
      { id: "a", text: "Yêu", isCorrect: false },
      { id: "b", text: "Thích", isCorrect: false },
      { id: "c", text: "Cảm ơn", isCorrect: true },
      { id: "d", text: "Ghét", isCorrect: false },
    ],
  },
];

export const gamesList: GameItem[] = [
  {
    id: 1,
    name: "Đoán từ qua video",
    description:
      "Quan sát video chuyên gia thực hiện thủ ngữ và chọn từ tương ứng. Giúp nhận diện các ký hiệu từ vựng thông dụng trong đời sống.",
    icongame: "/assets/games/guess-video.png",
    isActive: true,
    levels: [
      {
        level: 1,
        difficulty: "Dễ",
        detail:
          "Các từ đơn giản (xin chào, cảm ơn, ăn cơm), tốc độ ký hiệu chậm.",
        requiredScore: 300,
        questions: mockGameQuestions.slice(0, 3),
      },
      {
        level: 2,
        difficulty: "Trung bình",
        detail: "Các từ phức tạp hơn về chủ đề trường học, công việc.",
        requiredScore: 400,
        questions: [],
      },
      {
        level: 3,
        difficulty: "Khó",
        detail:
          "Các câu ngắn hoặc từ ghép, chuyên gia thực hiện ở tốc độ giao tiếp thực tế.",
        requiredScore: 500,
        questions: [],
      },
    ],
  },
  {
    id: 2,
    name: "Đoán từ qua hình ảnh",
    description:
      "Quan sát hình ảnh minh họa và chọn từ tương ứng. Giúp nhận diện ý nghĩa của từ qua hình ảnh trực quan.",
    icongame: "/assets/games/memory-match.png", // Tạm dùng icon này
    isActive: true,
    levels: [
      {
        level: 1,
        difficulty: "Dễ",
        detail:
          "Các từ đơn giản (xin chào, cảm ơn, ăn cơm), tốc độ ký hiệu chậm.",
        requiredScore: 300,
        questions: mockGameQuestions.slice(0, 3),
      },
      {
        level: 2,
        difficulty: "Trung bình",
        detail: "Các từ phức tạp hơn về chủ đề trường học, công việc.",
        requiredScore: 400,
        questions: [],
      },
      {
        level: 3,
        difficulty: "Khó",
        detail:
          "Các câu ngắn hoặc từ ghép, chuyên gia thực hiện ở tốc độ giao tiếp thực tế.",
        requiredScore: 500,
        questions: [],
      },
    ],
  },
  {
    id: 3,
    name: "Lật bài trí nhớ",
    description:
      "Tìm cặp bài trùng khớp giữa hình ảnh minh họa và ký hiệu thủ ngữ. Rèn luyện khả năng ghi nhớ hình ảnh và ý nghĩa từ vựng.",
    icongame: "/assets/games/memory-match.png",
    isActive: true,
    levels: [
      {
        level: 1,
        difficulty: "Dễ",
        detail: "Lưới 2x3 (3 cặp), không giới hạn thời gian.",
        requiredScore: 300,
        questions: [],
      },
      {
        level: 2,
        difficulty: "Trung bình",
        detail: "Lưới 3x4 (6 cặp), giới hạn 60 giây.",
        requiredScore: 400,
        questions: [],
      },
      {
        level: 3,
        difficulty: "Khó",
        detail:
          "Lưới 4x5 (10 cặp), giới hạn thời gian và có các thẻ gây nhiễu.",
        requiredScore: 500,
        questions: [],
      },
    ],
  },
  {
    id: 4,
    name: "Thử thách Đánh vần",
    description:
      "Hệ thống hiển thị chuỗi hình ảnh các chữ cái ngón tay tạo thành một từ hoàn chỉnh. Người chơi nhìn hình và nhập lại từ đó bằng bàn phím.",
    icongame: "/assets/games/spelling-bee.png",
    isActive: true,
    levels: [
      {
        level: 1,
        difficulty: "Dễ",
        detail:
          "Từ có 2-3 chữ cái (VÍ, XE, CÁ), các hình ảnh hiện cùng một lúc.",
        requiredScore: 300,
        questions: [],
      },
      {
        level: 2,
        difficulty: "Trung bình",
        detail:
          "Từ có 4-5 chữ cái (SÁCH, BÀN), hình ảnh hiện lần lượt từng chữ.",
        requiredScore: 400,
        questions: [],
      },
      {
        level: 3,
        difficulty: "Khó",
        detail:
          "Từ dài trên 6 chữ cái (TRƯỜNG, THỦ NGỮ), tốc độ chuyển hình ảnh nhanh.",
        requiredScore: 500,
        questions: [],
      },
    ],
  },
];

// Helper functions
export function getGameById(id: number): GameItem | undefined {
  return gamesList.find((g) => g.id === id);
}

export function getAllGames(): GameItem[] {
  return gamesList;
}

export function getActiveGames(): GameItem[] {
  return gamesList.filter((g) => g.isActive);
}

export function getGameLevel(
  gameId: number,
  level: number,
): GameLevel | undefined {
  const game = getGameById(gameId);
  if (!game) return undefined;
  return game.levels.find((l) => l.level === level);
}

export function getGamesStats() {
  return {
    totalGames: gamesList.length,
    totalLevels: gamesList.reduce((sum, g) => sum + g.levels.length, 0),
    activeGames: gamesList.filter((g) => g.isActive).length,
  };
}

export const difficultyConfig: Record<string, { color: string }> = {
  Dễ: { color: "bg-green-100 text-green-700" },
  "Trung bình": { color: "bg-yellow-100 text-yellow-700" },
  Khó: { color: "bg-red-100 text-red-700" },
};
