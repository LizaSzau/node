const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const User = require('../models/user')

exports.postUser = (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        const error = new Error(errors.array())
        error.statusCode = 422
        throw error
    }

    const name = req.body.name
    const email = req.body.email
    const password = req.body.password

    bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
            const user = new User({
                name: name,
                email: email,
                password: hashedPassword,
            })

            return user.save()
        })
        .then(result => {
            res.status(201).json({
                success: true,
                message: 'User created!',
                user: result
            })
        })
        .catch(err => next(err))
}