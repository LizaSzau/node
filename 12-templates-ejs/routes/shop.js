const path = require('path')
const express = require('express')

const router = express.Router()

const rootDir = require('../util/path')
const adminData = require('./admin')

router.get('/', (req, res, next) => {
    const products = adminData.products
    res.render('shop', {
        prods: products, 
        hasProds: products.length > 0,
        pageTitle: 'Shop',
        productCSS: true,
        activeShop: true
    })
})

module.exports = router