const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/user')

exports.postSignup = async (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        const error = new Error(errors.array())
        error.statusCode = 422
        throw error
    }

    const name = req.body.name
    const email = req.body.email
    const password = req.body.password

    try {
        const hashedPassword = await bcrypt.hash(password, 12)

        const user = new User({
            name: name,
            email: email,
            password: hashedPassword,
        })
    
        await user.save()
            
        res.status(201).json({
            success: true,
            message: 'User created!',
            user: user
        })
    } catch(error) {
        next(error)
    }
}

exports.postLogin = async (req, res, next) => {
    const email = req.body.email
    const password = req.body.password

    try {
        const user = await User.findOne({email:email})

        if (!user) {
            const error = new Error('A user with this email coul not be found.')
            error.statusCode = 401
            throw error
        }
        
        const isPasswordEqual = await bcrypt.compare(password, user.password)
      
        if (!isPasswordEqual) {
            const error = new Error('Wrong password.')
            error.statusCode = 401
            throw error
        }

        const token = jwt.sign(
            {
                email: user.email,
                userId: user._id.toString()
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: process.env.JWT_EXPIRE}
        )

        res.status(200).json({
            token: token,
            userId: user._id.toString()
        })
    } catch(error) {
        next(error)
    }
}

exports.getStatus = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId)
       
        if (!user) {
            const error = new Error('User not found.')
            error.statusCode = 404
            throw error
        }

        res.status(200).json({status: user.status})
    } catch(error) {
        next(error)
    }
}

exports.patchStatus = async (req, res, next) => {
    const newStatus = req.body.status

    try {
        const user = await User.findById(req.userId)
        
        if (!user) {
            const error = new Error('User not found.')
            error.statusCode = 404
            throw error
        }

        user.status = newStatus
        await user.save()
      
        res.status(200).json({
            message: 'Status changed.',
            status: user.status
        })
    } catch(error) {
        next(error)
    }
}