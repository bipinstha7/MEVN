const users = require('./users')
const employees = require('./employees')
const error = require('../middlewares/errors')

module.exports = app => {
  app.use('/api/v1/users', users)
  app.use('/api/v1/employees', employees)
  app.use(error)
}
