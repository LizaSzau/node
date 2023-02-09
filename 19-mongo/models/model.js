const mongoDb = require('mongodb')
const getDb = require('../utils/database').getDb

class Model {
    save(collection) {
        const db = getDb()
        let dbOp

        if (this._id) {
            dbOp = db.collection(collection).updateOne({ _id: this._id }, { $set: this })
        } else {
            dbOp = db.collection(collection).insertOne(this)
        }

        return dbOp
            .then(result => {
                console.log(result)
            })
            .catch(err => console.log(err))
    }

    static deleteById(collection, id) {
        const db = getDb()

        return db
            .collection(collection )
            .deleteOne({ _id: new mongoDb.ObjectId(id)  })
            .then(result => {
                console.log(result)
            })
            .catch(err => console.log(err))
    }

    static fetchAll(collection) {
        const db = getDb()
        return db
            .collection(collection )
            .find()
            .toArray()
            .then(data => {
                return data
            })
            .catch(err => HTMLFormControlsCollection.log(err))
    }

    static findById(collection, id) {
        const db = getDb()
        return db
            .collection(collection )
            .findOne({_id: new mongoDb.ObjectId(id) })
            .then(data => {
                console.log(data)
                return data
            })
            .catch(err => HTMLFormControlsCollection.log(err))
    }
}

module.exports = Model