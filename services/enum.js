const ROLE = {
  USER: 0,
  SUPER_USER: 1,
  ADMIN: 2,
  SYSTEM_USER: 3,
}

const REGIS_TYPE = {
  // 0-> đăng ký khóa học
  REGIS: 0,
  // 1 -> Cung cấp khóa học
  HAS: 1
}

const WAIT_TYPE = {
  UPLOAD: 0,
  REGIS: 1
}

module.exports = { ROLE, REGIS_TYPE, WAIT_TYPE }