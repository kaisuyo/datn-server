const { ROLE } = require("../services/enum")

const checkAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.json({value: null, message: "Bạn chưa đăng nhập"})
  }
}

const checkUser = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role == ROLE.USER) {
    next()
  } else {
    res.json({value: null, message: "Bạn không có quyền"})
  }
}

const checkSuperUser = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role == ROLE.SUPER_USER) {
    next()
  } else {
    res.json({value: null, message: "Bạn không có quyền"})
  }
}

const checkAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role == ROLE.ADMIN) {
    next()
  } else {
    res.json({value: null, message: "Bạn không có quyền"})
  }
}

const checkSuperAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role == ROLE.SYSTEM_USER) {
    next()
  } else {
    res.json({message: "Bạn không phải người quản trị hệ thống"})
  }
}

module.exports = {
  checkAuth,
  checkUser,
  checkSuperUser,
  checkAdmin,
  checkSuperAdmin
}