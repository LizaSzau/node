const path = require('path')
const express = require('express')

const shopController = require('../controllers/shop')
const isAuth = require('../middleware/is-auth')

const router = express.Router()

router.get('/', shopController.getIndex)

router.get('/products', shopController.getProducts)

router.get('/product/:productId', shopController.getProduct)

router.get('/cart', isAuth, shopController.getCart)

router.post('/add-to-cart', isAuth, shopController.postCart)

router.post('/cart-delete-product', isAuth, shopController.postCartDeleteProduct)

router.get('/orders', isAuth, shopController.getOrders)

router.post('/create-order', isAuth, shopController.postCreateOrder)

router.get('/invoice/:orderId', isAuth, shopController.getInvoice)

module.exports = router