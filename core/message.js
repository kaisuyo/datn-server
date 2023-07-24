const Message = {

  SYSTEM_ERR: "Đã có lỗi hệ thống",
  EXECUTE_QUERY_ERR: "Có lỗi trong quá trình truy xuất dữ liệu",
  ROLE_NOT_CORRECTED: "Bạn không có quyền thực hiện chức năng này",
  CREATE_USER_FAIL: "Đăng ký tài khoản thất bại",
  LOGIN_FAIL: "Đăng nhập thất bại",
  USER_EXIST_ERR: "Người dùng đã tồn tại",
  CHANGE_SYSTEM_ACCOUNT_ERR: "Không thể thay đổi thông tin của admin",
  CHANGE_USER_INFO_NOT_VALID_ERR: "Thông tin không hợp lệ",
  USER_NOT_EXIST: "Người dùng không tồn tại",
  COURSE_NOT_EXIST: "Khóa học không tồn tại",
  COURSE_REGIS_EXIST: "Bạn đã đăng ký khóa học này rồi",
  CANNOT_DELETE_COURSE: "Bạn không thể xóa khóa học này",
  CANNOT_UPDATE_COURSE_ERR: "Không thể thay đổi thông tin khóa học này",
  CANNOT_TAKE_FOR_APPROVE: "Không thể phê duyệt cho khóa học này",
  TEST_ERR: "Bài kiểm tra bị lỗi",
  COURSE_BE_REGIS: "Khóa học đã được đăng ký",
  
  CREATE_USER_SUCCESS: "Đăng ký tài khoản thành công",
  LOGIN_SUCCESS: "Đăng nhập thành công",
  CREATE_SUBJECT_SUCCESS: "Tạo môn học thành công",
  CHANGE_PASSWORD_SUCCESS: "Thay đổi mật khẩu thành công",
  SEND_REQUEST_REGIS_COURSE: "Đã gửi yêu cầu đăng ký khóa học",
  SEND_REQUEST_APPROVE_COURSE: "Đã gửi yêu cầu kiểm duyệt khóa học",
  UPDATE_COURSE_SUCCESS: "Thay đổi thông tin khóa học thành công",

}

module.exports = Message