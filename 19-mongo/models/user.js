const mongoDb = require('mongodb')
const getDb = require('../utils/database').getDb
const Model = require('./model.js')
class User extends Model{
    constructor(username, email, id) {
        super()
        this.collection = 'users'
        this._id = id ? new mongoDb.ObjectId(id) : null
        this.username = username
        this.email = email
    }
}

module.exports = User