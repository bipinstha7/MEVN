const express = require('express')
const app = express()
const cors = require('cors')

app.use(express.static(__dirname + '/../assets/images'))
app.use(express.json())
app.use(cors())
require('../routes')(app)

module.exports = app
