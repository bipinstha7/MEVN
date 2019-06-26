const express = require('express')
const router = express.Router()

const catchException = require('../middlewares/catchException')
const UserModel = require('../models/user')
const AuthService = require('../services/auth')
const { validateLoginInput } = require('../validation/users')

router.post(
  '/login',
  catchException(async (req, res) => {
    const { error } = validateLoginInput(req.body.payload)
    if (error) return res.status(400).send(error.details[0].message)

    const { email, password } = req.body.payload

    const authServiceInstance = new AuthService(UserModel)
    const { user, token } = await authServiceInstance.login(email, password)
    res.status(200).json({ user, token })
  })
)

router.post(
  '/register',
  catchException(async (req, res) => {
    const { error } = validateLoginInput(req.body.payload)
    if (error) return res.status(400).send(error.details[0].message)

    const { name, email, password } = req.body.payload
    const authServiceInstance = new AuthService(UserModel)

    const { user, token } = await authServiceInstance.signUp(
      email,
      password,
      name
    )
    res.status(200).json({ user, token })
  })
)
