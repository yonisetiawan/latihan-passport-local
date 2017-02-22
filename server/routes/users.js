var express = require('express');
var router = express.Router();
const modelUser = require('../models/model.user.js');
var passwordHash = require('password-hash');
var passport = require('passport')
const jwt = require('jsonwebtoken');

// ini midelware

var objVerify = {
  verify: function(req, res, next){
    if (req.headers.token == 'null') {
      res.json("you don't have access")
    }else{
      if (jwt.verify(req.headers.token, 'lol')) {
        next()
      }else {
        res.json("token sudah expried")
      }
    }
  }
}


/* GET users listing. */
router.get('/alluser', objVerify.verify, function(req, res, next) {
  modelUser.find({}, function(err, data){
    if (err) throw err
    res.json(data)
  })
});

/* login */
router.post('/login', passport.authenticate('test-login'), function(req, res, next) {
  // user.username neh dapet dari app.js neh yang serializeUser
  // console.log(req.body.username);
  var token = jwt.sign({ username: req.body.username }, 'lol');
  res.send({ token: token })
});

/* localhost:3000/users/register | register new user */
router.post('/register', function(req, res, next) {
  var newUser = modelUser({
    username: req.body.username,
    password: passwordHash.generate(req.body.password)
  })

  newUser.save(function(err, data){
    if (err) throw err
    res.json(data)
  })
});


module.exports = router;
