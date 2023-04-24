const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/user')

exports.postSignup = (req, res, next) => {
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

exports.postLogin = (req, res, next) => {
    const email = req.body.email
    const password = req.body.password
    let loadedUser

    User
        .findOne({email:email})
        .then(user => {
            if (!user) {
                const error = new Error('A user with this email coul not be found.')
                error.statusCode = 401
                throw error
            }

            loadedUser = user
            return bcrypt.compare(password, user.password)
        })
        .then(isPasswordEqual => {
            if (!isPasswordEqual) {
                const error = new Error('Wrong password.')
                error.statusCode = 401
                throw error
            }

            const token = jwt.sign(
                {
                    email: loadedUser.email,
                    userId: loadedUser._id.toString()
                }, 
                process.env.JWT_SECRET, 
                { expiresIn: process.env.JWT_EXPIRE}
            )

            res.status(200).json({
                token: token,
                userId: loadedUser._id.toString()
            })
        })
        .catch(err => next(err))
}

exports.getStatus = (req, res, next) => {
    User.findById(req.userId)
        .then(user => {
            if (!user) {
                const error = new Error('User not found.')
                error.statusCode = 404
                throw error
            }

            res.status(200).json({status: user.status})
        })
        .catch(err => next(err))
}

exports.patchStatus = (req, res, next) => {
    const newStatus = req.body.status

    User.findById(req.userId)
        .then(user => {
            if (!user) {
                const error = new Error('User not found.')
                error.statusCode = 404
                throw error
            }

            user.status = newStatus
            return user.save()
        })
        .then(user => {
            res.status(200).json({
                message: 'Status changed.',
                status: user.status
            })
        })
        .catch(err => next(err))
}