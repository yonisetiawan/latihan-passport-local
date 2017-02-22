var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');

// apa saja yang dibutuhkan untuk besok
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passwordHash = require('password-hash');
const jwt = require('jsonwebtoken');

mongoose.connect('mongodb://localhost/besok');

// required model user
const modelUser = require('./models/model.user');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// passport
passport.use('test-login', new LocalStrategy(function(usernameInput, passwordInput, done){

  // ini cari user ke database
  modelUser.findOne({ username: usernameInput }, function(err, data){
    if (!data) {
      // data tidak ditemukan bro | engak ada res juga jadi done() aja deh
      done(null, false, {message: 'incorect username'})
    }else{
      // data ternyata ada neh bro
      if (passwordHash.verify(passwordInput, data.password)) {
        done(null, data)
      }else{
        // err password salah | engak ada res juga adi engak bisa lempar, jadi pake done aja
        done(null, false, {message: 'incorect password'})
      }
    }

  })

}))


passport.serializeUser(function(user, callback){
  callback(null, user)
})

app.use(passport.initialize())
app.use(passport.session())


// cors
app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
