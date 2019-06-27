const argon2 = require('argon2')
const jwt = require('jsonwebtoken')

const keys = require('../config/keys')

class AuthService {
  constructor(UserModel) {
    this.UserModel = UserModel
  }

  async login(email, password) {
    const userRecord = await this.UserModel.findOne({ email })
    if (!userRecord) {
      throw new Error('User not found')
    }

    const correctPassword = await argon2.verify(userRecord.password, password)
    if (!correctPassword) {
      throw new Error('Incorrect password')
    }

    return {
      email: userRecord.email,

      // start private function with underscore(_)
      token: this._generateJWT(userRecord),
    }
  }

  async register(email, password) {
    const salt = randomBytes(32)
    const passwordHashed = await argon2.hash(password)

    const userRecord = await this.UserModel.create({
      password: passwordHashed,
      email,
    })

    const token = this._generateJWT(userRecord)

    return {
      email: userRecord.email,
      token,
    }
  }

  _generateJWT(token) {
    return jwt.sign(
      {
        data: {
          _id: user.id,
          email: user.email,
        },
      },
      keys.jwtPrivateKey,
      { expiresIn: keys.jwtExpiresIn }
    )
  }
}

module.exports = AuthService
