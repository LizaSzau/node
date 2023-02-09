const mongoDb = require('mongodb')
const getDb = require('../utils/database').getDb
const Model = require('./model.js')
class Product extends Model {
    constructor(title, price, description, imageUrl, userId, id) {
        super()
        this._id = id ? new mongoDb.ObjectId(id) : null
        this.userId = userId
        this.title = title
        this.price = price
        this.description = description
        this.imageUrl = imageUrl
    }
}

module.exports = Product