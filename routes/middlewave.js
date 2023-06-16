const checkAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.json({value: null, message: "Bạn chưa đăng nhập"})
  }
}

const checkAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role == 1) {
    next()
  } else {
    res.json({value: null, message: "Bạn không có quyền"})
  }
}

const checkSuperAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role == 2) {
    next()
  } else {
    res.json({message: "Bạn không phải người quản trị hệ thống"})
  }
}

module.exports = {
  checkAuth,
  checkAdmin,
  checkSuperAdmin
}