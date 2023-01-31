const fs = require('fs')
const path = require('path')

const rootDir = require('../util/path')
const Cart = require('./cart')
const p = path.join(rootDir, 'data', 'products.json')

const getProductsFromFile = (cb) => {
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            return cb([])
        } else {
            cb(JSON.parse(fileContent))
        }
    })
}

module.exports = class Product {
    constructor(id, title, imageUrl, price, description) {
        this.id = id
        this.title = title
        this.imageUrl = imageUrl
        this.price = price
        this.description = description
    }

    save() {
        getProductsFromFile(products => {
            if (this.id) {
                const existingProductIndex = products.findIndex(prod => prod.id === this.id)
                products[existingProductIndex] = this
            } else {
                const id = Math.floor(Math.random() * (999999 - 100000) + 100000)
                this.id = id.toString()
                products.push(this)
            }

            fs.writeFile(p, JSON.stringify(products), (err) => {
                console.log(err)
            })
        })
    }

    static findById(id, cb) {
        getProductsFromFile(products => {
            const product = products.find(p => p.id === id)
            cb(product)
        })
    }

    static fetchAll(cb) {
        getProductsFromFile(cb)
    }

    static deleteById(id, cb) {
        getProductsFromFile(products => {
            // const existingProductIndex = products.findIndex(prod => prod.id === id)
            // products.splice(existingProductIndex, 1)

            const product = products.find(prod => prod.id === id)
            const updatedProducts = products.filter(prod => prod.id !== id)
      
            fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
                if (!err) {
                    Cart.deleteProduct(id, product.price )
                } else {
                    console.log(err)
                }
                
            })
        })
    }
}