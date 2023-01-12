const path = require('path')
const express = require('express')

const productController = require('../controllers/product')

const router = express.Router()

const rootDir = require('../util/path')
const adminData = require('./admin')

router.get('/', productController.getProducts)

module.exports = router