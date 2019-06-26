const users = require('./users')
const error = require('../middlewares/errors')

module.exports = app => {
  app.use('/api/v1/users', users)
  app.use(error)
}
