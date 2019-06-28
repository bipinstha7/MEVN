const mongoose = require('mongoose')

const EmployeeSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  salary: {
    type: Number,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  imported: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('Employee', EmployeeSchema)
