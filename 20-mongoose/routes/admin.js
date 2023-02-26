const path = require('path')
const express = require('express')

const adminController = require('../controllers/admin')
const isAuth = require('../middleware/is-auth')
const validator = require('../middleware/validators/adminValidator')

const router = express.Router()

router.get('/add-product', isAuth, adminController.getAddProduct)

router.post('/add-product', isAuth, validator.product(), adminController.postAddProduct)

router.get('/products', isAuth, adminController.getAdminProducts)

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct)

router.post('/edit-product', isAuth, validator.product(), adminController.postEditProduct)

router.post('/delete-product', isAuth, adminController.postDeleteProduct)

module.exports = router