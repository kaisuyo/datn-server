var express = require('express');
var router = express.Router();
const passport = require('../services/auth')
const { User, WaitData } = require('../models/index')
const { bcrypt, saltRounds } = require('../services/bcrypt');
const { checkAdmin } = require('./middlewave');

router.post("/login", passport.authenticate('local'), (req, res) => {
  res.json({value: req.user})
})

router.post("/register", async (req, res) => {
  try {
    const newUser = await User.findOne({where: {username: req.body.username}})
    if (newUser) {
      res.json({value: null, message: "Người dùng đã tồn tại"})
    } else {
      const hashPass = bcrypt.hashSync(req.body.password, saltRounds)
      await User.create({username, password: hashPass, status: 1})
      res.redirect('/login')
    }
  } catch(e) {
    console.error(e)
    res.json({value: null, message: "Có lỗi khi đăng ký"})
  }
})

router.get('/logout', (req, res) => {
  req.logout();
  res.json({value: null})
})

router.post('/registerAdmin', async (req, res) => {
  try {
    const newAdmin = await User.findOne({where: {username: req.body.username}})
    if (newAdmin) {
      res.json({value: false})
    } else {
      const hashPass = bcrypt.hashSync(req.body.password, saltRounds)
      const admin = await User.create({username, password: hashPass, status: 0})
      // waitType  = 0 -> đăng ký admin, = 1 -> đăng ký khóa học
      await WaitData.create({userId: admin.userId, waitType: 0})
      res.json({value: true})
    }
  } catch (e) {
    console.error(e)
    res.json({value: null, message: "Có lỗi trong quá trình đăng ký"})
  }
})

router.get('/acceptAdmin:userId', checkAdmin, async (req, res) => {
  const { userId } = req.params
  try {
    const adminWait = await WaitData.findOne({where: {userId, waitType: 0}})
    await User.update({status: 1}, {where: {userId}})
    if (adminWait) {
      await WaitData.destroy({where: {userId: newAdmin.userId, waitType: 0}})
    }

    res.json({value: true, message: "Chấp nhận thành công"})
    
  } catch (e) {
    console.error(e)
    res.json({message: "Có lỗi trong quá trình xử lý"})
  }
})

module.exports = router;
