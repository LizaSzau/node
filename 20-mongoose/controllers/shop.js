const Product = require("../models/product")
const Order = require("../models/order")

exports.getIndex = (req, res, next) => {
    res.render('shop/index', {
        pageTitle: 'Welcome Page',
        path: '/'
    })
}

exports.getProducts = (req, res, next) => {
    Product
        .find()
        .then(data => {
            res.render('shop/product-list', {
                prods: data, 
                pageTitle: 'Products',
                path: '/products',
            })
        })
        .catch(err => console.log(err))
}

exports.getProduct = (req, res, next) => {
    const productId = req.params.productId
    Product
        .findById(productId)
        .then(product => {
            if (!product) {
                return res.redirect('/products')
            }

            res.render('shop/product-detail', {
                prod: product, 
                pageTitle: product.title,
                path: '/products',
            })
        })
        .catch(err => console.log(err))
}

exports.getCart = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .then(data => {
            res.render('shop/cart', {
                products: data.cart.items, 
                pageTitle: 'Your Cart',
                path: '/cart',
            })
        })
        .catch(err => console.log(err))
}

exports.postCart = (req, res, next) => {
    const productId = req.body.productId
    Product.findById(productId)
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
    Order
        .find({'user.userId': req.session.user._id})
        .populate('products.product.productId')
        .then(orders => {
            res.render('shop/orders', {
                pageTitle: 'Your Orders',
                path: '/orders',
                orders: orders,
            })
        })
        .catch(err => console.log(err))
}

exports.postCreateOrder = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .then(data => {
            const products = data.cart.items.map(i => {
                return {quantity: i.quantity, product: {...i.productId._doc}}
            })
            const order = new Order({
                user: {
                    name: req.session.user.name,
                    userId: req.session.user
                },
                products: products
            })
            order.save()
        })
        .then(result => {
            return req.user.clearCart()
        })
        .then(result => {
            res.redirect('/orders')
        })
        .catch(err => console.log(err))
}
