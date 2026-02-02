# Cấu trúc BE API Request Body

Tài liệu này tổng hợp chi tiết cấu trúc `requestBody` cho tất cả các API endpoint được định nghĩa trong Backend (Vietsignschool_BE).

## 1. Authentication

### `/auth/login` (POST)

- **Summary**: User login
- **Required**: `email`, `password`
- **Body**:
  ```json
  {
    "email": "hocsinh@gmai.com",
    "password": "123456"
  }
  ```

### `/auth/register` (POST)

- **Summary**: Register a new user
- **Required**: `email`, `password`, `name`
- **Body**:
  ```json
  {
    "email": "newuser@example.com",
    "password": "password123",
    "name": "Nguyễn Văn A"
  }
  ```

## 2. Users

### `/users/profile` (PUT)

- **Summary**: Update personal profile information
- **Required**: True (Body object is required, individual fields optional)
- **Body**:
  ```json
  {
    "name": "Nguyễn Văn B",
    "email": "newemail@example.com",
    "phone_number": "0123456789",
    "gender": "Male",
    "address": "123 Đường ABC, Quận 1, TP.HCM",
    "avatar_location": "/images/avatar.jpg",
    "birth_day": "1990-01-01",
    "code": "ADMIN",
    "school_id": "SCHOOL001"
  }
  ```

### `/users/teachers` (POST)

- **Summary**: Create a new teacher
- **Required**: `name`, `email`
- **Body**:
  ```json
  {
    "name": "Nguyễn Văn A",
    "email": "teacher@example.com",
    "phoneNumber": "0123456789",
    "birthDay": "1985-05-15",
    "address": "123 Đường ABC",
    "classRoomName": "Lớp 10A1",
    "schoolName": "Trường THPT Nguyễn Huệ"
  }
  ```

### `/users/teachers/{id}` (PUT)

- **Summary**: Update teacher information
- **Required**: True
- **Body**:
  ```json
  {
    "name": "string",
    "email": "string",
    "phone_number": "string",
    "gender": "string",
    "birth_day": "2023-01-01",
    "address": "string"
  }
  ```

### `/users/students` (POST)

- **Summary**: Create a new student
- **Required**: `name`, `email`
- **Body**:
  ```json
  {
    "name": "Nguyễn Văn B",
    "email": "student@example.com",
    "phoneNumber": "0987654321",
    "birthDay": "2005-08-20",
    "address": "456 Đường XYZ",
    "classRoomName": "Lớp 10A1"
  }
  ```

### `/users/students/{id}` (PUT)

- **Summary**: Update student information
- **Required**: True
- **Body**:
  ```json
  {
    "name": "string",
    "email": "string",
    "phone_number": "string",
    "gender": "string",
    "birth_day": "2023-01-01",
    "address": "string"
  }
  ```

## 3. Organizations

### `/organizations` (POST)

- **Summary**: Create a new organization
- **Required**: `name`, `type`
- **Body**:
  ```json
  {
    "parent_id": "null - Bộ Giáo dục, 1 - Sở Giáo dục, 2 - Trường",
    "name": "Trường THPT Nguyễn Huệ",
    "type": "SCHOOL",
    "address": "Số 12 Đường Nguyễn Huệ",
    "city": "Thành phố Hà Nội",
    "ward": "Quận Hoàn Kiếm",
    "street": "Đường Nguyễn Huệ",
    "phone": "024 3825 6789",
    "email": "thptnguyenhue@edu.vn"
  }
  ```

### `/organizations/{id}` (PUT)

- **Summary**: Update an existing organization
- **Required**: True
- **Body**:
  ```json
  {
    "parent_id": "null - Bộ Giáo dục, 1 - Sở Giáo dục, 2 - Trường",
    "name": "Trường THPT Nguyễn Huệ",
    "type": "SCHOOL",
    "address": "Số 12 Đường Nguyễn Huệ",
    "city": "Thành phố Hà Nội",
    "ward": "Quận Hoàn Kiếm",
    "street": "Đường Nguyễn Huệ",
    "phone": "024 3825 6789",
    "email": "thptnguyenhue@edu.vn"
  }
  ```

### `/organization-managers` (POST)

- **Summary**: Assign organization management role to a user
- **Required**: `organization_id`, `user_id`, `role_in_org`
- **Body**:
  ```json
  {
    "organization_id": "123",
    "user_id": "456",
    "role_in_org": "SUPER_ADMIN",
    "is_primary": true
  }
  ```

### `/organization-managers` (DELETE)

- **Summary**: Revoke organization management role from a user
- **Required**: `organization_id`, `user_id`
- **Body**:
  ```json
  {
    "organization_id": "12",
    "user_id": "34"
  }
  ```

## 4. Classrooms

### `/classrooms` (POST)

- **Summary**: Create a new classroom
- **Required**: `name`, `classLevel`
- **Body**:
  ```json
  {
    "name": "Lớp 10A1",
    "description": "Lớp học khối 10",
    "classCode": "CLASS001",
    "classLevel": "10",
    "teacherId": "5",
    "thumbnailPath": "/images/class.jpg",
    "schoolId": "1"
  }
  ```

### `/classrooms/{classroomId}` (PUT)

- **Summary**: Update classroom information
- **Required**: True
- **Body**:
  ```json
  {
    "name": "string",
    "description": "string",
    "classCode": "string",
    "classLevel": "string",
    "teacherId": "string",
    "thumbnailPath": "string",
    "status": "ACTIVE"
  }
  ```

### `/classrooms/{classroomId}/students` (POST)

- **Summary**: Add student to classroom
- **Required**: `studentId`
- **Body**:
  ```json
  {
    "studentId": "1"
  }
  ```

### `/classrooms/{classroomId}/students` (DELETE)

- **Summary**: Remove student from classroom
- **Required**: `studentId`
- **Body**:
  ```json
  {
    "studentId": "1"
  }
  ```

## 5. Lessons

### `/lessons` (POST)

- **Summary**: Create a new lesson
- **Required**: `lesson_name`, `topic_id`, `classroom_id`
- **Body**:
  ```json
  {
    "lesson_name": "Bài học 1: Chữ cái",
    "description": "Học về các chữ cái cơ bản",
    "topic_id": 1,
    "classroom_id": 1,
    "order_number": 1,
    "image_url": "https://example.com/image.jpg",
    "video_url": "https://example.com/video.mp4",
    "duration_minutes": 45,
    "difficulty_level": "BEGINNER",
    "vocabulary_count": 10,
    "is_active": 1
  }
  ```

### `/lessons/{lesson_id}` (PUT)

- **Summary**: Update lesson
- **Required**: True
- **Body**:
  ```json
  {
    "lesson_name": "string",
    "description": "string",
    "image_url": "string",
    "video_url": "string",
    "duration_minutes": 0,
    "difficulty_level": "BEGINNER",
    "vocabulary_count": 0,
    "is_active": 0
  }
  ```

### `/lessons/topic/{topic_id}/reorder` (PUT)

- **Summary**: Reorder lessons in a topic
- **Required**: `lessons`
- **Body**:
  ```json
  {
    "lessons": [
      {
        "lesson_id": 0,
        "order_number": 0
      }
    ]
  }
  ```

## 6. Vocabularies

### `/vocabularies` (POST)

- **Summary**: Create a new vocabulary
- **Required**: `content`, `topic_id`
- **Body**:
  ```json
  {
    "content": "Xin chào",
    "description": "Nghĩa là hello/goodbye",
    "topic_id": 1,
    "classroom_id": 1,
    "vocabulary_type": "WORD",
    "images_url": "https://example.com/image.jpg",
    "videos_url": "https://example.com/video.mp4",
    "note": "Note about pronunciation",
    "is_private": 0,
    "is_active": 1
  }
  ```

### `/vocabularies/{vocabulary_id}` (PUT)

- **Summary**: Update vocabulary
- **Required**: True
- **Body**:
  ```json
  {
    "content": "string",
    "description": "string",
    "images_url": "string",
    "videos_url": "string",
    "note": "string",
    "vocabulary_type": "WORD",
    "is_private": 0,
    "is_active": 0
  }
  ```

## 7. Topics

### `/topics` (POST)

- **Summary**: Create new topic
- **Required**: `name`
- **Body**:
  ```json
  {
    "name": "Basic Vocabulary",
    "classroom_id": 1,
    "image_location": "https://example.com/image.jpg",
    "description": "Introduction to basic vocabulary",
    "creator_id": 1,
    "is_common": false
  }
  ```

### `/topics/{topic_id}` (PUT)

- **Summary**: Update topic
- **Required**: True
- **Body**:
  ```json
  {
    "name": "string",
    "classroom_id": 0,
    "image_location": "string",
    "description": "string",
    "creator_id": 0,
    "is_common": false
  }
  ```

## 8. Questions

### `/questions` (POST)

- **Summary**: Create new question
- **Required**: `content`
- **Body**:
  ```json
  {
    "content": "What is the sign for \"hello\"?",
    "explanation": "The sign for hello involves waving your hand from left to right",
    "class_room_id": 1,
    "image_location": "https://example.com/question-image.jpg",
    "video_location": "https://example.com/question-video.mp4",
    "created_by": 1
  }
  ```

### `/questions/{question_id}` (PUT)

- **Summary**: Update question
- **Required**: True
- **Body**:
  ```json
  {
    "content": "string",
    "explanation": "string",
    "class_room_id": 0,
    "image_location": "string",
    "video_location": "string",
    "created_by": 0
  }
  ```

## 9. Exams

### `/exams` (POST)

- **Summary**: Create new exam
- **Required**: `name`
- **Body**:
  ```json
  {
    "name": "Sign Language Test Week 1",
    "description": "Test on basic sign language vocabulary and grammar",
    "exam_type": "MULTIPLE_CHOICE",
    "class_room_id": 1,
    "created_by": 1,
    "duration_minutes": 60,
    "total_points": 100,
    "passing_score": 50
  }
  ```

### `/exams/{exam_id}` (PUT)

- **Summary**: Update exam
- **Required**: True
- **Body**:
  ```json
  {
    "name": "string",
    "description": "string",
    "exam_type": "MULTIPLE_CHOICE",
    "class_room_id": 0,
    "duration_minutes": 0,
    "total_points": 0,
    "passing_score": 0,
    "is_active": true
  }
  ```

### `/exams/{exam_id}/submit` (POST)

- **Summary**: Submit exam
- **Required**: `student_id`
- **Body**:
  ```json
  {
    "student_id": 0,
    "score": 0,
    "answers": {},
    "time_spent": 0
  }
  ```

## 10. Student Learning Tracking

### `/users/students/tracking/view-lesson` (POST)

- **Summary**: Record student lesson view
- **Required**: `studentId`, `lessonId`
- **Body**:
  ```json
  {
    "studentId": "1",
    "lessonId": "10"
  }
  ```

### `/users/students/tracking/view-vocabulary` (POST)

- **Summary**: Record student vocabulary view
- **Required**: `studentId`, `vocabularyId`
- **Body**:
  ```json
  {
    "studentId": "1",
    "vocabularyId": "20"
  }
  ```

---

## 11. Frontend Integration Notes

Ghi chú về trạng thái tích hợp giữa Frontend và các API Backend.

### Đã tích hợp

| API               | Frontend Service      | Mapping đã thực hiện                                                                           |
| ----------------- | --------------------- | ---------------------------------------------------------------------------------------------- |
| `/auth/login`     | `authService`         | ✅ Hoàn chỉnh.                                                                                 |
| `/auth/register`  | `authService`         | ✅ Hoàn chỉnh.                                                                                 |
| `/users/profile`  | `userService`         | ✅ Map `avatar_location` -> `avatar`, `phone_number` -> `phone`, `is_deleted` -> `isDeleted`.  |
| `/users/teachers` | `userService`         | ✅ Map `phone` -> `phoneNumber`, `organizationId` -> `school_id`, `is_deleted` -> `isDeleted`. |
| `/users/students` | `userService`         | ✅ Map `phone` -> `phoneNumber`, `is_deleted` -> `isDeleted`.                                  |
| `/organizations`  | `organizationService` | ✅ Cơ bản hoạt động. Cần map `provinceCode`/`wardCode` -> `city`/`ward` tên chuỗi.             |

### Chưa tích hợp / Cần cập nhật

| API                      | Ghi chú                                                                                             |
| ------------------------ | --------------------------------------------------------------------------------------------------- |
| `/classrooms`            | Frontend gọi `/classes`. Cần map sang `/classrooms`.                                                |
| `/vocabularies`          | Frontend gọi `/dictionary`. Cần map sang `/vocabularies` và đổi tham số `q` -> `content`.           |
| `/organization-managers` | Trang Phân quyền (`/permissions`) đã ẩn. Chờ kích hoạt lại và tích hợp API này.                     |
| `/lessons` (POST/PUT)    | Field mapping cần: `name` -> `lesson_name`, `classId` -> `classroom_id`, `order` -> `order_number`. |

### Dữ liệu Local (Không dùng BE API)

| Module           | Đường dẫn              | Dữ liệu nguồn      | Ghi chú                                                      |
| ---------------- | ---------------------- | ------------------ | ------------------------------------------------------------ |
| Tự học           | `/learn`               | `selfLearnData.ts` | Dành cho user tự do, không cần đăng nhập.                    |
| Quản lý khóa học | `/learning-management` | `selfLearnData.ts` | Admin CRUD khóa học, bài học, bước học. Chỉ lưu local state. |

### Thay đổi UI gần đây

- **User Management List**: Đã xóa nút Edit inline. Chỉ còn nút Delete. Click row để vào detail page.
- **User Detail Delete Redirect**: Fix redirect về `/users-management` thay vì `/users`.
- **Learning Management Detail**: Thêm đầy đủ CRUD cho bài học và bước học. Các nút chỉ hiện khi ở chế độ "Chỉnh sửa thông tin".
