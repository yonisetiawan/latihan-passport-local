const modelUser = require('../models/model.user.js')
const passwordHash = require('password-hash')
const jwt = require('jsonwebtoken')

var objVerify = {
  verify: function (req, res, next) {
    if (req.headers.token == 'null') {
      res.json({msgCode: 0, msg: 'you not login yet'})
    }else {
      // let user = jwt.verify(req.headers.token, 'secret')
      jwt.verify(req.headers.token, 'secret', function (err, decoded) {
        // err
        console.log(' verify : ')
        console.log(typeof (err))
        console.log(decoded)
        if (err) {
          res.json({msgCode: 0,msg: 'session already exp'})
        }else {
          next()
        }
      })
    }
  }
}

module.exports = objVerify
