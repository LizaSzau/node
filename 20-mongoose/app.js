const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const csrf = require('csurf')
const flash = require('connect-flash')

const Error404Controller = require ('./controllers/404')
// const User = require('./models/user')
const MONGO_DB_URI = 'mongodb+srv://vividdarer:31szaui93@nodeshop.louxudq.mongodb.net/?retryWrites=true&w=majority'

const app = express();

const store = new MongoDBStore({
    uri: MONGO_DB_URI,
    collection: 'sessions'
})

const csrfProtection = csrf()

app.set('view engine', 'ejs')
app.set('views', 'views')

const shopRoutes = require('./routes/shop')
const adminRoutes = require('./routes/admin')
const authRoutes = require('./routes/auth')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

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
            req.user = user
            next();
        })
        .catch(err => console.log(err))
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

app.use(Error404Controller.get404)

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