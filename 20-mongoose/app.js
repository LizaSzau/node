const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const csrf = require('csurf')
const flash = require('connect-flash')
const multer = require('multer')

const ErrorController = require ('./controllers/error')
// const User = require('./models/user')
const MONGO_DB_URI = 'mongodb+srv://vividdarer:31szaui93@nodeshop.louxudq.mongodb.net/?retryWrites=true&w=majority'

const app = express()

const store = new MongoDBStore({
    uri: MONGO_DB_URI,
    collection: 'sessions'
})

const csrfProtection = csrf()

const fileStorage = multer.diskStorage({
    destination:(req, file, cb) => {
        cb(null, 'uploads/images')
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

app.set('view engine', 'ejs')
app.set('views', 'views')

const shopRoutes = require('./routes/shop')
const adminRoutes = require('./routes/admin')
const authRoutes = require('./routes/auth')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(multer({
        storage: fileStorage,
        fileFilter: fileFilter
    })
    .single('image')) // image: field name in the form

app.use(express.static(path.join(__dirname, 'public')))
app.use('/uploads/images', express.static(path.join(__dirname, 'uploads/images')))

app.use(session({
    secret: 'my secret key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
    store: store
}))

app.use(csrfProtection)

app.use((req, res, next) => {
    if (!req.session.user) {
        next()
    } else {
        User.findById(req.session.user._id)
        .then(user => {
            if (!user) {
                return next()
            }
            req.user = user
            next();
        })
        .catch(err => {
            throw new Error(err)
        })
    }
})

const User = require('./models/user')

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn
    res.locals.userName = req.user ? req.user.name : null
    res.locals.userEmail = req.user ? req.user.email : null
    res.locals.csrfToken = req.csrfToken()
    next()
})

app.use(flash())

app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(authRoutes)
app.use('/500', ErrorController.get500)

app.use(ErrorController.get404)

app.use((error, req, res, next) => {
    // res.redirect('/500?error=' + error)
    res
        .status(500)
        .render('500', {
            path: '',
                pageTitle: '500 Error',
                //isAuthenticated: req.session.isLoggedIn,
                isAuthenticated: res.locals.isAuthenticated,
                error: error,
                errorStack: error.stack
            });
})

mongoose.set('strictQuery', true)

mongoose
    .connect(
        MONGO_DB_URI,
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(result => {
        app.listen(3000)
    })
    .catch(err => console.log('err'))