const express = require('express')
const bodyParser = require('body-parser')

const app = express()

const feedRoutes = require('./routes/feed')

// app.use(bodyParser.urlencoded({ extended: false })) // x-www-form-urlencoded <form>
app.use(bodyParser.json()) // application/json

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-type, Authorization')
    next()
})

app.use('/feed', feedRoutes)

app.listen(8080)