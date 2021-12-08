const successMessages = {
  REGISTER_SUCCESSFUL: 'Đăng ký tài khoản thành công',
};

const errorMessages = {
  USERNAME_REQUIRED: 'Tên tài khoản là bắt buộc',
  PASSWORD_REQUIRED: 'Mật khẩu là bắt buộc',
  CONFIRM_PASSWORD_REQUIRED: 'Xác nhận mật khẩu là bắt buộc',
  CONFIRM_PASSWORD_NOT_MATCH: 'Xác nhận mật khẩu không trùng khớp',
  PASSWORD_LENGTH_INVALID:
    'Mật khẩu phải chứa ít nhất 6 ký tự và không vượt quá 255 ký tự',
  USERNAME_ALREADY_EXIST: 'Tên tài khoản đã được sử dụng',
  INTERNAL_SERVER_ERROR: 'Đã có lỗi xảy ra từ phía server',
  INCORRECT_USERNAME_OR_PASSWORD: 'Tài khoản hoặc mật khẩu không hợp lệ',
  INVALID_MIME_TYPE: 'Bạn cần chọn file có định dạng MP4 hoặc WebM',
  INVALID_FILE_SIZE: 'Bạn cần chọn file có kích thước không vượt quá 2GB',
  UPLOAD_VIDEO_FAILURE: 'Đã có lỗi xảy ra khi đăng tải video!',
};

export { successMessages, errorMessages };
