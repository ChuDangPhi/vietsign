# Nhiệm vụ: Cập nhật video demo cho Từ điển

Tôi đã cập nhật dữ liệu video cho từ điển để đảm bảo video hoạt động tốt cho bản demo.

## Các thay đổi chính

1.  **Cập nhật Component `DictionaryDetail`**:

    - Đã sửa file `src/components/dictionary/detail/index.tsx`.
    - Thêm logic kiểm tra URL video:
      - Hỗ trợ **YouTube**: Hiển thị iframe.
      - Hỗ trợ **Vimeo**: Hiển thị iframe (Mới thêm).
      - Hỗ trợ file video MP4: Hiển thị thẻ `<video>`.

2.  **Cập nhật dữ liệu `dictionaryData.ts`**:
    - **Video Vimeo**: Đã cập nhật link video demo sang link Vimeo (`https://vimeo.com/661750169`) theo yêu cầu người dùng cho các từ khóa quan trọng.
    - **Nâng cấp HTTPS**: Đã chuyển đổi tất cả các link video mẫu từ `http` sang `https`.

## Tại sao sử dụng Vimeo?

Theo yêu cầu của bạn, tôi đã tích hợp hỗ trợ video từ Vimeo và sử dụng video mẫu bạn cung cấp làm dữ liệu demo. Hệ thống giờ đây linh hoạt hỗ trợ cả YouTube, Vimeo và file video trực tiếp.

Bạn có thể kiểm tra ngay bằng cách vào chi tiết các từ như "Xin chào" hoặc "Cảm ơn".
