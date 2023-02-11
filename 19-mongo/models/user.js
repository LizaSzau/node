const mongoDb = require('mongodb')
const getDb = require('../utils/database').getDb
const Model = require('./model.js')
class User extends Model{
    constructor(username, email, id, cart) {
        super()
        this._id = id ? new mongoDb.ObjectId(id) : null
        this.username = username
        this.email = email
        this.cart = cart
    }

    addToCart(product) {
        let newQuantity = 1
        const updatedCartItems = [...this.cart.items]

        const cartProductIndex = this.cart.items.findIndex(cp => {
            return cp.productId.toString() === product._id.toString()
        })

        if (cartProductIndex >= 0) {
            newQuantity = this.cart.items[cartProductIndex].quantity + 1
            updatedCartItems[cartProductIndex].quantity = newQuantity
        } else {
            updatedCartItems.push({ 
                productId: new mongoDb.ObjectId(product._id), 
                quantity: newQuantity
            })
        }

        const updatedCart = { items: updatedCartItems}
        const db = getDb()

        return db.
            collection('users')
            .updateOne(
                { _id: new mongoDb.ObjectId(this._id)},
                { $set: { cart: updatedCart }}
            )
    }

    getCart() {
        const db = getDb()
        const productIds = this.cart.items.map(i => {
            return i.productId
        })
        return db
            .collection('products')
            .find({ _id: { $in: productIds}})
            .toArray()
            .then(products => {
                return products.map(p => {
                    return { 
                        ...p, 
                        quantity: this.cart.items.find(i => {
                            return i.productId.toString() === p._id.toString()
                        }).quantity
                    }
                })
            })
    }
}

module.exports = User