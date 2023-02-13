const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')

const Error404Controller = require ('./controllers/404')
const mongoConnect = require('./utils/database').mongoConnect
const User = require('./models/user')

const app = express();

app.set('view engine', 'ejs')
app.set('views', 'views')

const shopRoutes = require('./routes/shop')
const adminRoutes = require('./routes/admin')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
    // add a user
    // const User = require('./models/user')
    // const user = new User('Pink Cocac', 'pink.coca@gmail.comc')
    // user.save('users')
    User.findById('users', '63e5565434030e50c63da197')
        .then(user => {
            req.user = new User(user.username, user.email, user._id, user.cart)
            next();
        })
        .catch(err => console.log(err))
})

app.use('/admin', adminRoutes)
app.use('/', shopRoutes)

app.use(Error404Controller.get404)

mongoConnect(() => {
    app.listen(3000)
})