var express = require('express');
var router = express.Router();
const passport = require('../services/auth')
const { User, WaitData } = require('../models/index')
const { bcrypt, saltRounds } = require('../services/bcrypt')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/login", passport.authenticate('local'), (req, res) => {
  res.json({value: req.user})
})

router.post("/register", async (req, res) => {
  const newUser = await User.findOne({where: {username: req.body.username}})
  if (newUser) {
    res.json({value: null})
  } else {
    const hashPass = bcrypt.hashSync(req.body.password, saltRounds)
    await User.create({username, password: hashPass})
    res.redirect('/login')
  }
})

router.get('/logout', (req, res) => {
  req.logout();
  res.json({value: null})
})

router.post('/registerAdmin', async (req, res) => {
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
})

router.get('/acceptAdmin:userId', async (req, res) => {
  const newAdmin = await User.findOne({where: {userId: req.params.userId}})
  if (newAdmin) {
    const adminWait = await WaitData.findOne({where: {userId: newAdmin.userId, waitType: 0}})
    await User.update({status: 1}, {where: {userId: newAdmin.userId}})
    if (adminWait) {
      await WaitData.destroy({where: {userId: newAdmin.userId, waitType: 0}})
    }

    res.json({value: true})
  } else {
    res.json({value: false})
  }
})

module.exports = router;
