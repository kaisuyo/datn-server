const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { User } = require('../models/index')
const { bcrypt } = require('./bcrypt')

// Cấu hình Passport Local Strategy
passport.use(new LocalStrategy(
  function(username, password, done) {
    // Thực hiện xác thực người dùng dựa trên username và password ở đây
    
    // Ví dụ: truy vấn database để kiểm tra người dùng
    User.findOne({where: {username, status: 1 }}).then(user => {
      if (!user) { return done(null, false); }
      
      const isSystemUser = username == 'system'
      if (isSystemUser && password == user.password) return done(null, user)

      const verifyPassword = bcrypt.compareSync(password, user.password)
      if (!verifyPassword) { return done(null, false); }
      return done(null, user);
    }).catch(e => {
      return done(e)
    })
  }
));

// Cấu hình serialize và deserialize user cho Passport
passport.serializeUser(function(user, done) {
  done(null, user.userId);
});

passport.deserializeUser(function(id, done) {
  User.findOne({where: {userId: id}}).then(user => {
    done(null, user);
  }).catch(e => {
    done(e, null);
  })
});

module.exports = passport