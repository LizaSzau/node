
const Cart = require('../models/cart')
const { fetchAll } = require('../models/product')
const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        edit: false
    })
}

exports.getEditProduct = (req, res, next) => {
    const id = req.params.productId
    Product.findById(id, product => {
        if (!product) {
            return res.redirect('/')
        }

        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/products',
            edit: true,
            product: product
        })
    })
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title
    const imageUrl = req.body.imageUrl
    const price = req.body.price
    const description = req.body.description
    const product = new Product(null, title, imageUrl, price, description)
    product.save()
    res.redirect('/')
}

exports.postEditProduct = (req, res, next) => {
    const id = req.body.productId
    const title = req.body.title
    const imageUrl = req.body.imageUrl
    const price = req.body.price
    const description = req.body.description
    const product = new Product(id, title, imageUrl, price, description)
    product.save()
    res.redirect('/admin/products')
}

exports.postDeleteProduct = (req, res, next) => {
    const id = req.body.productId

    Product.deleteById(id)
    res.redirect('/admin/products')
}

exports.getAdminProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('admin/product-list', {
            prods: products, 
            pageTitle: 'Admin Products',
            path: '/admin/products'
        })
    })
}