const http = require('http')
const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')

const rootDir = require('./util/path')

const addUserRoutes = require ('./routes/addUser')
const listUsersRoutes = require ('./routes/listUsers')

const app = express()

app.set('view engine', 'pug')
app.set('views', 'views') // default

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(rootDir, 'public')))

app.use(addUserRoutes.routers)
app.use(listUsersRoutes)

app.use((req, res, next) => {
    res.render('404', {pageTitle: '404'})
})

app.listen(3000)