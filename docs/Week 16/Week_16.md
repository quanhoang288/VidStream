# Báo cáo tuần 16

## 1. Công việc đã thực hiện

- **Homepage**:

  - Thêm API fetch suggested video và populate dữ liệu
  - Thêm intersection observer API để lazyload video
  - Thêm chức năng like/comment video, follow người đăng bài

- **Video Detail**:

  - Populate video data
  - Thêm chức năng like/comment khi xem chi tiết
  - Follow người đăng bài

- **Profile**:

  - Thêm modal hiển thị danh sách follower/following
  - Thêm chức năng follow/unfollow khi hiển thị follow list modal + khi đang ở trang cá nhân của user khác

- **Edit Profile**:
  - Thêm giao diện + ghép API cho các chức năng:
    - Edit info (username, name, bio)
    - Change profile
    - Change password

## 2. Vấn đề gặp phải

- Cần update lại logic fetch danh sách gợi ý (video + account). Hiện tại đang lấy các bản ghi đầu tiên trong DB
- Chưa thực hiện được lazy loading cho các đối tượng dữ liệu dạng list (danh sách video, comment, follow list)

## 3. Công việc cần bổ sung

- Hoàn thiện fetch danh sách gợi ý (video/account)
- Populate danh sách video đang theo dõi
- Thêm chức năng realtime notification (khi có like, comment, follow)
- Update video player
- Bổ sung lazy loading
