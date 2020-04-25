const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(require('./usuario'))
app.use(require('./login'))
app.use(require('./categoria'))
app.use(require('./producto'))
app.use(require('./upload'))
app.use(require('./imagenes'))

module.exports = app;