# Báo cáo tuần 15

## 1. Công việc đã thực hiện

- **Video upload**: Update logic upload + Video model:

  - Không chia thành các chunk nữa mà upload toàn bộ video lên drive
  - Update lại Video model thêm trường remoteId để lưu id của video lưu trên drive
  - Khi download video từ drive có thể lựa chọn range request để download video theo chunk

- **Stream video**:

  - Fetch được video theo id của video và play được video
  - Quá trình play video đang sử dụng cơ chế mặc định của browser

- **Update profile view**:

  - Fetch dữ liệu từ api và hiển thị lên view (thông tin user, danh sách các video)

- **Thêm view xem chi tiết video**:
  - Fetch dữ liệu video theo id (metainfo, comments, user info)
  - Tạo view xem chi tiết video
  - Update video player nhận video id và phát nội dung video có id tương ứng từ server

## 2. Vấn đề gặp phải

- **Stream video**:
  - Chưa custom được xử lý sự kiện video player (có thể chỉ làm được 1 số thao tác cơ bản)
  - Cơ chế fetch theo chunk đang dùng mặc định của browser (do browser cũng fetch mặc định video theo chunk)

## 3. Công việc cần bổ sung

- Hoàn thiện các api liên quan đến tương tác với video (like/comment)
- Hoàn thiện api follow/unfollow user, lấy danh sách followers/following, danh sách user đề xuất
- Thêm api lấy danh sách video đề xuất/video của users đang follow + update home view
