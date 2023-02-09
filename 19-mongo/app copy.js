const http = require('http')
const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')

const sequelize = require('./utils/database')
const rootDir = require('./utils/path')

const adminRoutes = require ('./routes/admin')
const shopRoutes = require ('./routes/shop')

const Error404Controller = require ('./controllers/404')
const app = express()

app.set('view engine', 'ejs')
app.set('views', 'views') // default

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(rootDir, 'public')))

app.use('/admin', adminRoutes)
app.use(shopRoutes)

app.use(Error404Controller.get404)

const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cartItem');

app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user
            console.log('----' + user)
            console.log(req.user)
            next();
        })
        .catch(err => console.log(err))
})

/*
sequelize
    .sync({ force: false })
    .then(result => { app.listen(3000) })
    .catch(err => { console.log(err) })
*/
app.listen(3000)