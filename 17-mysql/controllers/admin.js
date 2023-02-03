
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

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title
    const imageUrl = req.body.imageUrl
    const price = req.body.price
    const description = req.body.description
    const product = new Product(null, title, imageUrl, price, description)
    product.save()
    .then(() => {
        res.redirect('/')
    })
    .catch(err => console.log(err))
}