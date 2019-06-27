const express = require('express')
const router = express.Router()

const catchException = require('../middlewares/catchException')
const UserModel = require('../models/user')
const AuthService = require('../services/auth')
const {
  validateLoginInput,
  validateRegisterInput,
} = require('../validation/users')

router.post(
  '/login',
  catchException(async (req, res) => {
    const { error } = validateLoginInput(req.body.payload)
    if (error) return res.status(400).json(error.details[0].message)

    const { email, password } = req.body.payload

    const authServiceInstance = new AuthService(UserModel)
    const result = await authServiceInstance.login(email, password)
    res.status(200).json({ email: result.email, token: result.token })
  })
)

router.post(
  '/register',
  catchException(async (req, res) => {
    const { error } = validateRegisterInput(req.body.payload)
    if (error) return res.status(400).json(error.details[0].message)

    const { email, password } = req.body.payload
    const authServiceInstance = new AuthService(UserModel)

    const result = await authServiceInstance.register(email, password)
    res.status(200).json({ email: result.email, token: result.token })
  })
)

module.exports = router