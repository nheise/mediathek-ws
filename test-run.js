const settings = require('./settings')
settings.baseURL = 'http://localhost:3000/mediathek-api'
const webservice = require('./webservice')
const express = require('express')
const http = require("http")

const PORT = 3000
const app = express()

app.use( function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
})

app.use( '/mediathek-api', webservice )

const server = app.listen(PORT, function () {
    console.log(`Test server runs on port ${PORT}!`);
})