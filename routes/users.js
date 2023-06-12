var express = require('express');
var router = express.Router();
const passport = require('../services/auth')
const { User } = require('../models/index')
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

module.exports = router;
