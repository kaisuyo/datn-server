const ROLE = {
  LEARNER: 0,
  PROVIDER: 1,
  APPROVER: 2,
  SYSTEM: 3,
}

const USER_STATUS = {
  BLOCK: 0,
  ACTIVE: 1
}

const REGIS_TYPE = {
  // 0-> đăng ký khóa học
  REGIS: 0,
  // 1 -> Cung cấp khóa học
  HAS: 1,
  // 2 -> người duyệt
  APPROVE: 2,
  // 3 -> gợi ý
  SUGGEST: 3,
  // 4 -> gợi ý theo người dùng
  SUGGEST_BY_UESR: 4,
  // 5 -> gợi ý theo môn học
  SUGGEST_BY_SUBJECT: 5
}

const WAIT_TYPE = {
  UPLOAD: 0,
  REGIS: 1,
  RETURN: 2
}

const COURSE_STATUS = {
  N0: -2,
  BLOCK: -1,
  WAIT: 0,
  ALOW: 1
}

module.exports = { ROLE, REGIS_TYPE, WAIT_TYPE, COURSE_STATUS, USER_STATUS }