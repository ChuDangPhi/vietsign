// Statistics data

export interface StatItem {
  label: string;
  value: string;
  change: string;
  iconName: string;
  color: string;
}

export interface MonthlyDataItem {
  month: string;
  students: number;
  lessons: number;
}

export const stats: StatItem[] = [
  { label: "Tổng học sinh", value: "2,350", change: "+12%", iconName: "Users", color: "bg-blue-500" },
  { label: "Khóa học hoàn thành", value: "1,245", change: "+8%", iconName: "BookOpen", color: "bg-green-500" },
  { label: "Bài kiểm tra", value: "856", change: "+15%", iconName: "Award", color: "bg-purple-500" },
  { label: "Điểm trung bình", value: "8.2", change: "+0.3", iconName: "TrendingUp", color: "bg-amber-500" },
];

export const monthlyData: MonthlyDataItem[] = [
  { month: "T1", students: 180, lessons: 450 },
  { month: "T2", students: 195, lessons: 520 },
  { month: "T3", students: 210, lessons: 580 },
  { month: "T4", students: 235, lessons: 620 },
  { month: "T5", students: 260, lessons: 680 },
  { month: "T6", students: 290, lessons: 750 },
  { month: "T7", students: 310, lessons: 800 },
  { month: "T8", students: 335, lessons: 850 },
  { month: "T9", students: 360, lessons: 920 },
  { month: "T10", students: 390, lessons: 980 },
  { month: "T11", students: 420, lessons: 1050 },
  { month: "T12", students: 450, lessons: 1120 },
];
