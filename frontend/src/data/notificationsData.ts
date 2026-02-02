// Notifications data

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  isRead: boolean;
  createdAt: string;
  sender: string;
  link?: string;
}

export const mockNotifications: NotificationItem[] = [
  { id: 1, title: "Lớp học mới đã được tạo", message: "Lớp A3 đã được tạo thành công và sẵn sàng nhận học sinh đăng ký.", type: "info", isRead: false, createdAt: "5 phút trước", sender: "Hệ thống" },
  { id: 2, title: "Bài kiểm tra sắp diễn ra", message: "Kiểm tra cuối kỳ lớp B2 sẽ diễn ra vào ngày 15/01/2025 lúc 9:00.", type: "warning", isRead: false, createdAt: "1 giờ trước", sender: "Admin" },
  { id: 3, title: "Hoàn thành khóa học", message: "Chúc mừng! Bạn đã hoàn thành khóa học Ký hiệu cơ bản A1 với số điểm xuất sắc.", type: "success", isRead: true, createdAt: "Hôm qua", sender: "Hệ thống" },
  { id: 4, title: "Lịch học thay đổi", message: "Lớp A1 sẽ nghỉ học vào ngày 20/01/2025 do giáo viên có việc đột xuất.", type: "error", isRead: true, createdAt: "2 ngày trước", sender: "GV Trần Lan" },
  { id: 5, title: "Học sinh mới đăng ký", message: "Có 5 học sinh mới đăng ký vào lớp B2 trong tuần qua.", type: "info", isRead: true, createdAt: "3 ngày trước", sender: "Hệ thống" },
  { id: 6, title: "Thanh toán thành công", message: "Học phí tháng 1/2025 đã được thanh toán thành công.", type: "success", isRead: false, createdAt: "4 ngày trước", sender: "Kế toán" },
  { id: 7, title: "Cập nhật hệ thống", message: "Hệ thống sẽ bảo trì vào 23:00 ngày 25/01/2025.", type: "warning", isRead: true, createdAt: "5 ngày trước", sender: "IT" },
  { id: 8, title: "Bài tập mới", message: "Giáo viên đã giao bài tập mới cho lớp A1.", type: "info", isRead: false, createdAt: "6 ngày trước", sender: "GV Nguyễn Minh" },
];

export const notificationTypeConfig: Record<string, { iconName: string; bgColor: string; iconColor: string }> = {
  info: { iconName: "Info", bgColor: "bg-blue-100", iconColor: "text-blue-600" },
  warning: { iconName: "AlertTriangle", bgColor: "bg-amber-100", iconColor: "text-amber-600" },
  success: { iconName: "CheckCircle", bgColor: "bg-green-100", iconColor: "text-green-600" },
  error: { iconName: "XCircle", bgColor: "bg-red-100", iconColor: "text-red-600" },
};
