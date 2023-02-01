const fs = require('fs')
const path = require('path')

const rootDir = require('../util/path')
const p = path.join(rootDir, 'data', 'cart.json')

const getCartFromFile = (cb) => {
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            let cart = { products: [], totalPrice: 0}
            return cb(cart)
        } else {
            cb(JSON.parse(fileContent))
        }
    })
}

module.exports = class Cart {
    static addProduct(id, price) {
        // Fetch the previous cart
        getCartFromFile(cart => {
            // Analyze the cart => find existing product
            const existingProductIndex = cart.products.findIndex(prod => prod.id === id)
            const existingProduct = cart.products[existingProductIndex]
            let updatedProduct

            if (existingProduct) {
                // increase quantity
                updatedProduct = {...existingProduct}
                updatedProduct.qty += 1
                cart.products = [...cart.products]
                cart.products[existingProductIndex] = updatedProduct
            } else {
                // Add new product
                updatedProduct = {id: id, qty: 1}
                cart.products = [...cart.products, updatedProduct]
            }

            cart.totalPrice += +price

            fs.writeFile(p, JSON.stringify(cart), (err) => {
                console.log(err)
            })
        })
    }

    static deleteProduct(id, price) {
        fs.readFile(p, (err, fileContent) => {
            if (!err) {
                let cart = JSON.parse(fileContent)

                const product = cart.products.find(prod => prod.id === id)

                if(product === undefined) return

                cart.totalPrice -= product.qty * +price
                cart.products = cart.products.filter(prod => prod.id !== id)
    
                fs.writeFile(p, JSON.stringify(cart), (err) => {
                    console.log(err)
                })
            } 

            return

        })
    }

    static deleteProductFromCart(id, price) {
        fs.readFile(p, (err, fileContent) => {
            if (!err) {
                let cart = JSON.parse(fileContent)

                const product = cart.products.find(prod => prod.id === id)

                if(product === undefined) return

                cart.totalPrice -= +price

                if (product.qty === 1) {
                    cart.products = cart.products.filter(prod => prod.id !== id)
                } else {
                    const productIndex = cart.products.findIndex(prod => prod.id === id)
                    cart.products[productIndex].qty -= 1
                }
    
                fs.writeFile(p, JSON.stringify(cart), (err) => {
                    console.log(err)
                })
            } 

            return

        })
    }

    static getCart(cb) {
        getCartFromFile(cart => {
            cb(cart)
        })
    }
}