const Product = require('../models/product')
const Order = require('../models/order')

exports.getIndex = (req, res, next) => {
    res.render('shop/index', {
        pageTitle: 'Welcome Page',
        path: '/'
    })
}

exports.getProducts = (req, res, next) => {
    Product.findAll()
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
    Product.findByPk(productId)
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
        return cart.getProducts()
        .then(products => {
            res.render('shop/cart', {
                pageTitle: 'Your Cart',
                path: '/cart',
                products: products
            })
        })

    })
    .catch(err => console.log(err))
}

exports.postCart = (req, res, next) => {
    const productId = req.body.productId
    let fetchedCart
    let quantity = 1

    req.user
    .getCart()
    .then(cart => {
        fetchedCart = cart
        return cart.getProducts({ where: { id: productId }})
    })
    .then(products => {
        let product

        if (products.length > 0) {
            product = products[0]
        }
        
        if (product) {
            quantity = product.cartItem.quantity + 1
            return product
        } else {
            return Product.findByPk(productId)
        }
    })
    .then((product) => {
        return fetchedCart.addProduct(product, { 
            through: { quantity: quantity} 
        })
    })
    .then(() => {
        res.redirect('/cart')
    })
    .catch(err => console.log(err))
}

exports.postCartDeleteProduct = (req, res, next) => {
    const productId = req.body.productId
   
    req.user
    .getCart()
    .then(cart => {
        return cart.getProducts({ where: { id: productId }})
    })
    .then(products => {
        const product = products[0]
        return product.cartItem.destroy()
    })
    .then(result => {
        res.redirect('/cart')
    })
    .catch(err => console.log(err))
}

exports.getOrders = (req, res, next) => {
    req.user
    .getOrders({ include: ['products'] })
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
    .getCart()
    .then(cart => {
        fetchedCart = cart
        return cart.getProducts()
    })
    .then(products => {
        return req.user.createOrder()
        .then(order => {
            return order.addProducts(products.map(product => {
                product.orderItem = { quantity: product.cartItem.quantity}
                return product
            }))
        })
        .then(result => {
            return fetchedCart.setProducts(null)
        })
        .then(result => {
            res.redirect('/orders')
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
}