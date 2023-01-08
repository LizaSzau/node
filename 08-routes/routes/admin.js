const path = require('path')
const express = require('express')

const router = express.Router()

const rootDir = require('../util/path')
console.log('rootDir: ' + rootDir)

router.get('/add-product', (req, res, next) => {
    // res.send('<form action="/admin/add-product" method="POST"><input type="text" name="product"><button type="submit">Add product</button></form>')
    // res.sendFile(path.join(__dirname, '..', 'views', 'add-product.html'))
    res.sendFile(path.join(rootDir, 'views', 'add-product.html'))
})

router.post('/add-product', (req, res, next) => {
    console.log(req.body)
    res.redirect('/')
})

module.exports = router