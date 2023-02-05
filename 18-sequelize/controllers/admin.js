const Cart = require('../models/cart')
const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        edit: false
    })
}

exports.getEditProduct = (req, res, next) => {
    const productId = req.params.productId

    req.user
    .getProducts({where: {id: productId}})
    .then(products => {
        const product = products[0]

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

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title
    const imageUrl = req.body.imageUrl
    const price = req.body.price
    const description = req.body.description
console.log(req.user)
    req.user
    .createProduct({
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description,
    })
    .then(result => {
        res.redirect('/admin/products')
    })
    .catch(err => console.log(err))
}

exports.postEditProduct = (req, res, next) => {
    const productId = req.body.productId
    const title = req.body.title
    const imageUrl = req.body.imageUrl
    const price = req.body.price
    const description = req.body.description

    Product.findByPk(productId)
    .then(product => {
        if (!product) {
            return res.redirect('/admin/products')
        }

        product.title = title
        product.imageUrl = imageUrl
        product.price = price
        product.description = description
        return product.save()
    })
    .then(rresult => {
        res.redirect('/admin/products')
    })
    .catch(err => console.log(err))
}

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId

    Product.findByPk(productId)
    .then(product => {
        return product.destroy()
    })
    .then(result => {
        res.redirect('/admin/products')
    })
    .catch(err => console.log(err))
}

exports.getAdminProducts = (req, res, next) => {
    req.user
    .getProducts()
    .then(data => {
        res.render('admin/product-list', {
            prods: data, 
            pageTitle: 'Admin Products',
            path: '/admin/products'
        })
    })
    .catch(err => console.log(err))
}