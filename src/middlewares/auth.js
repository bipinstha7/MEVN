const jwt = require('jsonwebtoken')
const keys = require('../config/keys')
const EmployeeModel = require('../models/employee')

const checkLogin = (req, res, next) => {
  let token = req.header('authorization')

  if (!token) return res.status(401).send('Access denied. No token provided.')

  let decoded = null
  try {
    decoded = jwt.verify(token, keys.jwtPrivateKey)
  } catch (error) {
    return res.status(400).send('Invalid Token.')
  }

  EmployeeModel.findOne({ email: decoded.email })
    .then(customer => {
      if (!customer) {
        res.status(426).json({
          message: 'Access Token Expired or Not Provided',
        })
      } else {
        next()
      }
    })
    .catch(function(err) {
      res.status(426).json({
        message: 'Access Token Expired or Not Provided',
      })
    })
}

module.exports = checkLogin
