const { fetchAll } = require('../models/product')
const { findById } = require('../models/product')
const Product = require('../models/product')
const Cart = require('../models/cart')

exports.getIndex = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('shop/index', {
            prods: products, 
            pageTitle: 'Shop',
            path: '/'
        })
    })
}

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('shop/product-list', {
            prods: products, 
            pageTitle: 'Products',
            path: '/products'
        })
    })
}

exports.getProduct = (req, res, next) => {
    const productId = req.params.productId
    Product.findById(productId, product => {
        res.render('shop/product-detail', {
            prod: product, 
            pageTitle: product.title,
            path: '/products'
        })
    })
}

exports.getCart = (req, res, next) => {
    Cart.getCart(cart => {
        Product:fetchAll(products => {
            const cartProducts = []
        
            for (product of products) {
                const item = cart.products.find(prod => prod.id === product.id)

                if(item) {
                    cartProducts.push({item: product, qty: item.qty})
                }
            }

            res.render('shop/cart', {
                pageTitle: 'Your Cart',
                path: '/cart',
                products: cartProducts,
                totalPrice: cart.totalPrice
            })
        })

    })
}

exports.postCart = (req, res, next) => {
    const productId = req.body.productId
    Product.findById(productId, (product) => {
        Cart.addProduct(productId, product.price)
    })
    res.redirect('/cart')
}

exports.postCartDeleteProduct = (req, res, next) => {
    const productId = req.body.productId
    Product.findById(productId, (product) => {
        Cart.deleteProductFromCart(productId, product.price)
    })
    res.redirect('/cart')
}

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        pageTitle: 'Your Orders',
        path: '/orders'
    })
}

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout'
    })
}