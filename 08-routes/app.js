const http = require('http')

const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.urlencoded({extended: false}))

app.use('/', (req, res, next) => {
    console.log('This always runs.')
    next()
})

app.use('/add-product', (req, res, next) => {
    res.send('<form action="/product" method="POST"><input type="text" name="product"><button type="submit">Add product</button></form>')
})

app.post('/product', (req, res, next) => {
    console.log(req.body)
    res.redirect('/')
})

app.use('/', (req, res, next) => {
    res.send('<h1>In the middleware!</h1>')
})

/*
app.use((req, res, next) => {
    console.log('In an other middleware!')
    res.send('<h1>Hello from Express.js middleware!</h1>')
})
*/

// const server = http.createServer(app)
// server.listen(3000)

app.listen(3000)