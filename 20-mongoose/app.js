const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const Error404Controller = require ('./controllers/404')
// const User = require('./models/user')

const app = express();

app.set('view engine', 'ejs')
app.set('views', 'views')

const shopRoutes = require('./routes/shop')
const adminRoutes = require('./routes/admin')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

const User = require('./models/user')

app.use((req, res, next) => {
    User
        .findById('63ed4424ddd55545d0f6c6d0')
        .then(user => {
            req.user = user
            next()
        })
        .catch(err => console.log(err))
})

app.use('/admin', adminRoutes)
app.use('/', shopRoutes)

app.use(Error404Controller.get404)

mongoose.set('strictQuery', true)

mongoose
    .connect(
        'mongodb+srv://vividdarer:31szaui93@nodeshop.louxudq.mongodb.net/?retryWrites=true&w=majority',
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(result => {
        User
            .findOne()
            .then(user => {
                if (!user) {
                    const user = new User({
                        name: 'Pink Coca',
                        email: 'pink.coca@gmail.hu',
                        cart: {
                            items: []
                        }
                    })
                    user.save()
                }
            })
        app.listen(3000)
    })
    .catch(err => console.log('err'))