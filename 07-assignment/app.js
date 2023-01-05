const http = require('http')

const express = require('express')

const app = express()

app.use((req, res, next) => {
    console.log('First middleware.')
    next()
})

app.use((req, res, next) => {
    console.log('Second middleware.')
    next()
})

app.use('/users', (req, res, next) => {
    res.send('<li>Mick Carpenter</li><li>Molly Richards</li>')
})

app.use('/', (req, res, next) => {
    res.send('<h1>Hi, I am Liza!</h1>')
})

app.listen(3000)