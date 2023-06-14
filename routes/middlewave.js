const checkAuth = async (req, res, next) => {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.json({value: null, message: "Bạn chưa đăng nhập"})
  }
}

const checkAdmin = async (req, res, next) => {
  if (req.isAuthenticated() && req.user.role == 1) {
    next()
  } else {
    res.json({value: null, message: "Bạn không có quyền"})
  }
}

module.exports = {
  checkAuth,
  checkAdmin
}