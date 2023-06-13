const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { User } = require('../models/index')
const { bcrypt } = require('./bcrypt')

// Cấu hình Passport Local Strategy
passport.use(new LocalStrategy(
  function(username, password, done) {
    // Thực hiện xác thực người dùng dựa trên username và password ở đây
    // Ví dụ: truy vấn database để kiểm tra người dùng
    User.findOne({ username: username, status: 1 }, function(err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }

      const verifyPassword = bcrypt.compareSync(password, user.password)
      if (!verifyPassword) { return done(null, false); }
      return done(null, user);
    });
  }
));

// Cấu hình serialize và deserialize user cho Passport
passport.serializeUser(function(user, done) {
  done(null, user.userId);
});

passport.deserializeUser(function(id, done) {
  User.findOne({userId: id}, function(err, user) {
    done(err, user);
  });
});

module.exports = passport