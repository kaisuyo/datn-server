var express = require('express');
const { ROLE } = require('../core/enum');
const { checkAuth } = require('../core/middlewave');
const passport = require('../core/sessionAuth');
const BaseUser = require('../services/BaseUser/BaseUser');
var router = express.Router();

router.post("/", (req, res) => {
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
  await BaseUser.create(username, password, ROLE.LEARNER)
  res.redirect(307, '/auth/login')
})

router.post('/changePass', checkAuth, async (req, res) => {
  const { newPassword, oldPassword } = req.body
  const result = await BaseUser.changePassword(req.user.userId, newPassword, oldPassword)
  res.json(result)
})

router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.json({})
  });
})

module.exports = router;
