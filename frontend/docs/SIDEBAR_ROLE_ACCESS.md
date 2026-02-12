# Bản Đồ Truy Cập Sidebar & Chức Năng Theo Role

Tài liệu này mô tả chi tiết các trang hiển thị trên Sidebar, quyền truy cập (Role) và các chức năng chính mà người dùng có thể thực hiện trên từng trang.

## Các Role Trong Hệ Thống

- **ADMIN**: Quản trị viên hệ thống (Toàn quyền).
- **FACILITY_MANAGER**: Quản lý cấp cơ sở/trường học.
- **TEACHER**: Giáo viên.
- **STUDENT**: Học sinh.
- **USER**: Người dùng vãng lai/đăng ký tự do.
- **TEST**: Tài khoản kiểm thử (thường có quyền tương đương admin hoặc full quyền).

---

## Chi Tiết Chức Năng Từng Trang

### 1. Trang chủ

- **Đường dẫn**: `/home`
- **Quyền truy cập**: Tất cả (All)
- **Chức năng chính**:
  - Xem trang tổng quan hệ thống.
  - Lối tắt nhanh đến các chức năng thường dùng.
  - Xem các tin tức hoặc thông báo nổi bật.

### 2. Dashboard

- **Đường dẫn**: `/dashboard`
- **Quyền truy cập**: Tất cả (All)
- **Chức năng chính**:
  - **Admin/Manager**: Xem thống kê tổng quan (số lượng user, lớp học, lưu lượng truy cập...).
  - **Teacher**: Xem thống kê lớp mình phụ trách, tiến độ học tập của học sinh.
  - **Student/User**: Xem tiến độ học tập cá nhân, biểu đồ hoạt động.

### 3. Tin nhắn

- **Đường dẫn**: `/messages`
- **Quyền truy cập**: Tất cả (All)
- **Chức năng chính**:
  - Gửi và nhận tin nhắn nội bộ.
  - Chat nhóm (hỗ trợ các nhóm lớp học).
  - Liên lạc trực tiếp giữa Giáo viên và Học sinh.

### 4. Quản lý người dùng

- **Đường dẫn**: `/users-management`
- **Quyền truy cập**: `ADMIN`, `TEST`
- **Chức năng chính**:
  - Xem danh sách người dùng trong hệ thống.
  - Thêm mới tài khoản người dùng.
  - Chỉnh sửa thông tin cá nhân, đặt lại mật khẩu.
  - Xóa hoặc vô hiệu hóa tài khoản.
  - Phân quyền (gán Role) cho người dùng.
  - chỉ có thể chỉnh sửa các tài khoản có role thấp hơn mình.

### 5. Quản lý tổ chức

- **Đường dẫn**: `/organizations-management`
- **Quyền truy cập**: `ADMIN`, `FACILITY_MANAGER`, `TEST`
- **Chức năng chính**:
  **Admin**:
  - Quản lý danh sách tất cả các tỉnh, trường học, cơ sở đào tạo.
  - Quản lý cấu trúc đơn vị hành chính tỉnh.
  - Cấu hình thông tin chung của tổ chức.
    **FACILITY_MANAGER**: - Quản lý danh sách các trường học, cơ sở đào tạo mà cơ sở manager này quản lý. vd: quản trị viên cơ sở của tp Hà Nội thì khi vào trang sẽ tự động chuyển đến trang chi tiết của tỉnh Hà Nội và chỉ có thể xem và chỉnh sửa thông tin của tỉnh Hà Nội cùng các cơ sở trong tỉnh Hà Nội.
  - Cấu hình thông tin chung của tổ chức mà người dùng có quyền chỉnh sửa.

### 6. Quản lý học tập

- **Đường dẫn**: `/learning-management`
- **Quyền truy cập**: `ADMIN`, `FACILITY_MANAGER`, `TEACHER`, `TEST`
- **Chức năng chính**:
  - **Admin/FACILITY_MANAGER**: Quản lý chương trình khung, khóa học mẫu của hệ thống.
  - Tạo và biên soạn nội dung bài học, chủ đề.
  - Tải lên và quản lý tài liệu học tập (video, hình ảnh).

### 7. Quản lý lớp học

- **Đường dẫn**: `/classes-management`
- **Quyền truy cập**: `ADMIN`, `FACILITY_MANAGER`, `TEACHER`, `TEST`
- **Chức năng chính**:
  - **Admin**: Xem và quản lý tất cả lớp học trong hệ thống. Tạo mới lớp học và phân công giáo viên.
  - **FACILITY_MANAGER**: Xem và quản lý các lớp học trong các trường thuộc phạm vi quản lý (theo cấp Tỉnh → Sở → Trường). Ví dụ: Manager của Hà Giang sẽ thấy tất cả lớp trong các trường thuộc các Sở GD của Hà Giang.
  - **TEACHER**: Chỉ xem các lớp mà mình đang phụ trách (teacherId trùng với ID người dùng).
  - Phân công giáo viên chủ nhiệm và giáo viên bộ môn (**Admin/FACILITY_MANAGER**).
  - Thêm học sinh vào lớp (thủ công hoặc import danh sách).
  - Quản lý lịch học và thời khóa biểu.

### 8. Thông báo

- **Đường dẫn**: `/notifications`
- **Quyền truy cập**: Tất cả (All)
- **Chức năng chính**:
  - **Admin/Manager/Teacher**: Soạn thảo và gửi thông báo mới đến các đối tượng cụ thể.
  - **Tất cả người dùng**: Xem danh sách thông báo đã nhận, đánh dấu tin đã đọc.

### 9. Quản lý công cụ

- **Đường dẫn**: `/tools`
- **Quyền truy cập**: `ADMIN`, `TEST`Ư
- **Chức năng chính**:
  - Cấu hình các công cụ hệ thống (System Tools).
  - Quản lý các cài đặt kỹ thuật nâng cao.

### 10. Quản lý kiểm tra

- **Đường dẫn**: `/exams-management`
- **Quyền truy cập**: `ADMIN`, `FACILITY_MANAGER`, `TEACHER`, `TEST`
- **Chức năng chính**:
  - **Admin**: Xem và quản lý tất cả bài kiểm tra trong hệ thống.
  - **FACILITY_MANAGER**: Xem và quản lý bài kiểm tra từ các lớp trong trường/cơ sở thuộc phạm vi quản lý (theo cấp Tỉnh → Sở → Trường).
  - **TEACHER**: Chỉ xem các bài kiểm tra trong các lớp mà mình phụ trách.
  - Tạo và quản lý ngân hàng đề thi.
  - Thiết lập các kỳ thi (cấu trúc đề, thời gian làm bài, quy chế).
  - Phân công bài thi cho từng lớp học cụ thể.

### 11. Thống kê

- **Đường dẫn**: `/statistics`
- **Quyền truy cập**: Tất cả (All)
- **Chức năng chính**:
  - Xem các thống kê chi tiết về hoạt động học tập và giảng dạy.

### 12. Quản lý từ điển

- **Đường dẫn**: `/dictionary-management`
- **Quyền truy cập**: `ADMIN`, `TEST`
- **Chức năng chính**:
  - Thêm từ vựng mới vào kho từ điển gốc (Dictionary Master Data).
  - Tải lên video mô phỏng ký hiệu, hình ảnh minh họa.
  - Duyệt và kiểm tra tính chính xác của dữ liệu từ vựng.

### 13. Quản lý trò chơi

- **Đường dẫn**: `/games-management`
- **Quyền truy cập**: `ADMIN`, `TEST`
- **Chức năng chính**:
  - Cấu hình nội dung cho các trò chơi (ví dụ: chọn bộ từ vựng dùng trong game).
  - Quản lý các cài đặt tham số trò chơi (độ khó, thời gian...).

### 14. Quản lý câu hỏi

- **Đường dẫn**: `/questions-management`
- **Quyền truy cập**: `ADMIN`, `FACILITY_MANAGER`, `TEACHER`, `TEST`
- **Chức năng chính**:
  - **Admin**: Xem và quản lý tất cả câu hỏi trong hệ thống.
  - **FACILITY_MANAGER**: Xem và quản lý câu hỏi từ các lớp trong trường/cơ sở thuộc phạm vi quản lý (theo cấp Tỉnh → Sở → Trường).
  - **TEACHER**: Chỉ xem câu hỏi từ các lớp mà mình phụ trách.
  - Tạo mới câu hỏi trắc nghiệm, câu hỏi video, câu hỏi ghép cặp...
  - Quản lý ngân hàng câu hỏi dùng chung cho các bài luyện tập và kiểm tra.

### 15. Từ điển

- **Đường dẫn**: `/vocabularies`
- **Quyền truy cập**: Tất cả (All)
- **Chức năng chính**:
  - Tra cứu từ vựng ngôn ngữ ký hiệu.
  - Xem video hướng dẫn thực hiện ký hiệu, hình ảnh và ví dụ ngữ cảnh.
  - Tìm kiếm nâng cao theo chủ đề hoặc từ khóa.

### 16. Trò chơi

- **Đường dẫn**: `/games`
- **Quyền truy cập**: Tất cả (All)
- **Chức năng chính**:
  - Tham gia các trò chơi giáo dục (ghép thẻ, trắc nghiệm, đoán từ...).
  - Vừa chơi vừa rèn luyện trí nhớ và phản xạ ngôn ngữ ký hiệu.

### 17. Luyện tập

- **Đường dẫn**: `/practice`
- **Quyền truy cập**: Tất cả (All)
- **Chức năng chính**:
  - Chế độ tự luyện tập với AI: Sử dụng camera để nhận diện cử chỉ tay.
  - Hệ thống tự động chấm điểm và phản hồi độ chính xác.
  - Ôn tập lại các từ vựng đã học.

### 18. Chấm điểm

- **Đường dẫn**: `/grading`
- **Quyền truy cập**: `ADMIN`, `FACILITY_MANAGER`, `TEACHER`, `TEST`
- **Chức năng chính**:
  - Xem danh sách bài tập nộp của học sinh (thường là video thực hành).
  - Giáo viên xem video, chấm điểm và viết nhận xét/góp ý chi tiết.

### 19. Làm bài kiểm tra

- **Đường dẫn**: `/take-exam`
- **Quyền truy cập**: `STUDENT`, `TEST`
- **Chức năng chính**:
  - Học sinh tham gia làm bài kiểm tra theo thời gian thực.
  - Hệ thống ghi nhận bài làm và tự động nộp khi hết giờ.
  - Xem kết quả thi (nếu giáo viên cho phép công bố ngay).

### 20. Lớp học của tôi

- **Đường dẫn**: `/study`
- **Quyền truy cập**: `ADMIN`, `TEACHER`, `STUDENT`, `TEST`
- **Chức năng chính**:
  - **Student**: Xem danh sách các lớp đang tham gia, vào học các bài giảng được giao.
  - **Teacher**: Truy cập giao diện lớp học ở góc nhìn người học (để kiểm tra hiển thị).

### 21. Học tập

- **Đường dẫn**: `/learn`
- **Quyền truy cập**: Tất cả (All)
- **Chức năng chính**:
  - Truy cập kho bài học tự do (các bài học đại chúng không thuộc lớp học kín).
  - Học theo lộ trình cá nhân hóa (nếu có).

### 22. Ký hiệu mỗi ngày

- **Đường dẫn**: `/daily-signs`
- **Quyền truy cập**: Tất cả (All)
- **Chức năng chính**:
  - Xem từ vựng hoặc câu "Word of the Day" được hệ thống gợi ý.
  - Duy trì chuỗi ngày học tập liên tục (Streak).

---

## Ghi Chú Kỹ Thuật

- **Client-side**: Các quyền truy cập trên được xử lý logic tại `Sidebar` component để quyết định việc ẩn/hiện menu item tương ứng với User Role.
- **Server-side**: Đảm bảo API Backend có cài đặt các **Guard** hoặc **Middleware** phân quyền tương ứng. Điều này ngăn chặn việc người dùng truy cập trái phép bằng cách gõ trực tiếp URL API hoặc sử dụng công cụ như Postman.
