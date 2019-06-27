const Joi = require('@hapi/joi')

const validateLoginInput = payload => {
  const schema = {
    email: Joi.string()
      .required()
      .email(),
    password: Joi.string().required(),
  }

  return Joi.validate(payload, schema)
}

const validateRegisterInput = payload => {
  const schema = {
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .min(5)
      .max(255) // user sends the plane text which can be hold by 255 character and that plane text will be hashed and store which can be hold by 1024
      .required(),
  }

  return Joi.validate(payload, schema)
}

module.exports = {
  validateLoginInput,
  validateRegisterInput,
}
