const Joi = require('@hapi/joi')

const validateCsvInput = payload => {
  const schema = {
    'Full Name': Joi.string().required(),
    'Date of Birth': Joi.date()
      .required(),
    gender: Joi.string().required,
    salary: Joi.number(),
    designation: Joi.string().required()
  }

  return Joi.validate(payload, schema)
}

// const validateRegisterInput = payload => {
//   const schema = {
//     email: Joi.string()
//       .min(5)
//       .max(255)
//       .required()
//       .email(),
//     password: Joi.string()
//       .min(5)
//       .max(255) // user sends the plane text which can be hold by 255 character and that plane text will be hashed and store which can be hold by 1024
//       .required(),
//   }

//   return Joi.validate(payload, schema)
// }

module.exports = {
    validateCsvInput
}
