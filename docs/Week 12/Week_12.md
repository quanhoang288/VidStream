# Báo cáo tuần 12

## 1. Công việc đã thực hiện

- Redux persist: Setup redux persist để lưu và nạp global state vào redux store

- Streaming:
  - Viết thêm 2 API để fetch manifest file và video chunk download từ drive API
  - Viết thêm các service classes để phục vụ streaming các chunks:
    - ParserMPD: Parse manifest file fetch từ server để lưu thông tin về các biểu diễn khác nhau của video và thông tin các chunks
    - Streamer: Thực hiện lấy các biểu diễn dựa vào bandwidth hiện tại của người dùng, fetch các video chunks tương ứng và nạp vào buffer để stream video. Sử dụng MSE để nạp các chunks

## 2. Vấn đề gặp phải

- Sau khi fetch các chunks và nạp vào source buffer thì hiện tại đang không nạp được vào buffer. Vẫn chưa tìm được nguyên nhân và hướng giải quyết (có thể do bước encode video khi upload chưa đúng nên source buffer không nhận chunks)

## 3. Công việc cần bổ sung

- Tìm cách giải quyết vấn đề nạp các chunks vào source buffer để stream video
- Trong trường hợp không tìm được hướng giải quyết, tìm phương án thay thế (có thể phải thay đổi cả phần upload video và lưu trữ thông tin video vì hiện tại đang thực hiện encode video thành các chunk và lưu thông tin các chunk lên drive và cơ sở dữ liệu)
- Bổ sung màn xem chi tiết video
