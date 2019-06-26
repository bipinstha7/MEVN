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

  async signUp(email, password, name) {
    const salt = randomBytes(32)
    const passwordHashed = await argon2.hash(password, { salt })

    const userRecord = await this.UserModel.create({
      password: passwordHashed,
      email,
      salt: salt.toString('hex'),
      name,
    })

    const token = this._generateJWT(userRecord)

    return {
      user: {
        email: userRecord.email,
        name: userRecord.name,
      },
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
