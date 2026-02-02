# So sánh API: Frontend vs Backend

Tài liệu này phác thảo những điểm giống và khác nhau giữa các endpoint API và cấu trúc dữ liệu được sử dụng trong Frontend (Vietsign) và các định nghĩa trong Backend (Vietsignschool_BE).

## 1. Xác thực & Người dùng

### Endpoint

| Hành động      | Đường dẫn Frontend (UI/Service) | Đường dẫn Backend (Swagger) | Trạng thái    | Ghi chú                                                                         |
| -------------- | ------------------------------- | --------------------------- | ------------- | ------------------------------------------------------------------------------- |
| Đăng nhập      | `/auth/login`                   | `/auth/login`               | ✅ Khớp       |                                                                                 |
| Đăng ký        | `/auth/register`                | `/auth/register`            | ✅ Khớp       |                                                                                 |
| Lấy hồ sơ      | `/users/profile`                | `/users/profile`            | ✅ Khớp       |                                                                                 |
| Cập nhật hồ sơ | `/users/profile`                | `/users/profile`            | ✅ Khớp       |                                                                                 |
| Lấy GV         | `/users/teachers`               | `/users/teachers`           | ✅ Khớp       |                                                                                 |
| Lấy HS         | `/users/students`               | `/users/students`           | ✅ Khớp       |                                                                                 |
| Quản lý User   | `/users-management` (UI)        | N/A                         | ✅ Refactored | UI dùng `/users-management`. Service gọi `/users/teachers` & `/users/students`. |
| User chờ duyệt | `/users/pending` (Mock)         | _Không tìm thấy trong docs_ | ❌ Không khớp | Service đang dùng Mock data. map sang `getPendingUsers` nếu có.                 |
| Phân quyền     | `/permissions` (Hidden)         | `/organization-managers`    | ⚠️ Ẩn         | Trang UI tạm ẩn. API BE hỗ trợ gán quyền quản lý tổ chức.                       |

### Trường dữ liệu (Đối tượng User)

| Trường       | Mong đợi từ Frontend           | Phản hồi Backend (Doc)    | Ghi chú                                                     |
| ------------ | ------------------------------ | ------------------------- | ----------------------------------------------------------- |
| ID           | `id`                           | `id` hoặc `user_id`       | Service map `user_id` -> `id`.                              |
| Vai trò      | `role` (map từ `code`)         | `code`                    | FE map `code` (ví dụ: 'TEACHER') sang `role`.               |
| Ảnh đại diện | `avatar`                       | `avatar_location`         | Service map `avatar_location` -> `avatar`.                  |
| Cơ sở        | `organizationId`               | `school_id`/`facility_id` | Service map `organizationId` <-> `facility_id`/`school_id`. |
| Trạng thái   | `status` ('active'/'inactive') | `is_deleted`              | Service map boolean `is_deleted` sang chuỗi trạng thái.     |

### Thay đổi UI Quản lý Người dùng

| Thành phần          | Trước                                       | Sau                 | Ghi chú                                        |
| ------------------- | ------------------------------------------- | ------------------- | ---------------------------------------------- |
| Nút Edit trong list | Hiển thị cạnh mỗi user                      | **Đã xóa**          | Chỉ click vào row để vào trang detail và edit. |
| Route redirect      | `/users` (sau khi xóa user từ trang detail) | `/users-management` | Fix route đúng với cấu trúc mới.               |
| Nút Delete          | Có trong list                               | Vẫn có trong list   | Giữ nguyên.                                    |

## 2. Học tập (Learn) & Quản lý (Learning Management)

| Module                   | Đường dẫn Frontend          | Đường dẫn Backend         | Dữ liệu nguồn           | Ghi chú                                    |
| ------------------------ | --------------------------- | ------------------------- | ----------------------- | ------------------------------------------ |
| Tự học (User)            | `/learn`                    | N/A                       | `selfLearnData` (Local) | Học viên tự do, không cần đăng nhập/lớp.   |
| Quản lý khóa học (Admin) | `/learning-management`      | N/A                       | `selfLearnData` (Local) | Admin quản lý nội dung tự học.             |
| Chi tiết khóa học        | `/learning-management/[id]` | N/A                       | `selfLearnData` (Local) | Xem, sửa, xóa khóa học, bài học, bước học. |
| Lớp học (Student)        | `/study`                    | `/classrooms`, `/lessons` | API                     | Học viên thuộc trường/lớp. Dữ liệu từ BE.  |

### Quản lý Khóa học - Chi tiết (`/learning-management/[id]`)

| Chức năng           | Trạng thái      | Điều kiện                         | Ghi chú                                     |
| ------------------- | --------------- | --------------------------------- | ------------------------------------------- |
| Xem thông tin KH    | ✅ Hoàn thành   | Luôn có                           |                                             |
| Sửa thông tin KH    | ✅ Hoàn thành   | Sau khi bấm "Chỉnh sửa thông tin" | Sửa tiêu đề, mô tả, cấp độ, thời lượng.     |
| Xóa khóa học        | ✅ Hoàn thành   | Luôn có                           | Confirm modal trước khi xóa.                |
| **Thêm bài học**    | ✅ Hoàn thành   | Chỉ khi đang ở chế độ chỉnh sửa   | Modal với form: tiêu đề, mô tả, thời lượng. |
| **Sửa bài học**     | ✅ Hoàn thành   | Chỉ khi đang ở chế độ chỉnh sửa   | Icon Edit cạnh mỗi bài học.                 |
| **Xóa bài học**     | ✅ Hoàn thành   | Chỉ khi đang ở chế độ chỉnh sửa   | Icon Delete cạnh mỗi bài học.               |
| **Thêm bước học**   | ✅ Hoàn thành   | Chỉ khi đang ở chế độ chỉnh sửa   | Nút "Thêm bước học mới" trong mỗi bài học.  |
| **Sửa bước học**    | ✅ Hoàn thành   | Chỉ khi đang ở chế độ chỉnh sửa   | Hover để hiện icon Edit.                    |
| **Xóa bước học**    | ✅ Hoàn thành   | Chỉ khi đang ở chế độ chỉnh sửa   | Hover để hiện icon Delete.                  |
| Hiển thị số bài học | ✅ Trong header | N/A                               | Hiển thị trong tiêu đề "Danh sách bài học". |

### Loại Bước Học (Step Types)

| Loại                  | Nhãn        | Mô tả                                |
| --------------------- | ----------- | ------------------------------------ |
| `vocabulary`          | Từ vựng     | Xem video từ vựng + thông tin.       |
| `sentence`            | Câu mẫu     | Xem video câu mẫu + phân tích từ.    |
| `quiz-video-to-text`  | Trắc nghiệm | Xem video, chọn đáp án chữ đúng.     |
| `quiz-text-to-video`  | Chọn video  | Xem chữ, chọn video đúng.            |
| `quiz-input`          | Gõ từ       | Xem video, gõ đáp án.                |
| `match-video-to-text` | Nối từ      | Nối video với chữ tương ứng.         |
| `flip-card`           | Lật thẻ     | Ghép cặp video-chữ bằng lật thẻ.     |
| `true-false`          | Đúng/Sai    | Xem video, xác nhận từ đúng hay sai. |

## 3. Lớp học (Classes/Classrooms)

### Endpoint

| Hành động  | Đường dẫn Frontend    | Đường dẫn Backend | Trạng thái    | Ghi chú                                                       |
| ---------- | --------------------- | ----------------- | ------------- | ------------------------------------------------------------- |
| Base UI    | `/classes-management` | N/A               | ✅ UI         | UI quản lý lớp học.                                           |
| Base API   | `/classes`            | `/classrooms`     | ❌ Không khớp | Service đang gọi `/classes`. Cần map sang `/classrooms`.      |
| Lấy tất cả | `/classes`            | `/classrooms`     | ❌ Không khớp | Cần cập nhật service.                                         |
| Tạo mới    | `/classes`            | `/classrooms`     | ❌ Không khớp | Cần cập nhật service.                                         |
| Lấy HS     | `/classes/my-classes` | N/A               | ❌ Không khớp | FE có `getStudentClasses`. BE có `/classrooms/{id}/students`. |

## 4. Bài học (Lessons)

### Endpoint

| Hành động      | Đường dẫn Frontend    | Đường dẫn Backend     | Trạng thái | Ghi chú |
| -------------- | --------------------- | --------------------- | ---------- | ------- |
| Base URL       | `/lessons`            | `/lessons`            | ✅ Khớp    |         |
| Lấy theo Topic | `/lessons/topic/{id}` | `/lessons/topic/{id}` | ✅ Khớp    |         |
| Tạo mới        | `/lessons`            | `/lessons`            | ✅ Khớp    |         |

## 5. Từ điển (Vocabulary)

### Endpoint

| Hành động      | Đường dẫn Frontend         | Đường dẫn Backend                             | Trạng thái    | Ghi chú                                                    |
| -------------- | -------------------------- | --------------------------------------------- | ------------- | ---------------------------------------------------------- |
| Base URL       | `/dictionary`              | `/vocabularies`                               | ❌ Không khớp | Frontend dùng `/dictionary`, Backend dùng `/vocabularies`. |
| Tìm kiếm       | `/dictionary/search?q=...` | `/vocabularies/search/by-content?content=...` | ❌ Không khớp | Khác đường dẫn và tham số truy vấn (`q` vs `content`).     |
| Lấy theo Topic | `/dictionary/topic/{id}`   | `/vocabularies/topic/{id}`                    | ⚠️ Một phần   | Cấu trúc đường dẫn khớp, URL gốc khác nhau.                |

## 6. Tổ chức (Organizations)

### Endpoint

| Hành động  | Đường dẫn Frontend          | Đường dẫn Backend | Trạng thái | Ghi chú             |
| ---------- | --------------------------- | ----------------- | ---------- | ------------------- |
| Base UI    | `/organizations-management` | N/A               | ✅ UI      | UI quản lý tổ chức. |
| Base API   | `/organizations`            | `/organizations`  | ✅ Khớp    |                     |
| Lấy tất cả | `/organizations`            | `/organizations`  | ✅ Khớp    |                     |
| Tạo mới    | `/organizations`            | `/organizations`  | ✅ Khớp    |                     |

## 7. Phân tích Form dữ liệu & Payload

Phần này phân tích cấu trúc payload để tạo và cập nhật các thực thể.

### Tổ chức (`/organizations`)

| Trường      | Frontend (OrganizationItem) | Backend (requestBody) | Trạng thái    | Ghi chú                                                            |
| ----------- | --------------------------- | --------------------- | ------------- | ------------------------------------------------------------------ |
| Tên         | `name`                      | `name`                | ✅ Khớp       |                                                                    |
| Loại        | `type`                      | `type` (Bắt buộc)     | ✅ Khớp       | FE cần gửi `type` (ví dụ: 'SCHOOL').                               |
| Tổ chức cha | N/A                         | `parent_id`           | ❌ Thiếu      | FE cần bổ sung nếu hỗ trợ phân cấp.                                |
| Địa chỉ     | `streetAddress`             | `address` / `street`  | ⚠️ Mơ hồ      | BE có các trường `address` và `street` riêng biệt.Service cần map. |
| Tỉnh/TP     | `provinceCode` (số)         | `city` (chuỗi)        | ❌ Không khớp | Service cần map Code -> Tên tỉnh.                                  |
| Phường/Xã   | `wardCode` (số)             | `ward` (chuỗi)        | ❌ Không khớp | Service cần map Code -> Tên xã.                                    |
| SĐT         | `phone`                     | `phone`               | ✅ Khớp       |                                                                    |
| Email       | `email`                     | `email`               | ✅ Khớp       |                                                                    |

### Giáo viên (`/users/teachers`)

| Trường    | Frontend (UserItem/Form) | Backend (requestBody) | Trạng thái | Ghi chú                                                                     |
| --------- | ------------------------ | --------------------- | ---------- | --------------------------------------------------------------------------- |
| Tên       | `name`                   | `name`                | ✅ Khớp    |                                                                             |
| Email     | `email`                  | `email`               | ✅ Khớp    |                                                                             |
| SĐT       | `phone`                  | `phoneNumber`         | ✅ Map     | Service map `phone` -> `phoneNumber`.                                       |
| Ngày sinh | `birthDay`               | `birthDay`            | ✅ Khớp    |                                                                             |
| Địa chỉ   | `address`                | `address`             | ✅ Khớp    |                                                                             |
| Lớp       | `className`?             | `classRoomName`       | ⚠️ Map     | Service map `className` -> `classRoomName`.                                 |
| Trường    | `organizationId`         | `schoolName`          | ⚠️ Map     | BE cần `schoolName`, FE có ID. Service cần lấy tên từ ID hoặc BE hỗ trợ ID. |

### Học sinh (`/users/students`)

| Trường    | Frontend (UserItem/Form) | Backend (requestBody) | Trạng thái | Ghi chú                                     |
| --------- | ------------------------ | --------------------- | ---------- | ------------------------------------------- |
| Tên       | `name`                   | `name`                | ✅ Khớp    |                                             |
| Email     | `email`                  | `email`               | ✅ Khớp    |                                             |
| SĐT       | `phone`                  | `phoneNumber`         | ✅ Map     | Service map `phone` -> `phoneNumber`.       |
| Ngày sinh | `birthDay`               | `birthDay`            | ✅ Khớp    |                                             |
| Địa chỉ   | `address`                | `address`             | ✅ Khớp    |                                             |
| Lớp       | `className`?             | `classRoomName`       | ⚠️ Map     | Service map `className` -> `classRoomName`. |

### Bài học (`/lessons`)

| Trường     | Frontend (Lesson) | Backend (requestBody) | Trạng thái    | Ghi chú                               |
| ---------- | ----------------- | --------------------- | ------------- | ------------------------------------- |
| Tên        | `name`            | `lesson_name`         | ❌ Không khớp | Map `name` -> `lesson_name`.          |
| Chủ đề     | `topicId`         | `topic_id`            | ✅ Khớp       |                                       |
| Lớp        | `classId`         | `classroom_id`        | ❌ Không khớp | Map `classId` -> `classroom_id`.      |
| Thứ tự     | `order`           | `order_number`        | ❌ Không khớp | Map `order` -> `order_number`.        |
| Ảnh        | `thumbnail`       | `image_url`           | ❌ Không khớp | Map `thumbnail` -> `image_url`.       |
| Video      | `video`           | `video_url`           | ❌ Không khớp | Map `video` -> `video_url`.           |
| Thời lượng | `duration`        | `duration_minutes`    | ❌ Không khớp | Map `duration` -> `duration_minutes`. |

### Từ vựng (`/vocabularies`)

| Trường   | Frontend (DictionaryItem) | Backend (requestBody) | Trạng thái    | Ghi chú                                       |
| -------- | ------------------------- | --------------------- | ------------- | --------------------------------------------- |
| Nội dung | `word` / `content`        | `content`             | ✅ Khớp       |                                               |
| Chủ đề   | `topicId`                 | `topic_id`            | ✅ Khớp       |                                               |
| Loại     | `type`                    | `vocabulary_type`     | ❌ Không khớp | Map giá trị: `WORD`, `SENTENCE`, `PARAGRAPH`. |
| Ảnh      | `image`                   | `images_url`          | ❌ Không khớp | Map chuỗi -> chuỗi (tên số nhiều trong BE).   |
| Video    | `video`                   | `videos_url`          | ❌ Không khớp | Map chuỗi -> chuỗi (tên số nhiều trong BE).   |
| Riêng tư | `isPrivate`               | `is_private`          | ✅ Khớp       | (chuyển đổi snake_case).                      |

## Tóm tắt trạng thái hiện tại

Backend (`Vietsignschool_BE`) và Frontend đang dần đồng bộ. Các Service của Frontend (`userService`, `organizationService`) đã bắt đầu thực hiện mapping dữ liệu:

1.  **Users**: Đã xử lý map `facility_id` <-> `organizationId`, `phone` <-> `phoneNumber`. UI đã remove nút Edit từ list, chỉ giữ Delete.
2.  **Permissions**: Trang UI đã ẩn, chờ BE hoàn thiện hoặc tích hợp flow `organization-managers`.
3.  **Learn/Study**: Phân tách rõ ràng giữa Tự học (Local Data) và Học chính quy (API Data).
4.  **Learning Management Detail**: Hỗ trợ đầy đủ CRUD cho bài học (Lesson) và bước học (Step). Các nút thêm/sửa/xóa chỉ hiện khi ở chế độ "Chỉnh sửa thông tin".

Cần tiếp tục cập nhật `classService`, `lessonService` và `dictionaryService` để đảm bảo mapping đúng các trường tên gọi khác nhau (`name` vs `lesson_name`, `classId` vs `classroom_id`, v.v.).
