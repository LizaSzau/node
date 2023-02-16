const Product = require("../models/product")

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        edit: false
    })
}

exports.postAddProduct = (req, res, next) => {
    //const userId = req.user._id
    const title = req.body.title
    const imageUrl = req.body.imageUrl
    const price = req.body.price
    const description = req.body.description
    const product = new Product({
        title: title, 
        price: price, 
        description: description, 
        imageUrl: imageUrl,
        userId: req.user
    })

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
        .find()
        // .select('title price imageUrl description -_id')
        .populate('userId', 'name email')
        .then(data => {
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
                edit: true
            })
        })
        .catch(err => console.log(err))
}

exports.postEditProduct = (req, res, next) => {
    const id = req.body.productId
    // const userId = req.user._id
    const title = req.body.title
    const imageUrl = req.body.imageUrl
    const price = req.body.price
    const description = req.body.description

    Product
    .findById(id)
    .then(product => {
        if (!product) {
            return res.redirect('/admin/products')
        }

        product.title = title
        product.price = price
        product.description = description
        product.imageUrl = imageUrl
        return product.save()
    })
    .then(result => {
        res.redirect('/admin/products')
    })
    .catch(err => console.log(err))
}

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId

    Product
        .findByIdAndRemove(productId)
        .then(result => {
            res.redirect('/admin/products')
        })
        .catch(err => console.log(err))
}