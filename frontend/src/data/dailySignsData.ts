// Daily Signs data - Chỉ lưu ID từ điển cho mỗi ngày
// Thông tin chi tiết của từ được lấy từ dictionaryData
// Lịch từ: 01/12/2025 - 31/03/2026

import { dictionaryItems, type DictionaryItem } from './dictionaryData';

// Interface đơn giản - chỉ lưu ngày và ID từ điển
export interface DailySignEntry {
  date: string;           // Format: YYYY-MM-DD
  dictionaryItemId: number;  // ID của từ trong từ điển
}

// Lịch từ vựng hàng ngày - từ 01/12/2025 đến 31/03/2026
export const dailySignSchedule: DailySignEntry[] = [
  // Tháng 12/2025 - Chào hỏi & Gia đình
  { date: "2025-12-01", dictionaryItemId: 1 },   // Xin chào
  { date: "2025-12-02", dictionaryItemId: 2 },   // Cảm ơn
  { date: "2025-12-03", dictionaryItemId: 3 },   // Tạm biệt
  { date: "2025-12-04", dictionaryItemId: 4 },   // Xin lỗi
  { date: "2025-12-05", dictionaryItemId: 5 },   // Không có gì
  { date: "2025-12-06", dictionaryItemId: 6 },   // Chào buổi sáng
  { date: "2025-12-07", dictionaryItemId: 7 },   // Chào buổi tối
  { date: "2025-12-08", dictionaryItemId: 8 },   // Hẹn gặp lại
  { date: "2025-12-09", dictionaryItemId: 9 },   // Rất vui được gặp
  { date: "2025-12-10", dictionaryItemId: 10 },  // Bạn khỏe không
  { date: "2025-12-11", dictionaryItemId: 11 },  // Tôi khỏe
  { date: "2025-12-12", dictionaryItemId: 12 },  // Làm ơn
  { date: "2025-12-13", dictionaryItemId: 14 },  // Chúc mừng
  { date: "2025-12-14", dictionaryItemId: 16 },  // Tên bạn là gì
  { date: "2025-12-15", dictionaryItemId: 17 },  // Tôi tên là
  { date: "2025-12-16", dictionaryItemId: 21 },  // Gia đình
  { date: "2025-12-17", dictionaryItemId: 22 },  // Bố
  { date: "2025-12-18", dictionaryItemId: 23 },  // Mẹ
  { date: "2025-12-19", dictionaryItemId: 24 },  // Anh trai
  { date: "2025-12-20", dictionaryItemId: 25 },  // Chị gái
  { date: "2025-12-21", dictionaryItemId: 26 },  // Em trai
  { date: "2025-12-22", dictionaryItemId: 27 },  // Em gái
  { date: "2025-12-23", dictionaryItemId: 28 },  // Ông
  { date: "2025-12-24", dictionaryItemId: 29 },  // Bà
  { date: "2025-12-25", dictionaryItemId: 30 },  // Con trai
  { date: "2025-12-26", dictionaryItemId: 31 },  // Con gái
  { date: "2025-12-27", dictionaryItemId: 38 },  // Vợ
  { date: "2025-12-28", dictionaryItemId: 39 },  // Chồng
  { date: "2025-12-29", dictionaryItemId: 40 },  // Con
  { date: "2025-12-30", dictionaryItemId: 41 },  // Bố mẹ
  { date: "2025-12-31", dictionaryItemId: 45 },  // Ông bà

  // Tháng 1/2026 - Giáo dục & Số đếm
  { date: "2026-01-01", dictionaryItemId: 51 },  // Trường học
  { date: "2026-01-02", dictionaryItemId: 52 },  // Giáo viên
  { date: "2026-01-03", dictionaryItemId: 53 },  // Học sinh
  { date: "2026-01-04", dictionaryItemId: 54 },  // Sinh viên
  { date: "2026-01-05", dictionaryItemId: 55 },  // Lớp học
  { date: "2026-01-06", dictionaryItemId: 56 },  // Bài học
  { date: "2026-01-07", dictionaryItemId: 57 },  // Bài tập
  { date: "2026-01-08", dictionaryItemId: 58 },  // Sách
  { date: "2026-01-09", dictionaryItemId: 60 },  // Bút
  { date: "2026-01-10", dictionaryItemId: 63 },  // Thi
  { date: "2026-01-11", dictionaryItemId: 64 },  // Điểm
  { date: "2026-01-12", dictionaryItemId: 67 },  // Học
  { date: "2026-01-13", dictionaryItemId: 68 },  // Đọc
  { date: "2026-01-14", dictionaryItemId: 69 },  // Viết
  { date: "2026-01-15", dictionaryItemId: 70 },  // Nghe
  { date: "2026-01-16", dictionaryItemId: 71 },  // Nói
  { date: "2026-01-17", dictionaryItemId: 72 },  // Hiểu
  { date: "2026-01-18", dictionaryItemId: 84 },  // Đại học
  { date: "2026-01-19", dictionaryItemId: 86 },  // Tốt nghiệp
  { date: "2026-01-20", dictionaryItemId: 92 },  // Một
  { date: "2026-01-21", dictionaryItemId: 93 },  // Hai
  { date: "2026-01-22", dictionaryItemId: 94 },  // Ba
  { date: "2026-01-23", dictionaryItemId: 95 },  // Bốn
  { date: "2026-01-24", dictionaryItemId: 96 },  // Năm
  { date: "2026-01-25", dictionaryItemId: 97 },  // Sáu
  { date: "2026-01-26", dictionaryItemId: 98 },  // Bảy
  { date: "2026-01-27", dictionaryItemId: 99 },  // Tám
  { date: "2026-01-28", dictionaryItemId: 100 }, // Chín
  { date: "2026-01-29", dictionaryItemId: 101 }, // Mười
  { date: "2026-01-30", dictionaryItemId: 108 }, // Một trăm
  { date: "2026-01-31", dictionaryItemId: 109 }, // Một nghìn

  // Tháng 2/2026 - Đời sống & Thời gian
  { date: "2026-02-01", dictionaryItemId: 147 }, // Ăn
  { date: "2026-02-02", dictionaryItemId: 148 }, // Uống
  { date: "2026-02-03", dictionaryItemId: 149 }, // Ngủ
  { date: "2026-02-04", dictionaryItemId: 150 }, // Đi
  { date: "2026-02-05", dictionaryItemId: 151 }, // Chạy
  { date: "2026-02-06", dictionaryItemId: 154 }, // Làm việc
  { date: "2026-02-07", dictionaryItemId: 155 }, // Nghỉ ngơi
  { date: "2026-02-08", dictionaryItemId: 156 }, // Chơi
  { date: "2026-02-09", dictionaryItemId: 157 }, // Xem
  { date: "2026-02-10", dictionaryItemId: 158 }, // Mua
  { date: "2026-02-11", dictionaryItemId: 160 }, // Nấu ăn
  { date: "2026-02-12", dictionaryItemId: 163 }, // Tắm
  { date: "2026-02-13", dictionaryItemId: 166 }, // Đi làm
  { date: "2026-02-14", dictionaryItemId: 167 }, // Về nhà
  { date: "2026-02-15", dictionaryItemId: 171 }, // Gọi điện
  { date: "2026-02-16", dictionaryItemId: 172 }, // Nhắn tin
  { date: "2026-02-17", dictionaryItemId: 181 }, // Thức dậy
  { date: "2026-02-18", dictionaryItemId: 182 }, // Đi ngủ
  { date: "2026-02-19", dictionaryItemId: 183 }, // Ăn sáng
  { date: "2026-02-20", dictionaryItemId: 184 }, // Ăn trưa
  { date: "2026-02-21", dictionaryItemId: 185 }, // Ăn tối
  { date: "2026-02-22", dictionaryItemId: 201 }, // Hôm nay
  { date: "2026-02-23", dictionaryItemId: 202 }, // Hôm qua
  { date: "2026-02-24", dictionaryItemId: 203 }, // Ngày mai
  { date: "2026-02-25", dictionaryItemId: 209 }, // Buổi sáng
  { date: "2026-02-26", dictionaryItemId: 211 }, // Buổi chiều
  { date: "2026-02-27", dictionaryItemId: 212 }, // Buổi tối
  { date: "2026-02-28", dictionaryItemId: 221 }, // Giờ

  // Tháng 3/2026 - Cảm xúc & Địa điểm
  { date: "2026-03-01", dictionaryItemId: 231 }, // Vui
  { date: "2026-03-02", dictionaryItemId: 232 }, // Buồn
  { date: "2026-03-03", dictionaryItemId: 233 }, // Giận
  { date: "2026-03-04", dictionaryItemId: 234 }, // Sợ
  { date: "2026-03-05", dictionaryItemId: 235 }, // Yêu
  { date: "2026-03-06", dictionaryItemId: 237 }, // Thích
  { date: "2026-03-07", dictionaryItemId: 239 }, // Hạnh phúc
  { date: "2026-03-08", dictionaryItemId: 241 }, // Lo lắng
  { date: "2026-03-09", dictionaryItemId: 244 }, // Ngạc nhiên
  { date: "2026-03-10", dictionaryItemId: 246 }, // Hy vọng
  { date: "2026-03-11", dictionaryItemId: 247 }, // Tự tin
  { date: "2026-03-12", dictionaryItemId: 252 }, // Mệt
  { date: "2026-03-13", dictionaryItemId: 253 }, // Khỏe
  { date: "2026-03-14", dictionaryItemId: 254 }, // Đói
  { date: "2026-03-15", dictionaryItemId: 256 }, // Khát
  { date: "2026-03-16", dictionaryItemId: 261 }, // Nhà
  { date: "2026-03-17", dictionaryItemId: 262 }, // Trường
  { date: "2026-03-18", dictionaryItemId: 263 }, // Bệnh viện
  { date: "2026-03-19", dictionaryItemId: 264 }, // Chợ
  { date: "2026-03-20", dictionaryItemId: 265 }, // Siêu thị
  { date: "2026-03-21", dictionaryItemId: 268 }, // Công viên
  { date: "2026-03-22", dictionaryItemId: 269 }, // Nhà hàng
  { date: "2026-03-23", dictionaryItemId: 270 }, // Quán cafe
  { date: "2026-03-24", dictionaryItemId: 271 }, // Rạp phim
  { date: "2026-03-25", dictionaryItemId: 275 }, // Khách sạn
  { date: "2026-03-26", dictionaryItemId: 283 }, // Biển
  { date: "2026-03-27", dictionaryItemId: 284 }, // Núi
  { date: "2026-03-28", dictionaryItemId: 291 }, // Văn phòng
  { date: "2026-03-29", dictionaryItemId: 292 }, // Công ty
  { date: "2026-03-30", dictionaryItemId: 294 }, // Cửa hàng
  { date: "2026-03-31", dictionaryItemId: 121 }, // A (Chữ cái)
];

// ========== Helper Functions ==========

// Lấy thông tin từ điển theo ID
export function getDictionaryItemById(id: number): DictionaryItem | undefined {
  return dictionaryItems.find(item => item.id === id);
}

// Lấy từ vựng theo ngày cụ thể
export function getDailySignByDate(date: string): DictionaryItem | undefined {
  const entry = dailySignSchedule.find(e => e.date === date);
  if (!entry) return undefined;
  return getDictionaryItemById(entry.dictionaryItemId);
}

// Lấy từ vựng hôm nay
export function getTodaySign(): DictionaryItem | undefined {
  const today = new Date().toISOString().split('T')[0];
  return getDailySignByDate(today);
}

// Lấy từ vựng hôm nay hoặc từ đầu tiên nếu không tìm thấy
export function getTodaySignOrDefault(): DictionaryItem {
  const todaySign = getTodaySign();
  if (todaySign) return todaySign;
  
  // Fallback: lấy từ theo ngày gần nhất trong schedule
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  // Tìm ngày gần nhất
  let closestEntry = dailySignSchedule[0];
  let minDiff = Infinity;
  
  for (const entry of dailySignSchedule) {
    const entryDate = new Date(entry.date);
    const diff = Math.abs(today.getTime() - entryDate.getTime());
    if (diff < minDiff) {
      minDiff = diff;
      closestEntry = entry;
    }
  }
  
  return getDictionaryItemById(closestEntry.dictionaryItemId) || dictionaryItems[0];
}

// Lấy danh sách từ vựng gần đây (n ngày trước)
export function getRecentSigns(days: number = 7): DictionaryItem[] {
  const today = new Date();
  const results: DictionaryItem[] = [];
  
  for (let i = 1; i <= days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const sign = getDailySignByDate(dateStr);
    if (sign) {
      results.push(sign);
    }
  }
  
  return results;
}

// Lấy từ vựng sắp tới (n ngày sau)
export function getUpcomingSigns(days: number = 7): DictionaryItem[] {
  const today = new Date();
  const results: DictionaryItem[] = [];
  
  for (let i = 1; i <= days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    const sign = getDailySignByDate(dateStr);
    if (sign) {
      results.push(sign);
    }
  }
  
  return results;
}

// Lấy các từ liên quan (cùng category)
export function getRelatedWords(dictionaryItemId: number, limit: number = 3): DictionaryItem[] {
  const item = getDictionaryItemById(dictionaryItemId);
  if (!item) return [];
  
  return dictionaryItems
    .filter(i => i.category === item.category && i.id !== dictionaryItemId)
    .slice(0, limit);
}

// Lấy từ ngẫu nhiên từ từ điển
export function getRandomDictionaryItem(): DictionaryItem {
  const randomIndex = Math.floor(Math.random() * dictionaryItems.length);
  return dictionaryItems[randomIndex];
}

// Màu sắc theo độ khó (để hiển thị)
export const difficultyColors: Record<string, string> = {
  "Dễ": "bg-green-100 text-green-700",
  "Trung bình": "bg-yellow-100 text-yellow-700",
  "Khó": "bg-orange-100 text-orange-700",
  "Rất khó": "bg-red-100 text-red-700",
};

// Thống kê
export function getDailySignsStats() {
  const categoryCounts: Record<string, number> = {};
  
  dailySignSchedule.forEach(entry => {
    const item = getDictionaryItemById(entry.dictionaryItemId);
    if (item) {
      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    }
  });
  
  return {
    totalScheduled: dailySignSchedule.length,
    startDate: dailySignSchedule[0]?.date,
    endDate: dailySignSchedule[dailySignSchedule.length - 1]?.date,
    categoryCounts,
    totalCategories: Object.keys(categoryCounts).length,
  };
}
