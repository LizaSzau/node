const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const app = express();
const mongoConnect = require('./utils/database').mongoConnect
const Error404Controller = require ('./controllers/404')

const shopRoutes = require('./routes/shop')
const adminRoutes = require('./routes/admin')

app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/admin', adminRoutes)
app.use('/', shopRoutes)

mongoConnect(() => {
  app.listen(3000)
})