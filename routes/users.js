var express = require('express');
var router = express.Router();
const passport = require('../services/auth')
const { User, WaitData } = require('../models/index')
const { bcrypt, saltRounds } = require('../services/bcrypt');
const { checkSuperAdmin } = require('./middlewave');

router.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({value: req.user})
  } else {
    res.json({})
  }
})

router.post("/login", passport.authenticate('local'), (req, res) => {
  if (req.isAuthenticated()) {
    res.json({value: req.user})
  } else {
    res.json({message: "Đăng nhập thất bại"})
  }
})

router.post("/signUp", async (req, res) => {
  const { username, password } = req.body
  try {
    const newUser = await User.findOne({where: {username}})
    if (newUser) {
      res.json({value: null, message: "Người dùng đã tồn tại"})
    } else {
      const hashPass = bcrypt.hashSync(password, saltRounds)
      await User.create({username, password: hashPass, status: 1})
      res.redirect(307, '/users/login')
    }
  } catch(e) {
    console.error(e)
    res.json({value: null, message: "Có lỗi khi đăng ký"})
  }
})

router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.json({})
  });
})

router.get('/all', checkSuperAdmin, async (req, res) => {
  try {
    const users = await User.findAll({where: {userId: {[sequelize.Op.not]: req.user.userId}}})
    res.json({value: users})
  } catch (e) {
    console.error(e)
    res.json({message: "Có lỗi trong quá trình xử lý"})
  }
})

router.post('/createAdmin', checkSuperAdmin, async (req, res) => {
  const { username, password } = req.body
  try {
    const oldAdmin = await User.findOne({where: {username}})
    if (oldAdmin) {
      res.json({message: "Tên người dùng đã tồn tại"})
    } else {
      const hashPass = bcrypt.hashSync(password, saltRounds)
      await User.create({username, password: hashPass, role: 1})
    }
    res.json({value: users})
  } catch (e) {
    console.error(e)
    res.json({message: "Có lỗi trong quá trình xử lý"})
  }
})

router.get('/info/:userId', checkSuperAdmin, async (req, res) => {
  try {
    const userId = req.params.userId
    const user = await User.update({where: {userId}})
    res.json({value: user})
  } catch (e) {
    res.json({message: "Có lỗi trong quá trình xử lý"})
  }
})

router.get('/block:userId', checkSuperAdmin, async (req, res) => {
  try {
    const blockUserId = req.params.userId
    await User.update({status: 0}, {where: {userId: blockUserId}})
    res.json({value: true})
  } catch (e) {
    res.json({message: "Có lỗi trong quá trình xử lý"})
  }
})


module.exports = router;
