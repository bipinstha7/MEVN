const mongoose = require('mongoose')
const keys = require('../config/keys')

module.exports = () => {
  mongoose
    .connect(keys.mongoURI, { useNewUrlParser: true })
    .then(() => console.log('MongoDB is connected'))
    .catch(err => console.log({ err }))
}
