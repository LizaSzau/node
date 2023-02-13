const Product = require('../models/product')
const collectionProducts = 'products'

exports.getIndex = (req, res, next) => {
    res.render('shop/index', {
        pageTitle: 'Welcome Page',
        path: '/'
    })
}

exports.getProducts = (req, res, next) => {
    Product
        .fetchAll(collectionProducts)
        .then(data => {
            res.render('shop/product-list', {
                prods: data, 
                pageTitle: 'Products',
                path: '/products'
            })
        })
        .catch(err => console.log(err))
}

exports.getProduct = (req, res, next) => {
    const productId = req.params.productId
    Product
        .findById(collectionProducts, productId)
        .then(product => {
            if (!product) {
                return res.redirect('/products')
            }

            res.render('shop/product-detail', {
                prod: product, 
                pageTitle: product.title,
                path: '/products'
            })
        })
        .catch(err => console.log(err))
}

exports.getCart = (req, res, next) => {
    req.user
        .getCart()
        .then(cart => {
            res.render('shop/cart', {
                pageTitle: 'Your Cart',
                path: '/cart',
                products: cart
            })
        })
        .catch(err => console.log(err))
}

exports.postCart = (req, res, next) => {
    const productId = req.body.productId
    Product.findById('products', productId)
        .then(product => {
            return req.user.addToCart(product)
        })
        .then(result => {
            res.redirect('/cart')
        })
        .catch(err => console.log(err))
}

exports.postCartDeleteProduct = (req, res, next) => {
    const productId = req.body.productId
   
    req.user
        .deleteCartItem(productId)
        .then(result => {
            res.redirect('/cart')
        })
        .catch(err => console.log(err))
}

exports.getOrders = (req, res, next) => {
    req.user
        .getOrders()
        .then(orders => {
            res.render('shop/orders', {
                pageTitle: 'Your Orders',
                path: '/orders',
                orders: orders
            })
        
        })
        .catch(err => console.log(err))
}

exports.postCreateOrder = (req, res, next) => {
    let fetchedCart

    req.user
        .addOrder()
        .then(result => {
            res.redirect('/orders')
        })
        .catch(err => console.log(err))
}