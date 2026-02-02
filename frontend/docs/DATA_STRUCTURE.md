# 📚 VietSign - Tài liệu Cấu trúc Dữ liệu

## Tổng quan

Hệ thống VietSign sử dụng các file dữ liệu mock trong `src/data/` để phát triển frontend. Dữ liệu được thiết kế theo mô hình quan hệ với ID liên kết giữa các bảng.

---

## 📁 Danh sách Data Files

| File                      | Kích thước | Mô tả                    |
| ------------------------- | ---------- | ------------------------ |
| `dictionaryData.ts`       | 70KB       | Từ điển ngôn ngữ ký hiệu |
| `messagesData.ts`         | 30KB       | Tin nhắn và hội thoại    |
| `questionsData.ts`        | 16KB       | Câu hỏi và bộ câu hỏi    |
| `selfLearnData.ts`        | 15KB       | Khóa học tự học          |
| `organizationsData.ts`    | 12KB       | Tổ chức/Cơ sở            |
| `dailySignsData.ts`       | 12KB       | Từ vựng hàng ngày        |
| `lessonsData.ts`          | 12KB       | Bài học và bước học      |
| `examsData.ts`            | 11KB       | Bài kiểm tra             |
| `learnData.ts`            | 11KB       | Dữ liệu học tập          |
| `classesData.ts`          | 6.8KB      | Lớp học                  |
| `gamesData.ts`            | 6.5KB      | Trò chơi                 |
| `gradingData.ts`          | 5.7KB      | Chấm điểm                |
| `vietnamLocationsData.ts` | 3.4KB      | Địa chỉ Việt Nam         |
| `usersData.ts`            | 2.9KB      | Người dùng               |
| `notificationsData.ts`    | 2.5KB      | Thông báo                |
| `statisticsData.ts`       | 1.4KB      | Thống kê                 |
| `permissionsData.ts`      | 0.3KB      | Phân quyền               |

---

## 1️⃣ usersData.ts - Người dùng

### Interface: `UserItem`

```typescript
interface UserItem {
  id: number; // ID duy nhất
  name: string; // Họ tên
  email: string; // Email
  role: string; // Vai trò (ADMIN, FACILITY_MANAGER, TEACHER, STUDENT, USER, TESTER)
  status: string; // Trạng thái (active, inactive)
  avatar?: string; // URL ảnh đại diện
  phone?: string; // Số điện thoại
  createdAt: string; // Ngày tạo (ISO string)
  facilityId?: number; // ID cơ sở (nếu có)
}
```

### Roles (Vai trò)

| Role               | Label tiếng Việt | Màu    |
| ------------------ | ---------------- | ------ |
| `ADMIN`            | Quản trị viên    | purple |
| `FACILITY_MANAGER` | Quản lý cơ sở    | blue   |
| `TEACHER`          | Giáo viên        | green  |
| `STUDENT`          | Học sinh         | amber  |
| `USER`             | Người dùng       | teal   |
| `TESTER`           | Tester           | orange |

### Helper Functions

- `getUserById(id)` - Lấy user theo ID
- `getUsersByRole(role)` - Lấy users theo role
- `getUsersByFacility(facilityId)` - Lấy users theo cơ sở
- `getFacilityManagers()` - Lấy tất cả manager cơ sở

### Mock Data

- **Số lượng**: 300 users
- **Phân bổ**: 5% Admin, 5% Manager, 15% Teacher, 65% Student, 5% Tester, 5% User

---

## 2️⃣ dictionaryData.ts - Từ điển Thủ ngữ

### Interface: `DictionaryItem`

```typescript
interface DictionaryItem {
  id: number; // ID duy nhất
  word: string; // Từ vựng
  category: string; // Danh mục
  videoUrl?: string; // URL video minh họa
  imageUrl?: string; // URL hình ảnh
  views: number; // Số lượt xem
  status: string; // Trạng thái (published, draft)
}
```

### Categories (Danh mục)

| ID          | Label     |
| ----------- | --------- |
| `all`       | Tất cả    |
| `alphabet`  | Chữ cái   |
| `numbers`   | Số đếm    |
| `greetings` | Chào hỏi  |
| `family`    | Gia đình  |
| `education` | Giáo dục  |
| `daily`     | Đời sống  |
| `time`      | Thời gian |
| `emotion`   | Cảm xúc   |
| `location`  | Địa điểm  |

### Mock Data

- **Khoảng 300 từ** với video từ Vimeo và Google Storage

---

## 3️⃣ classesData.ts - Lớp học

### Interface: `ClassItem`

```typescript
interface ClassItem {
  id: number; // ID duy nhất
  name: string; // Tên lớp
  teacherId: number; // ID giáo viên (FK -> users)
  students: number; // Số học sinh hiện tại
  maxStudents: number; // Sức chứa tối đa
  schedule: string; // Lịch học (VD: "Thứ 2, 4, 6 - 08:00")
  startDate: string; // Ngày bắt đầu
  endDate: string; // Ngày kết thúc
  status: "ongoing" | "upcoming" | "completed"; // Trạng thái
  facilityId: number | null; // ID cơ sở (null = Online)
  description?: string; // Mô tả
  level?: string; // Cấp độ (Cơ bản, Nâng cao, ...)
  gradeLevel: GradeLevel; // Cấp lớp (Lớp 1-5)
  studentIds: number[]; // Danh sách ID học sinh
}

type GradeLevel = "Lớp 1" | "Lớp 2" | "Lớp 3" | "Lớp 4" | "Lớp 5";
```

### Status Config

| Status      | Label         | Màu   |
| ----------- | ------------- | ----- |
| `ongoing`   | Đang diễn ra  | green |
| `upcoming`  | Sắp diễn ra   | blue  |
| `completed` | Đã hoàn thành | gray  |

### Helper Functions

- `getClassById(id)` - Lấy lớp theo ID
- `getClassTeacherName(classId)` - Lấy tên giáo viên
- `getClassFacilityName(classId)` - Lấy tên cơ sở
- `getClassesByFacility(facilityId)` - Lấy lớp theo cơ sở
- `getClassesByTeacher(teacherId)` - Lấy lớp theo giáo viên
- `getClassesByStatus(status)` - Lấy lớp theo trạng thái
- `getClassesByGradeLevel(gradeLevel)` - Lấy lớp theo cấp lớp
- `getClassStudents(classId)` - Lấy danh sách học sinh

### Mock Data

- **Số lượng**: 50 lớp học
- 80% thuộc cơ sở, 20% Online

---

## 4️⃣ organizationsData.ts - Cơ sở/Tổ chức

### Interface: `OrganizationItem`

```typescript
interface OrganizationItem {
  id: number; // ID duy nhất
  name: string; // Tên cơ sở
  streetAddress: string; // Địa chỉ đường
  wardCode: number; // Mã phường/xã
  provinceCode: number; // Mã tỉnh/thành phố
  phone: string; // Số điện thoại
  email: string; // Email
  managerId: number; // ID quản lý chính
  studentCount: number; // Số học sinh (tự động tính)
  teacherCount: number; // Số giáo viên (tự động tính)
  managers: UserItem[]; // Danh sách quản lý
  teachers: UserItem[]; // Danh sách giáo viên
  students: UserItem[]; // Danh sách học sinh
  status: "active" | "inactive" | "maintenance"; // Trạng thái
  description?: string; // Mô tả
  openingHours?: string; // Giờ mở cửa
  createdAt?: string; // Ngày tạo
  updatedAt?: string; // Ngày cập nhật
}
```

### Province Codes (Mã tỉnh)

```typescript
const PROVINCE_CODES = {
  HA_NOI: 1,
  HO_CHI_MINH: 79,
  DA_NANG: 48,
  CAN_THO: 92,
  HAI_PHONG: 31,
  HUE: 46,
  QUANG_NINH: 22,
  BAC_NINH: 24,
  THANH_HOA: 38,
  NGHE_AN: 40,
};
```

### Helper Functions

- `getOrganizationById(id)` - Lấy cơ sở theo ID
- `getOrganizationsByProvince(provinceCode)` - Lấy cơ sở theo tỉnh

### Mock Data

- **Số lượng**: 16 cơ sở tại các tỉnh thành

---

## 5️⃣ lessonsData.ts - Bài học (cho lớp học có giáo viên)

### Interface: `LessonItem`

```typescript
interface LessonItem {
  id: number; // ID duy nhất
  classId: number; // ID lớp (FK -> classes)
  title: string; // Tiêu đề bài học
  description: string; // Mô tả
  duration: string; // Thời lượng
  order: number; // Thứ tự
  completed?: boolean; // Đã hoàn thành?
  stepsCount: number; // Số bước học
}
```

### Interface: `StepItem`

```typescript
interface StepItem {
  id: number; // ID duy nhất
  lessonId: number; // ID bài học (FK -> lessons)
  title: string; // Tiêu đề
  type: StepType; // Loại bước
  order: number; // Thứ tự
  completed?: boolean; // Đã hoàn thành?
  word?: string; // Từ vựng (cho vocabulary)
  videoUrl?: string; // URL video
  description?: string; // Mô tả
  sentence?: string; // Câu (cho sentence)
  question?: string; // Câu hỏi (cho quiz)
  options?: {
    // Các lựa chọn
    id: number;
    text?: string;
    videoUrl?: string;
    imageUrl?: string;
    isCorrect: boolean;
  }[];
  correctAnswer?: string; // Đáp án đúng (cho quiz input)
  hint?: string; // Gợi ý
}

type StepType =
  | "vocabulary" // Từ vựng
  | "sentence" // Câu
  | "match-video-to-text" // Nối video với từ
  | "quiz-video-to-text" // Xem video, chọn từ
  | "quiz-text-to-video" // Xem từ, chọn video
  | "quiz-video-to-image" // Xem video, chọn hình
  | "quiz-input" // Nhập đáp án
  | "flip-card" // Lật thẻ
  | "true-false"; // Đúng/Sai
```

### Interface: `ExamItem` (Bài kiểm tra trong lớp)

```typescript
interface ExamItem {
  id: number;
  classId: number;
  title: string;
  description: string;
  duration: number; // Phút
  totalQuestions: number;
  dueDate: string;
  status: "pending" | "completed" | "expired";
  score?: number;
}
```

### Interface: `DocumentItem` (Tài liệu lớp)

```typescript
interface DocumentItem {
  id: number;
  classId: number;
  title: string;
  type: "pdf" | "doc" | "video" | "link";
  size?: string;
  url: string;
  uploadedAt: string;
}
```

### Helper Functions

- `getLessonsByClassId(classId)` - Lấy bài học theo lớp
- `getLessonById(lessonId)` - Lấy bài học theo ID
- `getStepsByLessonId(lessonId)` - Lấy các bước theo bài học
- `getStepById(stepId)` - Lấy bước theo ID
- `getExamsByClassId(classId)` - Lấy bài kiểm tra theo lớp
- `getDocumentsByClassId(classId)` - Lấy tài liệu theo lớp

---

## 6️⃣ selfLearnData.ts - Tự học (không có giáo viên)

### Interface: `SelfLearnCourse`

```typescript
interface SelfLearnCourse {
  id: number; // ID duy nhất
  title: string; // Tiêu đề khóa học
  subtitle: string; // Phụ đề
  description: string; // Mô tả
  colorClass: string; // CSS color class
  textClass: string; // CSS text class
  totalLessons: number; // Tổng số bài
  duration: string; // Thời lượng
  level: string; // Cấp độ
  progress?: number; // Tiến độ (%)
  topics: SelfLearnTopic[]; // Các chủ đề
}
```

### Interface: `SelfLearnTopic`

```typescript
interface SelfLearnTopic {
  id: number; // ID duy nhất
  courseId: number; // ID khóa học
  title: string; // Tiêu đề
  subtitle: string; // Phụ đề
  lessonsCount: number; // Số bài học
  completed?: boolean; // Đã hoàn thành?
}
```

### Interface: `SelfLearnLesson`

```typescript
interface SelfLearnLesson {
  id: number;
  topicId: number;
  courseId: number;
  title: string;
  description: string;
  duration: string;
  order: number;
  completed?: boolean;
  stepsCount: number;
}
```

### Các khóa học sẵn có

1. **Làm quen với chữ cái và số** - Chữ cái, thanh điệu, số tự nhiên
2. **Bản thân em** - Cơ thể, hoạt động, cảm xúc
3. **Gia đình** - Người thân, ngôi nhà, tình yêu thương
4. **Nhà trường** - Trường học, giao tiếp, an toàn
5. **Thiên nhiên và Đất nước** - Thiên nhiên, đất nước, môi trường

### Helper Functions

- `getAllSelfLearnCourses()` - Lấy tất cả khóa học
- `getSelfLearnCourseById(courseId)` - Lấy khóa học theo ID
- `getTopicsByCourseId(courseId)` - Lấy chủ đề theo khóa học
- `getTopicById(topicId)` - Lấy chủ đề theo ID
- `getLessonsByTopicId(topicId)` - Lấy bài học theo chủ đề
- `getSelfLearnLessonById(lessonId)` - Lấy bài học theo ID
- `getSelfLearnStepsByLessonId(lessonId)` - Lấy các bước theo bài học

---

## 7️⃣ examsData.ts - Bài kiểm tra (quản lý)

### Interface: `ExamItem`

```typescript
interface ExamItem {
  id: number; // ID duy nhất
  title: string; // Tiêu đề
  classId: number; // ID lớp (FK -> classes)
  date: string; // Ngày thi
  time: string; // Giờ thi
  duration: string; // Thời lượng
  questions: number; // Số câu hỏi
  students: number; // Số học sinh
  status: "upcoming" | "ongoing" | "completed"; // Trạng thái
  type: string; // Loại (Giữa kỳ, Cuối kỳ, ...)
  examType: ExamType; // Hình thức thi
  passingScore?: number; // Điểm đạt
  description?: string; // Mô tả
  createdById?: number; // ID người tạo
  questionIds?: number[]; // Danh sách ID câu hỏi
  questionSetIds?: number[]; // Danh sách ID bộ câu hỏi
}

type ExamType = "online" | "offline" | "practice";
```

### Helper Functions

- `getExamById(id)` - Lấy bài kiểm tra theo ID
- `getExamClassName(examId)` - Lấy tên lớp của bài kiểm tra
- `getExamsByClass(classId)` - Lấy bài kiểm tra theo lớp
- `getExamsByStatus(status)` - Lấy bài kiểm tra theo trạng thái
- `getUpcomingExams()` - Lấy bài kiểm tra sắp diễn ra
- `getCompletedExams()` - Lấy bài kiểm tra đã hoàn thành

---

## 8️⃣ questionsData.ts - Câu hỏi và Bộ câu hỏi

### Interface: `QuestionItem`

```typescript
interface QuestionItem {
  id: number; // ID duy nhất
  type: QuestionType; // Loại câu hỏi
  content: string; // Nội dung câu hỏi
  description?: string; // Mô tả
  category?: string; // Danh mục
  videoUrl?: string; // URL video
  imageUrl?: string; // URL hình ảnh
  answers?: AnswerOption[]; // Các đáp án
  practiceWord?: string; // Từ luyện tập
  practiceInstructions?: string; // Hướng dẫn luyện tập
  gradeLevel?: GradeLevel; // Cấp lớp
  classId?: number; // ID lớp (nếu có)
  creatorId: number; // ID người tạo
  organizationId: number; // ID tổ chức
  allowedEditorIds: number[]; // Danh sách ID người được phép sửa
  createdAt: string; // Ngày tạo
  updatedAt: string; // Ngày cập nhật
}

type QuestionType =
  | "multiple_choice" // Trắc nghiệm
  | "video_matching" // Nối video
  | "fill_blank" // Điền từ
  | "practice"; // Thực hành

interface AnswerOption {
  id: string;
  content: string;
  isCorrect: boolean;
}
```

### Interface: `QuestionSetItem`

```typescript
interface QuestionSetItem {
  id: number; // ID duy nhất
  name: string; // Tên bộ câu hỏi
  description?: string; // Mô tả
  type: QuestionType; // Loại
  questionIds: number[]; // Danh sách ID câu hỏi
  gradeLevel?: GradeLevel; // Cấp lớp
  classId?: number; // ID lớp
  creatorId: number; // ID người tạo
  organizationId: number; // ID tổ chức
  allowedEditorIds: number[]; // Người được phép sửa
  createdAt: string;
  updatedAt: string;
  category?: string;
}
```

### Categories

- Chào hỏi
- Gia đình
- Số đếm
- Màu sắc
- Thời gian
- Cảm xúc
- Hoạt động hàng ngày
- Thực phẩm
- Động vật
- Giao thông
- Trường học
- Y tế
- Nghề nghiệp
- Khác

### Helper Functions

- `getQuestionById(id)` - Lấy câu hỏi theo ID
- `getQuestionSetById(id)` - Lấy bộ câu hỏi theo ID
- `getQuestionsByOrganization(orgId)` - Lấy câu hỏi theo tổ chức
- `getQuestionSetsByOrganization(orgId)` - Lấy bộ câu hỏi theo tổ chức
- `getQuestionsByCreator(creatorId)` - Lấy câu hỏi theo người tạo
- `getQuestionsInSet(setId)` - Lấy câu hỏi trong bộ
- `canEditQuestion(question, userId, userRole, userOrgId)` - Kiểm tra quyền sửa
- `getVisibleQuestions(userId, userRole, userOrgId)` - Lấy câu hỏi có thể xem

### Mock Data

- **100 câu hỏi** và **30 bộ câu hỏi**

---

## 9️⃣ gamesData.ts - Trò chơi

### Interface: `GameItem`

```typescript
interface GameItem {
  id: number; // ID duy nhất
  name: string; // Tên trò chơi
  description: string; // Mô tả
  levels: GameLevel[]; // Các màn chơi
  icongame: string; // URL icon
  isActive: boolean; // Đang hoạt động?
}

interface GameLevel {
  level: number; // Số màn
  difficulty: "Dễ" | "Trung bình" | "Khó"; // Độ khó
  detail: string; // Chi tiết
  requiredScore?: number; // Điểm yêu cầu để qua màn
  questions: GameQuestion[]; // Câu hỏi trong màn
}

interface GameQuestion {
  id: number;
  content: string;
  videoUrl?: string;
  imageUrl?: string;
  options?: GameAnswerOption[];
  correctAnswer?: string;
  timeLimit?: number; // Giây
  points?: number;
}

interface GameAnswerOption {
  id: string | number;
  text: string;
  isCorrect: boolean;
}
```

### Các trò chơi sẵn có

1. **Đoán từ qua video** - Xem video, chọn từ đúng
2. **Lật bài trí nhớ** - Tìm cặp bài trùng khớp
3. **Thử thách Đánh vần** - Nhập từ theo hình ảnh chữ cái

### Helper Functions

- `getGameById(id)` - Lấy game theo ID
- `getAllGames()` - Lấy tất cả games
- `getActiveGames()` - Lấy games đang hoạt động
- `getGameLevel(gameId, level)` - Lấy màn chơi
- `getGamesStats()` - Thống kê games

---

## 🔟 dailySignsData.ts - Từ vựng hàng ngày

### Interface: `DailySignEntry`

```typescript
interface DailySignEntry {
  date: string; // Ngày (YYYY-MM-DD)
  dictionaryItemId: number; // ID từ điển (FK -> dictionary)
}
```

### Lịch biểu

- **Phạm vi**: 01/12/2025 - 31/03/2026
- **Nội dung theo tháng**:
  - Tháng 12/2025: Chào hỏi & Gia đình
  - Tháng 01/2026: Giáo dục
  - Tháng 02/2026: Đời sống & Thời gian
  - Tháng 03/2026: Cảm xúc & Địa điểm

### Helper Functions

- `getDictionaryItemById(id)` - Lấy từ điển theo ID
- `getDailySignByDate(date)` - Lấy từ theo ngày
- `getTodaySign()` - Lấy từ hôm nay
- `getTodaySignOrDefault()` - Lấy từ hôm nay hoặc mặc định
- `getRecentSigns(days)` - Lấy từ gần đây
- `getUpcomingSigns(days)` - Lấy từ sắp tới
- `getRelatedWords(dictionaryItemId, limit)` - Lấy từ liên quan
- `getRandomDictionaryItem()` - Lấy từ ngẫu nhiên

---

## 1️⃣1️⃣ messagesData.ts - Tin nhắn

### Interface: `Conversation`

```typescript
interface Conversation {
  id: string | number; // ID duy nhất
  participants: number[]; // Danh sách ID người tham gia
  type: "private" | "group"; // Loại (riêng tư/nhóm)
  name?: string; // Tên nhóm (nếu là group)
  avatar?: string; // Ảnh nhóm
  lastMessageId?: string | number; // ID tin nhắn cuối
  unreadCount: number; // Số tin chưa đọc
  createdAt: string;
  updatedAt: string;
}
```

### Interface: `Message`

```typescript
interface Message {
  id: string | number; // ID duy nhất
  conversationId: string | number; // ID hội thoại
  senderId: number; // ID người gửi
  content: string; // Nội dung
  type: "text" | "image" | "file" | "video"; // Loại
  attachments?: MessageAttachment[]; // Đính kèm
  status: "sending" | "sent" | "delivered" | "read"; // Trạng thái
  createdAt: string;
  replyToId?: string | number; // ID tin nhắn reply
}

interface MessageAttachment {
  id: string | number;
  name: string;
  url: string;
  type: "image" | "file" | "video";
  size: number;
}
```

### Interface: `UserOnlineStatus`

```typescript
interface UserOnlineStatus {
  userId: number;
  isOnline: boolean;
  lastSeen?: string;
}
```

### Mock Data

- **8 cuộc hội thoại** với hàng trăm tin nhắn mẫu

---

## 1️⃣2️⃣ learnData.ts - Học tập (dữ liệu cũ)

### Interface: `LearnCategory`

```typescript
interface LearnCategory {
  id: string;
  title: string;
  colorClass: string;
  textClass: string;
  items: LearnItem[];
}
```

### Interface: `LearnItem`

```typescript
interface LearnItem {
  id: number;
  title: string;
  subtitle: string;
  progress?: number;
  lessons?: number;
  duration?: string;
  level?: string;
  description?: string;
  students?: number;
  rating?: number;
  categoryTitle?: string;
  colorClass?: string;
  lessonsList?: Lesson[];
  videoUrl?: string;
  vocabularyList?: string[];
}

interface Lesson {
  id: number;
  title: string;
  description: string;
  duration: string;
  videoUrl?: string;
  vocabularyList?: string[];
}
```

---

## 1️⃣3️⃣ vietnamLocationsData.ts - Địa chỉ Việt Nam

Chứa dữ liệu mã tỉnh/thành phố và phường/xã của Việt Nam, được sử dụng làm mã địa chỉ chuẩn trong hệ thống.

---

## 1️⃣4️⃣ notificationsData.ts - Thông báo

### Interface: `NotificationItem`

```typescript
interface NotificationItem {
  id: number; // ID duy nhất
  title: string; // Tiêu đề thông báo
  message: string; // Nội dung
  type: "info" | "warning" | "success" | "error"; // Loại
  isRead: boolean; // Đã đọc?
  createdAt: string; // Thời gian
  sender: string; // Người gửi
  link?: string; // Link đến (nếu có)
}
```

### Type Config

| Type      | Icon          | Background   | Icon Color     |
| --------- | ------------- | ------------ | -------------- |
| `info`    | Info          | bg-blue-100  | text-blue-600  |
| `warning` | AlertTriangle | bg-amber-100 | text-amber-600 |
| `success` | CheckCircle   | bg-green-100 | text-green-600 |
| `error`   | XCircle       | bg-red-100   | text-red-600   |

### Mock Data

- **8 thông báo mẫu** với các loại khác nhau

---

## 1️⃣5️⃣ statisticsData.ts - Thống kê

### Interface: `StatItem`

```typescript
interface StatItem {
  label: string; // Nhãn
  value: string; // Giá trị
  change: string; // % thay đổi
  iconName: string; // Tên icon Lucide
  color: string; // Màu nền
}
```

### Interface: `MonthlyDataItem`

```typescript
interface MonthlyDataItem {
  month: string; // Tháng (T1, T2, ...)
  students: number; // Số học sinh
  lessons: number; // Số bài học
}
```

### Stats tổng quan

| Metric              | Value | Change | Icon       | Color  |
| ------------------- | ----- | ------ | ---------- | ------ |
| Tổng học sinh       | 2,350 | +12%   | Users      | blue   |
| Khóa học hoàn thành | 1,245 | +8%    | BookOpen   | green  |
| Bài kiểm tra        | 856   | +15%   | Award      | purple |
| Điểm trung bình     | 8.2   | +0.3   | TrendingUp | amber  |

### Monthly Data

- Dữ liệu 12 tháng (T1-T12)
- Theo dõi số học sinh và bài học qua từng tháng

---

## 1️⃣6️⃣ gradingData.ts - Chấm điểm

### Interface: `SubmissionItem`

```typescript
interface SubmissionItem {
  id: number; // ID duy nhất
  studentId: number; // ID học sinh (FK -> users)
  examId: number; // ID bài kiểm tra (FK -> exams)
  classId: number; // ID lớp (FK -> classes)
  submittedAt: string; // Thời gian nộp
  status: "pending" | "graded"; // Trạng thái
  score: number | null; // Điểm (null nếu chưa chấm)
  duration?: string; // Thời gian làm bài
  feedback?: string; // Nhận xét
  gradedById?: number; // ID người chấm
  gradedAt?: string; // Thời gian chấm
}
```

### Status Config

| Status    | Label    | Màu   |
| --------- | -------- | ----- |
| `pending` | Chờ chấm | amber |
| `graded`  | Đã chấm  | green |

### Helper Functions

- `getSubmissionById(id)` - Lấy submission theo ID
- `getSubmissionStudentName(submissionId)` - Lấy tên học sinh
- `getSubmissionExamTitle(submissionId)` - Lấy tên bài kiểm tra
- `getSubmissionClassName(submissionId)` - Lấy tên lớp
- `getSubmissionsByStudent(studentId)` - Lấy submissions theo học sinh
- `getSubmissionsByExam(examId)` - Lấy submissions theo bài kiểm tra
- `getSubmissionsByClass(classId)` - Lấy submissions theo lớp
- `getPendingSubmissions()` - Lấy submissions chờ chấm
- `getGradedSubmissions()` - Lấy submissions đã chấm
- `getStudentAverageScore(studentId)` - Tính điểm TB học sinh

### Mock Data

- **58 submissions** (8 cố định + 50 generated)
- ~67% đã chấm, ~33% chờ chấm

---

## 1️⃣7️⃣ permissionsData.ts - Phân quyền

### Interface: `Permission` (từ domain)

```typescript
interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}
```

### Exports

- `mockPermissions: Permission[]` - Danh sách quyền (hiện tại trống)
- `mockRolePermissions: Record<string, string[]>` - Map role -> permissions (hiện tại trống)

> ⚠️ **Note**: File này hiện đang trống, cần phát triển thêm logic phân quyền

---

## 🔗 Quan hệ giữa các bảng

```
users
  └── organizationsData (facilityId -> organizations.id)
  └── classesData (teacherId -> users.id, studentIds -> users.id[])

organizations
  └── classesData (facilityId -> organizations.id)
  └── questionsData (organizationId -> organizations.id)

classes
  └── lessonsData (classId -> classes.id)
  └── examsData (classId -> classes.id)

dictionary
  └── dailySignsData (dictionaryItemId -> dictionary.id)

selfLearnCourses
  └── SelfLearnTopic (courseId -> courses.id)
  └── SelfLearnLesson (topicId -> topics.id)

questions
  └── questionSets (questionIds -> questions.id[])
  └── examsData (questionIds -> questions.id[])
```

---

## 📝 Hướng dẫn sử dụng

### Import dữ liệu

```typescript
// Import từ barrel file
import {
  mockUsers,
  mockClasses,
  dictionaryItems,
  getUserById,
  getClassById,
} from "@/data";

// Hoặc import trực tiếp
import { mockUsers, getUserById } from "@/data/usersData";
```

### Thêm dữ liệu mới

1. Thêm item vào mảng mock tương ứng
2. Đảm bảo ID duy nhất
3. Liên kết đúng với các bảng khác qua FK

### Chỉnh sửa interface

1. Cập nhật interface trong file tương ứng
2. Cập nhật mock data generator nếu có
3. Cập nhật các helper functions nếu cần

---

## ⚠️ Lưu ý quan trọng

1. **Đây là mock data** - dùng cho phát triển frontend, không phải production database
2. **ID được tự động generate** - một số file sử dụng hàm generate, ID có thể thay đổi mỗi lần refresh
3. **Video URLs** - sử dụng Vimeo và Google Storage cho demo
4. **Dữ liệu có quan hệ** - khi thay đổi ID, cần cập nhật các FK liên quan
