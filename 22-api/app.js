const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const multer = require('multer')

const dotenv = require('dotenv');
dotenv.config();

const app = express()

const fileStorage = multer.diskStorage({
    destination:(req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' || 
        file.mimetype === 'image/jpg' || 
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const feedRoutes = require('./routes/feed')
const userRoutes = require('./routes/user')

const MONGO_DB_URI = 'mongodb+srv://vividdarer:31szaui93@nodeshop.louxudq.mongodb.net/blog?retryWrites=true&w=majority'

// app.use(bodyParser.urlencoded({ extended: false })) // x-www-form-urlencoded <form>
app.use(bodyParser.json()) // application/json

app
    .use(multer({
        storage: fileStorage,
        fileFilter: fileFilter
    })
    .single('image')) 

app.use('/images', express.static(path.join(__dirname, 'images')))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-type, Authorization')
    next()
})

app.use('/feed', feedRoutes)
app.use('/user', userRoutes)

app.use((error, req, res, next) => {
    const status = error.statusCode || 500
    const message = error.message
    const data = error.data
    res.status(status).json({errors: message, data: data}) 
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