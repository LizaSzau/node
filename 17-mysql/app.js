const http = require('http')
const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')

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

app.listen(3000)