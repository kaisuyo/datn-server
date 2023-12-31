var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const passport = require('./core/sessionAuth');
const cors = require('cors')

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
// const coursesRouter = require("./routes/courses");
// const subjectsRouter = require("./routes/subjects");
// const testsRouter = require('./routes/tests');
// const questionsRouter = require("./routes/questions")
// const videosRouter = require("./routes/videos")
const CommonRouter = require('./routes/Common')
const AuthRouter = require('./routes/Auth')
const SystemRouter = require('./routes/SystemManage')
const ProvideRouter = require('./routes/Provide')
const ApproveRouter = require('./routes/Approve')
const LearnRouter = require('./routes/Learn')
const SuggestRouter = require("./routes/Suggest")


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set("trust proxy", 1)

// Thiết lập middleware cho session
app.use(session({
  secret: 'your-secret-key',
  resave: true,
  saveUninitialized: true
}));

app.use(cors({
  // origin: ["http://localhost:3000", "https://doan.bacnt.own.vn"],
  origin: true,
  credentials: true,
  methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}))

// Thiết lập passport
app.use(passport.initialize());
app.use(passport.session());

app.use('/common', CommonRouter)
app.use('/auth', AuthRouter)
app.use('/system', SystemRouter)
app.use('/provide', ProvideRouter)
app.use('/approve', ApproveRouter)
app.use('/learn', LearnRouter)
app.use('/suggest', SuggestRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
