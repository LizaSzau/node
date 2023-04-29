const fs = require('fs')
const path = require('path')

const Product = require("../models/product")
const Order = require("../models/order")
const pdfDocument = require('pdfkit')
const stripe = require('stripe')(process.env.STRIPE_KEY)

const ITEMS_PER_PAGE = 3

exports.getIndex = (req, res, next) => {
    res.render('shop/index', {
        pageTitle: 'Welcome Page',
        path: '/'
    })
}

exports.getProducts = (req, res, next) => {
    const page = +req.query.page || 1
    let totalItems

    Product
        .find()
        .count()
        .then(totalProducts => {
            totalItems = totalProducts 
            return Product
                .find()
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE)
        })
        .then(data => {
            res.render('shop/product-list', {
                prods: data, 
                pageTitle: 'Products',
                path: '/products',
                totalItems: totalItems,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
                currentPage: page,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1
            })
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })
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
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })
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
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })
}

exports.postCart = (req, res, next) => {
    const productId = req.body.productId
    Product.findById(productId)
        .then(product => {
            return req.user.addToCart(product)
        })
        .then(result => {
            res.redirect('/products')
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })
}

exports.postCartDeleteProduct = (req, res, next) => {
    const productId = req.body.productId
   
    req.user
        .deleteCartItem(productId)
        .then(result => {
            res.redirect('/cart')
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })
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
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })
}

exports.getCheckoutSuccess = (req, res, next) => {
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
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })
}

exports.getInvoiceFromFile = (req, res, next) => {
    const orderId = req.params.orderId
    //const invoiceName = 'invoice-' + orderId + '.pdf'
    const invoiceName = 'bill.pdf'
    const invoicePath = path.join('data', 'invoices', invoiceName)

    Order.findById(orderId)
        .then(order => {
            if (!order) {
                return next(new Error('Order not found!'))
            }
            if (order.user.userId.toString() !== req.user._id.toString()) {
                return next(new Error('Unauthorized!'))
            }

            // for small files
            // fs.readFile(invoicePath, (err, data) => {
            //     if (err) {
            //         return next(err)
            //     }
        
            //     res.setHeader('Content-Type', 'application/pdf')
            //     res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"')
            //     res.send(data)
            // })

            const file = fs.createReadStream(invoicePath)
            res.setHeader('Content-Type', 'application/pdf')
            res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"')
            file.pipe(res)
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })
}

exports.getGenerateInvoice = (req, res, next) => {
    const orderId = req.params.orderId
    const invoiceName = 'bill.pdf'
    const invoicePath = path.join('data', 'invoices', invoiceName)

    Order.findById(orderId)
        .then(order => {
            if (!order) {
                return next(new Error('Order not found!'))
            }
            if (order.user.userId.toString() !== req.user._id.toString()) {
                return next(new Error('Unauthorized!'))
            }

            const invoiceName = 'invoice-' + orderId + '.pdf'
            const invoicePath = path.join('data', 'invoices', invoiceName)

            const pdfDoc = new pdfDocument()

            res.setHeader('Content-Type', 'application/pdf')
            res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"')

            pdfDoc.pipe(fs.createWriteStream(invoicePath))
            pdfDoc.pipe(res)
            pdfDoc.fontSize(26).text('Invoice', {
                underline: true
            })
            
            pdfDoc.text('---------------------------')
            let sum = 0

            order.products.forEach(prod => {
                sum += prod.quantity * prod.product.price
                pdfDoc.fontSize(14).text(prod.product.title + ' - ' 
                    + prod.quantity + ' x ' + '$' + prod.product.price + ' = $' 
                    + prod.quantity * prod.product.price)
            })

            pdfDoc.fontSize(26).text('---------------------------')
            pdfDoc.text('Total price: $' + sum)
            pdfDoc.end()
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })
}

exports.getCheckout = (req, res, next) => {
    let products
    let total = 0
    req.user
        .populate('cart.items.productId')
        .then(data => {
            products = data.cart.items

            products.forEach(p => {
                total += p.quantity * p.productId.price
            })

            return stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: products.map(p => {
                    return {
                        name: p.productId.title,
                        description: p.productId.description,
                        amount: p.productId.price * 100,
                        currency: 'usd',
                        quantity: p.quantity
                    }
                }),
                success_url: req.protocol + '://' + req.get('host') + '/checkout/success',
                cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel'
            })
        })
        .then(session => {
            res.render('shop/checkout', {
                products: products, 
                total: total,
                pageTitle: 'Checkout',
                path: null,
                sessionId: session.id
            })
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })
}