const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express()

const feedRoutes = require('./routes/feed')

const MONGO_DB_URI = 'mongodb+srv://vividdarer:31szaui93@nodeshop.louxudq.mongodb.net/blog?retryWrites=true&w=majority'

// app.use(bodyParser.urlencoded({ extended: false })) // x-www-form-urlencoded <form>
app.use(bodyParser.json()) // application/json
app.use('/images', express.static(path.join(__dirname, 'images')))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-type, Authorization')
    next()
})

app.use('/feed', feedRoutes)

app.use((error, req, res, next) => {
    const status = error.statusCode || 500
    const message = error.message
    res.status(status).json({errors: message}) 
})

mongoose.set('strictQuery', true)

mongoose
    .connect(
        MONGO_DB_URI,
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(result => {
        app.listen(8080)
    })
    .catch(err => console.log('err'))