const Joi = require('@hapi/joi')

const validateLoginInput = payload => {
  const schema = {
    email: Joi.string()
      .required()
      .email(),
    password: Joi.string().required(),
  }

  return Joi.validate(req, schema)
}

module.exports = {
  validateLoginInput,
}
