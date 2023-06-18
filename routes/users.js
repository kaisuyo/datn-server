var express = require('express');
var router = express.Router();
const passport = require('../services/auth')
const { User, WaitData } = require('../models/index')
const { bcrypt, saltRounds } = require('../services/bcrypt');
const { checkSuperAdmin, checkAuth } = require('./middlewave');
const { ROLE } = require('../services/enum');

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

router.post('/changePass', checkAuth, async (req, res) => {
  const { newPassword, oldPassword } = req.body
  try {
    const user = await User.findOne({where: {userId: req.user.userId}})
    const verifyPass = bcrypt.compareSync(oldPassword, user.password)
    if (verifyPass) {
      const hashPass = bcrypt.hashSync(newPassword, saltRounds)
      await User.update({password: hashPass}, {where: {userId: req.user.userId}})
      res.json({value: true, message: "Thay đổi mật khẩu thành công"})
    } else {
      res.json({message: "Mật khẩu cũ không chính xác"})
    }
  } catch(e) {
    console.error(e)
    res.json({message: "Có lỗi trong quá trình xử lý"})
  }
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

router.get('/:roleType', checkSuperAdmin, async (req, res) => {
  try {
    const users = await User.findAll({where: {role: req.params.roleType}})
    res.json({value: users})
  } catch (e) {
    console.error(e)
    res.json({message: "Có lỗi trong quá trình xử lý"})
  }
})

router.post('/create', checkSuperAdmin, async (req, res) => {
  const { username, password, roleType } = req.body
  try {
    const oldAdmin = await User.findOne({where: {username}})
    if (oldAdmin) {
      res.json({message: "Tên người dùng đã tồn tại"})
    } else {
      const hashPass = bcrypt.hashSync(password, saltRounds)
      const user = await User.create({username, password: hashPass, role: roleType})
      res.json({value: user})
    }
  } catch (e) {
    console.error(e)
    res.json({message: "Có lỗi trong quá trình xử lý"})
  }
})

router.post('/delete', checkSuperAdmin, async (req, res) => {
  const { userId } = req.body
  try {
    await User.destroy({where: {userId}})
    res.json({value: true})
  } catch (e) {
    console.error(e)
    res.json({message: "Có lỗi trong quá trình xử lý"})
  }
})

router.post('/resetPass', checkSuperAdmin, async (req, res) => {
  const { userId } = req.body
  try {
    const newPass = '0'
    const hashPass = bcrypt.hashSync(newPass, saltRounds)
    await User.update({password: hashPass}, {where: {userId}})
    res.json({value: true, message: "Đổi mật khẩu thành công"})
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

router.post('/block', checkSuperAdmin, async (req, res) => {
  const { userId } = req.body
  try {
    await User.update({status: 0}, {where: {userId}})
    res.json({value: true})
  } catch (e) {
    res.json({message: "Có lỗi trong quá trình xử lý"})
  }
})

router.post('/unblock', checkSuperAdmin, async (req, res) => {
  const { userId } = req.body
  try {
    await User.update({status: 1}, {where: {userId}})
    res.json({value: true})
  } catch (e) {
    res.json({message: "Có lỗi trong quá trình xử lý"})
  }
})

module.exports = router;
