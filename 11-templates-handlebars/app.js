const http = require('http')
const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')
const expressHbs = require('express-handlebars')

const rootDir = require('./util/path')

const adminData = require ('./routes/admin')
const shopRoutes = require ('./routes/shop')

const app = express()

app.engine('hbs', expressHbs.engine({extname: '.hbs'}))
app.set('view engine', 'hbs')
app.set('views', 'views') // default

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(rootDir, 'public')))

app.use('/admin', adminData.routes)
app.use(shopRoutes)

app.use((req, res, next) => {
    res.render('404', {pageTitle: '404'})
})

app.listen(3000)