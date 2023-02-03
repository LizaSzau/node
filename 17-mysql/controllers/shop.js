const { fetchAll } = require('../models/product')
const { findById } = require('../models/product')
const Product = require('../models/product')
const Cart = require('../models/cart')

exports.getIndex = (req, res, next) => {
    Product.fetchAll()
    .then(([rows, fieldData]) => {
        res.render('shop/index', {
            prods: rows, 
            pageTitle: 'Shop',
            path: '/'
        })
    })
    .catch(error => console.log(error))
}

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
    .then(([rows, fieldData]) => {
        res.render('shop/product-list', {
            prods: rows, 
            pageTitle: 'Products',
            path: '/products'
        })
    })
    .catch(error => console.log(error))
}

exports.getProduct = (req, res, next) => {
    const productId = req.params.productId
    Product.findById(productId)
    .then(([rows, fieldData]) => {
        const row = rows [0]
        res.render('shop/product-detail', {
            prod: row, 
            pageTitle: row.title,
            path: '/products'
        })
    })
    .catch(error => console.log(error))
}
