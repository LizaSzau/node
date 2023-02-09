const mongoDb = require('mongodb')
const Product = require("../models/product")

const objectId = mongoDb.objectId

exports.getAdminProducts = (req, res, next) => {
    Product
        .fetchAll()
        .then(data => {
            res.render('admin/product-list', {
                prods: data, 
                pageTitle: 'Admin Products',
                path: '/admin/products'
            })
        })
        .catch(err => console.log(err))
}

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        edit: false
    })
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title
    const imageUrl = req.body.imageUrl
    const price = req.body.price
    const description = req.body.description
    const product = new Product(title, price, description, imageUrl)

    product
        .save()
        .then(result => {
            res.redirect('/admin/products')
        })
        .catch(err => console.log(err))
}

exports.getEditProduct = (req, res, next) => {
    const productId = req.params.productId

    Product
        .findById(productId)
        .then(product => {
            if (!product) {
                return res.redirect('/admin/products')
            }

            res.render('admin/edit-product', {
                product: product, 
                pageTitle: 'Edit Product',
                path: '/admin/products',
                edit: true
            })
        })
        .catch(err => console.log(err))
}

exports.postEditProduct = (req, res, next) => {
    const id = req.body.productId
    const title = req.body.title
    const imageUrl = req.body.imageUrl
    const price = req.body.price
    const description = req.body.description
    const product = new Product(title, price, description, imageUrl, id)

    product
        .save()
        .then(result => {
            res.redirect('/admin/products')
        })
        .catch(err => console.log(err))
}

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId

    Product
        .deleteById(productId)
        .then(result => {
            res.redirect('/admin/products')
        })
        .catch(err => console.log(err))
}