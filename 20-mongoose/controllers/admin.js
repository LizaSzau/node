const Product = require("../models/product")
const { validationResult } = require('express-validator')

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        edit: false,
        flashMessage: [],
        oldData: {
            title: '',
            imageUrl: '',
            price: '',
            description: ''
        },
        validationErrors: []
    })
}

exports.postAddProduct = (req, res, next) => {
    //const userId = req.user._id
    const title = req.body.title
    const imageUrl = req.body.imageUrl
    const price = req.body.price
    const description = req.body.description
    const errors = validationResult(req)

    const product = new Product({
        title: title, 
        price: price, 
        description: description, 
        imageUrl: imageUrl,
        userId: req.session.user
    })

    if (!errors.isEmpty()) {
        return res
            .status(422)
            .render('admin/edit-product', {
                path: '/add-product',
                pageTitle: 'Add Product',
                flashMessage: errors.array()[0].msg,
                edit: false,
                oldData: {
                    title: title,
                    imageUrl: imageUrl,
                    price: price,
                    description: description
                },
                validationErrors: errors.array()
            });
    }

    product
        .save()
        .then(result => {
            console.log('Product created!')
            res.redirect('/admin/products')
        })
        .catch(err => console.log(err))
}

exports.getAdminProducts = (req, res, next) => {
    Product
        .find({userId: req.user._id})
        // .select('title price imageUrl description -_id')
        .populate('userId', 'name email')
        .then(data => {
            console.log(data)
            res.render('admin/product-list', {
                prods: data, 
                pageTitle: 'Admin Products',
                path: '/admin/products'
            })
        })
        .catch(err => console.log(err))
}

exports.getEditProduct = (req, res, next) => {
    const productId = req.params.productId
    Product
        .findById(productId)
        .then(product => {
            if (!product) {
                return res.redirect('/admin/products')
            }
            res.render('admin/edit-product', {
                product: product, 
                pageTitle: 'Edit Product',
                path: '/admin/products',
                edit: true,
                flashMessage: [],
                productId: productId,
                oldData: {
                    title: product.title,
                    imageUrl: product.imageUrl,
                    price: product.price,
                    description: product.description
                },
                validationErrors: []
            })
        })
        .catch(err => console.log(err))
}

exports.postEditProduct = (req, res, next) => {
    const errors = validationResult(req)
    const id = req.body.productId
    // const userId = req.user._id
    const title = req.body.title
    const imageUrl = req.body.imageUrl
    const price = req.body.price
    const description = req.body.description

    if (!errors.isEmpty()) {
        return res
            .status(422)
            .render('admin/edit-product', {
                path: '/edit-product',
                pageTitle: 'Edit Product',
                flashMessage: errors.array()[0].msg,
                edit: true,
                productId: id,
                oldData: {
                    title: title,
                    imageUrl: imageUrl,
                    price: price,
                    description: description
                },
                validationErrors: errors.array()
            });
    }

    Product
    .findById(id)
    .then(product => {
        if (!product || product.userId.toString() !== req.user._id.toString()) {
            return res.redirect('/admin/products')
        }

        product.title = title
        product.price = price
        product.description = description
        product.imageUrl = imageUrl
        return product.save()
            .then(result => {
                res.redirect('/admin/products')
            })
    })
    .catch(err => console.log(err))
}

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId

    Product
        //.findByIdAndRemove(productId)
        .deleteOne({_id: productId, userId: req.user})
        .then(result => {
            res.redirect('/admin/products')
        })
        .catch(err => console.log(err))
}