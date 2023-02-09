const mongoDb = require('mongodb')
const getDb = require('../utils/database').getDb

class Model {
    save() {
        const db = getDb()
        let dbOp

        if (this._id) {
            dbOp = db.collection('users').updateOne({ _id: this._id }, { $set: this })
        } else {
            dbOp = db.collection('users').insertOne(this)
        }

        return dbOp
            .then(result => {
                console.log(result)
            })
            .catch(err => console.log(err))
    }

    static deleteById(id) {
        const db = getDb()

        return db
            .collection('users')
            .deleteOne({ _id: new mongoDb.ObjectId(id)  })
            .then(result => {
                console.log('User deleted!')
            })
            .catch(err => console.log(err))
    }

    static fetchAll() {
        const db = getDb()
        return db
            .collection('users')
            .find()
            .toArray()
            .then(users => {
                return users
            })
            .catch(err => HTMLFormControlsCollection.log(err))
    }

    static findById(id) {
        const db = getDb()
        return db
            .collection('users')
            .findOne({_id: new mongoDb.ObjectId(id) })
            .then(users => {
                console.log(users)
                return users
            })
            .catch(err => HTMLFormControlsCollection.log(err))
    }
}

module.exports = User