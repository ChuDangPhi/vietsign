// Messages data - Dữ liệu tin nhắn

export interface Conversation {
  id: string | number;
  participants: number[]; // Array of user IDs
  type: "private" | "group";
  name?: string; // For group chats
  avatar?: string;
  lastMessageId?: string | number; // Updated type
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string | number;
  conversationId: string | number;
  senderId: number;
  content: string;
  type: "text" | "image" | "file" | "video";
  attachments?: MessageAttachment[];
  status: "sending" | "sent" | "delivered" | "read";
  createdAt: string;
  replyToId?: string | number;
}

export interface MessageAttachment {
  id: string | number;
  name: string;
  url: string;
  type: "image" | "file" | "video";
  size: number;
}

export interface UserOnlineStatus {
  userId: number;
  isOnline: boolean;
  lastSeen?: string;
}

// Mock conversations
export const mockConversations: Conversation[] = [
  {
    id: 1,
    participants: [1, 3], // Admin và Giáo viên
    type: "private",
    unreadCount: 2,
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2024-01-20T10:30:00Z",
  },
  {
    id: 2,
    participants: [1, 4], // Admin và Học sinh
    type: "private",
    unreadCount: 0,
    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2024-01-19T09:15:00Z",
  },
  {
    id: 3,
    participants: [1, 6], // Admin và Giáo viên Hoa
    type: "private",
    unreadCount: 0,
    createdAt: "2024-01-12T14:00:00Z",
    updatedAt: "2024-01-18T16:00:00Z",
  },
  {
    id: 4,
    participants: [1, 7], // Admin và Học sinh Tùng
    type: "private",
    unreadCount: 5,
    createdAt: "2024-01-08T11:00:00Z",
    updatedAt: "2024-01-17T11:20:00Z",
  },
  {
    id: 5,
    participants: [1, 3, 4, 6, 7], // Nhóm lớp
    type: "group",
    name: "Nhóm Lớp Ngôn Ngữ Ký Hiệu A1",
    unreadCount: 10,
    createdAt: "2024-01-05T10:00:00Z",
    updatedAt: "2024-01-20T08:00:00Z",
  },
  {
    id: 6,
    participants: [1, 2], // Admin và Quản lý
    type: "private",
    unreadCount: 0,
    createdAt: "2024-01-01T08:00:00Z",
    updatedAt: "2024-01-16T14:30:00Z",
  },
  {
    id: 7,
    participants: [1, 8], // Admin và Manager Lan
    type: "private",
    unreadCount: 3,
    createdAt: "2024-01-14T09:00:00Z",
    updatedAt: "2024-01-20T11:00:00Z",
  },
  {
    id: 8,
    participants: [1, 3, 6], // Nhóm giáo viên
    type: "group",
    name: "Nhóm Giáo Viên",
    unreadCount: 0,
    createdAt: "2024-01-02T10:00:00Z",
    updatedAt: "2024-01-19T17:00:00Z",
  },
];

// Mock messages
export const mockMessages: Message[] = [
  // Conversation 1: Admin và Giáo viên - Cuộc trò chuyện dài về lịch học và phương pháp giảng dạy
  {
    id: 1,
    conversationId: 1,
    senderId: 3,
    content: "Chào Admin! 👋",
    type: "text",
    status: "read",
    createdAt: "2024-01-20T09:00:00Z",
  },
  {
    id: 2,
    conversationId: 1,
    senderId: 1,
    content: "Chào thầy! Có việc gì không ạ?",
    type: "text",
    status: "read",
    createdAt: "2024-01-20T09:02:00Z",
  },
  {
    id: 3,
    conversationId: 1,
    senderId: 3,
    content: "Tôi muốn hỏi về lịch học tuần tới. Có thay đổi gì không?",
    type: "text",
    status: "read",
    createdAt: "2024-01-20T09:05:00Z",
  },
  {
    id: 4,
    conversationId: 1,
    senderId: 1,
    content:
      "Dạ, tuần tới lịch học vẫn giữ nguyên như bình thường ạ. Thứ 2, 4, 6 từ 8h-10h.",
    type: "text",
    status: "read",
    createdAt: "2024-01-20T09:08:00Z",
  },
  {
    id: 5,
    conversationId: 1,
    senderId: 3,
    content: "Tốt quá! Vậy thứ 5 có buổi bổ sung không nhỉ?",
    type: "text",
    status: "read",
    createdAt: "2024-01-20T09:10:00Z",
  },
  {
    id: 6,
    conversationId: 1,
    senderId: 1,
    content:
      "Dạ có ạ! Thứ 5 tuần tới có buổi ôn tập từ 14h-16h. Em đã thêm vào lịch rồi.",
    type: "text",
    status: "read",
    createdAt: "2024-01-20T09:12:00Z",
  },
  {
    id: 7,
    conversationId: 1,
    senderId: 3,
    content:
      "Cảm ơn bạn! Còn một việc nữa, tôi muốn đề xuất thêm nội dung về ký hiệu y tế vào chương trình.",
    type: "text",
    status: "read",
    createdAt: "2024-01-20T09:15:00Z",
  },
  {
    id: 8,
    conversationId: 1,
    senderId: 1,
    content:
      "Ý tưởng hay đó thầy! 👏 Em sẽ trình bày với ban quản lý. Thầy có thể gửi outline không ạ?",
    type: "text",
    status: "read",
    createdAt: "2024-01-20T09:18:00Z",
  },
  {
    id: 9,
    conversationId: 1,
    senderId: 3,
    content: "Tôi sẽ soạn và gửi qua email trong chiều nay.",
    type: "text",
    status: "read",
    createdAt: "2024-01-20T09:20:00Z",
  },
  {
    id: 10,
    conversationId: 1,
    senderId: 1,
    content: "Dạ vâng ạ! Em chờ email của thầy.",
    type: "text",
    status: "read",
    createdAt: "2024-01-20T09:22:00Z",
  },
  {
    id: 11,
    conversationId: 1,
    senderId: 3,
    content:
      "À còn nữa, các học sinh lớp A1 tiến bộ rất nhanh. Có em nào muốn học nâng cao không?",
    type: "text",
    status: "read",
    createdAt: "2024-01-20T09:25:00Z",
  },
  {
    id: 12,
    conversationId: 1,
    senderId: 1,
    content:
      "Dạ có khoảng 5 em đăng ký lớp nâng cao rồi ạ. Thầy có thể mở lớp vào tháng sau.",
    type: "text",
    status: "read",
    createdAt: "2024-01-20T09:28:00Z",
  },
  {
    id: 13,
    conversationId: 1,
    senderId: 3,
    content: "Tuyệt vời! Vậy tôi sẽ chuẩn bị giáo án cho lớp nâng cao.",
    type: "text",
    status: "read",
    createdAt: "2024-01-20T09:30:00Z",
  },
  {
    id: 14,
    conversationId: 1,
    senderId: 1,
    content: "Dạ cảm ơn thầy nhiều ạ! 🙏",
    type: "text",
    status: "read",
    createdAt: "2024-01-20T09:32:00Z",
  },
  {
    id: 15,
    conversationId: 1,
    senderId: 3,
    content: "Bạn kiểm tra giúp tôi phòng học ngày mai có trống không nhé?",
    type: "text",
    status: "delivered",
    createdAt: "2024-01-20T10:30:00Z",
  },
  {
    id: 16,
    conversationId: 1,
    senderId: 3,
    content: "Tôi cần phòng có máy chiếu để dạy bài mới.",
    type: "text",
    status: "delivered",
    createdAt: "2024-01-20T10:31:00Z",
  },

  // Conversation 2: Admin và Học sinh - Cuộc trò chuyện về bài tập và học tập
  {
    id: 17,
    conversationId: 2,
    senderId: 4,
    content: "Chào admin! Em muốn hỏi về bài tập ạ 📚",
    type: "text",
    status: "read",
    createdAt: "2024-01-19T08:00:00Z",
  },
  {
    id: 18,
    conversationId: 2,
    senderId: 1,
    content: "Chào em! Em cần hỏi bài tập gì?",
    type: "text",
    status: "read",
    createdAt: "2024-01-19T08:05:00Z",
  },
  {
    id: 19,
    conversationId: 2,
    senderId: 4,
    content:
      'Em không hiểu bài số 3 về ký hiệu chào hỏi ạ. Phần "Xin chào" em làm mãi không đúng.',
    type: "text",
    status: "read",
    createdAt: "2024-01-19T08:08:00Z",
  },
  {
    id: 20,
    conversationId: 2,
    senderId: 1,
    content:
      "Phần đó hơi khó đúng không? Em cần chú ý vị trí tay và hướng bàn tay nhé.",
    type: "text",
    status: "read",
    createdAt: "2024-01-19T08:12:00Z",
  },
  {
    id: 21,
    conversationId: 2,
    senderId: 4,
    content: "Dạ em đã thử nhiều lần rồi nhưng vẫn không giống video mẫu 😅",
    type: "text",
    status: "read",
    createdAt: "2024-01-19T08:15:00Z",
  },
  {
    id: 22,
    conversationId: 2,
    senderId: 1,
    content:
      "Em thử quay video và gửi cho thầy/cô giáo xem nhé. Họ sẽ chỉ cho em chỗ cần sửa.",
    type: "text",
    status: "read",
    createdAt: "2024-01-19T08:18:00Z",
  },
  {
    id: 23,
    conversationId: 2,
    senderId: 4,
    content: "Dạ ý hay đó ạ! Em sẽ quay và gửi ngay.",
    type: "text",
    status: "read",
    createdAt: "2024-01-19T08:20:00Z",
  },
  {
    id: 24,
    conversationId: 2,
    senderId: 1,
    content: "Ừ, cố lên em nhé! Có gì thắc mắc cứ hỏi 💪",
    type: "text",
    status: "read",
    createdAt: "2024-01-19T08:22:00Z",
  },
  {
    id: 25,
    conversationId: 2,
    senderId: 4,
    content: "Dạ cảm ơn anh/chị nhiều ạ!",
    type: "text",
    status: "read",
    createdAt: "2024-01-19T08:25:00Z",
  },
  {
    id: 26,
    conversationId: 2,
    senderId: 4,
    content: "À anh/chị ơi, khi nào thì có kết quả bài kiểm tra tuần trước ạ?",
    type: "text",
    status: "read",
    createdAt: "2024-01-19T08:28:00Z",
  },
  {
    id: 27,
    conversationId: 2,
    senderId: 1,
    content: "Kết quả sẽ có trong tuần này, khoảng thứ 4 hoặc thứ 5 nhé em.",
    type: "text",
    status: "read",
    createdAt: "2024-01-19T08:32:00Z",
  },
  {
    id: 28,
    conversationId: 2,
    senderId: 4,
    content: "Dạ em hiểu rồi ạ. Cảm ơn anh/chị! 🙏",
    type: "text",
    status: "read",
    createdAt: "2024-01-19T08:35:00Z",
  },
  {
    id: 29,
    conversationId: 2,
    senderId: 1,
    content: "Không có gì em! Chúc em học tốt nhé! 📖✨",
    type: "text",
    status: "read",
    createdAt: "2024-01-19T09:15:00Z",
  },

  // Conversation 3: Admin và Giáo viên Hoa - Cuộc trò chuyện về quyền truy cập và hệ thống
  {
    id: 30,
    conversationId: 3,
    senderId: 6,
    content: "Chào admin, tôi gặp vấn đề với tài khoản",
    type: "text",
    status: "read",
    createdAt: "2024-01-18T14:00:00Z",
  },
  {
    id: 31,
    conversationId: 3,
    senderId: 1,
    content: "Chào cô! Cô gặp vấn đề gì ạ?",
    type: "text",
    status: "read",
    createdAt: "2024-01-18T14:05:00Z",
  },
  {
    id: 32,
    conversationId: 3,
    senderId: 6,
    content:
      'Tôi không thể truy cập được phần quản lý lớp học. Nó báo "Không có quyền truy cập".',
    type: "text",
    status: "read",
    createdAt: "2024-01-18T14:08:00Z",
  },
  {
    id: 33,
    conversationId: 3,
    senderId: 1,
    content:
      "Để em kiểm tra ngay ạ. Cô cho em biết email đăng nhập được không?",
    type: "text",
    status: "read",
    createdAt: "2024-01-18T14:10:00Z",
  },
  {
    id: 34,
    conversationId: 3,
    senderId: 6,
    content: "Email là hoa.nguyen@vietsign.edu.vn",
    type: "text",
    status: "read",
    createdAt: "2024-01-18T14:12:00Z",
  },
  {
    id: 35,
    conversationId: 3,
    senderId: 1,
    content:
      "Em thấy rồi ạ. Có vẻ quyền Teacher của cô bị thiếu. Em sẽ cập nhật ngay.",
    type: "text",
    status: "read",
    createdAt: "2024-01-18T14:20:00Z",
  },
  {
    id: 36,
    conversationId: 3,
    senderId: 6,
    content: "Cảm ơn bạn! Tôi chờ nhé.",
    type: "text",
    status: "read",
    createdAt: "2024-01-18T14:22:00Z",
  },
  {
    id: 37,
    conversationId: 3,
    senderId: 1,
    content: "Em đã cập nhật quyền truy cập cho cô rồi ạ! ✅",
    type: "text",
    status: "read",
    createdAt: "2024-01-18T14:30:00Z",
  },
  {
    id: 38,
    conversationId: 3,
    senderId: 1,
    content: "Cô thử đăng xuất rồi đăng nhập lại xem có được chưa ạ.",
    type: "text",
    status: "read",
    createdAt: "2024-01-18T14:31:00Z",
  },
  {
    id: 39,
    conversationId: 3,
    senderId: 6,
    content:
      "Được rồi! Tôi vào được phần quản lý lớp học rồi. Cảm ơn bạn nhiều! 🎉",
    type: "text",
    status: "read",
    createdAt: "2024-01-18T14:40:00Z",
  },
  {
    id: 40,
    conversationId: 3,
    senderId: 1,
    content: "Dạ không có gì ạ! Nếu có vấn đề gì khác cô cứ nhắn em nhé.",
    type: "text",
    status: "read",
    createdAt: "2024-01-18T14:42:00Z",
  },
  {
    id: 41,
    conversationId: 3,
    senderId: 6,
    content: "Ok bạn! Chúc bạn cuối tuần vui vẻ! 😊",
    type: "text",
    status: "read",
    createdAt: "2024-01-18T16:00:00Z",
  },

  // Conversation 4: Admin và Học sinh Tùng - Cuộc trò chuyện về bài học và ký hiệu
  {
    id: 42,
    conversationId: 4,
    senderId: 7,
    content: "Anh ơi em chào anh ạ! 👋",
    type: "text",
    status: "read",
    createdAt: "2024-01-17T10:00:00Z",
  },
  {
    id: 43,
    conversationId: 4,
    senderId: 1,
    content: "Chào em Tùng! Có việc gì không em?",
    type: "text",
    status: "read",
    createdAt: "2024-01-17T10:05:00Z",
  },
  {
    id: 44,
    conversationId: 4,
    senderId: 7,
    content:
      "Anh ơi, cho em hỏi về bài học số 5. Em không hiểu phần ký hiệu số đếm ạ.",
    type: "text",
    status: "read",
    createdAt: "2024-01-17T10:08:00Z",
  },
  {
    id: 45,
    conversationId: 4,
    senderId: 1,
    content:
      "Phần số đếm có hơi khó với người mới học đúng không? Em đang bị stuck ở số mấy?",
    type: "text",
    status: "read",
    createdAt: "2024-01-17T10:12:00Z",
  },
  {
    id: 46,
    conversationId: 4,
    senderId: 7,
    content: "Dạ em bị stuck từ số 6 trở đi ạ. Tay em cứ bị lóng ngóng 😅",
    type: "text",
    status: "read",
    createdAt: "2024-01-17T10:15:00Z",
  },
  {
    id: 47,
    conversationId: 4,
    senderId: 1,
    content:
      "À, số 6-10 dùng hai tay nên có hơi phức tạp. Em xem thêm video slow motion nhé.",
    type: "text",
    status: "read",
    createdAt: "2024-01-17T10:18:00Z",
  },
  {
    id: 48,
    conversationId: 4,
    senderId: 7,
    content: "Dạ có video slow motion không anh? Em tìm không thấy ạ.",
    type: "text",
    status: "read",
    createdAt: "2024-01-17T10:20:00Z",
  },
  {
    id: 49,
    conversationId: 4,
    senderId: 1,
    content:
      'Có em nhé! Em vào phần "Từ điển" → chọn mục "Số đếm" → mỗi video đều có chế độ slow.',
    type: "text",
    status: "read",
    createdAt: "2024-01-17T10:25:00Z",
  },
  {
    id: 50,
    conversationId: 4,
    senderId: 7,
    content: "Ồ em thấy rồi ạ! Cảm ơn anh nhiều! 🙏",
    type: "text",
    status: "read",
    createdAt: "2024-01-17T10:30:00Z",
  },
  {
    id: 51,
    conversationId: 4,
    senderId: 1,
    content: "Không có gì em! Cố gắng lên nhé 💪",
    type: "text",
    status: "read",
    createdAt: "2024-01-17T10:32:00Z",
  },
  {
    id: 52,
    conversationId: 4,
    senderId: 7,
    content: "Anh ơi em có thể hỏi thêm một câu nữa được không ạ?",
    type: "text",
    status: "delivered",
    createdAt: "2024-01-17T11:00:00Z",
  },
  {
    id: 53,
    conversationId: 4,
    senderId: 7,
    content:
      "Bao giờ thì có lớp học trực tiếp lại ạ? Em muốn được thầy cô hướng dẫn tay trực tiếp.",
    type: "text",
    status: "delivered",
    createdAt: "2024-01-17T11:05:00Z",
  },
  {
    id: 54,
    conversationId: 4,
    senderId: 7,
    content: "Em thấy học online khó theo dõi quá ạ.",
    type: "text",
    status: "delivered",
    createdAt: "2024-01-17T11:10:00Z",
  },
  {
    id: 55,
    conversationId: 4,
    senderId: 7,
    content: "Cảm ơn anh trước ạ!",
    type: "text",
    status: "delivered",
    createdAt: "2024-01-17T11:15:00Z",
  },
  {
    id: 56,
    conversationId: 4,
    senderId: 7,
    content: "🙏",
    type: "text",
    status: "delivered",
    createdAt: "2024-01-17T11:20:00Z",
  },

  // Conversation 5: Nhóm lớp - Cuộc thảo luận về bài học và lịch học
  {
    id: 57,
    conversationId: 5,
    senderId: 3,
    content: "Chào các em! 🌟",
    type: "text",
    status: "read",
    createdAt: "2024-01-20T07:00:00Z",
  },
  {
    id: 58,
    conversationId: 5,
    senderId: 3,
    content:
      "Tuần này chúng ta sẽ học về ký hiệu gia đình nhé. Đây là chủ đề rất quan trọng!",
    type: "text",
    status: "read",
    createdAt: "2024-01-20T07:02:00Z",
  },
  {
    id: 59,
    conversationId: 5,
    senderId: 4,
    content: "Dạ vâng ạ! Em rất mong chờ ạ 👋",
    type: "text",
    status: "read",
    createdAt: "2024-01-20T07:10:00Z",
  },
  {
    id: 60,
    conversationId: 5,
    senderId: 7,
    content: 'Em đã xem trước video rồi ạ. Ký hiệu "Bố" và "Mẹ" khá dễ nhớ!',
    type: "text",
    status: "read",
    createdAt: "2024-01-20T07:15:00Z",
  },
  {
    id: 61,
    conversationId: 5,
    senderId: 6,
    content: "Giỏi lắm Tùng! Các em khác cũng nên xem trước video nhé.",
    type: "text",
    status: "read",
    createdAt: "2024-01-20T07:18:00Z",
  },
  {
    id: 62,
    conversationId: 5,
    senderId: 4,
    content:
      'Dạ em cũng đã xem rồi ạ. Ký hiệu "Anh/Chị" em thấy hơi khó phân biệt 😅',
    type: "text",
    status: "read",
    createdAt: "2024-01-20T07:22:00Z",
  },
  {
    id: 63,
    conversationId: 5,
    senderId: 3,
    content:
      "Phần đó thầy sẽ giảng kỹ trong buổi học. Chủ yếu là khác biệt về vị trí tay.",
    type: "text",
    status: "read",
    createdAt: "2024-01-20T07:25:00Z",
  },
  {
    id: 64,
    conversationId: 5,
    senderId: 1,
    content: "Các em nhớ vào đúng giờ nhé! Buổi học bắt đầu lúc 8h sáng mai.",
    type: "text",
    status: "read",
    createdAt: "2024-01-20T07:30:00Z",
  },
  {
    id: 65,
    conversationId: 5,
    senderId: 7,
    content: "Dạ em sẽ vào đúng giờ ạ! ⏰",
    type: "text",
    status: "read",
    createdAt: "2024-01-20T07:32:00Z",
  },
  {
    id: 66,
    conversationId: 5,
    senderId: 4,
    content: "Em cũng vậy ạ! 🙋‍♀️",
    type: "text",
    status: "read",
    createdAt: "2024-01-20T07:35:00Z",
  },
  {
    id: 67,
    conversationId: 5,
    senderId: 6,
    content:
      "Các em nhớ chuẩn bị trước vở ghi chép và điện thoại để quay video thực hành nhé!",
    type: "text",
    status: "read",
    createdAt: "2024-01-20T07:40:00Z",
  },
  {
    id: 68,
    conversationId: 5,
    senderId: 3,
    content:
      "À đúng rồi! Buổi học có phần thực hành quay video. Mọi người chuẩn bị sẵn.",
    type: "text",
    status: "read",
    createdAt: "2024-01-20T07:45:00Z",
  },
  {
    id: 69,
    conversationId: 5,
    senderId: 4,
    content: "Dạ em hiểu rồi ạ! 📱",
    type: "text",
    status: "read",
    createdAt: "2024-01-20T07:48:00Z",
  },
  {
    id: 70,
    conversationId: 5,
    senderId: 7,
    content: "Thầy ơi, nếu không có người quay video giúp thì sao ạ?",
    type: "text",
    status: "read",
    createdAt: "2024-01-20T07:52:00Z",
  },
  {
    id: 71,
    conversationId: 5,
    senderId: 3,
    content:
      "Em có thể dùng giá đỡ điện thoại hoặc dựa vào đồ vật để quay. Thầy sẽ hướng dẫn thêm.",
    type: "text",
    status: "read",
    createdAt: "2024-01-20T07:55:00Z",
  },
  {
    id: 72,
    conversationId: 5,
    senderId: 6,
    content: "Các em nhớ ôn bài nhé! Hẹn gặp mai! 👋",
    type: "text",
    status: "delivered",
    createdAt: "2024-01-20T08:00:00Z",
  },

  // Conversation 6: Admin và Quản lý - Cuộc thảo luận về báo cáo và công việc
  {
    id: 73,
    conversationId: 6,
    senderId: 2,
    content: "Chào bạn! Báo cáo tháng này đã hoàn thành.",
    type: "text",
    status: "read",
    createdAt: "2024-01-16T13:00:00Z",
  },
  {
    id: 74,
    conversationId: 6,
    senderId: 1,
    content: "Cảm ơn chị! Chị gửi em file nhé.",
    type: "text",
    status: "read",
    createdAt: "2024-01-16T13:05:00Z",
  },
  {
    id: 75,
    conversationId: 6,
    senderId: 2,
    content:
      "Mình đã gửi qua email rồi. Có số liệu học sinh mới và thống kê lớp học.",
    type: "text",
    status: "read",
    createdAt: "2024-01-16T13:10:00Z",
  },
  {
    id: 76,
    conversationId: 6,
    senderId: 1,
    content: "Em nhận được rồi ạ! Tháng này tăng 15% học sinh mới, tốt quá!",
    type: "text",
    status: "read",
    createdAt: "2024-01-16T13:20:00Z",
  },
  {
    id: 77,
    conversationId: 6,
    senderId: 2,
    content:
      "Đúng vậy! Chương trình marketing trên mạng xã hội đang hiệu quả. 📈",
    type: "text",
    status: "read",
    createdAt: "2024-01-16T13:25:00Z",
  },
  {
    id: 78,
    conversationId: 6,
    senderId: 1,
    content: "Chị có đề xuất gì cho tháng tới không ạ?",
    type: "text",
    status: "read",
    createdAt: "2024-01-16T13:28:00Z",
  },
  {
    id: 79,
    conversationId: 6,
    senderId: 2,
    content:
      "Mình nghĩ nên mở thêm lớp buổi tối vì nhiều người đi làm muốn học nhưng không có thời gian.",
    type: "text",
    status: "read",
    createdAt: "2024-01-16T13:32:00Z",
  },
  {
    id: 80,
    conversationId: 6,
    senderId: 1,
    content: "Ý hay đó ạ! Em sẽ đưa vào cuộc họp tuần sau.",
    type: "text",
    status: "read",
    createdAt: "2024-01-16T13:35:00Z",
  },
  {
    id: 81,
    conversationId: 6,
    senderId: 2,
    content: "Ok! Cảm ơn bạn. Có gì cần thì nhắn mình nhé.",
    type: "text",
    status: "read",
    createdAt: "2024-01-16T14:30:00Z",
  },

  // Conversation 7: Admin và Manager Lan - Cuộc thảo luận về cơ sở và nhân sự
  {
    id: 82,
    conversationId: 7,
    senderId: 8,
    content: "Chào admin! 👋",
    type: "text",
    status: "read",
    createdAt: "2024-01-20T09:30:00Z",
  },
  {
    id: 83,
    conversationId: 7,
    senderId: 1,
    content: "Chào chị Lan! Có việc gì không ạ?",
    type: "text",
    status: "read",
    createdAt: "2024-01-20T09:35:00Z",
  },
  {
    id: 84,
    conversationId: 7,
    senderId: 8,
    content: "Cơ sở 2 đang gặp vấn đề về nhân sự. Cần thêm giáo viên gấp!",
    type: "text",
    status: "read",
    createdAt: "2024-01-20T09:38:00Z",
  },
  {
    id: 85,
    conversationId: 7,
    senderId: 1,
    content: "Hiện tại cơ sở 2 có bao nhiêu giáo viên ạ?",
    type: "text",
    status: "read",
    createdAt: "2024-01-20T09:42:00Z",
  },
  {
    id: 86,
    conversationId: 7,
    senderId: 8,
    content:
      "Chỉ có 2 giáo viên mà học sinh đông quá. Hiện có 45 học sinh, lớp học quá tải.",
    type: "text",
    status: "read",
    createdAt: "2024-01-20T09:45:00Z",
  },
  {
    id: 87,
    conversationId: 7,
    senderId: 1,
    content:
      "Vậy là tỷ lệ 1:22 rồi, cao quá. Em sẽ báo cáo và đề xuất điều chuyển.",
    type: "text",
    status: "read",
    createdAt: "2024-01-20T09:50:00Z",
  },
  {
    id: 88,
    conversationId: 7,
    senderId: 8,
    content:
      "Cảm ơn bạn! Cố gắng xử lý sớm nhé, các giáo viên đang rất vất vả.",
    type: "text",
    status: "read",
    createdAt: "2024-01-20T09:55:00Z",
  },
  {
    id: 89,
    conversationId: 7,
    senderId: 8,
    content:
      "À còn nữa, phòng học số 3 cần sửa máy chiếu, bạn báo bộ phận kỹ thuật giúp nhé.",
    type: "text",
    status: "delivered",
    createdAt: "2024-01-20T10:30:00Z",
  },
  {
    id: 90,
    conversationId: 7,
    senderId: 8,
    content: "Máy chiếu bị mờ, không hiển thị được video rõ ràng.",
    type: "text",
    status: "delivered",
    createdAt: "2024-01-20T10:45:00Z",
  },
  {
    id: 91,
    conversationId: 7,
    senderId: 8,
    content: "Admin xem xét điều chuyển được không ạ?",
    type: "text",
    status: "delivered",
    createdAt: "2024-01-20T11:00:00Z",
  },

  // Conversation 8: Nhóm giáo viên - Cuộc họp và thảo luận chuyên môn
  {
    id: 92,
    conversationId: 8,
    senderId: 3,
    content: "Các thầy cô ơi! 👋",
    type: "text",
    status: "read",
    createdAt: "2024-01-19T14:00:00Z",
  },
  {
    id: 93,
    conversationId: 8,
    senderId: 3,
    content: "Cuối tuần này có họp chuyên môn không nhỉ?",
    type: "text",
    status: "read",
    createdAt: "2024-01-19T14:02:00Z",
  },
  {
    id: 94,
    conversationId: 8,
    senderId: 6,
    content: "Có, đã lên lịch rồi mà. Lúc 2h chiều thứ 7 nhé!",
    type: "text",
    status: "read",
    createdAt: "2024-01-19T14:10:00Z",
  },
  {
    id: 95,
    conversationId: 8,
    senderId: 3,
    content: "À đúng rồi, mình quên mất. Họp ở đâu vậy?",
    type: "text",
    status: "read",
    createdAt: "2024-01-19T14:15:00Z",
  },
  {
    id: 96,
    conversationId: 8,
    senderId: 6,
    content: "Họp online qua Zoom. Link mình sẽ gửi trước 30 phút.",
    type: "text",
    status: "read",
    createdAt: "2024-01-19T14:20:00Z",
  },
  {
    id: 97,
    conversationId: 8,
    senderId: 1,
    content:
      "Mình đã gửi email thông báo rồi ạ! Trong email có link Zoom luôn.",
    type: "text",
    status: "read",
    createdAt: "2024-01-19T14:25:00Z",
  },
  {
    id: 98,
    conversationId: 8,
    senderId: 3,
    content: "Cảm ơn! Mình sẽ check email ngay.",
    type: "text",
    status: "read",
    createdAt: "2024-01-19T14:28:00Z",
  },
  {
    id: 99,
    conversationId: 8,
    senderId: 6,
    content:
      "Buổi họp sẽ thảo luận về giáo trình mới cho học kỳ 2. Mọi người chuẩn bị ý kiến nhé!",
    type: "text",
    status: "read",
    createdAt: "2024-01-19T14:35:00Z",
  },
  {
    id: 100,
    conversationId: 8,
    senderId: 3,
    content:
      "Mình có một số đề xuất về phương pháp giảng dạy mới. Sẽ trình bày trong buổi họp.",
    type: "text",
    status: "read",
    createdAt: "2024-01-19T14:40:00Z",
  },
  {
    id: 101,
    conversationId: 8,
    senderId: 1,
    content: "Hay quá thầy! Mọi người nhớ tham dự đầy đủ nhé! 👍",
    type: "text",
    status: "read",
    createdAt: "2024-01-19T14:45:00Z",
  },
  {
    id: 102,
    conversationId: 8,
    senderId: 6,
    content: "Ok luôn! Hẹn gặp thứ 7! 🙌",
    type: "text",
    status: "read",
    createdAt: "2024-01-19T17:00:00Z",
  },
];

// Mock online status
export const mockOnlineStatus: UserOnlineStatus[] = [
  { userId: 1, isOnline: true },
  { userId: 2, isOnline: false, lastSeen: "2024-01-20T12:00:00Z" },
  { userId: 3, isOnline: true },
  { userId: 4, isOnline: false, lastSeen: "2024-01-20T08:00:00Z" },
  { userId: 5, isOnline: false, lastSeen: "2024-01-18T10:00:00Z" },
  { userId: 6, isOnline: true },
  { userId: 7, isOnline: false, lastSeen: "2024-01-19T15:00:00Z" },
  { userId: 8, isOnline: false, lastSeen: "2024-01-20T11:30:00Z" },
];

// Helper functions
export function getConversationById(id: number): Conversation | undefined {
  return mockConversations.find((c) => c.id === id);
}

export function getConversationsByUserId(userId: number): Conversation[] {
  return mockConversations.filter((c) => c.participants.includes(userId));
}

export function getMessagesByConversationId(conversationId: number): Message[] {
  return mockMessages.filter((m) => m.conversationId === conversationId);
}

export function getLastMessageOfConversation(
  conversationId: number
): Message | undefined {
  const messages = getMessagesByConversationId(conversationId);
  return messages.length > 0 ? messages[messages.length - 1] : undefined;
}

export function getUserOnlineStatus(
  userId: number
): UserOnlineStatus | undefined {
  return mockOnlineStatus.find((s) => s.userId === userId);
}

export function formatMessageTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) {
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (diffDays === 1) {
    return "Hôm qua";
  } else if (diffDays < 7) {
    const days = [
      "Chủ nhật",
      "Thứ 2",
      "Thứ 3",
      "Thứ 4",
      "Thứ 5",
      "Thứ 6",
      "Thứ 7",
    ];
    return days[date.getDay()];
  } else {
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    });
  }
}

export function getOtherParticipant(
  conversation: Conversation,
  currentUserId: number
): number | undefined {
  if (conversation.type === "private") {
    return conversation.participants.find((p) => p !== currentUserId);
  }
  return undefined;
}
