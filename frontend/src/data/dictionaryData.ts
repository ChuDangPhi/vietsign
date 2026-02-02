export interface DictionaryItem {
  id: number;
  word: string;
  category: string;
  videoUrl?: string;
  imageUrl?: string;
  views: number;
  status: string;
  description?: string;
  topicId?: number;
  classId?: number;
  vocabularyType?: string;
}

export const dictionaryItems: DictionaryItem[] = [];

export const categories = [
  { id: "all", label: "Tất cả" },
  { id: "alphabet", label: "Chữ cái" },
  { id: "numbers", label: "Số đếm" },
  { id: "greetings", label: "Chào hỏi" },
  { id: "family", label: "Gia đình" },
  { id: "education", label: "Giáo dục" },
  { id: "daily", label: "Đời sống" },
  { id: "time", label: "Thời gian" },
  { id: "emotion", label: "Cảm xúc" },
  { id: "location", label: "Địa điểm" },
];
